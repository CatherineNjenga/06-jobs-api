'use strict';
require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express'),
  app = express();

// connectDB
const connectDB = require('./answers/db/connect');
const authenticateUser = require('./answers/middleware/authentication');

// routers
const authRouter = require('./answers/routes/auth');
const blogsRouter = require('./answers/routes/blogs');

// error handler
const notFoundMiddleware = require('./answers/middleware/not-found');
const errorHandlerMiddleware = require('./answers/middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy', 1);
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get('/', (req, res) => {
  res.send('blogs api');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blogs',authenticateUser, blogsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();