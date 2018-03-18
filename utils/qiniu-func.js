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
      if (respErr) {
          reject('上传图片失败');
      } else if (respInfo.statusCode !== 200) {
          reject('上传图片失败: ' + respInfo.data.error);
      } else {
          resolve({'url': qiniuConfig.domain + '/' +respBody.key});
      }
    });
  })
};
