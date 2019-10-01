/*
https://eyesofkids.gitbooks.io/javascript-start-es6-promise/content/contents/flow_n_error.html
promise 是用來解決callback hell的問題
callback hell 是指javaScript是用丟callback給異步API的方式來執行，如果call太多次就會造成排版很醜且code維護不易
*/

// 隨便做幾個function來模擬不同的異步API，其實每一個都一樣，只是先假裝他們都做不一樣的事情XD
function MainAsyncFunc(callback, v){
    v = v + "<MainAsyncFunc>";
    console.log("In MainAsyncFunc, V = " + v);
    callback(v);
}

function asyncFunc1(callback, v){
    v = v + "<asyncFunc1>";
    console.log("In asyncFunc1, V = " + v);
    callback(v);
}

function asyncFunc2(callback, v){
    v = v + "<asyncFunc2>";
    console.log("In asyncFunc2, V = " + v);
    callback(v);
}

function asyncFunc3(callback, v){
    v = v + "<asyncFunc3>";
    console.log("In asyncFunc3, V = " + v);
    callback(v);
}

function asyncFunc4(callback, v){
    v = v + "<asyncFunc4>";
    console.log("In asyncFunc4, V = " + v);
    callback(v);
}

function asyncFunc5(callback, v){
    v = v + "<asyncFunc5>";
    console.log("In asyncFunc5, V = " + v);
    callback(v);
}

// call 主要的MainAsyncFunc，然後裡面都會執行別的異步API

MainAsyncFunc(function(v) {
    // Do something...
    // MainAsyncFunc執行成功後執行callback，callback裡面又會call別的異步function
    console.log("MainAsyncFunc finish,do callback.");
    asyncFunc1(function(v){
        console.log("asyncFunc1 finish,do callback.");
        asyncFunc2(function(v){
            console.log("asyncFunc2 finish,do callback."); 
            asyncFunc3(function(v){
                console.log("asyncFunc3 finish,do callback."); 
                asyncFunc4(function(v){
                    console.log("asyncFunc4 finish,do callback."); 
                    asyncFunc5(function(v){
                        console.log("asyncFunc5 finish,do callback."); 
                    }, v) 
                }, v)
            }, v)
        }, v)
    }, v)
}, "Get info : ")

console.log("-------------------------------------------------------------------------------");
/*
如何解決?
用Promise來解決
*/

// promise的建構式必須要丟一個function，然後function的input必須是兩個function > resolve和reject，然後我們決定假設promise的內容正常要跑callback就執行resolve，有非預期狀況就跑reject
// 現在先不理reject
// promise的then看起來似乎也是異步API，因為console.log("Code finish.");先跑了
// 習慣上先宣告一個function來取得初始化的promise物件，這個function就是MainFunction的意思，也有可能是別人做的API，回傳一個promise讓我用
function MainPromiseFunc(v) {
    /*
    Do something before init promise
    */

    return new Promise(function(resoleve, reject){      
        //Do something to 判斷執行結果是成功或是有誤
        // 這裡就是初始化promise物件來決定一開始的狀態
        v = v + "<MainPromiseFunc>";
        console.log("V = " + v);
        var success = true;
            
        if(success) {
            resoleve(v);
        } else {
            reject(v);
        }
    });
}


MainPromiseFunc("Get info : ").then(
    // resolve function
    function(v){
        console.log("Success, do asyncFunc1, v = " + v)
        var result;
        asyncFunc1(v => {result = v}, v);
        return result;
    }
).then(
    10
    // function(v){
    //     console.log("Success, do asyncFunc2, v = " + v)
    //     var result;
    //     asyncFunc2(v => {result = v}, v);
    //     return result;
    // }
).then(
    function(v){
        console.log("Success, do asyncFunc3, v = " + v)
        var result;
        asyncFunc3(v => {result = v}, v);
        return result;
    }
).then(
    function(v){
        console.log("Success, do asyncFunc4, v = " + v)
        var result;
        asyncFunc4(v => {result = v}, v);
        return result;
    }
).then(
    function(v){
        console.log("Success, do asyncFunc5, v = " + v)
        var result;
        asyncFunc5(v => {result = v}, v);
        return result;
    }
).catch(
    function(err) {
        console.log('Error msg = ' + err);
    }
).then(
    function(v){
        console.log("All Success, v = " + v)
    }
);


console.log("Code finish!");

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

// resolve跟reject不管有沒有return值都會往下跑
// 如果then沒有給resolve，那值會順延給下一個then的resolve嗎？會
// 什麼時候會進 reject function呢？有error的時候，reject跑完之後，能夠return值傳到下一個promise嗎？ 可以
// 如果下個then沒有接reject，那怎麼跑？ 狀態往下延續
// 如果success後reject後success，那value會被reject給重置嗎？ 會，因為是新物件
/*

then必須回傳一個promise。 promise2 = promise1.then(onFulfilled, onRejected);
2.2.7.1 當不論是onFulfilled或onRejected其中有一個是有回傳值x，執行Promise解析程序[[Resolve]](promise2, x)
2.2.7.2 當不論是onFulfilled或onRejected其一丟出例外e，promise2必須用e作為理由而拒絕(rejected)
2.2.7.3 當onFulfilled不是一個函式，而且promise1是fulfilled(已實現)時，promise2必須使用與promise1同樣的值被fulfilled(實現)
2.2.7.4 當onRejected不是一個函式，而且promise1是rejected(已拒絕)時，promise2必須使用與promise1同樣的理由被rejected(拒絕)

// async1 狀態是 onFulfilled
async1()
    .then(() => async2(), undefined)       
    .then(() => async3(), undefined)
    .then(undefined, (err) => errorHandler1())
    .then(() => async4(), (err) => errorHandler2())
    .then(undefined, (err) => console.log('Don\'t worry about it'))
    .then(() => console.log('All done!'), undefined)
情況: 當async1回傳的promise物件的狀態是rejected時。以下為每個步驟流程的說明:


2.2.7.4規則，async2不會被執行，新的Promise物件直接是rejected(已拒絕)狀態
2.2.7.4規則，async3不會被執行，新的Promise物件直接是rejected(已拒絕)狀態
2.2.7.1規則，errorHandler1()被執行，新的Promise物件為fulfilled(已實現)狀態
2.2.7.1規則，async4()被執行，新的Promise物件為fulfilled(已實現)狀態
2.2.7.3規則，跳過輸出字串，新的Promise物件為fulfilled(已實現)狀態，回傳值繼續傳遞
2.2.7.1規則，輸出字串

*/

/*
class Promise(func){
    var state;
    var value;
    var errMsg;
    
    // 這一段是initial跑的
    var res = functino(par...){
        state = success;
        value = par;
        ...
        ...
        ...
    }
    var rej = funciton(par...) {
        state = reject;
        errMsg = par;
        ...
        ...
        ...
    }
    try {
        func(res, rej); // 在這裡讓user決定初始狀態是success還是reject，跑res還是rej
    } catch(err) {
        rej(err);
    }
    // 

    // then會等狀態從未知變成確定的狀態後才會執行
    function then(res, rej) {
        try{
            // 假如沒有error的情況下，成功執行res或rej，那狀態就是success，否則狀態繼續往下傳
            if(state == success) {
                if (res == function) {
                    state = success;                
                    value = res(value);
                }
            } else {
                if (rej == function) {
                    state = success;
                    value = rej(value);
                }
            }
            // 這裡指的是，res跟rej的回傳值除了可以是一般值，也可以自己做一個新的promise來回船，不要用預設的new，
            // 為什麼要這樣？
            // 可能是要在一些非throws error的情況下也想要可能是Promise的state有機會是reject，所以不用try catch來決定狀態，
            // 用自己建的Promise的初始化那邊來決定狀態
            if (value == Promise) {
                return value;
            } else {
                return new Promise(
                    clons this.state, if state == success, clone value,
                                      if state == reject, clone errMsg;
                );
            }
        } catch(err) {
            state = reject;
            errMsg = err;
            return new Promise(
                clons this.state, if state == success, clone value,
                                    if state == reject, clone errMsg;
            );
        }
    }

    // 相當於 
    function catch(func) {
        then(Null, func);
    }
}

*/