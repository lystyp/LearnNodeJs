//writeStream 簡介 > 就像是把水(data)裝到水桶(buffer)裡，再把水桶倒到水池裡
//與ReadStream的實作不同的是，因為這邊是使用者負責把資料寫進buffer，所以是使用者要處裡Backpressure，
//實做者只負責把資料從buffer丟到目的地而已
//直接看code 


// Code
// 建一個readStream讀資料，並write到writeStream
var fs = require("fs");
var readerStream = fs.createReadStream('input.txt', { highWaterMark: 8});
var writeStream = fs.createWriteStream('output.txt', { highWaterMark: 1});

readerStream.on('data', function(chunk) {
    // 當讀進資料就寫入資料
    // write會回傳一個boolean，如果資料沒辦法寫到writeStream的buffer(可能是buffer太滿，還沒流到目的地去)，就會回傳false，並等待buffer清空後會觸發drain的callback，否則回傳true
    // 這個網站也有描述相關 http://taobaofed.org/blog/2015/12/31/nodejs-drain/
    var b = writeStream.write(chunk);
    if (!b) {
        // 發現buffer不能丟資料之後就應該先暫停寫入了，不要再繼續丟資料
        // !!!其實就算不暫停這個程式也不會有error，推測是因為我的buffer都超小，所以當我write不進去了，到下一次要write之間，他已經把buffer流光了，所以又寫得進去了
        // 還是得做啦，不然資料太大就爆了
        readerStream.pause();
    }
    console.log(b);
    console.log("Get data >> " + chunk);
});

readerStream.on('end',function(){
    // 标记文件末尾
    // 資料讀完了就把WriteStream給end關掉，讓他不能再寫東西
    writeStream.end();
    console.log("The end.");
});

writeStream.on('drain', function() {
    readerStream.resume();
    console.log("滿惹後清空惹");
});

// 处理流事件 --> data, end, and error
writeStream.on('finish', function() {
    console.log("写入完成。");
});

writeStream.on('error', function(err){
   console.log(err.stack);
});


// 用pipe(管線)把stream接在一起他就會自動流了，也處理好Backpressure，就不用理它了
fs.createReadStream('input.txt').pipe(fs.createWriteStream('ouput_by_pipe.txt'));


// 基本概念結束Transform Stream和Duplex Stream直接上網站看解說吧~有用到在查查怎麼用



