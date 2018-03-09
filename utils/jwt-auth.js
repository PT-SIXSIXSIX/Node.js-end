var jwt = require('jwt-simple');
var config = require('../config');

module.exports = function(req, res, next) {
  // code goes here
  var token = (req.body && req.body.access_token) ||
              (req.query && req.query.access_token) ||
              req.headers['x-access-token'];
  if (token) {
    try {
      var decoded = jwt.decode(token, config.jwtTokenSecret);
      console.log(decoded);
      // handle token here
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400);
      }
      res.code = 1;
      next();
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
      res.end(JSON.stringify({'code': 1, 'error_desc': err}));
    }
  } else {
    next();
  }
};
