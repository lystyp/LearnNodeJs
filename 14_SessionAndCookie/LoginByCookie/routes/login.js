var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  if(req.body.account=="" || req.body.password=="") {
    res.redirect('/login');
  } else {
      res.cookie('account', req.body.account, { signed: true, maxAge:10000});  //set cookie
      res.redirect('/');
  }
});

module.exports = router;
