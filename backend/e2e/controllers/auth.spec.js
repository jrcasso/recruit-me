// import { ApiError } from '../../lib/handlers/errors'; # Upgrade to TS
const request = require('supertest');
const RandomHelper = require('../helpers/random.helper');
const UserHelper = require('../helpers/user.helper');
const AuthHelper = require('../helpers/auth.helper');

describe('API endpoint for auth', function() {
  beforeAll(async function() {
    this.authHelper = new AuthHelper();
    this.userHelper = new UserHelper();
    this.localRequest = request('http://express:3000');
    this.apiPath = '/api/v1';
    this.email = 'jdoe@test.justinshipscode.com';
    this.password = 'foob!@arBaz1023';
    this.passwordHash = '$2b$10$ftteQVXjsPVLA5ZRU/rRCO60B0wMjh6q3vlNdOpveaEnAzYuXmeBy';
    this.authRequest = {
      email: this.email,
      password: this.password,
    };

    await Promise.all([
      this.authHelper.connect(),
      this.userHelper.connect()
    ]).then(() => {
      this.authHelper.removeAll().catch((err) => console.error(err));
      this.userHelper.removeAll().catch((err) => console.error(err));

      this.userHelper.create({
        email: this.email,
        password: this.passwordHash,
        firstname: 'John',
        lastname: 'Doe',
        verified: true,
        active: true
      });
    });

  });

  describe('with POST /auth/', function() {
    it('creates a valid auth', function(done) {
      this.localRequest
        .post(`${this.apiPath}/auth`)
        .send(this.authRequest)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_id).toBe(this.email);
          expect(res.body.token).toBe(this.firstname);
          expect(res.body.created).toBe(this.lastname);
          expect(res.body.expiry).toBe(null);
        })
        .end((err, res) => {
          console.log(res.body);
          if (err) {return done(err);}
          done();
        });
    });

    it('refuses to create a token for unverified accounts', function(done) {
      // Copy and override a valid payload with an invalid email
      const invalidEmails = [null, 0, '', false];
      invalidEmails.forEach(email => {
        const auth = { ...this.authRequest, ...{ email } };
        this.localRequest
          .post(`${this.apiPath}/auth`)
          .send(auth)
          .expect(422, { errors: [{
            value: email,
            msg: 'Email cannot be empty.',
            param: 'email',
            location: 'body'
          }]}, done);
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
            msg: 'Email cannot be empty.',
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
          msg: 'Email provided must be valid.',
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
            msg: 'Password cannot be empty.',
            param: 'password',
            location: 'body'
          }]}, done);
      });
    });
  });

  describe('with DELETE /auth/:id', function() {
    it('rejects to delete for invalid ObjectIds', function(done) {
      this.localRequest
        .delete(`${this.apiPath}/auth/99999`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, { errors: [{
          value: '99999',
          msg: 'ID parameter must be valid.',
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
