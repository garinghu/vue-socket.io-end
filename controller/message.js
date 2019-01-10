let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);


const getDate = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
}

module.exports = {
    getAllmessage (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        pool.query('SELECT * from message', function(err, rows, fields) {
            if (err) throw err;
            messages = rows;
            new Promise((resolve, reject) => {
                pool.query(`SELECT * from good WHERE userid=1`, function(err, userRows, fields) {
                    if (err) throw err;
                    resolve(rows)
                })
            }).then(goods => {
                for(let x in messages) {
                    pool.query(`SELECT * from user WHERE id=${messages[x].userid}`, function(err, userRows, fields) {
                        if (err) throw err;
                        messages[x].hasgood = 0;
                        for(let i in goods) {
                            if(goods[i].messsageid == messages[x].id) {
                                messages[x].hasgood = 1;
                            }
                        }
                        messages[x].userName = userRows[0].username;
                        messages[x].headImg = userRows[0].head;
                        // messages[x].content = new Buffer(messages[x].content, 'base64').toString()
                        if(x == messages.length - 1) {
                            console.log(messages);
                            res.send(messages.reverse());
                        }
                    }) 
                }
            })
        });
    },

    messageCommitsAddGoods (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        pool.query('SELECT * from message', function(err, rows, fields) {
            if (err) throw err;
            messages = rows;
            for(let x in messages) {
                messages[x].content = new Buffer(messages[x].content, 'base64').toString()
            }
            console.log(messages)
            res.send(message);
        });
    },

    messageAddGoods (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        const { goods, cardId, userId, hasgood } = req.body;
        console.log(req.body);
        pool.query(`SELECT * from message WHERE id=${cardId}`, function(err, rows, fields) {
            if (err) throw err;
            pool.query('UPDATE message set good= "'+goods+'" WHERE id= "'+cardId+'"', function(err, rows, fields) {
                if (err) throw err;
            }); 
            if(hasgood == 1) {
                pool.query('INSERT INTO good(userid, messageid) VALUES ("'+userId+ '","'+cardId+'")', function(err, rows, fields) {
                    if (err) throw err;
                    res.send('success')
                });
            } else {
                pool.query('DELETE FROM good WHERE userid = "'+userId+ '" AND messageid = "'+cardId+'"', function(err, rows, fields) {
                    if (err) throw err;
                    res.send('success')
                });
            }
        });
    },

    addNewPost (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('SELECT * from message', function(err, rows, fields) {
            if (err) throw err;
            const { title, content, uri, userid, type, } = req.body;
            let newPost = new Buffer(`{
                "bodyImg":"${uri}",
                "content": "${content}",
                "commits": []
            }`).toString('base64');
            let test = `${uri}`;
            const time = getDate()
            pool.query('INSERT INTO message(name, content, collection, good, userid, time, type) VALUES ("'+title+ '","'+newPost+'", 0, 0, "'+userid+'", "'+time+'", "'+type+'")', function(err, rows, fields) {
                if (err) throw err;
                res.send('success')
            });
        });
    },

    addCommits (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query(`SELECT * from message WHERE id=${req.body.cardId}`, function(err, rows, fields) {
            if (err) throw err;
            const { commit, userid, userName, headImg} = req.body;
            let newContent = JSON.parse(new Buffer(rows[0].content, 'base64').toString());
            if(newContent.commits) {
                newContent.commits.push({
                    "name": `${userName}`,
                    "content": `${commit}`,
                    "goods": 0,
                    "userid": `${userid}`,
                    "headImg": `${headImg}`,
                    "time": `${getDate()}`
                })
            } else {
                newContent.commits = [{
                    "name": `${userName}`,
                    "content": `${commit}`,
                    "goods": 0,
                    "userid": `${userid}`,
                    "headImg": `${headImg}`,
                    "time": `${getDate()}`
                }]
            }

            newContent = new Buffer(JSON.stringify(newContent)).toString('base64');
            pool.query('UPDATE message set content= "'+newContent+'" WHERE id= "'+req.body.cardId+'"', function(err, rows, fields) {
                if (err) throw err;
                res.send('success')
            });  
        });
    },


}