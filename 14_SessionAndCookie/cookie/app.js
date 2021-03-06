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

// 如果沒有放key，讀到有sign的cookie也會都放到 req.cookies 而不是req.signedCookies
// s:signed test msg.OMh+/34UjLU0dTtfAPkCxiRLmkdsTj5+ywBowGGierY // 有sign的會長這樣，Ｓ開頭後面加上一個hash code
// 如果有放key，但放的跟存cookie的時候的key是不一樣的，那讀到有sign的key一樣會放到req.signedCookies，但會讀到false，就是讀不到東西
app.use(cookieParser("S")); 

app.use(express.static(path.join(__dirname, 'public')));

// https://segmentfault.com/a/1190000004139342
// https://www.cnblogs.com/chyingp/p/express-cookie-parser-deep-in.html
// http://bubkoo.com/2014/04/21/http-cookies-explained/


app.use('/s', function(req, res, next) {
  res.cookie('signedTest', 'signed test msg', {signed: true});
  res.cookie('unsignedTest', 'unsigned test msg', {signed: false});
  console.log("Save cookie!");
  res.end("Save cookie!");
});
app.use('/l', function(req, res, next) {
  var s = JSON.stringify("Cookie in headers = " + req.headers.cookie); // 預設cookie就會存這裡，就算沒有用express相關cookie套件，但會是沒有解析過的格式
  var s2 = JSON.stringify("Cookies in headers = " + req.headers.cookies); // Undefined，在req裡，不在header裡
  var s3 = JSON.stringify("CookieParser in headers = " + req.headers.cookieParser); // Undefined，在req裡，不在header裡
  console.log('------------------------------------------------------------');
  console.log("Load cookie : " + s + "\n, " + s2 + "\n, " + s3);
  console.log("req.cookie = " + req.cookie); // Undefined，req裡的第一層有cookies和signedCookies是被cookie相關module處理過才存到這裡的
  console.log("Signed test in cookies = " + req.cookies.signedTest); // Undefined
  console.log("Unsigned test in cookies = " + req.cookies.unsignedTest);
  console.log("Signed test in signedCookies = " + req.signedCookies.signedTest);
  console.log("Unsigned test in signedCookies = " + req.signedCookies.unsignedTest);// Undefined
  console.log('------------------------------------------------------------');

  res.end(s);
});

app.use('/clear', function(req, res, next) {
  res.clearCookie("signedTest");
  res.clearCookie("unsignedTest");
  res.end("Clear cookie.");
});

/*
關於cookie的疑問
Ｑ：cookie可以活多久？
同一頁面連不同server時cookie是一樣的，那不同頁面連同一server呢？
cookie也在，但用無痕視窗cookie就不見了，所以應該是綁瀏覽器的吧？
關掉整個瀏覽器又打開，cookie就被清掉了(如果有另外設持續時間或到期時間才會關掉仍然存著，這個好像是存在硬碟裡面)
如果沒有特別設定，cookie的生命週期好像就是跟著session的，等之後念到session就知道是啥了吧

Ｑ：我怎麼知道我收到的cookie是哪一個server存的？
存cookie的時候可以順便設定cookie要在哪個domain(就是IP啦)底下運作，
預設會是server當前的domain(IP)，不同port也沒差，
然後client發request的時候就會根據發給哪個domain來順便發對應的cookie給他

！！cookie從client發到server的數量有限制，每個瀏覽器不同
http://bubkoo.com/2014/04/21/http-cookies-explained/
cookie 存在许多限制条件，来阻止 cookie 滥用并保护浏览器和服务器免受一些负面影响。有两种 cookie 限制条件：cookie 的属性和 cookie 的总大小。原始规范中限定每个域名下不超过 20 个 cookie，早期的浏览器都遵循该规范，并且在 IE7 中有更近一步的提升。在微软的一次更新中，他们在 IE7 中增加 cookie 的限制数量到 50 个，与此同时 Opera 限定 cookie 数量为 30 个，Safari 和 Chrome 对与每个域名下的 cookie 个数没有限制。
！！每個domain可以存的cookie最多不能超過4KB

sign的意義：
cookie在用key sign完之後存在client端，下次client傳cookie進來會是sign過的cookie，
我們就會把有sign的cookie拆解出純資料還沒sign的部分用server的key再sign一次，
然後跟client傳進來的sign過的資料比對看兩個sign過包含hash code的cookie有沒有一樣，
若不一樣表示可能有人改過client端sign過的cookie了
例如：
原本
s:signed test msg.OMh+/34UjLU0dTtfAPkCxiRLmkdsTj5+ywBowGGierY
有人偷改成
s:signed test newMsg.OMh+/34UjLU0dTtfAPkCxiRLmkdsTj5+ywBowGGierY
這樣在server把signed test newMsg拿去sign會發現跟client存的不一樣了
表示被偷改了

所以sign key的用意是在防止資料被修改，其實沒辦法防止資料被盜

如果我在A電腦登入然後存了cookie，下次用A電腦連server可以用cookie判斷是不是有登入過，就可以不用重複登入
但因為cookie可以被簡單的取得，如果有人用A電腦取得cookie，然後在B電腦用這個cookie來發給server，那server不就以為B電腦有登入了嗎?
這個問題怎麼解呢?
等念完session再回頭來看這個問題

Q:要怎麼自己塞header來假裝有cookie?
不知道欸，因為cookie還有到期時間、httpOnly等等其他一大堆資訊要設定，不能直接在header單純塞一個cookie就搞定，
之後再研究看看吧

*/




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
