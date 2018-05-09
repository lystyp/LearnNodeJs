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
/etc是放在Macintosh HD底下的隱藏資料夾，～則是Macintosh HD > 使用者 > Daniel 這個路徑
關於讀取的順序
/etc/profile和/etc/paths是系统级别的，系统启动就会加载，后面几个是当前用户级的环境变量。后面3个按照从前往后的顺序读取，如果/.bash_profile文件存在，则后面的几个文件就会被忽略不读了，如果/.bash_profile文件不存在，才会以此类推读取后面的文件。~/.bashrc没有上述规则，它是bash shell打开的时候载入的。
詳細在網站裡有寫

--mysql環境
安裝的時候會要設定一組密碼，
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
mysql> INSERT INTO user 
          (host, user, password, select_priv, insert_priv, update_priv) 
           VALUES ('localhost', 'guest', PASSWORD('guest123'), 'Y', 'Y', 'Y');
其中'password'欄位在mysql 6.XXX版好像已經改成 authentication_string 了，另外PASSWORD('guest123')這邊的PASSWORD()是用一個key來產生密碼，
但PASSWORD這個function好像在8.XXX的版本已經被棄用了，改成用SHA1()還是什麼的我也不確定， 
> https://stackoverflow.com/questions/49947017/simple-mysql-syntax-error-in-password-function?noredirect=1&lq=1
https://dev.mysql.com/doc/refman/5.7/en/encryption-functions.html#function_password
https://dev.mysql.com/doc/refman/8.0/en/encryption-functions.html#function_password

所以指令要改成
mysql> INSERT INTO user 
          (host, user, authentication_string, select_priv, insert_priv, update_priv) 
           VALUES ('localhost', 'guest', SHA1('guest123'), 'Y', 'Y', 'Y');
應該是這樣吧？

改完之後就可以用mysql -u username -p 來登入了，
然後會發現只有root的帳號用'SHOW DATABASES;'可以看到 mysql這個資料庫，

--有時候會遇到忘記root密碼導致登不進去的問題，
解決方法
https://stackoverflow.com/questions/18339513/access-denied-for-user-root-mysql-on-mac-os
簡單概念就是下指令來讓我登入root的時候可以跳過輸入密碼的部分，然後再進mysql的user這個table把密碼改掉

*/

