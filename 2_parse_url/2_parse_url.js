var http = require("http"); // http模組用來建server
var url = require("url"); // url模組用來把傳進來的一整串url處理成一項一項的資訊，感覺就是字串處哩，好像也可以自己實作?

function onRequest(req, res) {
  if (req.url != "/favicon.ico") { // 擋掉沒有用的request
    // 我用來連server的網址是 http://localhost:3000/blog?user=zack
    // blog就是pathname, user=zack就是query
    var parseUrl = url.parse(req.url);
    var pathname = parseUrl.pathname;
    var query = parseUrl.query;
    console.log(" pathname >>> " + pathname + "\n query >>> " + query);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello World");
  }
}

http.createServer(onRequest).listen(3000);
console.log("Server has started to listen at port: 3000.");