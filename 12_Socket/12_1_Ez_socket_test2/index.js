// 目標 使用者 A 輸入某些自，所有使用者會一起收到那些變更並顯示

// 參考
// https://blog.gtwang.org/programming/socket-io-node-js-realtime-app/

var http = require('http');
var url = require('url');
var fs = require('fs');

// 加入socket的library
var io = require('socket.io'); // 加入 Socket.IO

var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;
    switch (path) {
        case '/': 
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('Hello, World.');
            response.end();
            break;
        case '/socket':
            fs.readFile(__dirname + path + ".html", function(error, data) {
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                } else {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                }
                response.end();
            });
            break;
    }
});

server.listen(8888);
console.log("Server is created.")

// io需要找一個server依附在上面並且監聽他(完全不會影響到server)
var serv_io = io.listen(server);

var s = "";
serv_io.sockets.on('connection', function(socket) {
    console.log("Socket get connection : " + socket)
    socket.on('dataFromClient', function(data){
        console.log("Client send data : " + data);
        s = s + data;
        // Socket看起來似乎是一對一的連線，所以我如果兩個使用者連進來，A改資料，這裡的socket.emit('dataChanged', s)只會觸發對A的socket，B那邊沒有反應
        // socket.emit('dataChanged', s);

        // socket也有分布同種觸發事件方式
        // http://www.cc.ntu.edu.tw/chinese/epaper/0030/20140920_3010.html
        //  socket.emit - 對一個特定的 socket 傳訊息
        //  socket.on – 對特定 event 的運行結果進行接收
        //  socket.broadcast.emit - 對目前 socket 之外所有線上的 socket 傳訊息
        //  io.sockets.emit - 對所有線上 socket 傳訊息 (這裡的io就是var serv_io = io.listen(server)的serv_io)

        // 改成下面這樣就可以work了
        serv_io.sockets.emit('dataChanged', s);
    });
});