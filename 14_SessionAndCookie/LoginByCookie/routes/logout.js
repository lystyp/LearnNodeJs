var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.clearCookie('account');
  res.redirect('/');
});

module.exports = router;
