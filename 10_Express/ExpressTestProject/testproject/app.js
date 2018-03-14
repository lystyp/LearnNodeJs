/*
https://nodejust.com/nodejs-expressjs-project-package-json/
https://nodejust.com/nodejs-expressjs-web-routing/
https://nodejust.com/nodejs-expressjs-appjs/
https://nodejust.com/nodejs-expressjs-about-us/
*/

/* 用express建一個專案，他會自動切成各自的模組(依照MVC)
M-model -資料相關操作
V-view -就是view...
C-control -邏輯運算操作吧?
要執行時直接跑 npm start就行了，start這個指令是在package.json底下定義的
  "scripts": {
    "start": "node ./bin/www"
  }
相當於跑  node ./bin/www 指令的意思，所以主要應該是從www那個開始跑

www會跟這個app.js連，用這裡來連接MVC的不同區塊
*/

/*
關於package.json
然後當你上傳到git的時候，可以用npm init去產生一個跟這個路徑底下的專案相關的描述檔"package.json"，
產生時會要你填一些基本資訊，接著他產生的檔案裏面就會包含這個專案用了哪些module，其他人就可以根據這個json來裝專案所需的module到自己的電腦，
好像如果有那個json檔的話，只要輸入npm install就可以自動根據json來安裝了
*/
// include 各種 library
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

// 這裡是把MVC的C給include近來(都放在routes底下)
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// 設定view會從__dirname(就是專案路徑)底下的views裡面來，views應該是用一個css相關的模板來做
// 參閱https://nodejust.com/nodejs-expressjs-project-package-json/
// 使用hogan.js這個由Twitter開發的模版引擎(template engine)以及LESS這個CSS預處理器(CSS pre-processor)
// 所以'view engine' 是 'hjs'(hogan.js)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
console.log("__dirname = " + __dirname)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// 這裡是處理request傳進來的url決定要用哪一個route處理
// 去看route裡面的code都在幹嘛吧~
app.use('/', index);
app.use('/users', users);

// 下面都看不懂
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

/*
  我把mongoDB的東西寫在下面這裡
  一共新增了兩個模組，第一個是”mongodb”，使node.js可以使用MongoDB；第二個”monk”是用來連結MongoDB的，
  它的好處是簡單易用，適合新手。跟”monk”類似的模組有”mongoose”，”mongoose”比”monk”更強，更複雑

  mongoDB跟js這邊溝通也是透過port來相連的
  mongoDB預設的port是27017
*/
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/testproject');


module.exports = app;
