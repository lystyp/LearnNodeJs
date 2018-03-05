// 大方向是看懂了，但後面卻被timer的詳細執行順序給卡死，到底是怎麼運作的呢? 跟poll的關係是?
// 先把教學網站整理一下吧，然後先往下看
/*
 這是一個講解node.js的基礎的ppt
 https://docs.google.com/presentation/d/1JgISOukRsNDawRJunC0u9WkzugP4MnAr0bA6qtsp4gs/edit#slide=id.g276852746e_0_90

 process.nextTick()与promise.then()的關係
 https://segmentfault.com/q/1010000011914016

 EventLoop的基本觀念，看完就懂八成了
 https://cnodejs.org/topic/58d7d2f26f8b9bf02d1d0b1b

 這篇文章下面有一個hyj1991有根據source code說明大概的運作，還蠻重要的
 https://cnodejs.org/topic/57d68794cb6f605d360105bf

 官方文件
 裡面對poll有一句描述
 Once the poll queue is empty the event loop will check for timers whose time thresholds have been reached. If one or more timers are ready, the event loop will wrap back to the timers phase to execute those timers' callbacks.
 https://github.com/nodejs/node/blob/v4.x/doc/topics/the-event-loop-timers-and-nexttick.md#phases-in-detail

/*
Node.js只有一個執行續，要如何實現異步方法呢?
通常Node只有一個主執行續在執行事件，當主執行續沒事情要做了，就會去執行需要執行的callback，
詳細:
https://github.com/Devinnn/Blog/issues/6
通常就是有一個for迴圈在跑一整個node的事件循環(Event loop)，共分為下面幾個狀態，每個狀態可以把它看作一個Queue，用來存放不同來源的callback

   ┌───────────────────────┐
┌─>│        timers         │ > 跑setTimeout、 setInterval就是另外開執行續跑計時，時間到了以後把cllback丟到這個狀態的Queue，不要在setTimout裡面call setTimeout，
│  └──────────┬────────────┘   也不要同時call了好幾個setTimeout，會整個亂掉，因為他是用timeout時間來決定這個state執行那些callback > 搞不清楚內部原理
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │ > ?
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │ > ?
│  └──────────┬────────────┘     
│  ┌──────────┴────────────┐      
│  │         poll          │ > ?
│  └──────────┬────────────┘     
│  ┌──────────┴────────────┐      
│  │        check          │ > 略懂 
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘

*/

// !!! readFile讀同一個檔案會塞住，等上一次讀完callback回來才能跑下一個
// const fs = require('fs')
// fs.readFile("1",function(){
//     fs.readFile("2",function(){console.log('poll in poll')});

//     setImmediate(function(){console.log('check in poll')});

//     setTimeout(function(){console.log('timer in poll')},0);

//     sleep(500);
//     console.log('poll')
// });

// setImmediate(function(){
//     fs.readFile("3",function(){
//         console.log('poll in check')
//     });
//     setTimeout(function(){
//         console.log('timer in check')
//     },0);

//     setImmediate(function(){
//         console.log('check in check')
//     });

//     console.log('check')
//     sleep(500);
// });

// setTimeout(function(){
//     fs.readFile("4",function(){
//         console.log('poll in timer')
//     });
//     setImmediate(function(){
//         console.log('check in timer')
//     });
//     setTimeout(function(){
//         console.log('timer in timer')
//     },0);
//     console.log('timer')
//     sleep(500);
// },0);

// sleep(500);
// console.log('main');

//-------------------------------------------------------------------------------------------------------------------------
// 下面這個對timer的順序夠全面了吧?!

// 進loop前先記錄進第一個setTimeout的Timeout時間 = T，loop後進timer > 先記錄timer queue 的callback數量 = C，
// 跑完timer進poll，一開始會先看C有沒有 > 1，
// 有就去檢查timer還有沒有callback還沒做完，如果有就把他跑完，跑完再檢查，一直到空了才進check
// 沒有則看timer的queue裡面在"執行完第一個callback之後"(因為已經在poll了)有沒有timeout時間 = T 的callback，沒有就進check
// 有 > 把這個callback拉到timer queue的最後一個 > 把queue跑完(一次只跑一個timeout的callback，不同timeout的callback會跳出timer再重進timer來跑)，跑完再檢查，一直到空了才進check
// 沒有 > 直接check
// 結論 > 有兩個東西來在poll判斷要不要回timer跑queue
// 1.把timer的callback送出去給thread之後還有沒有callback?(一送就看，不是callback做完才看，避免被callback偷送進來)
// 2.如果1沒有callback了，那進poll後會看timeout時間，詳細內容上面有寫了

// setImmediate(function s1(){
//     process.nextTick(function(){
//         console.log('nextTick in check');
//     });
//     console.log('check');
// });
// setImmediate(function s1(){
//     process.nextTick(function(){
//         console.log('nextTick in check2');
//     });
//     console.log('check2');
// });
// setTimeout(function t1(){
//     setTimeout(function t2(){
//         sleep(100);
//         process.nextTick(function(){
//             console.log('nextTick in timer 100');
//         });
//         console.log('timer 100 in timer');
//     },100);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 200');
//         });
//         console.log('timer 200 in timer');
//     },200);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 300');
//         });
//         console.log('timer 300 in timer');
//     },300);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 400');
//         });
//         console.log('timer 400 in timer');
//     },400);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 500');
//         });
//         console.log('timer 500 in timer');
//     },500);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 100-2');
//         });
//         console.log('timer 100-2 in timer');
//     },100);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 200-2');
//         });
//         console.log('timer 200-2 in timer');
//     },200);
//     setTimeout(function t2(){
//         process.nextTick(function(){
//             console.log('nextTick in timer 600');
//         });
//         console.log('timer 600 in timer');
//     },600); 
//     process.nextTick(function(){
//         console.log('nextTick in timer');
//     });
//      sleep(450);
//     console.log('timer');
// }, 201);
// setTimeout(function t1(){
//     process.nextTick(function(){
//         console.log('nextTick in timer2');
//     });
//     console.log('timer2');
// }, 400)
// sleep(250);

//--------------------------------------------------------
// setImmediate(function s1(){
//     process.nextTick(function(){
//         console.log('nextTick in check');
//     });
//     console.log('check');
// });
// setTimeout(function t1(){
//     setTimeout(function t1(){
//         process.nextTick(function(){
//             console.log('nextTick in timer timer');
//         });
//         console.log('timer in timer');
//     },250)
//     process.nextTick(function(){
//         console.log('nextTick in timer');
//     });
//     sleep(500);
//     console.log('timer');
// }, 100)
// setTimeout(function t1(){
//     process.nextTick(function(){
//         console.log('nextTick in timer2');
//     });
//     console.log('timer2');
// }, 200)
// setTimeout(function t1(){
//     process.nextTick(function(){
//         console.log('nextTick in timer3');
//     });
//     console.log('timer3');
// }, 750)
// setTimeout(function t1(){
//     process.nextTick(function(){
//         console.log('nextTick in timer4');
//     });
//     console.log('timer4');
// }, 800)
// sleep(350);
/* 顯示結果
timer2
nextTick in timer2
timer3
nextTick in timer3
timer4
nextTick in timer4
check
check2
nextTick in check
nextTick in check2
這個用來證明timer跑state是一次就跑整個timer + nextTick ，然後不會跳下一個loop
*/

//-------------------------------------------------------------------------------------------------------------------------
setImmediate(function s1(){
    process.nextTick(function(){
        console.log('nextTick in check');
    });
    console.log('check');
});
setTimeout(function t1(){
    setTimeout(function t1(){
        process.nextTick(function(){
            console.log('nextTick in timer timer');
        });
        console.log('timer in timer');
    },100)
    process.nextTick(function(){
        console.log('nextTick in timer');
    });
    sleep(500);
    console.log('timer');
}, 100)

//下面這邊有沒有註解會影響順序
setTimeout(function t1(){
    process.nextTick(function(){
        console.log('nextTick in timer2');
    });
    console.log('timer2');
}, 300)

sleep(120);

/*
有註解掉的output
timer
nextTick in timer
check
nextTick in check
timer in timer
nextTick in timer timer

沒有註解掉的output
timer
nextTick in timer
timer2
nextTick in timer2
timer in timer
nextTick in timer t
check
nextTick in check
*/
// 沒註解 > 表示進loop前call了不只一次setTimeout，會去檢查timer還有沒有callback還沒做完，有註解，只call的一次timeout，就不檢查了

//-----------------------------------------------------------------------------------------------------------------------------------
//我要怎麼知道poll發的callback是同一個loop跑(跟nextTick一樣)還是下一個loop跑? > 


//-------------------------------------------------------------------------------------------------------------------------

// setImmediate(function immediate () {
//     sendCallbackToPollByReadFile(()=>console.log('read file in check'))
//     setTimeout(function timeout () {
//         console.log('timeout in check');
//     },0);
//     sleep(1000);
//     console.log('immediate');
// });

// setTimeout(function timeout () {
//     sendCallbackToPollByReadFile(()=>console.log('read file in timer'))
//     sleep(1000);
//     console.log('timeout');
// },0);

// sleep(500);
// console.log('main');

// var fs = require('fs')

// setTimeout(() => {
//     console.log('timeout')
//   }, 10)
//   setImmediate(() => {
//     sleep(100);
//     console.log('immediate')
//   })
 // sleep(100);
// fs.readFile(__filename, () => {
//   setTimeout(() => {
//     console.log('timeout')
//   }, 0)
//   setImmediate(() => {
//     console.log('immediate')
//   })
//   sleep(100);
// })

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function sendCallbackToPollByReadFile(callback) {
    const fs = require('fs')
    fs.readFile("test.txt",callback);
}
