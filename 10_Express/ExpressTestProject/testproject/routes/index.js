var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 這邊的render就是指把views裡面的index.hjs丟給res去瀏覽器render，並且index.hjs裡面有一個title變數，把Express存到index.hjs的title裡面丟過去
  res.render('index', { title: 'Home Page' });
});

module.exports = router;
 