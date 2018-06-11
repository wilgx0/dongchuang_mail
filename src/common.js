import axios from 'axios'
import qs from 'qs'



//获取服务器的数据
function getData(url,postData,callback){
    let data = qs.stringify({
        ...postData
    });
    axios({
        method: 'post',
        url: url,
        data: data,
    }).then(function(response) {
        callback(response);
    }).catch(function(error) {
        console.log(error);
    });
}


//时间戳装换日期格式
function timestampToTime(timestamp) {
    var Y,M,D,h,m,s;
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}

/**
 * 字符串截取
 * @param str
 * @param num
 */
function substring(str,length){
    if(str == undefined) {
        return '';
    }
    if(str.length>length){
        return str.substring(0,length)+'..';
    } else {
        return str;
    }

}

export {
    getData,
    timestampToTime,
    substring,
}
