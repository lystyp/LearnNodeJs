// 目標 使用者 A 輸入某些自，所有使用者會一起收到那些變更並顯示

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

serv_io.sockets.on('connection', function(socket) {
    console.log("Trigger connection in socket.")
    socket.emit('data', {'data': "Data from server."});
});