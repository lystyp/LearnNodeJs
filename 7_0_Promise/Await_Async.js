// https://wcc723.github.io/javascript/2017/12/30/javascript-async-await/
// https://developers.google.com/web/fundamentals/primers/async-functions?hl=zh-tw

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
        var result = await awaitFunc1('1!');
        console.log('Result1 = ' + result);
        var result2 = await awaitPromiseFunc('2!', true);
        console.log('Result2 = ' + result2);
        return result;
    } catch(err) {
        console.log('Error msg = ' + err);
    }
} 

var p = asyncFunc1('Test');
console.log('finish!');
var p2 = awaitPromiseFunc('3!', true);
console.log(p2);

/*
原始版本  
var result = await Obj;
*/

/*
同義版本
function awaitFunc(Obj) {
    if (Obj == Promise) {
        Obj,then((v) => {
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
var promise = func();
promise.then(function(value){
    // value是從// Do something那邊return的值
})





