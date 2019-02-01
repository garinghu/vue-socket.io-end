let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    getChatRoomIdByUsers (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userId, withWhom } = req.body;
        pool.query('SELECT * from chat_room', function(err, rows, fields) {
            if (err) throw err;
            let hasChatRoom = false;
            let messages = [];
            for(let i in rows) {
                const usersArr = rows[i].users.split(',')
                console.log(usersArr, userId + '', withWhom + '');
                if(usersArr.includes(userId + '') && usersArr.includes(withWhom + '')) {
                    hasChatRoom = rows[i].id;
                    messages = rows[i].messages;
                }
            }
            if(hasChatRoom) {
                res.send({
                    chatId: hasChatRoom + '',
                    messages,
                });
            } else {
                const users = `${userId},${withWhom}`;
                const messages = '[]'
                pool.query('INSERT INTO chat_room(users, messages) VALUES ("'+users+ '","'+messages+'")', function(err, rows, fields) {
                    if (err) throw err;
                    res.send({
                        chatId: rows.insertId + '',
                        messages,
                    });
                });
            }
          });
    },

    getAllByChatRoomId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { chatId, withWhom } = req.body;
        pool.query(`SELECT * from chat_room WHERE id=${chatId}`, function(err, rows, fields) {
            if (err) throw err;
            pool.query(`SELECT * from user WHERE id=${withWhom}`, function(err, innerRows, fields) {
                res.send({
                    userid: withWhom,
                    chatid: chatId,
                    username: innerRows[0].username,
                    headImg: innerRows[0].head,
                    messages: 22,
                    lastMessage: '测试',
                    lastMessageTime: '3:43 pm',
                });
            });
        });
    },

    getAllByChatRoomIdArr (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { chatIds, userId } = req.body;
        const chatRooms = [];
        console.log(chatIds);
        if(chatIds.length) {
            for(let i in chatIds) {
                pool.query(`SELECT * from chat_room WHERE id=${chatIds[i]}`, function(err, rows, fields) {
                    if (err) throw err;
                    let usersArr = rows[0].users.split(',');
                    usersArr.splice(usersArr.indexOf(userId + ''), 1);
                    const withWhom = usersArr.join('');
                    pool.query(`SELECT * from user WHERE id=${withWhom}`, function(err, innerRows, fields) {
                        chatRooms.push({
                            userid: withWhom,
                            chatid: chatId,
                            username: innerRows[0].username,
                            headImg: innerRows[0].head,
                            messages: 22,
                            lastMessage: '测试',
                            lastMessageTime: '3:43 pm',
                        })
                        if(i == chatIds.length - 1) {
                            res.send(chatRooms);
                        }
                    });
                });
            }
        } else {
            res.send(chatRooms);
        }
    },

    getChatRoomsByUsers (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userId } = req.body;
        pool.query('SELECT * from chat_room', function(err, rows, fields) {
            let chatRooms = [];
            new Promise((resolve, reject) => {
                for(let i in rows) {
                    let usersArr = rows[i].users.split(',')
                    if(usersArr.indexOf(userId + '') != -1) {
                        usersArr.splice(usersArr.indexOf(userId + ''), 1);
                        const withWhom = usersArr.join('');
                        pool.query(`SELECT * from user WHERE id=${withWhom}`, function(err, innerRows, fields) {
                            console.log(innerRows);
                            chatRooms.push({
                                userid: withWhom,
                                chatid: rows[i].id,
                                username: innerRows[0].username,
                                headImg: innerRows[0].head,
                                messages: 22,
                                lastMessage: '测试',
                                lastMessageTime: '3:43 pm',
                            })
                            if(i == rows.length - 1) {
                                resolve(chatRooms)
                            }
                        })
                    } else {
                        if(i == rows.length - 1) {
                            resolve(chatRooms)
                        }
                    }
                }
            }).then(data => res.send(chatRooms));
        })
    },

    getUsersByChatRoomId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { chatId } = req.body;
        pool.query(`SELECT * from chat_room WHERE id=${chatId}`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows[0].users);
        })
    },

    storeMessagesByChatRoomId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { chatId, messages } = req.body;
        console.log(messages);
        const inMessages = new Buffer(JSON.stringify(messages)).toString('base64');
        console.log(inMessages);
        pool.query('UPDATE chat_room set messages= "'+inMessages+'" WHERE id= "'+chatId+'"', function(err, rows, fields) {
            if (err) throw err;
            console.log(rows);
            res.send('success')
        });  
    }
}

