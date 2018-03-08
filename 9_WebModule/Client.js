

//http://www.runoob.com/nodejs/nodejs-web-module.html
//重點在這個
//用node.js來發一個GET要求，取代用瀏覽器key URL來發
// 這裡就可以取得回應來做事 

var http = require('http');
var fs = require("fs");

// 用于请求的选项
var options = {
   host: 'localhost',
   port: '8080',
   path: '/index.html'  

// 可以用這個對google發要求，不知為何https的443 port不能用，只好用http 的 80 port
//    host: 'www.google.com.tw',
//    port: '80',
//    path: ''  

};

var writeStream = fs.createWriteStream('output.html', { highWaterMark: 1});
// 处理响应的回调函数
var callback = function(response){
   // 不断更新数据
   var body = '';
    response.on('data', function(data) {
        // 把收到的data寫成一個新的html檔
        var b = writeStream.write(data);
        console.log("Get data >> " + data);
    });
   
   response.on('end', function() {
      // 数据接收完成
      writeStream.end();
      console.log("end");
   });
}
// 向服务端发送请求
var req = http.request(options, callback);
req.end();