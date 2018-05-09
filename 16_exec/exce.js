// http://nodejs.org/api.html#_child_processes
var sys = require('util')
var exec = require('child_process').exec;
var child;

// executes `pwd`
// 第一個參數就是用來執行一些cmd的命令
child = exec("pwd", function (error, stdout, stderr) {
  console.log('stdout: ' + stdout); // 執行完的輸出
  console.log('stderr: ' + stderr); // 執行完的error
  if (error !== null) {
    console.log('exec error: ' + error); // node本身的error
  }
});