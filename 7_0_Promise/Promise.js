/*
https://eyesofkids.gitbooks.io/javascript-start-es6-promise/content/contents/flow_n_error.html
promise 是用來解決callback hell的問題
callback hell 是指javaScript是用丟callback給異步API的方式來執行，如果call太多次就會造成排版很醜且code維護不易
*/

// 隨便做幾個function來模擬不同的異步API，其實每一個都一樣，只是先假裝他們都做不一樣的事情XD
function MainAsyncFunc(callback, v){
    v = v + "<MainAsyncFunc>";
    console.log("V = " + v);
    callback(v);
}

function asyncFunc1(callback, v){
    v = v + "<asyncFunc1>";
    console.log("V = " + v);
    callback(v);
}

function asyncFunc2(callback, v){
    v = v + "<asyncFunc2>";
    console.log("V = " + v);
    callback(v);
}

function asyncFunc3(callback, v){
    v = v + "<asyncFunc3>";
    console.log("V = " + v);
    callback(v);
}

function asyncFunc4(callback, v){
    v = v + "<asyncFunc4>";
    console.log("V = " + v);
    callback(v);
}

function asyncFunc5(callback, v){
    v = v + "<asyncFunc5>";
    console.log("V = " + v);
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

/*
如何解決?
用Promise來解決
*/

// promise的建構式必須要丟一個function，然後function的input必須是兩個function > resolve和reject，然後我們決定假設promise的內容正常要跑callback就執行resolve，有非預期狀況就跑reject
// 現在先不理reject

// 寫成這樣，但還是沒有很懂......只知道promise的then看起來似乎也是異步API，因為console.log("Code finish.");先跑了
MainAsyncFunc(GetNewPromiseCallback, "Get info : ")

function GetNewPromiseCallback(v){
    var p = new Promise(function(res, rej){
        console.log("Init a promise.");
        if (v != undefined) {
            res(v);
        } else {
            rej('v is null');
        }
    });
    p.then(
        function(v){
            console.log("Success, do asyncFunc1, v = " + v)
            var result;
            asyncFunc1(v => {result = v}, v);
            return result;
        }
    ).then(
        function(v){
            console.log("Success, do asyncFunc2, v = " + v)
            var result;
            asyncFunc2(v => {result = v}, v);
            return result;
        }
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
    ).then(
        function(v){
            console.log("All Success, v = " + v)
        }
    )
    
}

console.log("Code finish.");