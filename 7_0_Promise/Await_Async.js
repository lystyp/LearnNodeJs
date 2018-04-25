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


