// import { ApiError } from '../../lib/handlers/errors'; # Upgrade to TS
const request = require('supertest');
const RandomHelper = require('../helpers/random.helper');
const UserHelper = require('../helpers/user.helper');
const AuthHelper = require('../helpers/auth.helper');
const decode = require('jose/util/base64url')

describe('API endpoint for auth', function() {
  beforeAll(async function() {
    this.authHelper = new AuthHelper();
    this.userHelper = new UserHelper();
    this.textDecoder = new TextDecoder()
    this.localRequest = request('http://express:3000');
    this.apiPath = '/api/v1';
    this.email = 'jdoe@test.justinshipscode.com';
    this.password = 'foob!@arBaz1023';
    this.passwordHash = '$2b$10$ftteQVXjsPVLA5ZRU/rRCO60B0wMjh6q3vlNdOpveaEnAzYuXmeBy';
    this.firstname = 'John';
    this.lastname = 'Doe';
    this.user = {
      email: this.email,
      password: this.passwordHash,
      firstname: this.firstname,
      lastname: this.lastname
    };
    this.authRequest = {
      email: this.email,
      password: this.password,
    };

    await Promise.all([
      this.authHelper.connect(),
      this.userHelper.connect()
    ]);

  });

  beforeEach(async function() {
    await this.authHelper.removeAll().catch((err) => console.error(err));
    await this.userHelper.removeAll().catch((err) => console.error(err));
  });

  describe('with POST /auth/', function() {
    it('creates a valid auth', async function(done) {
      await this.userHelper.create({ ...this.user, ...{ active : true, verified : true } });
      this.localRequest
        .post(`${this.apiPath}/auth`)
        .send(this.authRequest)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res) => {
          sections = []
          expect(res.body.token.length).toBeGreaterThan(0);
          res.body.token.split('.').forEach((section, index) => {
            if (index == 0 || index == 1) {
              sections.push(JSON.parse(this.textDecoder.decode(decode.decode(section))))
            } else {
              // The EC256 signature is not a JSON
              sections.push(section)
            }
          })

          // Mongo object IDs are 24 characters in length
          // The creation of the authentication entry should have happened recently
          // The expiry of the authentication entry should be greater than now but less than 4 weeks
          expect(res.body._id.length).toBe(24);
          expect(res.body.user_id.length).toBe(24);
          expect(Date.parse(res.body.created)).toBeLessThan(Date.now());
          expect(Date.parse(res.body.created)).toBeGreaterThan(Date.now() - 5000);
          expect(Date.parse(res.body.expiry)).toBeGreaterThan(Date.now());
          expect(Date.parse(res.body.expiry)).toBeLessThan(Date.now() + (31 * 24 * 60 * 60 * 1000));

          // The token algorithm field indicates EC256
          // The token claims field has a recent iat
          // The token claims field has a future exp
          // The token claims field has a defined iss
          // The token claims field has a defined aud
          // The token signature field is defined
          expect(sections[0].alg).toBe('ES256')
          expect(sections[1].iat).toBeLessThan(Date.now() / 1000)
          expect(sections[1].exp).toBeGreaterThan(Date.now() / 1000)
          expect(sections[1].iss.length).toBeGreaterThan(0)
          expect(sections[1].aud.length).toBeGreaterThan(0)
          expect(sections[2].length).toBeGreaterThan(0)
        })
        .end((err, res) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('refuses to create a token for unverified accounts', async function(done) {
      // Copy and override a valid payload with an unverified user
      await this.userHelper.create({ ...this.user, ...{ active : true, verified : false } });
      this.localRequest
        .post(`${this.apiPath}/auth`)
        .send(this.authRequest)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('User has not been verified')
        })
        .end((err) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('refuses to create a token for inactive accounts', async function(done) {
      // Copy and override a valid payload with an inactive user
      await this.userHelper.create({ ...this.user, ...{ active : false, verified : true } });
      this.localRequest
        .post(`${this.apiPath}/auth`)
        .send(this.authRequest)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('User is inactive')
        })
        .end((err) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('refuses to create a auth with an empty email', function(done) {
      // Copy and override a valid payload with an invalid email
      const invalidEmails = [null, 0, '', false];
      invalidEmails.forEach(email => {
        const auth = { ...this.authRequest, ...{ email } };
        this.localRequest
          .post(`${this.apiPath}/auth`)
          .send(auth)
          .expect(422, { errors: [{
            value: email,
            msg: 'Email cannot be empty',
            param: 'email',
            location: 'body'
          }]}, done);
      });
    });

    it('refuses to create a auth with an invalid email', function(done) {
      const randomString = RandomHelper.randomString(5, 10);
      const invalidUser = { ...this.authRequest, ...{ email: randomString } };

      this.localRequest
        .post(`${this.apiPath}/auth`)
        .send(invalidUser)
        .expect(422, { errors: [{
          value: randomString,
          msg: 'Email provided must be valid',
          param: 'email',
          location: 'body'
        }]}, done);
    });

    it('refuses to create a auth with an empty password', function(done) {
      const invalidPasswords = [ null, 0, '', false ];

      invalidPasswords.forEach(password => {
        const auth = { ...this.authRequest, ...{ password } }
        this.localRequest
          .post(`${this.apiPath}/auth`)
          .send(auth)
          .expect(422, { errors: [{
            value: password,
            msg: 'Invalid credentials',
            param: 'password',
            location: 'body'
          }]}, done);
      });
    });
  });

  describe('with DELETE /auth/:id', function() {
    it('rejects to delete for empty ObjectIds', function(done) {
      const invalidIds = [ 'null', 0, '', false ];

      invalidIds.forEach(id => {
        this.localRequest
          .delete(`${this.apiPath}/auth/${id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, { errors: [{
            value: id.toString(),
            msg: 'ID parameter must be valid',
            param: 'id',
            location: 'params'
          }]}, done);
      });
    });

    it('rejects to delete for invalid ObjectIds', function(done) {
      this.localRequest
        .delete(`${this.apiPath}/auth/99999`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, { errors: [{
          value: '99999',
          msg: 'ID parameter must be valid',
          param: 'id',
          location: 'params'
        }]}, done);
    });

    it('deletes for a valid ObjectId', async function(done) {
      const auth = await this.authHelper.create(this.authRequest);

      this.localRequest
        .delete(`${this.apiPath}/auth/${auth.insertedId}`)
        .set('Accept', 'application/json')
        .expect(204, done);

      const deletedUser = await this.authHelper.retrieve(this.authRequest.insertedId);
      expect(deletedUser).toBe(null);
    });
  });
});
