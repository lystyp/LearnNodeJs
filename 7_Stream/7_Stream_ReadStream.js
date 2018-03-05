//http://www.runoob.com/nodejs/nodejs-stream.html > 語法教學
//https://scarletsky.github.io/2016/07/01/basics-node-js-streams/
//可以直覺地觀看每個queue間如何運作的網站 http://latentflip.com/loupe/?code=Cgpjb25zb2xlLmxvZygiSGkhIik7CgpzZXRUaW1lb3V0KGZ1bmN0aW9uIHRpbWVvdXQoKSB7CiAgICBjb25zb2xlLmxvZygiMTExMTExISIpOwp9LCAxMDAwKTsKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIjIyMjIyMjIhIik7Cn0sIDEwMDApOwpzZXRUaW1lb3V0KGZ1bmN0aW9uIHRpbWVvdXQoKSB7CiAgICBjb25zb2xlLmxvZygiMzMzMzMzMyEiKTsKfSwgNTAwMCk7CmNvbnNvbGUubG9nKCJXZWxjb21lIHRvIGxvdXBlLiIpOw%3D%3D!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D
// 異步執行的說明 https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/eventloop.html
// CommonQueue是我自己取的，正確的名字是呼叫堆疊(call stack)

/* 
taskQueue是先進先出 > 正常沒問題
commonQueue是後進先出 > 什麼意思?如何測試是不是真的?
*/


//--------------------------------------------------------------正文開始------------------------------------------------------------------------------------------
// http://www.eebreakdown.com/2016/10/nodejs-streams.html
// Stream有四種 >
// _stream_readable.js 可讀(只能流出)
// _stream_writable.js 可寫(只能流進)
// _stream_transform.js 轉換
// _stream_duplex.js 雙向
// stream.js (以上四個都繼承了這個 Base Class) 

/*
一個Stream基本上就是一個buffer配上一個EventEmitter 的組合
當資料進到Stream時，會先存到buffer裡，buffer滿了會暫時無法再放資料，資料取出也是從buffer取出，如果buffer空了會有通知表示資料已經取完了，或是可以在放新資料進buffer了
直接看範例
*/

//------------------------------------------------------------------------從ReadStream開始--------------------------------------------------------------------------------------
//ReadStream簡介 > 就是會從資料來源一直讀資料進buffer，滿了之後會暫停，空了會繼續讀，來源資料讀完後會通知使用者，然後在使用者自己決定要怎麼讓資料從buffer流出來
// 就像是要從水池(資料來源)舀水進水桶(Buffer)，然後再讓使用者喝水(從buffer取資料)，水桶滿了就沒辦法再去裝新的一桶水，要等喝完了才能再裝




var RUN_CODE_VERSION = 5;

if(RUN_CODE_VERSION == 1){
    // Code 1..........................................................................................

    // 创建可读流，來源是'input.txt'，read Stream裡的buffer大小設為8byte(預設是65536，單位應該是byte吧?預設太大了很難塞滿，所以把他預設小一點)，
    // 我沒有設定他的stream編碼，所以預設應該是ASCII...吧? 
    // (有看到有說buffer除了放一般的型態，還可以放object，蠻神奇的)
    var fs = require("fs");
    var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});
    // 秀一下readStream長怎樣
    console.log(" > " + JSON.stringify(readerStream) + "\n\n")



    // 註冊callback(類似EventEmitter)
    // 'readable':通知使用者，buffer已經滿囉~~
    // 'end':當資料讀完時要通知一下

    readerStream.on('readable', function() {
        // readerStream.read()用來把資料從buffer倒出來，預設是一次全倒光，也可以readerStream.read([size])來設定一次要到多少資料出來
        // 倒完之後會再裝新資料進buffer
        // p.s.特別case:假如我一次倒3單位，會發現第三次倒不滿，就會直接不倒了回傳null，並重新把buffer補滿，所以buffer狀態如下
        console.log("readable start.");
        // buffer = 12345678
        var s = readerStream.read([3]); 
        console.log("readable >> "  + s);  // 123
        // buffer = 45678
        var s = readerStream.read([3]); 
        console.log("readable >> "  + s);  // 456
        // buffer = 78
        var s = readerStream.read([3]);
        console.log("readable >> "  + s);  // null
        // buffer = 789012345
    });

    readerStream.on('end',function(){
        console.log("The end.");
    });
}

if(RUN_CODE_VERSION == 2){
    // Code2..........................................................................................
    // 一樣先創一個ReadStream
    var fs = require("fs");
    var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});

    // 註冊'data'事件，這個比較特別的地方是，當我註冊data事件，Stream會自動把資料給倒出來到這個callback裡面，等於註冊data callback就是在把stream的開關自動打開
    readerStream.on('data', function(chunk) {
        console.log("Get data >> " + chunk);
    });

    readerStream.on('end',function(){
        console.log("The end.");
    });
}


/*
介紹完ReadStream之後，接下來來看看Stream的一些版本
　　Node.js 的 Stream 自第一版的 Stream1 (Node v0.8) 演化至今，已經歷經 Stream2 (>  v0.10) 而來到 Stream3 (> v0.12)。這裡我先很簡單地作一下摘要：

[ Stream1 ]
使用 Push Model，即有資料來，Stream 自動發射 'data' 事件伴隨 data chunk 以將資料推出去，這稱為 Flowing Mode (流動模式)。
[ Stream2 ]
預設為 Pull Model，即有資料來時，Stream 將資料累積於內部緩衝區中，並同時發射一個 'readable' 事件來通知 Stream 的使用者，將資料取走 (使用 read() 方法)。若使用者沒有取走，資料將繼續累積於內部緩衝區。
Stream2 的預設模式也稱為 Paused Mode 或 Non-Flowing Mode (非流動模式)。
當 Stream 不再自動將資料推出來、使用者可以自己決定要不要拉出資料，意味著使用者控制「資料流動」的彈性增加了。
使用者仍可以將 Stream 轉回 Flowing Mode 來使用，只要掛上 'data' 事件的監聽器或呼叫 resume() 即可。
Flowing/Non-flowing 模式只能擇一使用，即你的程式碼中不可以同時有 'data' 的監聽器以及 'readable' 的監聽器。若兩者兼有之，程式不會當掉，但是你可能會得到非預期的 Stream 行為。
[ Stream3 ]
混合模式(Mixed mode)，推拉模型混在一起，程式碼中可以同時有 'data' 的監聽器以及 'readable' 的監聽器，行為容我後面再說明。
一般還是建議維持 Flowing / Non-Flowing 模式擇一使用的習慣，通常混著用的機會可能也不大 (或許是有很棒的使用時機？這要請高手指點一下～)。
Stream3 開始，幾乎都是 performance 調整與 bug 的修正，Stream 的介面與行為看起來目前是穩定下來了。

總而言之就是分成Flowing Mode和 Non-Flowing Mode，註冊data就會自動開啟 Flowing Mode，
或是也可以用readerStream.pause()或resume()來控制要不要讓資料流出來
看code3
*/

if(RUN_CODE_VERSION == 3){
    // Code3..........................................................................................
    var fs = require("fs");
    var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});
    readerStream.on('data', function(chunk) {
        console.log("Get data >> " + chunk);
    });

    readerStream.on('readable', function() {
        // 會發現這裡是null，因為資料已經流到data那邊流完了   
        var s = readerStream.read(); 
        console.log("readable >> "  + s);  
    });

    readerStream.on('end',function(){
        console.log("The end.");
    });
}


if(RUN_CODE_VERSION == 4){
    // Code4..........................................................................................
    var fs = require("fs");
    var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});
    readerStream.resume();

    readerStream.on('readable', function() {
        // 一樣是null，因為resume打開流的開關，資料全流到data那邊了，但data沒註冊，總而言之還是流掉了  
        var s = readerStream.read(); 
        console.log("readable >> "  + s);  
    });

    readerStream.on('end',function(){
        console.log("The end.");
    });
}

if(RUN_CODE_VERSION == 5){
    // Code5..........................................................................................
    var fs = require("fs");
    var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});
    // 強制把開關鎖住了
    readerStream.pause();

    // 這邊就沒辦法自動打開開關了，如果註冊data完才pause沒用，已經來不及了
    readerStream.on('data', function(chunk) {
        console.log("Get data >> " + chunk);
    });

    // 所以這邊就會正常buffer填滿就跑這裡
    readerStream.on('readable', function() { 
        // 這裡再讓資料流出來，data那邊也會順便一起收到資料，這是Stream3才有的行為
        var s = readerStream.read(); 
        console.log("readable >> "  + s);  
    });

    readerStream.on('end',function(){
        console.log("The end.");
    });
}

/*
關於ReadStream的實作，這邊是用fs.createReadStream，也有很多其他的ReadStream，或是自己實作，這邊是node實作的用來讀檔案用的ReadStream，
Node就是實做者，我們去call他的funciton，就是使用者，實做者需要關心當buffer滿了之後，要停止塞資料(此機制稱為 Backpressure)，buffer有空間之後，要繼續塞資料，資料沒了要通知......之類的相關細節
詳細可以回去看網站
http://www.eebreakdown.com/2016/10/nodejs-streams.html
*/