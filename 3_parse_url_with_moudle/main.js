// 參考 https://nodejust.com/nodejs-routing-request/

var http = require("http");
var url = require("url");
var router = require("./route");
 
function onRequest(req, res) {
  if(req.url != "/favicon.ico") {
    var pathname = url.parse(req.url).pathname;
    console.log("Get request : " + pathname);
    router.route(res, pathname);
    console.log("Finish route.");
  }
}
 
http.createServer(onRequest).listen(3000);
console.log("Server has started to listen at port: 3000.");

