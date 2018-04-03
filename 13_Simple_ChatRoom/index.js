

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

var serv_io = io.listen(server);

// 整個邏輯就是，有新使用者加入或是使用者輸入的訊息，通通會傳回server，
// 並且把要顯示的訊息新增到historyMsg裡面，然後通知client把訊息更新(清空重寫一遍全部訊息)


var userList = {}
function addUser(id, name) {
    if(name == "" || name == null) {
        name = "怪人";
      }
    userList[id] = name;
}

var historyMsg = [];
function addMsg(name, text) {
    var l = historyMsg.length;
    historyMsg[l] = [name + " : " + text]
    console.log("Add msg : " + historyMsg[l])
}

serv_io.sockets.on('connection', function(socket) {
    console.log("Socket get connection : " + socket.client.id)
    socket.on("newUser", function(name){
        addUser(socket.client.id, name);
        console.log("User list = \n" + JSON.stringify(userList, null, 2));

        addMsg("System", userList[socket.client.id] + " 已經加入惹~")
        serv_io.sockets.emit('msgUpdate', historyMsg);
    });

    socket.on("newText", function(data){
        addMsg(data["name"], data["text"]);
        serv_io.sockets.emit('msgUpdate', historyMsg);
    })

});