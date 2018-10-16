//  let  APIDomain='http://v2base.api.95laibei.com';
// let APIDomain = 'https://base-api.95laibei.com'
let APIDomain = 'https://t-base-api.95laibei.com'
// let APIDomain = '/api'

export default{
<<<<<<< HEAD
  APIDomain: APIDomain,
=======
>>>>>>> 9ced28722433260d05ae238a29f13617858bfd6c
  IMServiceUrl: 'https://t-im-api.95laibei.com',
  // 通用方法类接口
  Common_PicFileSave: APIDomain + '/MWeb/Common/PicFileSave',
  Common_GetGeoCoder: APIDomain + '/MWeb/Common/GetGeoCoder',
  Common_GetCoreRegionByParentId: APIDomain + '/MWeb/Common/GetCoreRegionByParentId',
  Common_SetErrLog: APIDomain + '/MWeb/Common/SetErrLog',
  Common_SetMonitorHijackingLog: APIDomain + '/MWeb/Common/SetMonitorHijackingLog',
  Common_SetServerLog: APIDomain + '/MWeb/Common/SetServerLog',
  Common_GetExpressByOrderId: APIDomain + '/MWeb/Common/GetExpressByOrderId',
  Common_AddSiteAccessLog: APIDomain + '/MWeb/Common/AddSiteAccessLog',
  //  首页请求接口
  Home_GetHomeList: APIDomain + '/MWeb/Home/GetHomeList',
  // 产品接口
  Product_GetCategoryTop: APIDomain + '/MWeb/Product/GetCategoryTop',
  Product_GetCategorySubByTopId: APIDomain + '/MWeb/Product/GetCategorySubByTopId',
  Product_AddProductComment: APIDomain + '/MWeb/Product/AddProductComment',
  Product_GetProductListByCategory: APIDomain + '/MWeb/Product/GetProductListByCategory',
  Product_GetProductDetail: APIDomain + '/MWeb/Product/GetProductDetail',
  Product_BasePraise: APIDomain + '/MWeb/Product/BasePraise',
  Product_GetZLDetailById: APIDomain + '/MWeb/Product/GetZLDetailById',
  Product_GetZulinProperty: APIDomain + '/MWeb/Product/GetZilinProperty',
  Product_GetZulinHotList: APIDomain + '/MWeb/Product/GetZulinHotList',
  Product_GetZulinList: APIDomain + '/MWeb/Product/GetZulinList',
  Product_GetSeatList: APIDomain + '/MWeb/Product/GetSeatList',
  Product_GetMoreList: APIDomain + '/MWeb/Product/GetMoreList',
  Product_BatchPraise: APIDomain + '/MWeb/Product/BatchPraise',

  ProductTrailReport_GetListById: APIDomain + '/MWeb/ProductTrailReport/GetListById',
  // 用户信息接口
  Account_AddValidCode: APIDomain + '/MWeb/Account/AddValidCode',
  Account_CheckLoginByValidCode: APIDomain + '/MWeb/Account/CheckLoginByValidCode',
  Account_CheckLoginByPwd: APIDomain + '/MWeb/Account/CheckLoginByPwd',
  Account_ChangePassword: APIDomain + '/MWeb/Account/ChangePassword',
  Account_GetBaseByToken: APIDomain + '/MWeb/Account/GetMbrBase',
  Account_ChangeBaseSex: APIDomain + '/MWeb/Account/ChangeBaseSex',
  Account_GetConsigneeByMbrBaseId: APIDomain + '/MWeb/Account/GetConsigneeByMbrBaseId',
  Account_SetConsigneeIsDefault: APIDomain + '/MWeb/Account/SetConsigneeIsDefault',
  Account_RemoveConsignee: APIDomain + '/MWeb/Account/RemoveConsignee',
  Account_GetConsigneeById: APIDomain + '/MWeb/Account/GetConsigneeById',
  Account_AddConsignee: APIDomain + '/MWeb/Account/AddConsignee',
  Account_GetMbrInfoByToken: APIDomain + '/MWeb/Account/GetMbrInfoByToken',
  Account_GetUserProductList: APIDomain + '/MWeb/Account/GetUserProductList',
  Account_GetAriticlePraiseList: APIDomain + '/MWeb/Account/GetAriticlePraiseList',
  Account_GetProductPraiseList: APIDomain + '/MWeb/Account/GetProductPraiseList',
  Account_CheckBaseByToken: APIDomain + '/MWeb/Account/CheckBaseByToken',
  Account_ChangeFaceImg: APIDomain + '/MWeb/Account/ChangeFaceImg',
  Account_ChangeNickName: APIDomain + '/MWeb/Account/ChangeNickName',
  Account_ChangeBirthday: APIDomain + '/MWeb/Account/ChangeBirthday',
  Account_ChangeSignature: APIDomain + '/MWeb/Account/ChangeSignature',
  Account_SetPassword: APIDomain + '/MWeb/Account/SetPassword',
  Account_GetMyIndex: APIDomain + '/MWeb/Account/GetMyIndex',
  Account_GetBackgroundImage: APIDomain + '/MWeb/Account/GetBackgroundImage',
  Account_ChangeBackgroundImg: APIDomain + '/MWeb/Account/ChangeBackgroundImg',
  Account_CheckPassword: APIDomain + '/MWeb/Account/CheckPassword',
  Account_ModifyPassword: APIDomain + '/MWeb/Account/ModifyPassword',
  Account_SignOut: APIDomain + '/MWeb/Account/SignOut',
  Account_CheckValidCode: APIDomain + '/MWeb/Account/CheckValidCode',
  Account_CheckLoginByConnect: APIDomain + '/MWeb/Account/CheckLoginByConnect',
  Account_AddConnectMBRBase: APIDomain + '/MWeb/Account/AddConnectMBRBase',
  Account_ChangeCategoryDesc: APIDomain + '/MWeb/Account/ChangeCategoryDesc',
  Account_GetBindInfo: APIDomain + '/MWeb/Account/GetBindInfo',
  Account_RemoveBindingConnect: APIDomain + '/MWeb/Account/RemoveBindingConnect',
  Account_BindingConnect: APIDomain + '/MWeb/Account/BindingConnect',
  Account_GetRecommendBase: APIDomain + '/MWeb/Account/GetRecommendBase',
  Account_GetCouponList: APIDomain + '/MWeb/Account/GetCouponList',
  Account_GetCouponCount: APIDomain + '/MWeb/Account/GetCouponCount',
  Account_GetCouponListByOrderId: APIDomain + '/MWeb/Account/GetCouponListByOrderId',
  Account_GetCouponProductList: APIDomain + '/MWeb/Account/GetCuponProductList',

  Account_GetIMAutoReminder: APIDomain + '/MWeb/Account/GetIMAutoReminder',
  Account_GetInvitationCode: APIDomain + '/MWeb/Account/GetInvitationCode',
  Account_GetInvitationCodeDetail: APIDomain + '/MWeb/Account/GetInvitationCodeDetail',
  Account_CheckPromotionCode: APIDomain + '/MWeb/Account/CheckPromotionCode',
  Account_SetTGCode: APIDomain + '/MWeb/Account/SetTGCode',
  Account_GetBounty: APIDomain + '/MWeb/Account/GetBounty',
  // 查询接口
  Search_GetHotSearch: APIDomain + '/MWeb/Search/GetHotSearch',
  Search_GetProduct: APIDomain + '/MWeb/Search/GetProduct',
  Search_GetRealTimeProduct: APIDomain + '/MWeb/Search/GetProductSuggestion',
  // 商品接口
  Goods_GetBaseListByProductId: APIDomain + '/MWeb/Goods/GetBaseListByProductId',
  Goods_GetBaseConsigneeByUserId: APIDomain + '/MWeb/Goods/GetBaseConsigneeByUserId',
  Goods_GetData: APIDomain + '/MWeb/Goods/GetData',
  Goods_GetZulinByGoodsId: APIDomain + '/MWeb/Goods/GetZulinByGoodsId',
  Goods_GetZMXYByGoodsId: APIDomain + '/MWeb/Goods/GetZMXYByGoodsId',
  Goods_GetPinTuanByGoodsId: APIDomain + '/MWeb/Goods/GetPinTuanByGoodsId',
  CommentBase_GetList: APIDomain + '/MWeb/CommentBase/GetList',
  // 积分接口
  Points_GetBaseList: APIDomain + '/MWeb/Points/GetBaseList',
  Points_GetCommonPayById: APIDomain + '/MWeb/Points/GetCommonPayById',
  // 微信相关接口
  WeiXin_GetJsApiParam: APIDomain + '/MWeb/WeiXin/GetJsApiParam',
  WeiXin_GetOauthUrl: APIDomain + '/MWeb/WeiXin/GetOauthUrl',
  WeiXin_GetJsApiConfig: APIDomain + '/MWeb/WeiXin/GetJsApiConfig',
  WeiXin_GetOrderId: APIDomain + '/MWeb/WeiXin/GetOrderId',
  WeiXin_XCXGetOrderId: APIDomain + '/MWeb/WeiXin/XCXGetOrderId',
  WeiXin_GetInfoByOpenId: APIDomain + '/MWeb/WeiXin/GetInfoByOpenId',
  WeiXin_GetOpenId: APIDomain + '/MWeb/WeiXin/GetOpenId',
  WeiXin_GetUserInfo: APIDomain + '/MWeb/WeiXin/GetUserInfo',
  // 订单接口
  Order_AddBase: APIDomain + '/MWeb/Order/AddBase',
  Order_GetBaseById: APIDomain + '/MWeb/Order/GetBaseById',
  Order_Pay: APIDomain + '/MWeb/Order/Pay',
  Order_GetPayState: APIDomain + '/Mweb/Order/GetPayStateById',
  Order_GetMyList: APIDomain + '/MWeb/Order/GetMyList',
  Order_CancelBase: APIDomain + '/MWeb/Order/CancelBase',
  Order_GetBaseDetailByID: APIDomain + '/MWeb/Order/GetBaseDetailByID',
  Order_GetRefundByOrderGoodsId: APIDomain + '/MWeb/Order/GetRefundByOrderGoodsId',
  Order_ApplyRefund: APIDomain + '/MWeb/Order/ApplyRefund',
  Order_CancelRefund: APIDomain + '/MWeb/Order/CancelRefund',
  Order_GetReplyByOrderId: APIDomain + '/MWeb/Order/GetReplyByOrderId',
  Order_ReplyRefundByOrderId: APIDomain + '/MWeb/Order/ReplyRefundByOrderId',
  Order_ConfirmExpress: APIDomain + '/MWeb/Order/ConfirmExpress',
  Order_GetRefundListByOrderGoodsId: APIDomain + '/MWeb/Order/GetRefundListByOrderGoodsId',
  Order_CheckPayment: APIDomain + '/MWeb/Order/CheckPayment',
  Order_ReminderDelivery: APIDomain + '/MWeb/Order/ReminderDelivery',
  Order_GetMyRefundList: APIDomain + '/MWeb/Order/GetMyRefundList',
  Order_DeteleBase: APIDomain + '/MWeb/Order/DeteleBase',
  Order_GetRefundGoods: APIDomain + '/MWeb/Order/GetRefundGoods',
  Order_ApplyGoodsRefund: APIDomain + '/MWeb/Order/ApplyGoodsRefund',
  Order_GetPayDetailById: APIDomain + '/MWeb/Order/GetPayDetailById',
  Order_AddOrderParent: APIDomain + '/MWeb/Order/AddOrderParent',
  Order_AddZulinBase: APIDomain + '/MWeb/Order/AddZulinBase',
  Order_GetCashPledgeList: APIDomain + '/MWeb/Order/GetCashPledgeList',
  Order_ExchangeCashPledge: APIDomain + '/MWeb/Order/ExchangeCashPledge',
  Order_GetLeaseRefundGoods: APIDomain + '/MWeb/Order/GetLeaseRefundGoods',
  Order_LeaseApplyRefund: APIDomain + '/MWeb/Order/LeaseApplyRefund',
  Order_CancelLeaseRefund: APIDomain + '/MWeb/Order/CancelLeaseRefund',
  Order_GetZuLin: APIDomain + '/MWeb/Order/GetZuLin',
  Order_AddZMXYBase: APIDomain + '/MWeb/Order/AddZMXYBase',
  Order_GetZMXYPolicy: APIDomain + '/MWeb/Order/GetZMXYPolicy',
  // 主页接口

  // 支付宝接口
  Alipay_Pay: APIDomain + '/MWeb/Alipay/Pay',
  Alipay_AppPay: APIDomain + '/MWeb/Alipay/AppPay',
  // SSO接口
  SSO_GetSSOInfo: APIDomain + '/MWeb/SSO/GetSSOInfo',
  // 数据统计接口
  BehaviorAnalysis_AddPageVisit: APIDomain + '/MWeb/BehaviorAnalysis/AddPageVisit',
  BehaviorAnalysis_AddPageDuration: APIDomain + '/MWeb/BehaviorAnalysis/AddPageDuration',
  // 优选商品接口
  Preferred_GetPreferredList: APIDomain + '/MWeb/Preferred/GetPreferredList',
  Preferred_GetBannerList: APIDomain + '/MWeb/Common/GetBannerList',
  Preferred_GetBaseById: APIDomain + '/MWeb/Preferred/GetBaseById',
  Preferred_GetProductListById: APIDomain + '/MWeb/Preferred/GetProductListById',

  // 购物车相关接口
  ShoppingCart_Add: APIDomain + '/MWeb/MBRShoppingCart/AddBase',
  ShoppingCart_GetMyList: APIDomain + '/MWeb/MBRShoppingCart/GetMyList',
  ShoppingCart_Update: APIDomain + '/MWeb/MBRShoppingCart/Update',
  ShoppingCart_Delete: APIDomain + '/MWeb/MBRShoppingCart/Delete',

  // 芝麻信用接口
  AlipayZMXY_RentCreate: APIDomain + '/MWeb/AlipayZMXY/RentCreate',
  AlipayZMXY_ReserveSeat: APIDomain + '/MWeb/AlipayZMXY/ReserveSeat',
  AlipayZMXY_GetProductDetail: APIDomain + '/MWeb/AlipayZMXY/GetProductDetail',
  AlipayZMXY_GetBaseListByProductId: APIDomain + '/MWeb/AlipayZMXY/GetBaseListByProductId',
  AlipayZMXY_ApplyRentCreate: APIDomain + '/MWeb/AlipayZMXY/ApplyRentCreate',

  // 拼团接口
  PinTuan_ProductDetail: APIDomain + '/MWeb/PinTuan/GetProductDetail',
  PinTuan_GetGoodListByProductId: APIDomain + '/MWeb/PinTuan/GetGoodListByProductId',
  PinTuan_GetGroupList: APIDomain + '/MWeb/PinTuan/GetGroupList',
  PinTuan_GetGroupDetail: APIDomain + '/MWeb/PinTuan/GetGroupDetail',
  PinTuan_GetActivityRule: APIDomain + '/MWeb/PinTuan/GetActivityRule',
  PinTuan_GetOrderList: APIDomain + '/MWeb/PinTuan/GetOrderList',
  PinTuan_GetRefundList: APIDomain + '/MWeb/PinTuan/GetRefundList',
  PinTuan_AddOrderBase: APIDomain + '/MWeb/PinTuan/AddOrderBase',

  // 呗圈
  BeiQuan_GetNewsList: APIDomain + '/MWeb/Search/GetArticleBase',
  BeiQuan_GetNewDetail: APIDomain + '/MWeb/BeiQuan/GetNewDetail',
  BeiQuan_BasePraise: APIDomain + '/MWeb/BeiQuan/BasePraise',

  // 本地生活
  LocalLife_GetActivityDetail: APIDomain + '/MWeb/LocalLife/GetActivityDetail',
  LocalLife_JoinActivity: APIDomain + '/MWeb/LocalLife/JoinActivity',
  LocalLife_GetMyActivityList: APIDomain + '/MWeb/LocalLife/GetMyActivityList',
  LocalLife_GetActivityPlays: APIDomain + '/MWeb/LocalLife/GetActivityPlays',
  LocalLife_GetTypeList: APIDomain + '/MWeb/LocalLife/GetTypeList',
  LocalLife_GetCityList: APIDomain + '/MWeb/LocalLife/GetCityList',
  LocalLife_GetLightCity: APIDomain + '/MWeb/LocalLife/GetLightCity',
  LocalLife_SetLightCity: APIDomain + '/MWeb/LocalLife/SetLightCity',
  LocalLife_GetList: APIDomain + '/MWeb/LocalLife/GetList',
  // 图文管理
  DocumentBase_GetByCode: APIDomain + '/Mweb/DocumentBase/GetByCode',
  // 极光推送所需tag前缀
  SysConfig_GetJpushTagprevfix: APIDomain + '/MWeb/SysConfig/GetJpushTagprevfix'

}
