/*
MySQL
建一個MySQL的資料庫就像建一個server一樣，
建好後用ip跟port來連接資料庫，並且用sql指令來對資料庫做操作(library應該都包好了吧？)

在mac上安裝sql的心路歷程

--設環境變數
關於mac的環境變數
https://www.jianshu.com/p/acb1f062a925
/etc/profile 
/etc/paths 
~/.bash_profile 
~/.bash_login 
~/.profile 
~/.bashrc
在跑shell的指令的時候，系統會去讀以上這幾個檔案的內容來設定環境變數，
/etc是放在Macintosh HD底下的隱藏資料夾，～則是Macintosh HD > 使用者 > Username 這個路徑
關於讀取的順序
/etc/profile和/etc/paths是系统级别的，系统启动就会加载，后面几个是当前用户级的环境变量。后面3个按照从前往后的顺序读取，如果/.bash_profile文件存在，则后面的几个文件就会被忽略不读了，如果/.bash_profile文件不存在，才会以此类推读取后面的文件。~/.bashrc没有上述规则，它是bash shell打开的时候载入的。
詳細在網站裡有寫

mysql的安裝路徑
Macintosh HD/usr/local/mysql-5.7.22-macos10.13-x86_64

--mysql環境
安裝的時候會要設定一組密碼，(8.X版是自己設密碼，5.X版是自動產生)
這組密碼會是aql的預設有root權限的帳號，mysql是用登入不同帳號的方式來管理個別的資料庫
安裝好sql，設定好環境變數之後，
用cmd打‘mysql’沒辦法直接進入mysql的指令環境，
要用'mysql -u username -p'接著他就會要我輸入密碼來登入，
用'sudo mysql'會預設用root帳號來當作登入帳號，直接用'mysql'會預設用目前的使用者帳號來登入，
如何新增使用者？
sudo mysql -u root -p
登入後
輸入
'SHOW DATABASES;'會顯示所有目前有的資料庫，使用者資訊都存在'mysql'裡，
用
'use mysql;'進入那一個資料庫，使用者資訊存在user這個table裡面
可以用
'select * from user;'來看所有的使用者資訊，
新增使用者 > http://www.runoob.com/mysql/mysql-administration.html
網站裡面是說輸入下面這個指令，目前沒有仔細去研究那些欄位分別是什麼意思，但有幾點需要注意
INSERT INTO user 
          (host, user, password, select_priv, insert_priv, update_priv) 
           VALUES ('localhost', 'guest', PASSWORD('guest123'), 'Y', 'Y', 'Y');
其中'password'欄位在mysql 5.XXX版好像已經改成 authentication_string 了，另外PASSWORD('guest123')這邊的PASSWORD()是用一個key來產生密碼，
但PASSWORD這個function好像在8.XXX的版本已經被棄用了，改成用SHA1()還是什麼的我也不確定， 
> https://stackoverflow.com/questions/49947017/simple-mysql-syntax-error-in-password-function?noredirect=1&lq=1
https://dev.mysql.com/doc/refman/5.7/en/encryption-functions.html#function_password
https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_password
但我後來轉用5.X版了....所以不要理SHA那個了，用原本的password就可以了

所以指令要改成
INSERT INTO user (host, user, authentication_string, select_priv, insert_priv, update_priv) VALUES ('localhost', 'Daniel', PASSWORD(''), 'Y', 'Y', 'Y');
應該是這樣吧？
輸入指令完他說
ERROR 1364 (HY000): Field 'ssl_cipher' doesn't have a default value
https://hk.saowen.com/a/eb5e24bca235739ed4f815f1fa50d6fbaabb26a0f21d40430d56d1ac76bce4d9
好像是在說因為有設成嚴格模式，所以不能用insert直接新增使用者的樣子，明明8.X版就沒有這個問題ＱＡＱ

新增使用者有另一個指令也可以
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'newpassword';
GRANT 要開啟的權限 ON  新增的使用者可以用的Table名稱.* TO '使用者名稱'@'localhost(這可以改別的IP)' IDENTIFIED BY '密碼';
參考網站
https://blog.longwin.com.tw/2006/02/mysql_adduser_grant_2006/
https://www.phpini.com/mysql/mysql-add-new-users-databases-privileges

新增完記得讓他重新讀table
用 ' FLUSH PRIVILEGES;'
改完之後就可以用mysql -u username -p 來登入了，
然後會發現只有root的帳號用'SHOW DATABASES;'可以看到 mysql這個資料庫


--有時候會遇到忘記root密碼導致登不進去的問題，
解決方法
https://stackoverflow.com/questions/18339513/access-denied-for-user-root-mysql-on-mac-os
簡單概念就是下指令來讓我登入root的時候可以跳過輸入密碼的部分，然後再進mysql的user這個table把密碼改掉


-- 建完使用者之後就可以建資料庫啦~
create DATABASE database_name;
但資料庫的名字好像不能用大寫，
https://stackoverflow.com/questions/20795947/mysql-table-name-not-working-in-uppercase
*/

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'daniel',
  password : '',
  database : 'testdb'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});     

/*
跑上面的code會發生error : 
Client does not support authentication protocol requested by server
關於這個error的解法
http://yoonow.pixnet.net/blog/post/11141518-%E8%BD%89%E8%BC%89%EF%BC%9A%E6%96%B0%E7%89%88mysql%E5%AF%86%E7%A2%BC%E7%AE%97%E6%B3%95%E4%B8%8D%E5%90%8C%E5%B0%8E%E8%87%B4%E3%80%8Cclient-does-n
https://dev.mysql.com/doc/refman/5.5/en/old-client.html
反正就是在說密碼驗證方式有變怎樣怎樣的

但我mysql是裝8.X版的，好像沒有old_password這個function，只好先裝回5.X版的了，5.X版就沒遇到這個問題了．．．．．．
*/