/* eslint-disable */
function IsWXBrowser () {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    }
    else {
        return false;
    }
}
export default {
    IsWXBrowser: IsWXBrowser
}