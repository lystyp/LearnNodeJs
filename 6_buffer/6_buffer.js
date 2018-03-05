// 參考網站 http://www.runoob.com/nodejs/nodejs-buffer.html
const buf = Buffer.from('az', 'ascii');

// show 61 7a
console.log(buf);

// show 617a
console.log(buf.toString('hex'));

// 參考base64轉換方法 https://zh.wikipedia.org/wiki/Base64
// show YXo=
console.log(buf.toString('base64'));

// ------------------------------------------------------------------------------

// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);
console.log(buf1);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);
console.log(buf2);

// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
const buf3 = Buffer.allocUnsafe(10);
console.log(buf3);

// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);
console.log(buf4);

// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');
console.log(buf5);

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'latin1');
console.log(buf6);

const buf7 = Buffer.alloc(256);
len = buf7.write("www.runoob.com");

console.log("写入字节数 : "+  len);

// ------------------------------------------------------------------------------

/*
緩衝區的定義

Buffer: 緩衝區,顧名思義,在快與慢的裝置中設置一個緩衝的區域,讓快的裝置在把資料丟入緩衝區後,可以再去執行其他的命令.不受慢的裝置影響.
例如:硬碟,光碟機,設定一個緩衝區讓電腦放資料,讓電腦不用為了這個裝置忙番天.
https://www.pcdvd.com.tw//showthread.php?s=&threadid=332805

又例如可以從來源把音訊丟到緩衝區，程式讀音訊就從緩衝區讀，不必還要跟來源互動
*/
