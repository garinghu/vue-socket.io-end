let sql = require('../sql/sql');
let db = require('../config/db');
let mysql = require('mysql');
let pool = mysql.createPool(db);

module.exports = {
    add (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('INSERT INTO type(userid, content, date) VALUES ('+req.body.userid+ ',"'+req.body.content+'","'+req.body.date+'")', 'type', function(err, rows, fields) {
            if (err) throw err;
            res.send('成功')
          });
    },

    mytype (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        pool.query('SELECT * from type Where userid = '+ req.body.userid, function(err, rows, fields) {
            if (err) throw err;
            var flag = false;
            for (let x in rows){
                pool.query('select * from goods where typeid = '+rows[x].Id, function(err, rows2, fields) {
                    if (err) throw err;
                    var goods = [];
                    for(var y in rows2){
                        if(rows2[y].userid){
                            goods.push({
                                'userid': rows2[y].userid,
                                'name': rows2[y].name
                            });
                        }
                    }
                    rows[x]['good'] = goods;
                    pool.query('select * from commits where typeid = '+rows[x].Id, function(err, rows3, fields) {
                        if (err) throw err;
                        var commits = [];
                        for(var z in rows3){
                            if(rows3[z].userid){
                                console.log(rows3[z]);
                                commits.push({
                                    'userid': rows3[z].userid,
                                    'name': rows3[z].name,
                                    'content': rows3[z].content
                                });
                            }
                        }
                        rows[x]['commit'] = commits;
                        if(x == rows.length -1){
                             res.send(rows);
                         }
                    })
                });
            }
          });
    },

    
    
}