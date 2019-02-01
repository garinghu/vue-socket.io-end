let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);
let axios = require('axios');
const async = require('async');
let Q = require('q');

module.exports = {
    getFriendsByUserId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid } = req.body;
        pool.query(`SELECT * from friend WHERE userid=${userid}`, function(err, rows, fields) {
            if (err) throw err;
            const friends = [...rows];
            async.eachSeries(friends, (item, callback) => {
                pool.query(`SELECT * from user WHERE Id=${item.with_whom}`, function(err, userRows, fields) {
                    if (err) throw err;
                    item.withWhomInfo = userRows[0];
                    callback(null);
                })
            }, err => { res.send(friends) })
        })
    },

    deleteFriendByUserId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid, withWhom } = req.body;
        pool.query('DELETE FROM friend WHERE userid = "'+userid+ '" AND with_whom = "'+withWhom+'"', function(err, rows, fields) {
            if (err) throw err;
            res.send('success')
        });
    },

    addFriendByUserId (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { userid, withWhom } = req.body;
        pool.query('INSERT INTO friend(userid, with_whom) VALUES ("'+userid+ '","'+withWhom+'")', function(err, rows, fields) {
            if (err) throw err;
            res.send('success')
        });
    }
}