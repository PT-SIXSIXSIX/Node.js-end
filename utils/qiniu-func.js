var qiniu = require('qiniu');
var qiniuConfig = require('../config').qiniuConfig

var mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);

var putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.options);
var uploadToken=putPolicy.uploadToken(mac);


var formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
var putExtra = new qiniu.form_up.PutExtra();

// 文件上传
exports.uploadFile = function (key, file){
  return new Promise(function (resolve, reject){
    formUploader.putFile(uploadToken, key, file, putExtra, function(respErr,
      respBody, respInfo) {
      if (!respErr) {
        resolve({'url': qiniuConfig.domain + '/' +respBody.key});
      }
      else {
        reject();
      }
    });
  })
};
