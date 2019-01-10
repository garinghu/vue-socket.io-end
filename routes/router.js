let express = require('express');
let router = express.Router();
let lab = require('../controller/lab')
let user = require('../controller/user')
let type = require('../controller/type')
let good = require('../controller/good')
let commit = require('../controller/commit')
let message = require('../controller/message')

router.get('/user', lab.getAll);
router.get('/getallmessage', message.getAllmessage);
router.post('/addnewpost', message.addNewPost);
router.post('/addcommits', message.addCommits);
router.post('/messageaddgoods', message.messageAddGoods);

router.post('/login', user.login);

router.post('/register', user.register);
router.post('/changename', user.changeName);
router.post('/changesign', user.changeSign);
router.post('/changehead', user.changeHead);


router.post('/addtype', type.add);
router.post('/mytype', type.mytype);

router.post('/addgood', good.add);

router.post('/addcommit', commit.add);




module.exports = router;