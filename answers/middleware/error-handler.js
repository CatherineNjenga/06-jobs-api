'use strict';

// const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { custom } = require('joi');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later'
  }
  // this is now handled by the first property in the customError object above
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id ${err.value}.`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
}

module.exports = errorHandlerMiddleware;