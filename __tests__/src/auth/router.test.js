'use strict';

const jwt = require('jsonwebtoken');

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose(server);

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

describe('Auth Router', () => {

  describe.each(
    Object.keys(users).map(key => [key])
  )('%s users', (userType) => {

    let id;

    it('can create one', () => {
      return mockRequest.post('/signup')
        .send(users[userType])
        .then(res => {
          let decodedToken = jwt.decode(res.text);
          id = decodedToken.id;
          expect(decodedToken.id).toBeDefined();
          expect(decodedToken.capabilities).toBeDefined();
        });
    });

    it('can signin with basic', () => {
      return mockRequest.post('/signin')
        .auth(Buffer.from(`${users[userType].username}:${users[userType].password}`))
        .then(res => {
          let decodedToken = jwt.decode(res.text);
          expect(decodedToken.id).toEqual(id);
          expect(decodedToken.capabilities).toBeDefined();
        });
    });

  });

  it('can get all users', () => {
    return mockRequest.get('/users')
      .then(res => {
        
      });
  });
});