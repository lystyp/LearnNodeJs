var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var account='guest';
  var isLogin=false;
  if(req.signedCookies.account){
    　 account = req.signedCookies.account;
      isLogin = true;
  }
  res.render('index', { title: 'Express', name:account, status:isLogin});
});

module.exports = router;
