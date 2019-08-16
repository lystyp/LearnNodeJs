var express = require('express');
var router = express.Router();

const MemberModifyController = require('../controllers/modify_controller');
memberModifyController = new MemberModifyController();

router.post('/register', memberModifyController.postRegister);

module.exports = router;

