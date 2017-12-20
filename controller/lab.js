let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    getAll (req, res) {
        // pool.getConnection ((err, connection) => {
        //     connection.query(sql.queryAll, 'lab', (err, rows) => {
        //         if (err) throw err;
        //         res.send(rows);
        //         console.log(rows)
        //         connection.release();
        //     });
        // })
        pool.query(sql.queryAll, 'lab', function(err, rows, fields) {
            if (err) throw err;
            res.send(rows[0]);
            console.log('The solution is: ', rows);
          });
    }
}

