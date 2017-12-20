let express = require('express');
let router = express.Router();
let lab = require('../controller/lab')
let user = require('../controller/user')
let type = require('../controller/type')

router.get('/user', lab.getAll);

router.post('/login', user.login);

router.post('/register', user.register);
router.post('/changename', user.changeName);
router.post('/changesign', user.changeSign);
router.post('/changehead', user.changeHead);


router.post('/addtype', type.add);
router.post('/mytype', type.mytype);
module.exports = router;