var express = require('express');
var app = express();
var router = require('./routes/router')
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    next();  
});
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(router);

app.get('/image/:id', function (req, res) {
    fs.readFile(path.resolve(__dirname, `./${req.url}`), (err, data) => {
        if(err) {
            res.send('error 404');
        } else {
            res.send(data);
        }
    })
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})