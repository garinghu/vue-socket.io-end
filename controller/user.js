let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);
let axios = require('axios');
const async = require('async');
let Q = require('q');

const randomNum = function (minNum,maxNum) {
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
        break; 
    } 
}

module.exports = {
    login (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { phone, password } = req.body;
        pool.query(`SELECT * FROM user WHERE phone=${phone}`, function(err, rows, fields) {
            if (err) {res.send({
                errno: 2,
                errText: '该手机号还未注册',
            })} else {
                var flag = 0;
                var x;
                for(var x in rows){
                    if(rows[x].phone == phone){
                        if(rows[x].password == password){
                            flag = 1;
                            res.send({
                                errno: 0,
                                data: rows[x],
                            })
                        } else {
                            flag = 2;
                            res.send({
                                errno: 1,
                                errText: '密码错误',
                            })
                        }
                    }
                }
                if(flag == 0){
                    res.send({
                        errno: 2,
                        errText: '该手机号还未注册',
                    })
                }
            };
          });
    },

    regist (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { phone, password } = req.body;
        pool.query(`SELECT * FROM user WHERE phone=${phone}`, function(err, rows, fields) {
            if (err) {
                // pool.query('INSERT INTO user(username, password, phone) VALUES ("'+phone+ '","'+password+'","'+phone+'")', function(inErr, inRows, fields) {
                //     if (inErr) throw inErr;
                //     res.send(res.send({
                //         errno: 0,
                //         data: inRows[0],
                //     }))
                // });
            }else {
                if(!rows.length) {
                    pool.query('INSERT INTO user(username, password, phone) VALUES ("'+phone+ '","'+password+'","'+phone+'")', function(inErr, inRows, fields) {
                        if (inErr) throw inErr;
                        res.send({
                            errno: 0,
                            data: inRows[0],
                        })
                    });
                } else {
                    res.send({
                        errno: 1,
                        errText: '该手机号已注册',
                    })
                }
            }
        });  
    },

    changeName (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { name, userid } = req.body;
        pool.query('UPDATE user set username= "'+name+'" WHERE Id= "'+userid+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('success');
          });  
    },

    changeSign (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('UPDATE user set signature= "'+req.body.sign+'" WHERE username= "'+req.body.username+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('成功')
        });  
    },

    changeHead (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { head, id } = req.body
        pool.query('UPDATE user set head= "'+head+'" WHERE Id= "'+id+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('success');
          });  
    },

    getUserTocken (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid, expoToken } = req.body;
        console.log(userid, expoToken)
        pool.query('UPDATE user set token= "'+expoToken+'" WHERE Id= "'+userid+'"', function(err, rows, fields) {
            if (err) throw err;
            console.log(userid, expoToken)
            res.send('success')
        });
    },

    getUserInfoById (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid } = req.body;
        console.log(userid)
        pool.query(`SELECT * from user WHERE Id=${userid}`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows[0])
        })
    },

    postExpoNotification (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        axios.post('https://exp.host/--/api/v2/push/send', {
            "to": "ExponentPushToken[IzFs08BBhhcpZoRUJsMbwb]",
            "title":"hello",
            "body": "world",
            sound: 'default',
        })
        .then(function (response) {
            res.send('success');
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    },

    sendSms (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { phone, random } = req.body;
        axios.post(`https://open.ucpaas.com/ol/sms/sendsms`, {
            sid: '9e00bee333444bf07f246b39931f1aa6',
            token: 'd09d66304b72d1b9ee5a4c6b9d6fa8eb',
            appid: '846c0eaa73f64f338210f332e8220fe9',
            templateid: '424574',
            param: random,
            mobile: phone,
        })
        .then(function (response) {
            res.send('success');
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
        // res.send('success');
    },

    sendLocateSms (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { address } = req.body;
        axios.post(`https://open.ucpaas.com/ol/sms/sendsms`, {
            sid: '9e00bee333444bf07f246b39931f1aa6',
            token: 'd09d66304b72d1b9ee5a4c6b9d6fa8eb',
            appid: '846c0eaa73f64f338210f332e8220fe9',
            templateid: '424574',
            param: address,
            mobile: phone,
        })
        .then(function (response) {
            res.send('success');
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
        // res.send('success');
    },

    getAllByUserId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid } = req.body;
        new Promise (resolve => {
            pool.query(`SELECT * from user WHERE Id=${userid}`, function(err, rows, fields) {
                if (err) throw err;
                resolve({ userInfo: rows[0] })
            })
        }).then(data => {
            return new Promise(resolve => {
                pool.query(`SELECT * from message WHERE userid=${userid}`, function(err, rows, fields) {
                    if (err) throw err;
                    resolve({...data, messages: rows})
                })
            })
        }).then(data => {
            return new Promise(resolve => {
                pool.query(`SELECT * from good WHERE userid=${userid}`, function(err, rows, fields) {
                    if (err) throw err;
                    const goodRows = [...rows];
                    async.eachSeries(goodRows, (item, callback) => {
                        pool.query(`SELECT * from message WHERE id=${item.messageid}`, function(err, messageRows, fields) {
                            if (err) throw err;
                            item.messageInfo = messageRows[0];
                            callback(null);
                        })
                    }, (err) => {resolve({...data, goods: goodRows})} )
                })
            })
        }).then(data => {
            return new Promise(resolve => {
                pool.query(`SELECT * from collection WHERE userid=${userid}`, function(err, rows, fields) {
                    if (err) throw err;
                    const collectionRows = [...rows];
                    async.eachSeries(collectionRows, (item, callback) => {
                        pool.query(`SELECT * from message WHERE id=${item.messageid}`, function(err, messageRows, fields) {
                            if (err) throw err;
                            item.messageInfo = messageRows[0];
                            callback(null);
                        })
                    }, (err) => {resolve({...data, collections: collectionRows})})
                })
            })
        }).then(data => { res.send(data) })
    },
    
    searchUsersByUserName (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { username, userid } = req.body
        pool.query(`SELECT * from user WHERE LOCATE('${username}', username) > 0`, function(err, rows, fields) {
            if (err) throw err;
            let newRows = [...rows];
            pool.query(`SELECT * from friend WHERE userid=${userid}`, function(err, friendRows, fields) {
                if (err) throw err;
                for(let i in newRows) {
                    newRows[i].alreadyFriend = false;
                    for(let j in friendRows) {
                        if(friendRows[j].with_whom == newRows[i].Id) {
                            newRows[i].alreadyFriend = true
                        }
                    }
                }
                res.send(newRows);
            })
        })
    }
    
}