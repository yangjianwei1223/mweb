/* eslint-disable */ 
import qs from 'qs'
import storage from './storage'
import apiport from './api'
import http from './http.js'
//获取当前用户信息
function GetLoginInfo() {
    return new Promise((resolve, reject) => {
        let loginInfo = storage.getSession("BaseInfo")
        if (!loginInfo) {
            let isSetTGCode = false;
            let PromotionCode = "";
            let token = GetToken();
            if (!!token) {
                http({
                    url: apiport.Account_GetBaseByToken,
                    method: 'post',
                    data: qs.stringify({ reqJson: JSON.stringify({ "Token": token }) })
                }).then((res) => {
                    if (!!res.data && res.data.ResultNo == "00000000") {
                        storage.setSession(JSON.stringify(res.data), "BaseInfo");
                        loginInfo = res.data;
                        var PromotionCodeSession = storage.getLocal("ZulinPromotionCode")
                        if (!!PromotionCodeSession) {
                            PromotionCode = PromotionCodeSession;
                        }
                        //判断TGCode是否为空
                        if (!!res.data.TGCode) {
                            storage.setLocal(res.data.TGCode.toUpperCase(), "ZulinPromotionCode")
                        }
                        else {
                            if (res.data.InvitationCode !== PromotionCode) {
                                http({
                                    url: apiport.Account_SetTGCode,
                                    method: 'post',
                                    data: qs.stringify({ reqJson: JSON.stringify({ "TGCode": PromotionCode, "Token": token }) })
                                }).then((res) => {
                                }).catch((error) => {
                                })
                            }
                        }

                        resolve(loginInfo)
                    }
                    else {
                        reject(loginInfo)
                    }
                }).catch((error) => {
                    reject(error)
                })
            }
            else {
                resolve(loginInfo)
            }
        } else {
            resolve(loginInfo)
        }
    }).catch(function (err) {
        resolve(null)
    })


}
//
// 获取用户token
function GetToken() {
    let token = ""
    let storageResult = storage.GetStorageDataByKey("UserToken")
    if (!!storageResult) {
        token = JSON.parse(storageResult).Token
    }
    return token
}
export default {
    GetLoginInfo: GetLoginInfo,
    GetToken: GetToken
}