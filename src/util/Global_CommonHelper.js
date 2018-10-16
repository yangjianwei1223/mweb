function GetQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = null;
    if (!!window.location.search) {
        r = window.location.search.substr(1).match(reg);
    }
    if (r == null) {
        //解决/Article/List/3390 格式问题
        reg = /(?:(\/{1}))(\d+)(?:[?&]?)/gi;
        var matchResult = window.location.href.match(reg);
        var result = "";
        if (matchResult != null && matchResult.length > 0) {
            result = matchResult[matchResult.length - 1];
        }
        if (!!result) {
            return result.match(/\d+/) != null ? result.match(/\d+/)[0] : "";
        }
        return "";
    }

    if (r != null) return unescape(r[2]); return null;
}
export default {
    GetQueryString: GetQueryString,
}