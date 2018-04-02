var http = require("http");

http.createServer(function(request, response) {
  console.log("Server is connected.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello world");
  response.end();
}).listen(8888);
console.log("Server is created.");

// 用createServer建一個server，並且server會監聽電腦的8888的port
// 所以我開網頁連 127.0.0.1:8888
// 相當於我從外部發一個請求到某IP的某port，127.0.0.1就是本機電腦啦
// 他回傳hello world 給我show

// 每次有人連上自己的Server，一次有兩個request進來，秀url會發現兩次要求的內容不一樣，是因為有一個request是在要求 Favicon.ico
// 什麼是Favicon.ico? > https://blog.miniasp.com/post/2007/12/17/Introduce-faviconico-and-important-concept.aspx