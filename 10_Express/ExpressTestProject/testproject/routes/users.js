var express = require('express');
var router = express.Router();

/* GET users listing. */
// 注意這裡的get為何只有/沒有/user，因為在app.js那邊就接走user了，剩下的才傳進來
router.get('/', function(req, res, next) {
  res.send('This is user page.');
});

module.exports = router;
