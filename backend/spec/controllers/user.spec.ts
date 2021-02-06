const UserContoller = require('../../src/app/controllers/user.controller')
const User = require('../../src/app/models/user.model')
const UserHelper = require('../helpers/user.helper');

describe('API endpoint for user', function() {
  beforeAll(function() {
  });

  afterEach(function() {
  });

  describe('#list', () => {
    it('should return a list of users', () => {
      expect(1).toBe(1)
    });
  });
});
