var qiniu = require('qiniu');

var qiniuConfig = new qiniu.conf.Config();
// 空间对应的机房
qiniuConfig.zone = qiniu.zone.Zone_z0;
qiniuConfig.domain = 'http://p57uimjto.bkt.clouddn.com';
qiniuConfig.accessKey = process.env.X_Qiniu_Access_Key || '';
qiniuConfig.secretKey = process.env.X_Qiniu_Secret_Key || '';
qiniuConfig.bucket = 'ykat';
qiniuConfig.options = {
  scope: qiniuConfig.bucket,
  expires: 86400
};

exports.qiniuConfig = qiniuConfig;

exports.bmob_req_url = 'https://api.bmob.cn/1/requestSmsCode/';
exports.bmob_verify_url = 'https://api.bmob.cn/1/verifySmsCode/';
exports.bmob_sms_headers = {
    "X-Bmob-Application-Id": process.env.X_Bmob_Application_Id || '',
    "X-Bmob-REST-API-Key": process.env.X_Bmob_REST_API_Key || '',
    "Content-Type": "application/json"
};
exports.jwtTokenSecret = 'YKAT';
