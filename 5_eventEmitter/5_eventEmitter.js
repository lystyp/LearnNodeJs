//參考 http://www.runoob.com/nodejs/nodejs-event.html



// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

// 宣告一個function來當callback，這個function用來 > 當connect完成時觸發"data_received"事件
var connectHandler = function connected(arg1, arg2) {
   console.log('connected succeed, arg1 = ' + arg1 + ", arg2 = " + arg2);
   eventEmitter.emit('data_received');
}

var receivedHandler = function received() {
  sleep(2000);
  console.log('data_received succeed');
}

// 告訴eventEmitter 當觸發connection時執行connectHandler，當觸發
eventEmitter.on('connection', connectHandler);
eventEmitter.on('data_received', receivedHandler);

// 触发 connection 事件 
eventEmitter.emit('connection', "參數1", "參數2");

console.log("Finish");

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

/*執行步驟
eventEmitter不是非同步API，而是同步API，所以只會依照順序一行一行執行，他只是做一個有callback的pattern讓我們比較好使用而已，所以還是要配合一些非同步API(把事情丟到EventLoop的API)一起使用
*/

//---------------------------------------------------------------------------------------------------

// 下面這個code會爆掉，因為common queue塞太多callback爆掉
var EventEmitter = require("events");

var crazy = new EventEmitter();

crazy.on('event1', function () {
    console.log('event1 fired!');
    crazy.emit('event2');
});

crazy.on('event2', function () {
    console.log('event2 fired!');
    crazy.emit('event3');

});

crazy.on('event3', function () {
    console.log('event3 fired!');
    crazy.emit('event1');
});

crazy.emit('event1');

// 下面這個不會掛掉，因為是非同步API，所以確認common queue空了才把下一個callback拿進來，callback執行完才有產生一個新的callback
var EventEmitter = require('events');

var crazy = new EventEmitter();

crazy.on('event1', function () {
    console.log('event1 fired!');
    setImmediate(function () {
        crazy.emit('event2');
    });
});

crazy.on('event2', function () {
    console.log('event2 fired!');
    setImmediate(function () {
        crazy.emit('event3');
    });

});

crazy.on('event3', function () {
    console.log('event3 fired!');
    setImmediate(function () {
        crazy.emit('event1');
    });
});

crazy.emit('event1');