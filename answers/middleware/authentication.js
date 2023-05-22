'use strict';
const user = require('../models/User');
const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const authenticationMiddleware = async (req, res, next) => {
  // check header
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, function(err,decoded) {
    if (err) {
      throw new UnauthenticatedError('Invalid credentials');
    }
    // attach the user to the job routes
    // const user = user.findById(decoded.id).select('-password');
    // req.user = user;
    req.user = {userId: decoded.userId, name: decoded.name};
    next();
  }); 
}

module.exports = authenticationMiddleware;
