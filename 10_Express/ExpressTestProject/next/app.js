var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



/*
http://expressjs.com/zh-tw/guide/writing-middleware.html
https://cnodejs.org/topic/5757e80a8316c7cb1ad35bab

Ｅxpress 的 Middleware
可以用
app.get(.....)
get可以換成其他http方法，像post, delete之類的
或是用app.use(......)
然後Middleware可以配合next()使用
運作機制明天補
*/


app.get('/a', function(req, res, next) {
  console.log("GET a!")
  res.send('a');
  next();
});

app.get('/b', function(req, res, next) {
  console.log("GET b!")
  res.send('b');
});

app.use(function(req, res, next) {
  console.log("First Middleware, req = " + req.path)
  next("Msg arg1!");
});

app.use(function(arg1, req, res, next) {
  console.log("Second Middleware, arg1 = " + arg1);
  next();
});

app.get('/c', function(req, res, next) {
  console.log("GET c!")
  res.send('c');
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
