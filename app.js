var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var superRouter = require('./routes/super');
var userRouter = require('./routes/users');
var managerRouter = require('./routes/manager');
var app = express();
var session = require('express-session')
require('dotenv').config()
const MongoStore = require('connect-mongo')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');
const { env } = require('process');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/lms';
Object.keys(mongoose.connection.models).forEach(key => {
  delete mongoose.connection.models[key];
});
const conn = mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var sess = {
  secret: process.env.STORE_SECRET,
  resave: false,
  saveUninitialized: true,
  store:MongoStore.create({mongoUrl:'mongodb://localhost:27017/lms'}),
  cookie: {
    maxAge:24*60*60*1000
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use('/', indexRouter);
app.use('/super', superRouter);
app.use('/user',userRouter);
app.use('/manager',managerRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
