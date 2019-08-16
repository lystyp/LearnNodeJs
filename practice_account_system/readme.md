這個專案就是
https://ithelp.ithome.com.tw/users/20107420/ironman/1381
照著這篇來實做node js的express
練習一下，
以下就是紀錄一些練習的重點

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(11)-SQL資料庫
https://ithelp.ithome.com.tw/articles/10194991

SQL指令整理
http://note.drx.tw/2012/12/mysql-syntax.html

遇到的問題
1.這個指令不能跑
    mysql> CREATE DATABASE member DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
    
    解法
    https://blog.csdn.net/wukong_666/article/details/70208749
    因為member是mysql的保留字元，所以要用`member`來框起來(是數字鍵1左邊那個符號，鍵盤最左上角)
    如果是用其他名字就沒有這個問題了

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(12)實作囉~
關於nodejs 的 .env檔用途
https://dwatow.github.io/2019/01-26-node-with-env-first/

遇到的問題
1.用nodejs連資料庫發現錯誤
    ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
    怎麼解呢?
    之前練習也有遇過，但只有5.X版的解法，如下
        關於這個error的解法
        http://yoonow.pixnet.net/blog/post/11141518-%E8%BD%89%E8%BC%89%EF%BC%9A%E6%96%B0%E7%89%88mysql%E5%AF%86%E7%A2%BC%E7%AE%97%E6%B3%95%E4%B8%8D%E5%90%8C%E5%B0%8E%E8%87%B4%E3%80%8Cclient-does-n
        https://dev.mysql.com/doc/refman/5.5/en/old-client.html
        反正就是在說密碼驗證方式有變怎樣怎樣的

        但我mysql是裝8.X版的，好像沒有old_password這個function，只好先裝回5.X版的了，5.X版就沒遇到這個問題了．．．．．．
    但這次就來練習看看8.X版的解法吧~
    找到了~~~
    https://zhuanlan.zhihu.com/p/36087723
    總之就是，密碼驗證形式不同了，要改回來，
    mysql的使用者資料都存在 database:mysql, table:user底下，
    先用root帳號登進mysql後，進入mysql 這個 database
        use mysql
    接著
        select host, user, plugin from user;
    秀出user的幾個欄位，其中plugin就是密碼的驗證方式，把它改回舊方法就行了，
    指令如下
    alter user '用户名'@localhost IDENTIFIED WITH mysql_native_password by '你的密码';
    
2.SQL不能塞null，怎麼辦呢?
    https://social.msdn.microsoft.com/Forums/sqlserver/en-US/1bee7824-3e8e-4088-b069-73ed9175b00a/sql-to-set-allow-null?forum=transactsql

    