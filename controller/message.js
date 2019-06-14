let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);
let axios = require('axios');
let path = require('path')
const async = require('async');
let fs = require('fs');

const GET_GEO_BY_COORDS = 'http://apis.juhe.cn/geo/';
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

function getAllMessagesBySearch(str) {

}

module.exports = {
    getAllmessage (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        const { userid, requestTime } = req.body;
        pool.query('SELECT * from message', function(err, rows, fields) {
            if (err) throw err;
            messages = rows.reverse();
            new Promise((resolve, reject) => {
                pool.query(`SELECT * from good WHERE userid=${userid}`, function(err, goodRows, fields) {
                    if (err) throw err;
                    pool.query(`SELECT * from collection WHERE userid=${userid}`, function(err, collectionRows, fields) {
                        resolve({ goods: goodRows, collections: collectionRows });
                    })
                })
            }).then(data => {
                const { goods, collections } = data;
                async.eachSeries(messages, (item, callback) => {
                    pool.query(`SELECT * from user WHERE Id=${item.userid}`, function(err, userRows, fields) {
                        if (err) throw err;
                        item.hasgood = 0;
                        item.hascollection = 0;
                        for(let i in goods) {
                            if(goods[i].messageid == item.id) {
                                item.hasgood = 1;
                            }
                        }
                        for(let x in collections) {
                            if(collections[x].messageid == item.id) {
                                item.hascollection = 1;
                            }
                        }
                        item.userName = userRows[0].username;
                        item.headImg = userRows[0].head;
                        callback(null);
                    })
                }, (err) => {
                    const start = 5*(requestTime - 1);
                    const end = messages.length < 5*requestTime ? messages.length : 5*requestTime;
                    if(start >= messages.length) {
                        res.send('all')
                    }else {
                        res.send(messages.splice(start, end));
                    }
                })
            })
        });
    },

    // getMessagesByUserCF (req, res) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     const { userid } = req;
    //     const messages = [];
    //     const userCF = [];
    //     const oUserRows = [];
    //     const { userid } = req.body;
    //     new Promise((resolve, reject) => {
    //         pool.query(`SELECT * from user`, function(err, userRows, fields) {
    //             if (err) throw err;
    //             const userCFGood = [];
    //             oUserRows = [...userRows];
    //             for(let i in userRows) {
    //                 pool.query(`SELECT * from good WHERE userid=${userRows[i].Id}`, function(err, goodRows, fields) {
    //                     if (err) throw err;
    //                     userCF[userRows[i].Id] = [];
    //                     for(let j in goodRows) {
    //                         userCF[userRows[i].Id].push(goodRows[j].messageid);
    //                     }
    //                     if(i == userRows.length - 1) {
    //                         resolve(userCFGood);
    //                     }
    //                 })
    //             }
    //         })
    //     })
    //     .then(userCFGood => {
    //         return new Promise ((resolve, reject) => {
    //             for(let i in oUserRows) {
    //                 // userCF[oUserRows[i].Id] = 
    //                 let userCF = 0;
    //                 for(let j in userCFGood[userid]) {
    //                     if(userCFGood[oUserRows[i].Id].includes(userCFGood[userid][j].messageid)) {
    //                         userCF++;
    //                     }
    //                 }
    //                 userCF[oUserRows[i].Id] = userCF / Math.sqrt(userCFGood[oUserRows[i].Id].length * userCFGood[userid].length);
    //             }
    //             resolve(userCF)
    //         })
    //     })
    //     .then(userCF => )
    // },

    searchMessagesByType (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        const { userid, requestTime, type } = req.body;
        pool.query(`SELECT * from message WHERE LOCATE('${type}', type) > 0`, function(err, rows, fields) {
            if (err) throw err;
            messages = rows;
            new Promise((resolve, reject) => {
                pool.query(`SELECT * from good WHERE userid=${userid}`, function(err, goodRows, fields) {
                    if (err) throw err;
                    pool.query(`SELECT * from collection WHERE userid=${userid}`, function(err, collectionRows, fields) {
                        resolve({ goods: goodRows, collections: collectionRows });
                    })
                })
            }).then(data => {
                const { goods, collections } = data;
                async.eachSeries(messages, (item, callback) => {
                    pool.query(`SELECT * from user WHERE Id=${item.userid}`, function(err, userRows, fields) {
                        if (err) throw err;
                        item.hasgood = 0;
                        item.hascollection = 0;
                        for(let i in goods) {
                            if(goods[i].messageid == item.id) {
                                item.hasgood = 1;
                            }
                        }
                        for(let x in collections) {
                            if(collections[x].messageid == item.id) {
                                item.hascollection = 1;
                            }
                        }
                        item.userName = userRows[0].username;
                        item.headImg = userRows[0].head;
                        callback(null);
                    })
                }, (err) => {
                    const start = 5*(requestTime - 1);
                    const end = messages.length < 5*requestTime ? messages.length : 5*requestTime;
                    if(start >= messages.length) {
                        res.send('all')
                    }else {
                        res.send(messages.splice(start, end).reverse());
                    }
                })
            })
        });
    },

    searchMessagesByFriends (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid, requestTime } = req.body;
        new Promise((resolve, reject) => {
            pool.query(`SELECT * from good WHERE userid=${userid}`, function(err, goodRows, fields) {
                if (err) throw err;
                pool.query(`SELECT * from collection WHERE userid=${userid}`, function(err, collectionRows, fields) {
                    resolve({ goods: goodRows, collections: collectionRows });
                })
            })
        }).then(data => {
            const { goods, collections } = data;
            pool.query(`SELECT * from friend WHERE userid=${userid}`, function(err, rows, fields) {
                let messages = [];
                async.eachSeries(rows, (item, callback) => {
                    pool.query(`SELECT * from message WHERE userid=${item.with_whom}`, function(err, userRows, fields) {
                        if (err) throw err;
                        pool.query(`SELECT * from user WHERE Id=${item.with_whom}`, function(err, innUserRows, fields) {
                             // {...userRows, userName: innUserRows[0].username, headImg: innUserRows[0].head}
                            const userItem = (userRows || []).map((item, index) => {
                                return {...item, userName: innUserRows[0].username, headImg: innUserRows[0].head}
                            })
                            messages = [...messages, ...userItem];
                            callback(null);
                        })
                    })
                }, (err) => {
                    for(let i in messages) {
                        messages[i].hasgood = 0;
                        messages[i].hascollection = 0;
                        for(let j in goods) {
                            if(goods[j].messageid == messages[i].id) {
                                messages[i].hasgood = 1;
                            }
                        }
                        for(let k in collections) {
                            if(collections[k].messageid == messages[i].id) {
                                messages[i].hascollection = 1;
                            }
                        }
                    }
                    const start = 5*(requestTime - 1);
                    const end = messages.length < 5*requestTime ? messages.length : 5*requestTime;
                    if(start >= messages.length) {
                        res.send('all')
                    }else {
                        res.send(messages.splice(start, end).reverse());
                    }
                })
            })
        })
    },

    searchMessagesByLike (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        const { userid, requestTime, search } = req.body;
        pool.query(`SELECT * from message WHERE LOCATE('${search}', name) > 0`, function(err, rows, fields) {
            if (err) throw err;
            messages = rows;
            new Promise((resolve, reject) => {
                pool.query(`SELECT * from good WHERE userid=${userid}`, function(err, goodRows, fields) {
                    if (err) throw err;
                    pool.query(`SELECT * from collection WHERE userid=${userid}`, function(err, collectionRows, fields) {
                        resolve({ goods: goodRows, collections: collectionRows });
                    })
                })
            }).then(data => {
                const { goods, collections } = data;
                async.eachSeries(messages, (item, callback) => {
                    pool.query(`SELECT * from user WHERE Id=${item.userid}`, function(err, userRows, fields) {
                        if (err) throw err;
                        item.hasgood = 0;
                        item.hascollection = 0;
                        for(let i in goods) {
                            if(goods[i].messageid == item.id) {
                                item.hasgood = 1;
                            }
                        }
                        for(let x in collections) {
                            if(collections[x].messageid == item.id) {
                                item.hascollection = 1;
                            }
                        }
                        item.userName = userRows[0].username;
                        item.headImg = userRows[0].head;
                        callback(null);
                    })
                }, (err) => {
                    const start = 5*(requestTime - 1);
                    const end = messages.length < 5*requestTime ? messages.length : 5*requestTime;
                    if(start >= messages.length) {
                        res.send('all')
                    }else {
                        res.send(messages.splice(start, end).reverse());
                    }
                })
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

    messageAddCollections (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var messages = [];
        const { collections, cardId, userId, hascollection } = req.body;
        pool.query(`SELECT * from message WHERE id=${cardId}`, function(err, rows, fields) {
            if (err) throw err;
            pool.query('UPDATE message set collection= "'+collections+'" WHERE id= "'+cardId+'"', function(err, rows, fields) {
                if (err) throw err;
            }); 
            if(hascollection == 1) {
                pool.query('INSERT INTO collection(userid, messageid) VALUES ("'+userId+ '","'+cardId+'")', function(err, rows, fields) {
                    if (err) throw err;
                    res.send('success')
                });
            } else {
                pool.query('DELETE FROM collection WHERE userid = "'+userId+ '" AND messageid = "'+cardId+'"', function(err, rows, fields) {
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
            const { title, content, base64, userid, type, uri, } = req.body;
            const dataBuffer = new Buffer(base64, 'base64');
            const random = Date.now();
            const imgPath = path.resolve(__dirname, `../image/${random}.png`);
            fs.writeFile(imgPath, dataBuffer, function(err){
                if(err){
                    console.log(err);
                }else{
                    let newPost = new Buffer(`{
                        "bodyImg":"http://188.131.233.116:3000/image/${random}.png",
                        "content": "${content}",
                        "commits": []
                    }`).toString('base64');
                    let test = `${imgPath}`;
                    const time = getDate()
                    pool.query('INSERT INTO message(name, content, collection, good, userid, time, type) VALUES ("'+title+ '","'+newPost+'", 0, 0, "'+userid+'", "'+time+'", "'+type+'")', function(err, rows, fields) {
                        if (err) throw err;
                        res.send('success')
                    });
                }
            })
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
    addSecoundCommits (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query(`SELECT * from message WHERE id=${req.body.cardId}`, function(err, rows, fields) {
            if (err) throw err;
            const { index, commit, userid, userName, headImg} = req.body;
            let newContent = JSON.parse(new Buffer(rows[0].content, 'base64').toString());
            if(!newContent.commits[index].second) {
                newContent.commits[index].second = [];
            }
            newContent.commits[index].second.push({
                "name": `${userName}`,
                "content": `${commit}`,
                "goods": 0,
                "userid": `${userid}`,
                "headImg": `${headImg}`,
                "time": `${getDate()}`
            })

            newContent = new Buffer(JSON.stringify(newContent)).toString('base64');
            pool.query('UPDATE message set content= "'+newContent+'" WHERE id= "'+req.body.cardId+'"', function(err, rows, fields) {
                if (err) throw err;
                res.send('success')
            });  
        });
    },
    addGoodToMessageReq (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid, messageId, whom } = req.body;
        pool.query('INSERT INTO message_req(userid, messageId, whom, checked) VALUES ("'+userid+ '","'+messageId+'","'+whom+'", 0)', function(err, rows, fields) {
            if (err) throw err;
            res.send({ id: rows[0] });
        });
    },
    getMessagesTipNoCheck (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid } = req.body;
        const messages = [];
        const messagesChecked = [];
        pool.query(`SELECT * from message_req WHERE userid=${userid}`, async function(err, orows, fields) {
            if (err) throw err;
            async.eachSeries(orows, (item, callback) => {
                const { userid, messageId, whome } = item;
                const messagesItem = { id: item.id, checked: item.checked };
                pool.query(`SELECT * from user WHERE Id=${userid}`, function(err, rows, fields) {
                    if (err) throw err;
                    messagesItem.userInfo = {
                        username: rows[0].username,
                        head: rows[0].head,
                        userid
                    }
                    pool.query(`SELECT * from message WHERE id=${messageId}`, function(err, rows, fields) {
                        if (err) throw err;
                        messagesItem.messageInfo = {
                            id: messageId,
                            name: rows[0].name
                        }
                        if(item.checked) {
                            messagesChecked.push(messagesItem)
                        } else {
                            messages.push(messagesItem);
                        }
                        callback(null);
                    });
                });
            }, (err) => {
                res.send({
                    messages,
                    messagesChecked
                });
            })
        });
    },
    checkedMessagesTip (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { id } = req.body;
        pool.query('UPDATE message_req set checked=1 WHERE id= "'+id+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('success');
        }); 
    },
    // 聚合数据api
    getGeoByCoords (req, res) {
        const { latitude, longitude } = req.body;
        axios.get(`${GET_GEO_BY_COORDS}?key=9429d2cb9a0655a63389ec28dde98775&lat=${latitude}&lng=${longitude}&type=1`)
        .then(function (response) {
	    console.log(response.data.result);
            res.send(response.data.result);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}
