const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}


var convertToStarsArray= stars =>{
  var num = Number(stars.toString().substring(0,1));
  var arr = [];
  for (var i = 1; i<=5;i++){
    if(i<=num){
      arr.push(1);
    }
    else{
      arr.push(0);
    }
  }
  return arr;
}
function http(url,callBack){
  wx.request({
    url: url,
    method: 'GET',
    success:res=>callBack(res.data),
    fail:err=>console.log("getMoviesData_err_is" + err),
        })
  }
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http:http,

}