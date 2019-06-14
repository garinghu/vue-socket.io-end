let express = require('express');
let router = express.Router();
let lab = require('../controller/lab')
let user = require('../controller/user')
let type = require('../controller/type')
let good = require('../controller/good')
let commit = require('../controller/commit')
let message = require('../controller/message')
let chat_room = require('../controller/chat_room')
let friend = require('../controller/friend')
let friend_req = require('../controller/friend_req')

router.get('/user', lab.getAll);
router.get('/postnotification', user.postExpoNotification);
router.post('/getuserinfobyid', user.getUserInfoById);
router.post('/getgeobycoords', message.getGeoByCoords);
router.post('/sendlocatesms', user.sendLocateSms);
router.post('/sendsms', user.sendSms);
router.post('/getallbyuserid', user.getAllByUserId);

router.post('/getfriendsbyuserid', friend.getFriendsByUserId);
router.post('/deletefriendbyuserid', friend.deleteFriendByUserId);
router.post('/addfriendbyuserid', friend.addFriendByUserId);

router.get('/getallfriendreq', friend_req.getAllFriendReq);
router.post('/deletehasrequestbyid', friend_req.deleteHasRequestById);

router.post('/addgoodtomessagereq', message.addGoodToMessageReq);
router.post('/getmessagestipnocheck', message.getMessagesTipNoCheck);
router.post('/getallmessage', message.getAllmessage);
router.post('/addnewpost', message.addNewPost);
router.post('/addcommits', message.addCommits);
router.post('/addsecoundcommits', message.addSecoundCommits);
router.post('/messageaddgoods', message.messageAddGoods);
router.post('/messageaddcollections', message.messageAddCollections);
router.post('/searchmessagesbytype', message.searchMessagesByType);
router.post('/searchmessagesbylike', message.searchMessagesByLike);
router.post('/searchmessagesbyfriends', message.searchMessagesByFriends);
router.post('/checkedmessagetip', message.checkedMessagesTip);

router.post('/getusertoken', user.getUserTocken);

router.post('/login', user.login);

router.post('/regist', user.regist);
router.post('/changename', user.changeName);
router.post('/changesign', user.changeSign);
router.post('/changehead', user.changeHead);
router.post('/searchusersbyusername', user.searchUsersByUserName);


router.post('/addtype', type.add);
router.post('/mytype', type.mytype);

router.post('/addgood', good.add);

router.post('/addcommit', commit.add);


router.post('/getchatroombyusers', chat_room.getChatRoomIdByUsers);
router.post('/storemessagesbychatroomid', chat_room.storeMessagesByChatRoomId);
router.post('/getchatRoomsbyusers', chat_room.getChatRoomsByUsers);
router.post('/getusersbychatroomid', chat_room.getUsersByChatRoomId);
router.post('/getallbychatroomid', chat_room.getAllByChatRoomId);
router.post('/getallbychatroomidarr', chat_room.getAllByChatRoomIdArr);

module.exports = router;