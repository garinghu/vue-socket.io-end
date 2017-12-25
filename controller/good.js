let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    add (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('INSERT INTO goods(typeid, userid, name) VALUES ('+req.body.typeid+ ','+req.body.userid+',"'+req.body.name+'")', function(err, rows, fields) {
            if (err) throw err;
            res.send('成功')
          });
    },

    mytype (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('SELECT * from type Where userid = '+ req.body.userid, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows)
          });
    },

    
    
}