var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 這邊的render就是指把views裡面的index.hjs丟給res去瀏覽器render，並且index.hjs裡面有一個title變數，把Express存到index.hjs的title裡面丟過去
  // render這個函式就會自己幫你把index.html跟你想要傳的參數name結合在一起，變成我們想輸出的樣子
  // 大概的架構會長這樣
  // 先把html檔讀進來，然後把變數取代掉，這著用string回傳整個html，然後就可以用res.send(htmlString)
  /*
  function render(filename, params) {
    var data = fs.readFileSync(filename, 'utf8');
    for (var key in params) {
      data = data.replace('{' + key + '}', params[key]);
    }
    return data;
  }
  */
  //https://ithelp.ithome.com.tw/articles/10186877

  // 這裡的render應該是把send跟上面那個render給包再一起做好了，並且順便把不同模板轉成html了
  res.render('index', { title: 'Home Page' });
});

module.exports = router;
 