// https://wcc723.github.io/javascript/2017/12/30/javascript-async-await/
// https://developers.google.com/web/fundamentals/primers/async-functions?hl=zh-tw

// 兩個修飾詞
// await用來修飾promise...嗎?，原本promise往下跑不會佔住當下執行續，用await修飾的promise會佔住當下執行續，始之從非同步變成同步
// async 用來修飾function...嗎，此function預期應回傳promise

/*
!!!!
新重點~~~
await跟then的腳色很像，遇到await就是開新的thread跑了~~~~，
所以async只會跑到await的前一刻，await function就結束了!!!!!
*/
function awaitFunc1(v) {
    console.log('awaitFunc1 start');
    return 'awaitFunc1 Msg:' + v;
}

function awaitPromiseFunc(v, b) {
    console.log('awaitPromiseFunc start');
    return new Promise((res, rej) => {
        if (b) res(v);
        else rej(v);
    }); 
}

async function asyncFunc1(v) {
    console.log('AsyncFunc1 start');
    try {
        var result = await awaitPromiseFunc('1!', true);
        console.log('Result = ' + result);
        var result2 = awaitFunc1('2!');
        console.log('Result2 = ' + result2);
        // return result;
    } catch(err) {
        console.log('Error msg = ' + err);
    }
} 

var p = asyncFunc1('Test');
console.log('finish!');
// var p2 = awaitPromiseFunc('3!', true);
// console.log('finish2:' + p2);

/*
原始版本  
var result = await Obj;
*/

/*
同義版本
function awaitFunc(Obj) {
    if (Obj == Promise) {
            Obj.then((v) => {
                return v;
            });
    } else {
        Promise.resolve(Obj).then((v) => {
            return v;
        });
    }
}
var result = awaitFunc(Obj);
*/

/*
async funciton will return a promise
原始版本
var func = async function funcDeclareByAsync(){
    //Do something
};
*/

/*
同義版本
function asyncFunc() {
    return Promise.resolve().then(function() {
        // Do something
    });
}
var func = asyncFunc();
*/
// var promise = func();
// promise.then(function(value){
//     // value是從// Do something那邊return的值
// })

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}



