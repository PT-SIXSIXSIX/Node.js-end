var qiniu = require('qiniu');

var qiniuConfig = new qiniu.conf.Config();
// 空间对应的机房
qiniuConfig.zone = qiniu.zone.Zone_z0;
qiniuConfig.domain = 'http://p57uimjto.bkt.clouddn.com';
qiniuConfig.accessKey = 'M8Ix6_UIHTUIM49NWeKn3KVB048ORYpi0csdgyYZ';
qiniuConfig.secretKey = '5fZFKrpvz1irFEhrjY5GJwgaBksIh8X9XZi93Fu6';
qiniuConfig.bucket = 'ykat';
qiniuConfig.options = {
  scope: qiniuConfig.bucket,
  expires: 7200
};
exports.qiniuConfig = qiniuConfig;

exports.bmob_req_url = 'https://api.bmob.cn/1/requestSmsCode/';
exports.bmob_verify_url = 'https://api.bmob.cn/1/verifySmsCode/';
exports.bmob_sms_headers = {
    "X-Bmob-Application-Id": "253950cf6fe3d5d8682b0f4e0251ef63",
    "X-Bmob-REST-API-Key": "dd6ee8a5569911ae46d062ac15cdb21f",
    "Content-Type": "application/json"
};
exports.jwtTokenSecret = 'YKAT';