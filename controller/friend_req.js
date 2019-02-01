let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);
let axios = require('axios');
const async = require('async');
let Q = require('q');

module.exports = {
    getAllFriendReq (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query(`SELECT * from friend_req`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
        })
    },

    deleteHasRequestById (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const { id } = req.body;
        pool.query('DELETE FROM friend_req WHERE id = "'+id+ '"', function(err, rows, fields) {
            if (err) throw err;
            res.send('success')
        });
    }
}