let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    getAll (req, res) {
        pool.query(`select * from tickets where start_adress="${req.body.start}" and arrive_adress="${req.body.end}"`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
        });
    },

    getNumInfo (req, res) {
        pool.query(`select * from train where num="${req.body.num}"`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
        });
    },

    getTicket (req, res) {
        pool.query(`select * from tickets where num="${req.body.num}" and start_adress="${req.body.start}" and arrive_adress="${req.body.end}"`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
        });
    },

    bookTicket (req, res) {
        pool.query(`UPDATE train set a_type_tickets="${req.body.a}", b_type_tickets="${req.body.b}" where num="${req.body.num}"`, function(err, rows, fields) {
            if (err) throw err;
            res.send('成功');
            console.log('The solution is: ', req.body);
        });
    },

    getTimer (req, res) {
        pool.query(`select * from time where num="${req.body.num}"`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
            console.log('The solution is: ', req.body);
        });
    },

    login (req, res) {
        pool.query(`select * from user where username="${req.body.username}"`, function(err, rows, fields) {
            if (err) throw err;
            if(rows[0].password == req.body.password) {
                res.send('成功');
            }else {
                res.send(rows);
            }
            console.log('The solution is: ', req.body);
        });
    },

    addInfo (req, res) {
        pool.query(`insert into user_ticket(userid,ticketid,tickets,date) values (${req.body.username},${req.body.trainNum},${req.body.ticketsNum},${req.body.date})`, function(err, rows, fields) {
            if (err) throw err;
            res.send(rows);
            console.log('The solution is: ', req.body);
        });
    },
}

