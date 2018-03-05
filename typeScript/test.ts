interface Person {
    firstname: string;
    lastname: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstname + " " + person.lastname;
}

var user = {firstname: "Jane", lastname: "User"};

console.log(greeter(user))

/*

Node.js的有些底層code是用typeScript寫的，
javascript的擴充> typeScript : 主要新增了靜態型別的功能
https://blogs.msdn.microsoft.com/ericsk/2012/10/01/typescript/
https://hackmd.io/s/rkITEOYX
typescript的.d.ts檔相當於c的.h檔，指定義funtion格式，不包含內容

如何執行typeScript的檔案(副檔名 .ts)?
先安裝ts的編譯器
npm install -g typescript
接著可以用command line跑 tsc XXX.ts來把.ts檔轉成.js檔(code會自動生成js的code)，接著就可以跑.js擋了
參考:https://dotblogs.com.tw/lapland/2016/03/09/163229 

*/