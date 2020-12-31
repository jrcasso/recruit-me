// import { ApiError } from '../../lib/handlers/errors'; # Upgrade to TS
const request = require('supertest');
const RandomHelper = require('../helpers/random.helper');
const UserHelper = require('../helpers/user.helper');

describe('API endpoint for user', function() {
  beforeAll(async function() {
    this.helper = new UserHelper();
    await this.helper.connect().then(() => {
      this.helper.removeAll().catch((err) => console.error(err));
      // This host is docker compatible
      this.localRequest = request('http://express:3000');
      this.apiPath = '/api/v1';
      this.email = 'jdoe@test.justinshipscode.com';
      this.password = 'foob!@arBaz1023';
      this.firstname = 'John';
      this.lastname = 'Doe';
      this.user = {
        email: this.email,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname
      };
    });
  });

  afterEach(function() {
    // Clean-up: remove users from the database after testing
    this.helper.removeAll();
  });

  describe('with GET /user/:id', function() {
    it('refuses to return a user for invalid ObjectIds', function(done) {
      this.localRequest
        .get(`${this.apiPath}/user/99999`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns a specific user for a valid ObjectId', async function(done) {
      // Create user in database
      const user = await this.helper.create({ ...this.user, ...{ active : true, verified : false } });

      this.localRequest
        .get(`${this.apiPath}/user/${user.insertedId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(this.email);
          expect(res.body.firstname).toBe(this.firstname);
          expect(res.body.lastname).toBe(this.lastname);
          expect(res.body.active).toBe(true);
          expect(res.body.verified).toBe(false);
        })
        .end((err, res) => {
          if (err) {return done(err);}
          done();
        });
    });
  });

  describe('with GET /user/', function() {
    it('returns a number of users', async function(done) {
      // Generate a random number of users
      const numUsers = RandomHelper.randomInt(1, 10);
      for (let index = 0; index < numUsers; index++) {
        tempUser = { ...this.user, ...{ email: `${RandomHelper.randomString(10)}@test.com` } };
        await this.helper.create(tempUser);
      }

      this.localRequest
        .get(`${this.apiPath}/user/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.length).toBe(numUsers, 'the number of seeded users');
        })
        .expect(200, done);
    });
  });

  describe('with POST /user/', function() {
    it('creates a valid user', function(done) {
      this.localRequest
        .post(`${this.apiPath}/user`)
        .send(this.user)
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe(this.email);
          expect(res.body.firstname).toBe(this.firstname);
          expect(res.body.lastname).toBe(this.lastname);
          expect(res.body.password).toBe(null);
          expect(res.body.active).toBe(true);
          expect(res.body.verified).toBe(false);
        })
        .end((err, res) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('refuses to create a user that with an email already in use', function(done) {
      // Create a user in the database
      this.helper.create(this.user);

      // Try to POST another user with the same email
      this.localRequest
        .post(`${this.apiPath}/user`)
        .send(this.user)
        .expect(422, { errors: [{
          value: this.email,
          msg: 'E-mail already in use.',
          param: 'email',
          location: 'body'
        }]}, done);
    });

    it('refuses to create a user with an empty email', function(done) {
      // Copy and override a valid payload with an invalid email
      const invalidEmails = [null, 0, '', false];
      invalidEmails.forEach(email => {
        const user = { ...this.user, ...{ email } };
        this.localRequest
          .post(`${this.apiPath}/user`)
          .send(user)
          .expect(422, { errors: [{
            value: email,
            msg: 'Email cannot be empty.',
            param: 'email',
            location: 'body'
          }]}, done);
      });
    });

    it('refuses to create a user with an invalid email', function(done) {
      const randomString = RandomHelper.randomString(5, 10);
      const invalidUser = { ...this.user, ...{ email: randomString } };

      this.localRequest
        .post(`${this.apiPath}/user`)
        .send(invalidUser)
        .expect(422, { errors: [{
          value: randomString,
          msg: 'Email provided must be valid.',
          param: 'email',
          location: 'body'
        }]}, done);
    });

    it('refuses to create a user with an empty password', function(done) {
      const invalidUsers = [ null, 0, '', false ];

      invalidUsers.forEach(password => {
        const user = { ...this.user, ...{ password } };

        this.localRequest
          .post(`${this.apiPath}/user`)
          .send(user)
          .expect(422, { errors: [{
            value: password,
            msg: 'Password cannot be empty.',
            param: 'password',
            location: 'body'
          }]}, done);
      });
    });

    it('refuses to create a user without a sufficiently complex password', function(done) {
      const invalidPasswords = [
        'abcdefghij',
        '1234567890',
        'abc123'
      ];

      invalidPasswords.forEach(password => {
        const user = { ...this.user, ...{ password } };

        this.localRequest
          .post(`${this.apiPath}/user`)
          .send(user)
          .expect(422, { errors: [{
            value: password,
            msg: 'Password provided must meet complexity requirements.',
            param: 'password',
            location: 'body'
          }]}, done);
      });
    });

    it('refuses to create a user with a non-alphabetic firstname', function(done) {
      const invalidUser = { ...this.user, ...{ firstname: 'Jane123' } };

      this.localRequest
        .post(`${this.apiPath}/user`)
        .send(invalidUser)
        .expect(422, { errors: [{
          value: 'Jane123',
          msg: 'First name provided must be valid.',
          param: 'firstname',
          location: 'body'
        }]}, done);
    });

    it('refuses to create a user with a non-alphabetic lastname', function(done) {
      const invalidUser = { ...this.user, ...{ lastname: '987Smith' } };

      this.localRequest
        .post(`${this.apiPath}/user`)
        .send(invalidUser)
        .expect(422, { errors: [{
          value: '987Smith',
          msg: 'Last name provided must be valid.',
          param: 'lastname',
          location: 'body'
        }]}, done);
    });
  });

  describe('with UPDATE /user/:id', function() {
    it('returns 400 for invalid ObjectIds', function(done) {
      this.localRequest
        .put(`${this.apiPath}/user/99999`)
        .send(this.user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 200 for valid ObjectIds', async function(done) {
      // Create user in the database
      const user = await this.helper.create(this.user);

      // Update the user and expect new attributes
      const newUser = { ...this.user, ...{ firstname: 'Jane', lastname: 'Smith' } };
      this.localRequest
        .put(`${this.apiPath}/user/${user.insertedId}`)
        .send(newUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.firstname).toBe('Jane');
          expect(res.body.lastname).toBe('Smith');
        })
        .expect(200, done);
    });

    it('returns 200 for valid ObjectIds', async function(done) {
      // Create user in the database
      const user = await this.helper.create(this.user);

      // Update the user and expect new attributes
      const newUser = { ...this.user, ...{ password: 'foobarbaz1213' } };
      this.localRequest
        .put(`${this.apiPath}/user/${user.insertedId}`)
        .send(newUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.password).toBe(null);
        })
        .expect(200, done);
    });
  });

  describe('with DELETE /user/:id', function() {
    it('rejects to delete for invalid ObjectIds', function(done) {
      this.localRequest
        .delete(`${this.apiPath}/user/99999`)
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
      const user = await this.helper.create(this.user);

      this.localRequest
        .delete(`${this.apiPath}/user/${user.insertedId}`)
        .set('Accept', 'application/json')
        .expect(204, done);

      const deletedUser = await this.helper.retrieve(this.user.insertedId);
      expect(deletedUser).toBe(null);
    });
  });
});
