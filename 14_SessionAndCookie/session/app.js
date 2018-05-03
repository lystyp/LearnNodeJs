var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("test"));
/*
https://niefengjun.cn/blog/576c6f44353308f7389956822726645b.html
https://blog.csdn.net/liangklfang/article/details/50998959
https://gist.github.com/ilake/344733
Session的設定流程
server這邊先導入要有session的設定後，連上client，收到request，server就會根據client的資訊來設定一個client專屬的uuid，
並用signed cookie的方式跟著response送回去給client存在client那邊，
另外可以在req.session設定要存在session的值，
例如:
req.session.name = 'Daniel';
req.session.age = 27;
這個事實上是存在server端的記憶體或資料庫或看我要存哪自己在初始化session的時候順便設定，
接著client第二次發request的時候cookie就會帶有uuid，
server會自己去判斷這個uuid是啥，然後認出她是哪一個client後，就會去找他當初存在session的資料抓出來丟到request，
就可以抓出來用了，像是:
var name = req.session.name;
*/
app.use(session({
  secret:"test", //這是產生uuid用的key
  name:'SessionTest'
  //這是存uuid的cookie的名字，就是uuid會存成
  //req.headers.cookie = 'SessionTest=XXXXXXXXXXXX'
  // 如果name沒填的話預設會是connect.sid
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
