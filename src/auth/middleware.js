'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {

  try {
    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
    case 'basic':
      //console.log(authType, encodedString);
      return _authBasic(encodedString);
    default:
      return _authError();
    }

  } catch(e) {
    console.error(e);
    return _authError();
  }

  function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    //console.log(username, password);
    let auth = [username,password];  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then(user => {
        _authenticate(user);
      });
  }

  function _authenticate(user) {
    if (user) {
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

