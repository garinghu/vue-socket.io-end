var express = require('express');
var app = express();
var mysql = require('mysql');
var router = require('./routes/router')
var bodyParser = require('body-parser')
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    next();  
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(router);


app.get('/test', function(req, res) {
    res.send('123123');
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})