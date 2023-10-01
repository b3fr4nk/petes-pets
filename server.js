/* eslint-disable no-unused-vars */
if (!process.env.PORT) {
  require('dotenv').config();
  process.env.NODE_ENV = 'dev';
}
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
// (async (body, key) => {
//   await s3.putObject({
//     Body: 'hello world',
//     Bucket: 'cw-petespet',
//     Key: 'myfile.txt',
//   })
//       .promise();
// })();

// require mailgun dependencies
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
// eslint-disable-next-line max-len
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

// TEST EMAIL
// mg.messages.create(process.env.EMAIL_DOMAIN, {
//   from: `Excited User <mailgun@${process.env.EMAIL_DOMAIN}>`,
//   to: ['c.wood1011@pm.me'],
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomeness!',
//   html: '<h1>Testing some Mailgun awesomeness!</h1>',
// })
//     .then((msg) => console.log(msg)) // logs response data
//     .catch((err) => console.log(err)); // logs any error

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://petes-pets-db-1:27018', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// payment
app.locals.PUBLIC_STRIPE_API_KEY = process.env.PUBLIC_STRIPE_API_KEY;

require('./routes/index.js')(app);
require('./routes/pets.js')(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

