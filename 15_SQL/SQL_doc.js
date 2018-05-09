/*
http://www.runoob.com/sql/sql-where.html
虽然 SQL 是一门 ANSI（American National Standards Institute 美国国家标准化组织）标准的计算机语言，但是仍然存在着多种不同版本的 SQL 语言。

然而，为了与 ANSI 标准相兼容，它们必须以相似的方式共同地来支持一些主要的命令（比如 SELECT、UPDATE、DELETE、INSERT、WHERE 等等）。
一套標準·各自實踐·像Restful那樣。

SELECT - 从数据库中提取数据
UPDATE - 更新数据库中的数据
DELETE - 从数据库中删除数据
INSERT INTO - 向数据库中插入新数据
CREATE DATABASE - 创建新数据库
ALTER DATABASE - 修改数据库
CREATE TABLE - 创建新表
ALTER TABLE - 变更（改变）数据库表
DROP TABLE - 删除表
CREATE INDEX - 创建索引（搜索键）
DROP INDEX - 删除索引


基本結構

SELECT 某欄 FROM 某表格 WHERE 篩選資料的條件式 

SELECT 某欄 FROM 某表格 ORDER BY 某欄(用某一欄的資料來當作排序基礎) XXX 排序規則 
ex:SELECT * FROM Websites ORDER BY id DESC(降序排列);
ORDER BY 多列的时候，先按照第一个column name排序，在按照第二个column name排序；如上述教程最后一个例子：

 1）、先将country值这一列排序，同为CN的排前面，同属USA的排后面；
 2）、然后在同属CN的这些多行数据中，再根据alexa值的大小排列。
 3）、ORDER BY 排列时，不写明ASC DESC的时候，默认是ASC。ORDER BY 多列的时候，先按照第一个column name排序，在按照第二个column name排序；如上述教程最后一个例子：

 1）、先将country值这一列排序，同为CN的排前面，同属USA的排后面；
 2）、然后在同属CN的这些多行数据中，再根据alexa值的大小排列。
 3）、ORDER BY 排列时，不写明ASC DESC的时候，默认是ASC。

 關於插入值
 http://www.runoob.com/sql/sql-insert.html

 基本型
  INSERT INTO 表格名稱 (依序填欄位名稱) VALUES (要填入的值);
  INSERT INTO Websites (name, url, alexa, country) VALUES ('百度','https://www.baidu.com/','4','CN');
  INSERT INTO Websites (這個也可以不用全填，如果全部的欄位都填，也可以直接不用填這個括號，就是全部的欄位都會填值的意思) VALUES (ＸＸＸ);
  沒有給值的欄位會給個初始值，如果那欄是存int，就會是０之類的

  關於更新值
  UPDATE database_name SET title_name = value where XXX
  http://www.runoob.com/sql/sql-update.html

  UPDATE user SET authentication_string = OLD_PASSWORD('') where user = 'Daniel';

*/