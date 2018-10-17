/* eslint-disable */
function IsApp() {
    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象        
    if (ua.indexOf("apicloud_laibei") > 0) {
        return true;
    } else {
        return false;
    }
}
//应用版本号
function get_appVersion() {
    if (!api) {
        return "";
    }
    return api.appVersion;
}
//系统类型
function get_systemType() {
    if (!api) {
        return "";
    }
    return api.systemType;
}
//手机平台的系统版本
function get_systemVersion() {
    if (!api) {
        return "";
    }
    return api.systemVersion;
}
//设备唯一标识
function get_deviceId() {
    if (!api) {
        return "";
    }
    return api.deviceId;
}
//设备型号
function get_deviceModel() {
    if (!api) {
        return "";
    }
    return api.deviceModel;
}
//设备名称
function get_deviceName() {
    if (!api) {
        return "";
    }
    return api.deviceName;
}
//运营商名称
function get_operator() {
    if (!api) {
        return "";
    }
    return api.operator;
}
//屏幕分辨率宽
function get_screenWidth() {
    if (!api) {
        return "";
    }
    return api.screenWidth;
}
//屏幕分辨率高
function get_screenHeight() {
    if (!api) {
        return "";
    }
    return api.screenHeight;
}
//当前网络连接类型
function get_connectionType() {
    if (!api) {
        return "";
    }
    return api.connectionType;
}
export default {
    IsApp: IsApp,
    get_appVersion: get_appVersion,
    get_systemType: get_systemType,
    get_systemVersion: get_systemVersion,
    get_deviceId: get_deviceId,
    get_deviceModel: get_deviceModel,
    get_deviceName: get_deviceName,
    get_operator: get_operator,
    get_screenWidth: get_screenWidth,
    get_screenHeight: get_screenHeight,
    get_connectionType: get_connectionType,
}