const showtime = (time) => {
  // var lefttime = endtime.getTime() - nowtime.getTime(),  //距离结束时间的毫秒数
  var lefttime = time
  // leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)),  //计算天数
  let lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24);  //计算小时数
  let leftm = Math.floor(lefttime / (1000 * 60) % 60);  //计算分钟数
  let lefts = Math.floor(lefttime / 1000 % 60);  //计算秒数
  return (lefth > 9 ? lefth : `0${lefth}`) + "小时" + ":" + (leftm > 9 ? leftm : `0${leftm}`) + "分钟" + ":" + (lefts > 9 ? lefts : `0${lefts}`) + "秒";  //返回倒计时的字符串
}
export default showtime