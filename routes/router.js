let express = require('express');
let router = express.Router();
let lab = require('../controller/lab')
let user = require('../controller/user')
let type = require('../controller/type')
let good = require('../controller/good')
let commit = require('../controller/commit')
let train = require('../controller/train')

// router.get('/user', lab.getAll);

// router.post('/login', user.login);

// router.post('/register', user.register);
// router.post('/changename', user.changeName);
// router.post('/changesign', user.changeSign);
// router.post('/changehead', user.changeHead);


// router.post('/addtype', type.add);
// router.post('/mytype', type.mytype);

// router.post('/addgood', good.add);

// router.post('/addcommit', commit.add);

router.post('/train', train.getAll)
router.post('/numinfo', train.getNumInfo)
router.post('/ticket', train.getTicket)
router.post('/book', train.bookTicket)
router.post('/time', train.getTimer)
router.post('/login', train.login)

module.exports = router;