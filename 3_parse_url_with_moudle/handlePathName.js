// 在執行home的時候，用一個sleep來模擬大量運算導致response 會 delay
var exec = require("child_process").exec;

function funcHome(res) {
  function getS(){
    sleep(5000);
    console.log("This is the home page.");
    return "This is the home page.";
  }
  // 這個會卡住所有resques, 怎麼解?
  var s = getS();
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(s);
}

function funcBlog(res) {
  function getS(){
    console.log("This is the blog page.");
    return "This is the blog page.";
  }
  var s = getS();
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(s);
}

function funcUser(res) {
  function getS(){
    console.log("This is the user page.");
    return "This is the user page.";
  }
  var s = getS();
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end(s);
}

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

// 把這些function exports 出去給其他同資料夾底下的.js 檔用
exports.home = funcHome;
exports.blog = funcBlog;
exports.user = funcUser;