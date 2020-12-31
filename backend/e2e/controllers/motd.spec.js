// import { ApiError } from '../../lib/handlers/errors'; # Upgrade to TS
const request = require('supertest');
const RandomHelper = require('../helpers/random.helper');
const MotdHelper = require('../helpers/motd.helper');

describe('API endpoint for motd', function() {
  beforeAll(async function() {
    this.helper = new MotdHelper();
    await this.helper.connect().then(() => {
      // This host is docker compatible
      this.localRequest = request('http://express:3000');
      this.apiPath = '/api/v1';
    });
  });

  beforeEach(function() {
    // await this.helper.clean()
    this.numMotds = RandomHelper.randomInt(1, 10);
    this.message = `test-${RandomHelper.randomString(10)}`;
    this.foreground = RandomHelper.randomColor();
    this.background = RandomHelper.randomColor();
    this.timestamp = Date.now();
    this.motd = {
      message: this.message,
      foreground: this.foreground,
      background: this.background,
      timestamp: this.timestamp
    };
    this.ids = [];
  });

  afterEach(function() {
    // Clean-up: remove motds from the database after testing
    this.ids.forEach(element => {
      this.helper.remove(element).catch((err) => console.error(err));
    });
  });

  describe('with GET /motd/:id', () => {
    it('returns 400 for invalid ObjectIds', function(done) {
      this.localRequest
        .get(`${this.apiPath}/motd/99999`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 200 for valid ObjectIds', async function(done) {
      // Create motd in database
      const motd = await this.helper.create(this.motd);
      this.localRequest
        .get(`${this.apiPath}/motd/${motd.insertedId}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);

      this.ids.push(motd.insertedId); // Add to clean-up
    });
  });

  describe('with GET /motd/', function() {
    it('returns an array of messages', async function(done) {
      // Generate a random number of messages
      for (let index = 0; index < this.numMotds; index++) {
        const motd = await this.helper.create(this.motd);
        this.ids.push(motd.insertedId);
      }
      this.localRequest
        .get(`${this.apiPath}/motd/`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.length).toBe(this.numMotds, 'the number of seeded messages');
        })
        .expect(200, done);
    });
  });

  describe('with POST /motd/', function() {
    it('creates a valid message of the day', function(done) {
      this.localRequest
        .post(`${this.apiPath}/motd`)
        .send(this.motd)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe(this.message);
          expect(res.body.foreground).toBe(this.foreground);
          expect(res.body.background).toBe(this.background);
          expect(res.body.timestamp).toBe(this.timestamp);
          this.ids.push(res.body._id); // Add to clean-up
        })
        .end((err, res) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('creates a default message of the day', function(done) {
      motd = { message: 'test-default-message' };
      this.localRequest
        .post(`${this.apiPath}/motd`)
        .send(motd)
        .expect(201)
        .expect((res) => {
          expect(Date.now() - res.body.timestamp, 'with now as the current timestamp').toBeLessThan(10000);
          this.ids.push(res.body._id);
        })
        .end((err, res) => {
          if (err) {return done(err);}
          done();
        });
    });

    it('fails to create an motd without the message defined', function(done) {
      // Missing required field "message":
      motd = { foreground : this.foreground, background : this.background, timestamp : this.timestamp };
      this.localRequest
        .post(`${this.apiPath}/motd`)
        .send(motd)
        .expect(422, { errors: [{
          msg: 'Message cannot be empty',
          param: 'message',
          location: 'body'
        }]}, done);
    });

    it('fails to create an motd with the message exceeding 80 characters', function(done) {
      motd = this.motd;
      motd.message = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzOOO';
      this.localRequest
        .post(`${this.apiPath}/motd`)
        .send(motd)
        .expect(422, { errors: [{
          value: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzOOO',
          msg: 'Message cannot exceed 80 characters',
          param: 'message',
          location: 'body'
        }]}, done);
    });

    it('succeeds to create an motd with the message 80 characters', function(done) {
      motd = this.motd;
      motd.message = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzOO';
      this.localRequest
        .post(`${this.apiPath}/motd`)
        .send(motd)
        .expect((res) => this.ids.push(res.body._id))
        .expect(201, done);
    });
  });

  describe('with UPDATE /motd/:id', function() {
    it('returns 400 for invalid ObjectIds', function(done) {
      this.localRequest
        .put(`${this.apiPath}/motd/99999`)
        .send(this.motd)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 200 for valid ObjectIds', async function(done) {
      // Create motd in the database
      const motd = await this.helper.create(this.motd);

      // Update the motd and expect a new message
      newMotd = { message: 'test-new-message' };
      this.localRequest
        .put(`${this.apiPath}/motd/${motd.insertedId}`)
        .send(newMotd)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body.message).toBe('test-new-message');
        })
        .expect(200, done);

      this.ids.push(motd.insertedId); // Add to clean-up
    });
  });

  describe('with DELETE /motd/:id', function() {
    it('returns 400 for invalid ObjectIds', function(done) {
      this.localRequest
        .delete(`${this.apiPath}/motd/99999`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

    it('returns 200 for valid ObjectIds', async function(done) {
      // Create motd in the database
      const motd = await this.helper.create(this.motd);

      // Delete the motd and expect a new message
      newMotd = { message: 'test-new-message' };
      this.localRequest
        .delete(`${this.apiPath}/motd/${motd.insertedId}`)
        .set('Accept', 'application/json')
        .expect(204, done);

      this.ids.push(motd.insertedId); // Add to clean-up
    });
  });
});
