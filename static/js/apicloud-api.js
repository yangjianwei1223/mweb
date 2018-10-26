var apicloudready = new function () {

    this.Init = function () {
        var header = $api.byId('header');
        $api.fixStatusBar(header);
        var headerH = $api.offset(header).h;
        var footerH = 0;
        var frameH = api.winHeight - headerH - footerH;
        
        var isAndroid = (/android/gi).test(navigator.appVersion);
        if (!isAndroid && $api.fixTabBar(footer)>0){
            api.openFrame({
                name: 'main',
                url: 'https://t-mweb.95laibei.com?AppType=12&AppChannel=' + apicloud_config.AppChannel,
                bounces: false,
                allowEdit: true,
                rect: {
                    x: 0,
                    y: 0,
                    w: 'auto',
                    h: 'auto',
                    marginBottom: 34
                }
            });
        } else {
            api.openFrame({
                name: 'main',
                url: 'https://t-mweb.95laibei.com?AppType=12&AppChannel=' + apicloud_config.AppChannel,
                bounces: false,
                allowEdit: true,
                rect: {
                    x: 0,
                    y: 0,
                    w: 'auto',
                    h: 'auto'
                }
            });
        }
        //app回退事件暂不处理
        //api.addEventListener({
        //    name: 'keyback'
        //}, function (ret, err) {
        //    var js = 'api.closeWidget();';
        //    api.execScript({
        //        frameName: 'main',
        //        script: 'Global_ReturnHelper.APPReturnHistoryPage()'
        //    });
        //});

        api.setStatusBarStyle({
            style: 'light'
        });
        //推送
        var ajpush = api.require('ajpush');
        if (ajpush != undefined&&ajpush != null) {
            if (api.systemType != 'ios') {
                ajpush.init(function (ret) {
                    if (ret && ret.status) {
                        //success
                    } else {
                        alert('推送模块加载失败');
                    }
                });

                api.addEventListener({
                    name: 'appintent'
                }, function (ret, err) {
                    if (ret && ret.appParam.ajpush) {
                        var ajpush = ret.appParam.ajpush;
                        //var id = ajpush.id;
                        //var title = ajpush.title;
                        //var content = ajpush.content;
                        //var extra = ajpush.extra;
                        ajpush_listener_callback(2, ajpush);
                    }
                });

            } else {
                api.addEventListener({
                    name: 'noticeclicked'
                }, function (ret, err) {
                    if (ret && ret.value) {
                        var ajpush = ret.value;
                        //var content = ajpush.content;
                        //var extra = ajpush.extra;
                        ajpush_listener_callback(1, ajpush);

                    }

                });
            }

            ajpush.setListener(
             function (ret) {
                 //var id = ret.id;
                 //var title = ret.title;
                 //var content = ret.content;
                 //var extra = ret.extra;
                 //alert(JSON.stringify(ret));
                 ajpush_listener_callback(0, ret);

             });


            var ajpush_listener_callback = function (type, ajpush) {
                var isRun = false;
                var content = ajpush.content;
                ajpush.content = content.replace(/\n/g, "@_@");//回车字符处理
                api.setFrameClient({
                    frameName: 'main'
                }, function (ret, err) {
                    switch (ret.state) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            var jsfun = 'JpushCallBack(' + type + ',\'' + JSON.stringify(ajpush) + '\');';
                            api.execScript({
                                frameName: 'main',
                                script: jsfun
                            });
                            isRun = true;
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                        default:
                            break;
                    }
                });

                if (!isRun) {
                    var jsfun = 'JpushCallBack(' + type + ',\'' + JSON.stringify(ajpush) + '\');';
                    api.execScript({
                        frameName: 'main',
                        script: jsfun
                    });
                }
            }
        }
    }
}