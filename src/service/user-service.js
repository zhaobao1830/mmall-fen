/**
 * Created by zb on 2018/4/2.
 */
var _mm = require('util/mm.js');

var _user = {
  // 退出
  logout : function (resolve, reject) {
    _mm.request({
      url: _mm.getServerUrl('/user/logout.do'),
      method: 'POST',
      success: resolve,
      error: reject
    });
  },
  // 检查登录状态
  checkLogin : function(resolve, reject){
    _mm.request({
      url     : _mm.getServerUrl('/user/get_user_info.do'),
      method  : 'POST',
      success : resolve,
      error   : reject
    });
  }
}
exports.module = _user;
