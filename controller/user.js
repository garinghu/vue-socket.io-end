let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    login (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query(sql.queryAll, 'user', function(err, rows, fields) {
            if (err) throw err;
            var flag = 0;
            var x;
            for(var x in rows){
                if(rows[x].username == req.body.username){
                    if(rows[x].password == req.body.password){
                        flag = 1;
                        res.send(rows[x])
                    } else {
                        flag = 2;
                        res.send('密码错误')
                    }
                }
            }
            if(flag == 0){
                res.send('用户名不存在')
            }
          });
    },

    register (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        var users = [];
        pool.query(sql.queryAll, 'user', function(err, rows, fields) {
            if (err) throw err;
            users =rows;
            var x = true;
            console.log(users[0].username)
            for(var x in users){
                if(users[x].username == req.body.username){
                    var x = false;
                }
            }
            if(x){
                pool.query('INSERT INTO user(username, password) VALUES ("'+req.body.username+ '","'+req.body.password+'")', function(err, rows, fields) {
                    if (err) throw err;
                    res.send('注册成功')
                });
            }else{
                res.send('重复')
            }
           
          });  
    },

    changeName (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('UPDATE user set name= "'+req.body.name+'" WHERE username= "'+req.body.username+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('成功')
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
        pool.query('UPDATE user set head= "'+req.body.head+'" WHERE username= "'+req.body.username+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('成功')
          });  
    },

    getUserTocken (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        console.log(req.body.expoToken);
        res.send('success');
    }
}