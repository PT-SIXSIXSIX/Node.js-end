//server.js 文件
var express = require('express');
var moment = require('moment');
var request = require('request');
var jwt = require('jwt-simple');
var fs = require("fs");
var md5 = require('md5');
var multer = require('multer');
var multipartMiddleware = require('connect-multiparty')();
var bodyParser = require('body-parser');

var qiniuFunc = require('./utils/qiniu-func');
var jwtAuth = require('./utils/jwt-auth');
var config = require('./config');

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('jwtTokenSecret', config.jwtTokenSecret);

app.use(multer({ dest: '/tmp/'}).array('image'));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/api/v1/images', function (req, res) {
  console.log(req.files);
  file = req.files[0];

  var key = md5(file.originalname);
  var promise = qiniuFunc.uploadFile(key, file.path).then(function onFulfilled(value){
      console.log(value);
      res.end(JSON.stringify(value));
  }).catch(function onRejected(error){
      res.sendStatus(400);
      res.status(400).end(JSON.stringify({'statusCode': 1, 'errorDesc': error}));
  });
})

app.post('/api/v1/login', urlencodedParser, function (req, res){
  console.log(req.body);
  var phone = req.body.phone;
  var password = req.body.password;
  var userId = 1;
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: userId,
    exp: expires
  }, app.get('jwtTokenSecret'));

  res.json({
    userId: 1,
    name: 'Hello, world!',
    phone: phone,
    role: 1,
    accessToken: token
  });
});

app.get('/api/v1/sms/', function (req, res){
  console.log(req.query.phone);
  var phone = req.query.phone;
  console.log(config.bmob_req_url, config.bmob_sms_headers);
  request({
    url: config.bmob_req_url,
    method: "POST",
    json: true,
    headers: config.bmob_sms_headers,
    body: {'mobilePhoneNumber': phone}
  }, function(error, response, body) {
    console.log(response.statusCode, body);
      if (!error && response.statusCode == 200) {
        res.end(JSON.stringify({'msg': 'OK'}));
      }
      res.status(400).end(JSON.stringify({'statusCode': 1, 'errorDesc': '获取验证码失败！'}));
  });
});

app.get('/api/v1/sms/verify', function (req, res){
  console.log(req.query);
  var smsCode = req.query.smsCode;
  var phone = req.query.phone;
  console.log(config.bmob_verify_url + smsCode);
  request({
    url: config.bmob_verify_url + smsCode,
    method: "POST",
    json: {'mobilePhoneNumber': phone},
    headers: config.bmob_sms_headers,
  }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response.statusCode, body);
        res.end(JSON.stringify({'msg': 'OK'}));
      }
      console.log(error);
      res.status(400).end(JSON.stringify({'statusCode': 1, 'errorDesc': '验证码错误'}));
  });
});

app.get('/api/v1/users/:id/store', function (req, res){
  console.log('getStore:')
  var data = {
    "name": "Hello, world!",
    "phone": "18983944359",
    "reservePhone": "13290035875",
    "companyName": "Hello, world!",
    "location": "Hello, world!",
    "idCard": "411111199911118888",
    "picHeadUrl": "http://p57uimjto.bkt.clouddn.com/ykat/background-4.png",
    "picTailUrl": "http://p57uimjto.bkt.clouddn.com/ykat/background-6.png",
    "serviceType": "Hello, world!",
    "deposit": 1,
    "createdAt": "Hello, world!"
  };
  res.end(JSON.stringify(data));
});

app.put('/api/v1/users/:id/store', function (req, res){
  console.log('putStore:', req.body);
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
