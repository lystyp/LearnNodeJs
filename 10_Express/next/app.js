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
Middleware就是一個中介器，負責接http跟自訂路由處理的中間者
可以用
app.get(.....)
get可以換成其他http方法，像post, delete之類的
或是用
app.use(......)
來new一個Middleware，
會有一個stack負責來放所有Middleware，當有http requset進來，就會把Middleware拿出來從第一個開始比對，
如果request有打中那個Middleware，就執行它裡面function的內容，如果function裡面有執行next()就會繼續往下一個Middleware比對，
否則就停止往下比對。
*/

// Middleware的參數可以丟app.XXX("url string", function)，比對的時候就先根據ＸＸＸ是http方法還是use()，
// 如果是http方法，只有GET才會打中app.get(...)，如果是use，則不管哪個方法都會打中(嗎？？)
// 然後還會看url內容來決定會不會打中這個Middleware
// 然後
// app.get(function...) 相當於app.get("/", function...)
// 
// 接著講Middleware裡面的function,基本就是丟三個參數functoin(req, res, next)
// next就是決定要不要把res跟req繼續往下一個Middleware傳
// next裡面可以丟參數next(arg)
// arg就會是下一個Middleware的第一個參數
// 變成app.get("url", function(arg, req, res, next){...})



//1
app.get('/a', function(req, res, next) {
  console.log("GET a!")
  res.send('a');
  next();
});

//2
app.get('/b', function(req, res, next) {
  console.log("GET b!")
  res.send('b');
});

//3
app.use(function(req, res, next) {
  console.log("First Middleware, req = " + req.path)
  next("Msg arg!");
});

//4
app.use(function(arg, req, res, next) {
  console.log("Second Middleware, arg = " + arg);
});

//5
app.get('/c', function(req, res, next) {
  console.log("GET c!")
  res.send('c');
});


/*
case1:127.0.0.1:3000/
1沒打中，2沒打中，3打中有next往4跑，4有打中沒next停止

case2:127.0.0.1:3000/a
打中1有next往二跑，2沒中，3有中有next往4，4有中沒next停止

case3:127.0.0.1:3000/b
1沒中往2，2有中沒next停止

case4:127.0.0.1:3000/c
1沒中2沒中3有中有next往4有中沒next停止，沒有到5
*/

module.exports = app;
