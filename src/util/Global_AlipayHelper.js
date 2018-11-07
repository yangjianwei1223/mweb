/* eslint-disable */ 
import qs from "qs";
import ApicloudHelper from './Global_ApicloudHelper'
import BaseInfoHelper from './Global_BaseInfoHelper'
import apiport from './api'
import http from './http.js'

var GetAlipayData = {
    ListStrBuilder: function (slt) {
        var result = '<form id="alipaysubmit" name="alipaysubmit" action="' + slt.action + '" method="get">';
        result += ' <input type="hidden" name="_input_charset" value="' + slt._input_charset + '"/>';
        result += ' <input type="hidden" name="body" value="' + slt.body + '"/>';
        result += ' <input type="hidden" name="notify_url" value="' + slt.notify_url + '"/>';
        result += ' <input type="hidden" name="out_trade_no" value="' + slt.out_trade_no + '"/>';
        result += ' <input type="hidden" name="partner" value="' + slt.partner + '"/>';
        result += ' <input type="hidden" name="payment_type" value="' + slt.payment_type + '"/>';
        result += ' <input type="hidden" name="return_url" value="' + slt.return_url + '"/>';
        result += ' <input type="hidden" name="seller_id" value="' + slt.seller_id + '"/>';
        result += ' <input type="hidden" name="service" value="' + slt.service + '"/>';
        result += ' <input type="hidden" name="show_url" value="' + slt.show_url + '"/>';
        result += ' <input type="hidden" name="subject" value="' + slt.subject + '"/>';
        result += ' <input type="hidden" name="total_fee" value="' + slt.total_fee + '"/>';
        result += ' <input type="hidden" name="sign" value="' + slt.sign + '"/>';
        result += ' <input type="hidden" name="sign_type" value="' + slt.sign_type + '"/>';
        result += ' <input type="submit" value="确认" style="display:none;"/></form>';

        return result;
    }
}

var Pay = function (IsMixPay, hasPointPay, hasTimesCardPay, remark, showUrl, type, relationId, SucFun, ErrFun) {
    if (ApicloudHelper.IsApp()) {
        var Token = BaseInfoHelper.GetToken();
        var model = {
            IsMixPay: IsMixPay,
            PaymentMethod: 1,
            Remark: remark,
            Token: Token,
            showUrl: showUrl,
            type: type,
            relationId: relationId,
            hasPointPay: hasPointPay,
            hasTimesCardPay: hasTimesCardPay
        }

        http({
            url: apiport.Alipay_AppPay,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
             //alert(JSON.stringify(res.data));
              var data=res.data;
              if (data.ResultNo == "00000000") {
                ApicloudHelper.aliPay(data.AlipayHtml, SucFun, ErrFun);
                //Global_CommonHelper.ConfirmLoadingHide();
            }
            else {
                alert("支付失败，请重试" );
               // Global_CommonHelper.ConfirmLoadingHide();
            }
            })
            .catch(error => {
              console.log(2);
              console.log(error);
            });

    }
    else {
        var result = null;
        var Token =BaseInfoHelper.GetToken();
        var model = {
            IsMixPay: IsMixPay,
            PaymentMethod: 1,
            Remark: remark,
            Token: Token,
            showUrl: showUrl,               
            type: type,
            relationId: relationId,
            hasPointPay: hasPointPay,
            hasTimesCardPay: hasTimesCardPay
        }
        http({
            url: apiport.Alipay_Pay,
            method: "post",
            data: qs.stringify({ reqJson: JSON.stringify(model) })
          })
            .then(res => {
              var data=res.data;
              if (data.ResultNo == "00000000") {
                var result = GetAlipayData.ListStrBuilder(JSON.parse(data.AlipayHtml));
                  document
                    .getElementsByTagName("body")[0]
                    .insertAdjacentHTML("afterBegin", result);
                  document.getElementById("alipaysubmit").submit();
            }
            else {
                alert("支付失败，请重试" );
               // Global_CommonHelper.ConfirmLoadingHide();
            }
            })
            .catch(error => {
              console.log(2);
              console.log(error);
            });
    }
}

export default {
    Pay:Pay

}
