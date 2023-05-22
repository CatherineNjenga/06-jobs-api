'use strict';
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  // res.send('register user');
  // if not using mongoose for validation
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password');
  // }
  // if hashing the password in the controller
  // const { name, email, password } = req.body;

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // const tempUser =  { name, email, password: hashedPassword };

  // const user = await User.create({...tempUser});

  // res.status(StatusCodes.CREATED).json({ user });
  const user = await User.create({...req.body});
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user:{name: user.name}, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name: user.name}, token})

  // res.send('login user');
};

module.exports = {
  register,
  login,
};