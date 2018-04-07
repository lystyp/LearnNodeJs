var express = require('express');
var router = express.Router();
var app = express();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Run index.js in router.")
  res.render('index', { title: 'Express' });
});

module.exports = router;
