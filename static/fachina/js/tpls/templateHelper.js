template.helper('dataRound', function(data) {
  return Math.round(data * 100);
});

/**
 * 对日期进行格式化，
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
template.helper('dateFormat', function(date, format) {

  date = new Date(date);

  var map = {
    "M": date.getMonth() + 1, //月份
    "d": date.getDate(), //日
    "h": date.getHours(), //小时
    "m": date.getMinutes(), //分
    "s": date.getSeconds(), //秒
    "q": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length - 2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
});

/*格式化百分比*/
template.helper('rate', function(num,noSymbol) {
  var data;
  if(num){
    data = (num * 100).toFixed(2);
  } else{
    data = '0.00';
  }
  return noSymbol ? data : (data + '%');
});

/*收益颜色*/
template.helper('color', function(data) {
  if(data > 0){
    return 'text-red';
  } else if(data < 0){
    return 'text-green';
  } else{
    return '';
  }
});

/*长度限制*/
template.helper('limit', function(data, limitLength) {
  if(data && data.length > limitLength){
    return data.substr(0,limitLength) + '*';
  }else{
    return data;
  }
});

/*委托状态*/
template.helper('ordStat', function(data) {
  switch(data){
    case 'A':
      return '待交易';
      break;
    case 'B':
      return '交易中';
      break;
    case 'C':
      return '全部成交';
      break;
    case 'D':
      return '部分撤销';
      break;
    case 'E':
      return '全部撤销';
      break;
    case 'F':
      return '委托失败';
      break;
    case 'G':
      return '发送异常';
      break;
    case 'H':
      return '未成交';
      break;
    case 'I':
      return '撤单中';
      break;
    case 'J':
      return '部分成交';
      break;
    default :
      return '--';
  }
});

/*判断为空*/
template.helper('isNull', function(val) {

  if((typeof val === 'undefined') || val === null ){
    return '--';
  } else{
    return val;
  }
});

/*价格格式化*/
template.helper('price', function(val) {
  if(val){
    return val.toFixed(2);
  } else{
    return '--';
  }
});

/*转换*/
template.helper('notNull', function(val) {
  if(val === null){
    return 0;
  } else{
    return val;
  }
});