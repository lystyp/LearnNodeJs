var express = require('express');
var router = express.Router();

const MemberModifyController = require('../controllers/modify_controller');
memberModifyController = new MemberModifyController();

router.get('', memberModifyController.mainPage);
router.get('/registerPage', memberModifyController.registerPage);
router.get('/updatePage', memberModifyController.updatePage);
router.post('/register', memberModifyController.register);
router.post('/login', memberModifyController.login);
router.post('/update', memberModifyController.update);

module.exports = router;

