var express = require('express');
var router = express.Router();
var getContent = require('./getAllItemInObjectToJson');

/* GET home page. */
router.get('/', function(req, res, next) {
  // var c = getContent(req.session, 2);
  // c.writeToFile("json.txt");
  console.log(req.session);
  console.log(req.headers.cookie);
  console.log(req.signedCookies);

  var s;
  if(req.session.isVisit) {
    req.session.isVisit++;
    s = ('<p>第 ' + req.session.isVisit + '次来此页面</p>');
    // console.log(req.session);
  } else {
    req.session.isVisit = 1;
    s = ("欢迎第一次来这里");
    // console.log(req.session);
  }
  res.render('index', { title: s });
});

module.exports = router;
