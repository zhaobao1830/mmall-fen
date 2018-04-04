/**
 * Created by zb on 2018/4/4.
 */
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

$(function () {
  console.log('pppp')
  var type =_mm.getUrlParam('type') || 'default',
       $element =$('.' + type + '-success');
  console.log('yyyyy')
  $element.show();
})
