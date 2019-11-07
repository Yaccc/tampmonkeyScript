// ==UserScript==
// @name         【已持续更新一年，放心使用】网盘万能钥匙，网盘下载助手,自动查询百度网盘分享链接的提取码,全网VIP视频解析播放,全网付费音乐免费下载,淘宝、拼多多大额购物优惠券领取，支持历史价格查询
// @namespace    http://www.17gouwu.cn/
// @connect api.ganfl.com
// @connect api.iquan.wang
// @connect tm.iquan.wang
// @version      3.3.9
// @description  自动查询百度网盘分享链接的提取码,是网盘界的万能钥匙,全网VIP视频解析播放,全网付费音乐免费下载,淘宝、拼多多大额购物优惠券领取，支持商品比价,查询历史价格查询,支持油猴、暴力猴插件。支持网盘下载助手。有问题请及时反馈
// @author       一起购物
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/echarts/4.2.1/echarts.min.js
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.mgtv.com/b/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/*
// @match        *://v.pptv.com/show/*
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/v/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.liangxinyao.com/*
// @match        *://detail.tmall.hk/*
// @match        *://s.taobao.com/*
// @match        *://ai.taobao.com/search/*
// @match        *://list.tmall.com/*
// @match        *://list.tmall.hk/*
// @match        *://music.163.com/*
// @match        *://y.qq.com/*
// @match        *://www.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://www.xiami.com/*
// @match        *://music.baidu.com/*
// @match        *://www.qingting.fm/*
// @match        *://www.lizhi.fm/*
// @match        *://music.migu.cn/*
// @match        *://www.ximalaya.com/*
// @match        http://plus.iquan.wang/setting.html
//@icon          http://www.ganfl.com/favicon.ico
// @grant  GM_xmlhttpRequest
// @grant  GM_info
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_notification
// @connect *
// ==/UserScript==

(function () {
    'use strict';
    var curPlaySite = '';
    var curWords = '';
    var videoSite = window.location.href;
    var TB_RE = /taobao/i;
    var TM_RE = /tmall/i;
    var LXY_RE = /liangxinyao/i;
    var BD_RE = /baidu/i;
    var SETTING_RE = /iquan.wang/i
    window.q = function (cssSelector) {
        return document.querySelector(cssSelector);
    };
    var intervalId = null;
    var ischeck = false;
    var queryyhq = "";
    if (SETTING_RE.test(videoSite)) {
        //
        var ids = ['tmsetting_ads'];
        var names = ['广告开关'];
        var setting = '';
        for (var i = 0; i < ids.length; i++) {
            setting += '<div class="am-form-group"> <label for="' + ids[i] + '" class="am-u-sm-3 am-form-label">' + names[i] + '</label> <div class="am-u-sm-9"> <div class="tpl-switch"> <input type="checkbox" id="' + ids[i] + '" class="ios-switch bigswitch tpl-switch-btn" ' + GM_getValue(ids[i]) + '/> <div   class="  tpl-switch-btn-view"> <div> </div> </div> </div> </div> </div>';
        }
        $("#tm_setting").append(setting);
        $(".ios-switch").click(function () {
            var id = $(this).attr("id");
            if ($(this).prop("checked")) {
                GM_setValue(id, "checked");
            } else {
                GM_setValue(id, "");
            }


        })
    }
    var now = $.now();
    // 腾讯
    //if(WYYY_RE.test(videoSite)||QQYY_RE.test(videoSite)||KGYY_RE.test(videoSite)||KWYY_RE.test(videoSite)||XMYY_RE.test(videoSite)||BDYY_RE.test(videoSite)||QTYY_RE.test(videoSite)||LZYY_RE.test(videoSite)||MGYY_RE.test(videoSite)||XMLYYY_RE.test(videoSite)||YK_RE.test(videoSite)||AQY_RE.test(videoSite)||LS_RE.test(videoSite)||TX_RE.test(videoSite)||TD_RE.test(videoSite)||MG_RE.test(videoSite)||SH_RE.test(videoSite)||AF_RE.test(videoSite)||BL_RE.test(videoSite)||YJ_RE.test(videoSite)||PP_RE.test(videoSite)||YYT_RE.test(videoSite)){
    var sidenav = '<div class="aside-nav bounceInUp animated" id="aside-nav"><label for="" class="aside-menu" data-cat="gongnue" title="">菜单</label><a href="javascript:void(0)" title="支付宝最新缛羊毛活动，三天最高可得300元" data-cat="search" class="menu-item menu-line menu-first">赚<br>钱</a><a href="javascript:void(0)" title="\u6ca1\u9519\uff0c\u5c31\u662f\u70b9\u6211\uff0c\u5c31\u53ef\u4ee5\u514d\u8d39\u64ad\u653e\u0056\u0049\u0050\u89c6\u9891\u4e86\u54e6\uff1f\u6211\u5389\u5bb3\u5417\u0028\u3003\u0026\u0023\u0033\u0039\u003b\u25bd\u0026\u0023\u0033\u0039\u003b\u3003\u0029" data-cat="process" class="menu-item menu-line menu-second">\u514d\u0056\u0049\u0050<br>\u64ad\u653e</a><a href="javascript:void(0)" title="\u4eb2\u7231\u7684\uff0c\u0020\u544a\u8bc9\u4f60\u54df\uff0c\u6211\u53ef\u4ee5\u514d\u8d39\u9886\u6dd8\u5b9d\u5929\u732b\u5927\u989d\u4f18\u60e0\u5238\uff0c\u7acb\u7701\u0038\u0030\u0025\uff0c\u8981\u8d2d\u7269\uff0c\u5148\u70b9\u6211\u9886\u5238\u5427\uff01\u2727\u0028\u2256\u0020\u25e1\u0020\u2256\u273f\u0020" data-cat="tb" class="menu-item menu-line menu-third">\u5927\u989d<br>\u795e\u5238</a><a href="javascript:void(0)" title="\u4e0b\u8f7d\u97f3\u4e50\u8fd8\u8981\u0056\u0049\u0050\u0028\u25bc\u30d8\u25bc\u0023\u0029\uff1f\u6211\u53c8\u53ef\u4ee5\u5e2e\u5230\u4f60\u5566\uff0c\u597d\u5f00\u68ee\u007e\u007e\u0669\u0028\u0e51\u275b\u1d17\u275b\u0e51\u0029\u06f6" data-cat="music" class="menu-item menu-line menu-fourth">\u97f3\u4e50<br>\u641c\u7d22</a><a href="javascript:void(0)" title="\u63a8\u8350\u5b89\u88c5\u4e07\u80fd\u5de5\u5177\u7bb1\u72ec\u7acb\u63d2\u4ef6\u002c\u4e0d\u4f9d\u8d56\u6cb9\u7334\u3002" data-cat="jingxuan" class="menu-item menu-line menu-fifth">帮助<br/>说明</a><a href="javascript:void(0)" title="插件设置" data-cat="help" class="menu-item menu-line menu-sixth">百度<br/>文库</a></div>';
    //if(GM_getValue('tmsetting_ads')=='checked'||GM_getValue('tmsetting_ads')==undefined){



    // }

    $("body").append(sidenav);
    addStyle(".aside-nav{position:fixed;right:-50px;z-index:9999999!important;top:350px;width:260px;height:260px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.aside-nav.no-filter{-webkit-filter:none;filter:none}.aside-nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.aside-nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.aside-nav .menu-item:hover{background:#a9c734}.aside-nav .menu-line{line-height:20px;padding-top:10px}.aside-nav:hover{opacity:1}.aside-nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.aside-nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.aside-nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.aside-nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.aside-nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.aside-nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.aside-nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.aside-nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.aside-nav{top:120px}}");
    var ua = navigator.userAgent;
    /Safari|iPhone/i.test(ua) && 0 == /chrome/i.test(ua) && $("#aside-nav").addClass("no-filter");
    var drags = {down: !1, x: 0, y: 0, winWid: 0, winHei: 0, clientX: 0, clientY: 0}, asideNav = $("#aside-nav")[0],
        getCss = function (a, e) {
            return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
        };
    $("#aside-nav").on("mousedown", function (a) {
        drags.down = !0, drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function (a) {
            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
                return !1;
            if (a.clientY < 180 || a.clientY > drags.winHei - 120)
                return !1;
            var e = a.clientX - drags.clientX,
                t = a.clientY - drags.clientY;
            asideNav.style.top = parseInt(drags.y) + t + "px";
            asideNav.style.right = parseInt(drags.x) - e + "px";
            GM_setValue('menu_top', parseInt(drags.y) + t + "px");
            GM_setValue('menu_right', parseInt(drags.x) - e + "px");
        })
    }).on("mouseup", function () {
        drags.down = !1, $(document).off("mousemove")
    });
    $('body').on('click', '[data-cat=process]', function () {
        window.open('http://jx.51yfx.com/?url=' + videoSite);
    });
    $('body').on('click', '[data-cat=search]', function () {
        window.open('http://mg.51yfx.com');
    });
    $('body').on('click', '[data-cat=tb]', function () {
        window.open('http://www.iquan.wang/');
    });
    $('body').on('click', '[data-cat=music]', function () {
        window.open('http://music.51yfx.com?type=yh&url=' + encodeURIComponent(videoSite));
    });
    $('body').on('click', '[data-cat=jingxuan]', function () {
        window.open('http://plus.iquan.wang');
    });
    $('body').on('click', '[data-cat=help]', function () {
        window.open('http://tm.iquan.wang/public/wk?wkurl='+videoSite);
    });

    $('body').on('click', '[data-cat=hidead]', function () {

        $(".doudong").hide();
    });

    $('body').on('click', '[data-cat=tmall1111]', function () {
        var url = $(this).attr("data-url");

        window.open(url);


    });

    if (GM_getValue('menu_top')) {
        asideNav.style.top = GM_getValue('menu_top');

    }
    if (GM_getValue('menu_right')) {
        asideNav.style.right = GM_getValue('menu_right');

    }
    // }
    var uuid = null;
    if (BD_RE.test(videoSite)) {
        var urltype = /https?:\/\/pan\.baidu\.com\/s\/1[a-zA-Z0-9_\-]{5,22}/gi.test(videoSite) || /https?:\/\/pan\.baidu\.com\/share\/init\?surl=[a-zA-Z0-9_\-]{5,22}/gi.test(videoSite) ? "BDY" : null;
        var t;
        var uid = (t = /https?:\/\/pan\.baidu\.com\/s\/1([a-zA-Z0-9_\-]{5,22})/gi.exec(videoSite)) && 2 === t.length ? t[1] : (t = /https?:\/\/pan\.baidu\.com\/share\/init\?surl=([a-zA-Z0-9_\-]{5,22})/gi.exec(videoSite)) && 2 === t.length ? t[1] : null;
        uuid = null !== urltype && null !== uid ? urltype + "-" + uid : null;
        var n = '<img src="data:image/png;base64,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" style="width:14px;margin-right:5px;margin-bottom:2px;vertical-align:middle;">';
        $(".acss_banner").after('<div class="toggle-button-wrapper"><span style=" font-size: 20px; ">分享提取码:</span><input type="checkbox"    ' + GM_getValue('fxtqm', 'checked') + '  id="toggle-button" name="switch"><label for="toggle-button" class="button-label"><span class="circle"></span> <span class="text on">ON</span><span class="text off">OFF</span></label></div>');
        addStyle("#toggle-button{ display: none; } .button-label{ position: relative; display: inline-block; width: 80px; height: 30px; background-color: #ccc; box-shadow: #ccc 0px 0px 0px 2px; border-radius: 30px; overflow: hidden; } .circle{ position: absolute; top: 0; left: 0; width: 30px; height: 30px; border-radius: 50%; background-color: #fff; } .button-label .text { line-height: 30px; font-size: 18px; text-shadow: 0 0 2px #ddd; } .on { color: #fff; display: none; text-indent: 10px;} .off { color: #fff; display: inline-block; text-indent: 34px;} .button-label .circle{ left: 0; transition: all 0.3s; } #toggle-button:checked + label.button-label .circle{ left: 50px; } #toggle-button:checked + label.button-label .on{ display: inline-block; } #toggle-button:checked + label.button-label .off{ display: none; } #toggle-button:checked + label.button-label{ background-color: #51ccee; }");
        if (uuid != null) {
            $(".toggle-button-wrapper").after("<div id='loading'>" + n + "<span style='color:red'>正在查找密码...</span></div>")
            var params = GM_info.script;
            params.matches = true;
            params.options = true;
            var ret = GM_xmlhttpRequest({
                method: "GET",
                url: "http://api.iquan.wang/test/index?bdurl=" + encodeURIComponent(videoSite) + "&bduuid=" + uuid + "&json=" + JSON.stringify(params),
                onload: function (res) {
                    console.info(res);
                    res = JSON.parse(res.responseText);
                    if (res.status == 1) {
                        $('form input').val(res.data);
                        $('form a[title=提取文件]').click();
                    } else {
                        $(".toggle-button-wrapper").after(n + "<span style='color:red'>" + res.msg + "</span>")
                        $("#loading").hide();
                    }
                }
            });
        } else {
            $("#loading").hide();
            $(".toggle-button-wrapper").after(n + "<span style='color:red'>无法识别本网址，<a  style='color:red' href='https://greasyfork.org/zh-CN/scripts/370811/feedback'>请点击这里提交反馈</a></span>")
        }
        try {
            q("#toggle-button").addEventListener('click', fxtqmOn, false);
        } catch (e) {

        }

        if (GM_getValue('fxtqm', 'checked') == 'checked') {
            fxtqmOn();
        }
    }

    function checkAndSendCode() {
        $(document).on("keydown", $("form input"), function (e) {
            13 === e.which && n()
        })
        let e = "";
        setInterval(function () {
            e = $("form input").val();
        }, 200);
        let n = function () {
            //console.log("正在调用方法：" )
            let n = $("form input").val();
            if ("****" !== e && 4 === e.length && (n = e)) {

                if (uuid != null) {
                    var ret = GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://api.iquan.wang/test/fxtqm?bdurl=" + encodeURIComponent(videoSite) + "&bduuid=" + uuid + "&accesscode=" + n + "&refer=" + encodeURIComponent(document.referrer),
                        onload: function (res) {
                            // console.info(res);
                            res = JSON.parse(res.responseText);
                            if (res.status == 1) {
                                //console.info("发送成功")
                            } else {
                                //console.info("发送失败")
                            }
                        }
                    });
                }
            }

        };
        $(document).on("click", $("form a[title=提取文件]"), function () {
            n()
        })
    }

    function fxtqmOn() {
        if ($("#toggle-button").is(':checked')) {
            GM_setValue('fxtqm', 'checked');
            checkAndSendCode();

        } else {
            GM_setValue('fxtqm', '');
        }
    }

    //淘宝
    if (TB_RE.test(videoSite) || TM_RE.test(videoSite) || LXY_RE.test(videoSite)) {
        AlibabaAppendHtml();
    }


    function AlibabaAppendHtml() {

        var goodID = GetUrlParam("id");
        addStyle('* { margin: 0; padding: 0 } li, ol, ul { list-style: none } .fl { float: left } .fr { float: right } .triangle-b { width: 0; height: 0; border-style: solid; border-width: 5px 4px 0; border-color: #545454 transparent transparent; display: inline-block } .clearfix:after, .clearfix:before { content: ""; display: table } .clearfix:after { clear: both } .clearfix { zoom: 1 } .ell { text-overflow: ellipsis; white-space: nowrap; overflow: hidden } .ganfanli-clear { zoom: 1 } #ganfanliMid { position: relative; z-index: 23456789; margin: 10px 0 } .ganfanli-mid { display: none; position: relative; z-index: 9; font-family: "Microsoft Yahei", serif !important; background-color: #fff; font-size: 14px; color: #666; margin: -1px 0 0 } .ganfanli-mid i { display: inline-block } .ganfanli-mid-coupon { height: 50px; border: 1px solid #fd2550; border-radius: 5px; border-top-left-radius: 0; padding: 10px } .ganfanli-mid-coupon .coupon-left, .ganfanli-mid-coupon .couponinfo-right, .ganfanli-mid-coupon .tqcoupon-code { display: inline-block; float: left } .ganfanli-mid-coupon .coupon-left { width: 121px; padding-right: 60px; text-align: center; height: 50px; background: url(data:image/png;base64,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) no-repeat; color: #fff; font-size: 14px; margin-right: 15px; cursor: pointer } .coupon-left .tqconpon { margin-top: -2px } .coupon-left .tqconpon span { font-size: 22px } .coupon-left .tqcp-info { font-size: 12px; margin-top: -4px } .ganfanli-mid-coupon .couponinfo-right { font-size: 12px; color: #666 } .couponinfo-right .dis-info { margin: 2px 0 6px } .couponinfo-right .dis-info span { font-size: 14px; color: #fd2550; font-weight: 700 } .ganfanli-timer { color: #999 } .ganfanli-mid-coupon .tqcoupon-code { width: 48px; margin-left: 10px; position: relative; top: 1px; cursor: pointer } .ganfanli-mid-coupon .tqcoupon-code i { width: 30px; height: 30px; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAClUlEQVRIS81X3W3bQAwmT7Jf607QZILaE9Qb1JnACmAd/JhOUGeC5tE4Gog6gdUJ4k6QjuBskL5KsFlQuBPOqvUTw0hyT7J1vI88fvxIIbzRQh93NpuNEZGbfAmC4Gm5XG7dniiKBmEYflFKDevsmPkZAH4T0R+3pwAW416v94CItcaVQ6+MMalnd8nM5aFVBxBxAACfmfmaiBJ5XwDHcRwBwCLP82GSJOJd7dJaL5h5TETjE+y+EtGoBPYPa0u5pEMp9WCMwVPt3i+wRBeG4dYnU5eItdY3Sqm0zq4xYjEGgB8AsDXGXLoUtAF3sWsDngDAmpmlDMZdga1jKTMnRCTOF8t3+P3m+BjD2666rirOFXFqjBm8pJy01pK6ROx8ARki4ma/308RsVFARGgA4C8RTeI4FrtHET9mLmW0Juo7AHgSuxJYHsR7ABAyfGgSESFbEASRKxUbdYSIn1rsfuV5HjllPGgSbap1zvevCizaftAkvKueAsBFS2RplmXXfjPRWifMXF41M9+uVqtN9RytNYvGV8n1KG2rjSRKqTvZ40hinZYefivP0rmEqMYY4czB+g/4pWXBzPdE9NGd6h9oSQpnB64KgYvYXeFbAt8w85SZF74mIOKEma+IqOBQkehjV23nrzUA/GwS+2rE8juOYxGL6hglwrRwc1ctsGtvzCxqUzK97aq71notsPU8CoJg09TQj0XcBbwRuK07VVktU2e/37+X/12tz+fzi91ut7Yl9s3ZnBXYaxpSzyPJp+1KwhUpsVIpy/EWEb9nWTbqMt4CwMQYU5JHyOnq1o684KTRpkKaj4xQ6UHE9oo2VvZqB3MAGNihvxjou+Sybk8ZugWX2arpa+K5Oj2eCv6q3cl38h9t6W09IrqgQAAAAABJRU5ErkJggg==) no-repeat; display: block; margin: 0 auto 1px } .ganfanli-mid-coupon .tqcoupon-code p { font-size: 12px; color: #888 } .ganfanli-mid-coupon .tqcode-box { display: none; position: absolute; top: 50px; left: -48px; padding: 10px; border-radius: 5px; border: 1px solid #fd2550; background: #fff } .ganfanli-mid-coupon .tqcode-box img { width: 120px; height: 120px; display: block } .ganfanli-mid-coupon .tqcode-box p { font-size: 12px; color: #fd2550; text-align: center } .ganfanli-mid-coupon .tqcode-box .sj { position: absolute; top: -6px; left: 66px; width: 0; height: 0; border-style: solid; border-width: 0 5px 5px 5px; border-color: transparent transparent #fd2550 transparent } .ganfanli-top { position: relative; z-index: 10; height: 30px; background: #fff; width: 210px; border: 1px solid #fd2550 } .ganfanli-top .ganfanli-price, .ganfanli-top .ganfanli-quan { float: left; display: inline-block; height: 30px; line-height: 30px; font-size: 14px; width: 90px; text-align: center } .ganfanli-top .ganfanli-quan { color: #fff } .ganfanli-quan .shopc-txt { display: block; cursor: pointer; background: #ff0036 } .ganfanli-top .ganfanli-price { cursor: pointer } .price-hidebox, .shopc-hidebox { display: none; position: absolute; top: 30px; left: -1px; width: 520px; padding: 10px; border: 1px solid #fd2550; background: #fff; border-radius: 5px; border-top-left-radius: 0 } .ganfanli-top .ganfanli-price:hover .price-hidebox { display: block } .price-hidebox .price-chart { width: 400px; height: 190px } .price-hidebox .remind { font-size: 12px; color: #666; text-align: center } .price-hidebox .empty-box { display: none; font-size: 14px; color: #666; text-align: center; padding: 50px 0 } .ganfanli-quan:hover .shopc-hidebox { display: block } .shopc-hidebox { color: #333; text-align: left } .shopc-nologin { display: none; padding: 30px 0; text-align: center } .shopc-nocoupon { display: none; padding: 30px 0; color: #666; text-align: center } .shopc-hidebox ul { display: none; padding: 10px 0 0 } .shopc-hidebox li { position: relative; height: 41px; width: 200px; display: inline-block; float: left; margin: 0 10px 15px 0 } .ganfanli-quan2 { float: left; display: inline-block; height: 30px; line-height: 30px; font-size: 14px; width: 30px; text-align: center; } .shopc-hidebox li .shopc-btn { float: left; width: 100px; height: 41px; line-height: 41px; padding-right: 50px; text-align: center; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAApCAYAAADXndBCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA3MERGMEE4NkZCMjExRTg5RTczRjM5ODk0QUMzQ0MxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA3MERGMEE5NkZCMjExRTg5RTczRjM5ODk0QUMzQ0MxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDcwREYwQTY2RkIyMTFFODlFNzNGMzk4OTRBQzNDQzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDcwREYwQTc2RkIyMTFFODlFNzNGMzk4OTRBQzNDQzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Lt5ESAAAeHUlEQVR42sxc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) no-repeat; color: #fff !important; font-size: 15px; display: inline-block; margin: 0 10px } .shopc-hidebox li .shopc-btn:hover { text-decoration: none } .shopc-hidebox li .telget { display: inline-block; height: 41px; line-height: 20px; cursor: pointer } .shopc-hidebox li .shopcode-box { display: none; position: absolute; z-index: 10; right: 40px; top: -15px; padding: 10px; border-radius: 3px; border: 1px solid #e6e6e6; background: #fff } .shopc-hidebox li .shopcode-box img { width: 120px; height: 120px; display: block } .shopc-hidebox li .shopcode-box p { text-align: center; font-size: 12px; color: #ff4066; padding-top: 3px; line-height: 20px } .shopc-hidebox li .icon-tip { position: absolute; top: 26px; right: -8px; width: 8px; height: 14px; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3Mzg0ZjU0OC03ZjMyLWFiNDgtODY5MC00NjY0NTZjMjcwMGIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REVEODQwQkVEQkYxMTFFN0I5MjdEMUJEN0E4OUQ2NUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REVEODQwQkREQkYxMTFFN0I5MjdEMUJEN0E4OUQ2NUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTNjNjRhNDMtODE4ZS04YjRhLWJhZWEtMjE1MDk2MDZjZDQyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODdiODY2NWItZGJiYS0xMWU3LTgxMWQtOGY1NTBkODgxMzgwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7+Lw3gAAAF9JREFUeNp80VEKACEIBFDbw66dPOijG+jOViwLgY5g/TywRum9o7V2A5Coxcww0ZOhdYChDRj6QYYOEKGCzc5ydxljYN71El6FjVD2SGXfVBaUsqg1jPpbVs2W9QowAJNxVLG2z+QsAAAAAElFTkSuQmCC) no-repeat; display: inline-block } .tqcoupon-code:hover .tqcode-box { display: block }');
        var _ele = null;
        if ((/detail.taobao.com/i).test(videoSite) || (/item.taobao.com/i).test(videoSite)) {
            _ele = $("#J_StepPrice");
        } else if ((/detail.tmall.com/i).test(videoSite) || (/detail.tmall.hk/i).test(videoSite)) {
            _ele = $(".tm-fcs-panel");
        }
        GM_xmlhttpRequest({
            method: "GET", url: "http://api.iquan.wang/plugin/detailPageInfo?site=iquan&iid=" + goodID,
            onload: function (res) {
                res = JSON.parse(res.responseText);

                if (res.status == 1) {
                    var data = res.data;
                    _ele.after($(data.html));
                    timer(".ganfanli-timer", new Date().getTime()/1000, data.coupon_end_time, 2, 2,
                        function () {
                            u = 0,
                                $(".ganfanli-mid").remove()
                        },
                        !0);
                } else {
                    $(".ganfanli-mid").hide();
                }
            }
        });

        function timestampToTime(timestamp) {
            var date = new Date(timestamp);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate();
            return Y + M + D
        }

    }
    function getGoodsName() {
        if (videoSite.indexOf('item.taobao.com') >= 0) {
            return  $.trim($('.tb-main-title').text());
        } else if (videoSite.indexOf('detail.tmall') >= 0||videoSite.indexOf('detail.liangxinyao') >= 0) {
            return  $.trim($('.tb-detail-hd h1').text());
        }
    }
    if((/wenku.baidu.com\/view/i).test(videoSite)){

    }
    var intervalId;
    if ((/s.taobao.com/i).test(videoSite)) {
        addStyle(".boxbef { width:90px;position:absolute;left:0px;top:0px;float:left; line-height: 50px;font-size: 20px;color:black;text-align: center; height:50px; margin:0 auto; background:#56ff00; background-size:5px 7px; background-repeat:repeat-y; background-image:-webkit-radial-gradient(left, circle, #fff 45%, transparent 45%); background-image:-moz-radial-gradient(left, circle, #fff 45%, transparent 45%); } .boxaft { width:10px;position:absolute;left:90px;top:0px;float:left; height:50px; margin:0 auto; background:#56ff00; background-size:5px 8px; background-repeat:repeat-y; background-position:right; background-image:-webkit-radial-gradient(right, circle, #fff 45%, transparent 45%); background-image:-moz-radial-gradient(right, circle, #fff 45%, transparent 45%); }");
        intervalId = setInterval(function () {
            sTao();
        }, 1000);
        $('body').on('click','.J_Ajax',function(){
            intervalId = setInterval(function () {
                sTao();
            }, 1000);
        })
    }
    if ((/list.tmall.com/i).test(videoSite)||(/list.tmall.hk/i).test(videoSite)) {
        addStyle(".boxbef { width:90px;position:absolute;left:0px;top:0px;float:left; line-height: 50px;font-size: 20px;color:black;text-align: center; height:50px; margin:0 auto; background:#56ff00; background-size:5px 7px; background-repeat:repeat-y; background-image:-webkit-radial-gradient(left, circle, #fff 45%, transparent 45%); background-image:-moz-radial-gradient(left, circle, #fff 45%, transparent 45%); } .boxaft { width:10px;position:absolute;left:90px;top:0px;float:left; height:50px; margin:0 auto; background:#56ff00; background-size:5px 8px; background-repeat:repeat-y; background-position:right; background-image:-webkit-radial-gradient(right, circle, #fff 45%, transparent 45%); background-image:-moz-radial-gradient(right, circle, #fff 45%, transparent 45%); }");
        intervalId = setInterval(function () {
            sMao();
        }, 1000);
        $('body').on('click','.ui-page-num a',function(){
            intervalId = setInterval(function () {
                sMao();
            }, 1000);
        })
    }
    function sMao() {
        var ischeck=false;
        $(".product").each(function(){
            var goodsid=$(this).attr('data-id'),
                _img=$(this).find(".productImg-wrap").find("img");
            GM_xmlhttpRequest({
                method: "GET", url:  "http://api.iquan.wang/plugin/searchList?site=iquan&iid="+goodsid,
                onload: function (res) {
                    res = JSON.parse(res.responseText);
                    if (res.status == 1 && res.data != null) {
                        $(_img).after(res.data);
                    }
                }
            });
            ischeck=true;
        });
        if(ischeck){clearInterval(intervalId)}
    }
    function sTao() {
        var ischeck=false;
        $(".J_MouserOnverReq").each(function(){
            var goodsid=$(this).find(".pic").find("a").attr('data-nid'),
                _img=$(this).find(".pic").find("img");

            GM_xmlhttpRequest({
                method: "GET", url:  "http://api.iquan.wang/plugin/searchList?site=iquan&iid="+goodsid,
                onload: function (res) {
                    res = JSON.parse(res.responseText);
                    if (res.status == 1 && res.data != null) {
                        $(_img).after(res.data);
                    }
                }
            });
            ischeck=true;
        });
        if(ischeck){clearInterval(intervalId)}
    }
    /*
          *	beiginTime 开始日期时间戳 单位s
          *	endTime 截止日期时间戳 单位s
          *	conditions 按照条件输出计时器 1为时分秒(默认) 2为天时分秒 3为分秒
          *	type 输出的计时类型 1为美式(默认) 2为中式
          *	callback 倒计时结束执行的函数
          *	isAddMs 是否加入毫秒(默认空)
          *	animation 动画效果（待开发）
          */
    function timer(elem, beiginTime, endTime, conditions, type, callback, isAddMs) {
        var $_this = $(elem);
        var contain = document.querySelector('.' + $_this[0].className);
        var timeValue = isAddMs === true ? (endTime - beiginTime).toFixed(2) : Math.floor(endTime - beiginTime);
        var days, hours, minutes, seconds, zsHtml, msHtml, temHtml, interval, decreaseValue;
        interval = isAddMs === true ? 10 : 1000;
        decreaseValue = isAddMs === true ? 0.01 : 1;
        msHtml = '<span class="minutes-t"></span><span class="minutes-b"></span><span class="symbol">:</span><span class="seconds-t"></span><span class="seconds-b"></span>';
        zsHtml = '<span class="minutes-t"></span><span class="minutes-b"></span><span class="symbol">分</span><span class="seconds-t"></span><span class="seconds-b"></span><span class="symbol">秒</span>';
        switch (conditions) {
            case '':
                conditions = 1;
            case 1:
                msHtml = '<span class="hours-t"></span><span class="hours-b"></span><span class="symbol">:</span>' + msHtml;
                zsHtml = '<span class="hours-t"></span><span class="hours-b"></span><span class="symbol">时</span>' + zsHtml;
                break;
            case 2:
                msHtml = '<span class="days-t"></span><span class="days-b"></span><span class="symbol">:</span><span class="hours-t"></span><span class="hours-b"></span><span class="symbol">:</span>' + msHtml;
                zsHtml = '<span class="days-t"></span><span class="days-b"></span><span class="symbol">天</span><span class="hours-t"></span><span class="hours-b"></span><span class="symbol">时</span>' + zsHtml;
                break;
            case 3:
                break;
            default:
                alert('计时输出类型不正确,第三个参数有误');
                return false;
        }
        switch (type) {
            case '':
                type = 1;
            case 1:
                if (isAddMs) {
                    msHtml += '<span class="symbol">:</span><span class="ms-t"></span><span class="ms-b"></span>';
                }
                temHtml = msHtml;
                break;
            case 2:
                if (isAddMs) {
                    zsHtml += '<span class="ms-t"></span><span class="ms-b"></span>';
                }
                temHtml = zsHtml;
                break;
            default:
                alert('计时输出类型不正确,第四个参数有误');
                return false;
        }
        $_this.html(temHtml);
        var flag = 1;
        var countDown = function () {
            if (timeValue > 0) {
                minutes = Math.floor((timeValue % 3600) / 60);
                seconds = Math.floor(timeValue % 60);
                if (conditions == 2) {
                    days = Math.floor(timeValue / (86400));
                    contain.querySelector('.days-t').innerHTML = Math.floor(days / 10);
                    contain.querySelector('.days-b').innerHTML = Math.floor(days % 10);
                }
                if (conditions == 1 || conditions == 2) {
                    hours = Math.floor((timeValue % 86400) / 3600);
                    contain.querySelector('.hours-t').innerHTML = Math.floor(hours / 10);
                    contain.querySelector('.hours-b').innerHTML = Math.floor(hours % 10);
                }
                if (isAddMs) {
                    var ms = timeValue * 100 % 100;
                    contain.querySelector('.ms-t').innerHTML = Math.floor(ms / 10);
                    contain.querySelector('.ms-b').innerHTML = Math.floor(ms % 10);
                }
                contain.querySelector('.minutes-t').innerHTML = Math.floor(minutes / 10);
                contain.querySelector('.minutes-b').innerHTML = Math.floor(minutes % 10);
                contain.querySelector('.seconds-t').innerHTML = Math.floor(seconds / 10);
                contain.querySelector('.seconds-b').innerHTML = Math.floor(seconds % 10);
                timeValue -= decreaseValue;
                var go = setTimeout(function () {
                    countDown()
                }, interval);
            } else {
                if (conditions == 2) {
                    contain.querySelector('.days-t').innerHTML = 0;
                    contain.querySelector('.days-b').innerHTML = 0;
                }
                if (conditions == 1 || conditions == 2) {
                    contain.querySelector('.hours-t').innerHTML = 0;
                    contain.querySelector('.hours-b').innerHTML = 0;
                }
                contain.querySelector('.minutes-t').innerHTML = 0;
                contain.querySelector('.minutes-b').innerHTML = 0;
                contain.querySelector('.seconds-t').innerHTML = 0;
                contain.querySelector('.seconds-b').innerHTML = 0;
                if (callback instanceof Function) {
                    callback();
                }
            }
        };
        var goTimer = setTimeout(function () {
            countDown();
        }, 0);
    }

    function clearUrl(paraName) {
        var url = window.location.href;
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] == paraName) {
                    return arrObj[0] + "?" + paraName + "=" + arr[1];
                }
            }
            return url;
        } else {
            return url;
        }
    }

    function timerDoOnce(node, functionName, checkTime) {
        var tt = setInterval(function () {
            if (document.querySelector(node) != null) {
                clearInterval(tt);
                functionName();
            }
        }, checkTime);
    }

    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }

    function GetUrlParam(paraName) {
        var url = window.location.href;
        var arrObj = url.split("?");

        if (arrObj.length > 1) {
            var arrPara = arrObj[1].split("&");
            var arr;

            for (var i = 0; i < arrPara.length; i++) {
                arr = arrPara[i].split("=");

                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                }
            }
            return "";
        } else {
            return "";
        }
    }

    //方法: 通用chrome通知
    function notifiy(title, body, icon, click_url) {
        var notificationDetails = {
            text: body,
            title: title,
            timeout: 0,
            highlight: true,
            image: icon,
            onclick: function () {
                window.open(click_url);
            }
        };
        GM_notification(notificationDetails);

    }

    /****百度网盘下载助手 start  版权所有 ：作者：syhyz1990，原链接地址https://greasyfork.org/zh-CN/scripts/39504 ****/
    var log_count = 1;
    var classMap = {
        'list': 'zJMtAEb',
        'grid': 'fyQgAEb',
        'list-grid-switch': 'auiaQNyn',
        'list-switched-on': 'ewXm1e',
        'grid-switched-on': 'kxhkX2Em',
        'list-switch': 'rvpXm63',
        'grid-switch': 'mxgdJgwv',
        'checkbox': 'EOGexf',
        'col-item': 'Qxyfvg',
        'check': 'fydGNC',
        'checked': 'EzubGg',
        'chekbox-grid': 'cEefyz',
        'list-view': 'vdAfKMb',
        'item-active': 'zwcb105L',
        'grid-view': 'JKvHJMb',
        'bar-search': 'OFaPaO',
        'list-tools': 'tcuLAu',
    };
    var errorMsg = {
        'dir': '不支持整个文件夹下载，可进入文件夹内获取文件链接下载',
        'unlogin': '提示 : 必须登录百度网盘后才能正常使用脚本哦!!!',
        'fail': '获取下载链接失败！请刷新后重试！',
        'unselected': '未选中文件，请刷新后重试！',
        'morethan2': '多个文件请点击【显示链接】'
    };

    var secretCode = GM_getValue('secretCode') ? GM_getValue('secretCode') : '123123';
    // var secretCode = GM_getValue('secretCode') ? GM_getValue('secretCode') : '498065';

    function slog(c1, c2, c3) {
        c1 = c1 ? c1 : '';
        c2 = c2 ? c2 : '';
        c3 = c3 ? c3 : '';
        console.log('#' + ('00' + log_count++).slice(-2) + '-助手日志:', c1, c2, c3);
    }

    //网盘页面的下载助手
    function PanHelper() {
        var yunData, sign, timestamp, bdstoken, logid, fid_list;
        var fileList = [], selectFileList = [], batchLinkList = [], batchLinkListAll = [], linkList = [],
            list_grid_status = 'list';
        var observer, currentPage, currentPath, currentCategory, dialog, searchKey;
        var panAPIUrl = location.protocol + "//" + location.host + "/api/";
        var restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
        var clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";

        this.init = function () {
            yunData = unsafeWindow.yunData;
            slog('yunData:', yunData);
            if (yunData === undefined) {
                slog('页面未正常加载，或者百度已经更新！');
                return;
            }
            initParams();
            registerEventListener();
            createObserver();
            addButton();
            createIframe();
            dialog = new Dialog({addCopy: true});
            slog('百度网盘直接下载助手 直链加速版加载成功！');
        };

        function initParams() {
            sign = getSign();
            timestamp = getTimestamp();
            bdstoken = getBDStoken();
            logid = getLogID();
            currentPage = getCurrentPage();
            slog('当前模式:', currentPage);

            if (currentPage == 'all')
                currentPath = getPath();
            if (currentPage == 'category')
                currentCategory = getCategory();
            if (currentPage == 'search')
                searchKey = getSearchKey();
            refreshListGridStatus();
            refreshFileList();
            refreshSelectList();
        }

        function refreshFileList() {
            if (currentPage == 'all') {
                fileList = getFileList();
            } else if (currentPage == 'category') {
                fileList = getCategoryFileList();
            } else if (currentPage == 'search') {
                fileList = getSearchFileList();
            }
        }

        function refreshSelectList() {
            selectFileList = [];
        }

        function refreshListGridStatus() {
            list_grid_status = getListGridStatus();
        }

        //获取当前的视图模式
        function getListGridStatus() {
            if ($('.' + classMap['list']).is(':hidden')) {
                return 'grid'
            } else {
                return 'list'
            }
        }

        function registerEventListener() {
            registerHashChange();
            registerListGridStatus();
            registerCheckbox();
            registerAllCheckbox();
            registerFileSelect();
            registerShareClick();
        }

        //监视点击分享按钮
        function registerShareClick() {
            $(document).on('click', '[title="分享"]', function () {
                var inv = setInterval(function () {
                    if ($('#share-method-public').length === 0) {
                        $(".share-method-line").parent().append('<div class="share-method-line"><input type="radio" id="share-method-public" name="share-method" value="public" checked><span class="icon radio-icon icon-radio-non"></span><label for="share-method-public"><b>公开分享</b><span>任何人访问链接即可查看，下载！</span></div>');
                    } else {
                        clearInterval(inv);
                        $(document).off('click', '[title="分享"]');
                    }
                }, 100);
            });
        }

        //监视地址栏#标签的变化
        function registerHashChange() {
            window.addEventListener('hashchange', function (e) {
                refreshListGridStatus();

                if (getCurrentPage() == 'all') {
                    if (currentPage == getCurrentPage()) {
                        if (currentPath != getPath()) {
                            currentPath = getPath();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        currentPath = getPath();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else if (getCurrentPage() == 'category') {
                    if (currentPage == getCurrentPage()) {
                        if (currentCategory != getCategory()) {
                            currentPage = getCurrentPage();
                            currentCategory = getCategory();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        currentCategory = getCategory();
                        refreshFileList();
                        refreshSelectList();
                    }
                } else if (getCurrentPage() == 'search') {
                    if (currentPage == getCurrentPage()) {
                        if (searchKey != getSearchKey()) {
                            currentPage = getCurrentPage();
                            searchKey = getSearchKey();
                            refreshFileList();
                            refreshSelectList();
                        }
                    } else {
                        currentPage = getCurrentPage();
                        searchKey = getSearchKey();
                        refreshFileList();
                        refreshSelectList();
                    }
                }
            });
        }

        //监视视图变化
        function registerListGridStatus() {
            var $a_list = $('a[data-type=list]');
            $a_list.click(function () {
                list_grid_status = 'list';
            });

            var $a_grid = $('a[data-type=grid]');
            $a_grid.click(function () {
                list_grid_status = 'grid';
            });
        }

        //文件选择框
        function registerCheckbox() {
            var $checkbox = $('span.' + classMap['checkbox']);
            if (list_grid_status == 'grid') {
                $checkbox = $('.' + classMap['chekbox-grid']);
            }

            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var $parent = $(this).parent();
                    var filename;
                    var isActive;

                    if (list_grid_status == 'list') {
                        filename = $('div.file-name div.text a', $parent).attr('title');
                        isActive = $parent.hasClass(classMap['item-active']);
                    } else if (list_grid_status == 'grid') {
                        filename = $('div.file-name a', $(this)).attr('title');
                        isActive = !$(this).hasClass(classMap['item-active'])
                    }

                    if (isActive) {
                        slog('取消选中文件：' + filename);
                        for (var i = 0; i < selectFileList.length; i++) {
                            if (selectFileList[i].filename == filename) {
                                selectFileList.splice(i, 1);
                            }
                        }
                    } else {
                        slog('选中文件:' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                var obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterCheckbox() {
            var $checkbox = $('span.' + classMap['checkbox']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //全选框
        function registerAllCheckbox() {
            var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var $parent = $(this).parent();
                    if ($parent.hasClass(classMap['checked'])) {
                        slog('取消全选');
                        selectFileList = [];
                    } else {
                        slog('全部选中');
                        selectFileList = [];
                        $.each(fileList, function (index, element) {
                            var obj = {
                                filename: element.server_filename,
                                path: element.path,
                                fs_id: element.fs_id,
                                isdir: element.isdir
                            };
                            selectFileList.push(obj);
                        });
                    }
                });
            });
        }

        function unregisterAllCheckbox() {
            var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //单个文件选中，点击文件不是点击选中框，会只选中该文件
        function registerFileSelect() {
            var $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var nodeName = e.target.nodeName.toLowerCase();
                    if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
                        slog('shiftKey:' + e.shiftKey);
                        if (!e.shiftKey) {
                            selectFileList = [];
                            var filename = $('div.file-name div.text a', $(this)).attr('title');
                            slog('选中文件：' + filename);
                            $.each(fileList, function (index, element) {
                                if (element.server_filename == filename) {
                                    var obj = {
                                        filename: element.server_filename,
                                        path: element.path,
                                        fs_id: element.fs_id,
                                        isdir: element.isdir
                                    };
                                    selectFileList.push(obj);
                                }
                            });
                        } else {
                            selectFileList = [];
                            var $dd_select = $('div.' + classMap['list-view'] + ' dd.' + classMap['item-active']);
                            $.each($dd_select, function (index, element) {
                                var filename = $('div.file-name div.text a', $(element)).attr('title');
                                slog('选中文件：' + filename);
                                $.each(fileList, function (index, element) {
                                    if (element.server_filename == filename) {
                                        var obj = {
                                            filename: element.server_filename,
                                            path: element.path,
                                            fs_id: element.fs_id,
                                            isdir: element.isdir
                                        };
                                        selectFileList.push(obj);
                                    }
                                });
                            });
                        }
                    }
                });
            });
        }

        function unregisterFileSelect() {
            var $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视文件列表显示变化
        function createObserver() {
            var MutationObserver = window.MutationObserver;
            var options = {
                'childList': true
            };
            observer = new MutationObserver(function (mutations) {
                unregisterCheckbox();
                unregisterAllCheckbox();
                unregisterFileSelect();
                registerCheckbox();
                registerAllCheckbox();
                registerFileSelect();
            });

            var list_view = document.querySelector('.' + classMap['list-view']);
            var grid_view = document.querySelector('.' + classMap['grid-view']);

            observer.observe(list_view, options);
            observer.observe(grid_view, options);
        }

        //添加助手按钮
        function addButton() {
            $('div.' + classMap['bar-search']).css('width', '18%');
            var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            var $dropdownbutton_a = $('<a class="g-button g-button-blue" href="javascript:void(0);"><span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>');
            var $dropdownbutton_span = $('<span class="menu" style="width:104px"></span>');

            var $directbutton = $('<span class="g-button-menu" style="display:block"></span>');
            var $directbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            var $directbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">直接下载</span></span></a>');
            var $directbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            var $directbutton_download_button = $('<a id="download-direct" class="g-button-menu" href="javascript:void(0);">下载</a>');
            var $directbutton_link_button = $('<a id="link-direct" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            var $directbutton_batchhttplink_button = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:void(0);">批量链接(HTTP)</a>');
            var $directbutton_batchhttpslink_button = $('<a id="batchhttpslink-direct" class="g-button-menu" href="javascript:void(0);">批量链接(HTTPS)</a>');
            $directbutton_menu.append($directbutton_download_button).append($directbutton_link_button).append($directbutton_batchhttplink_button).append($directbutton_batchhttpslink_button);
            $directbutton.append($directbutton_span.append($directbutton_a).append($directbutton_menu));
            $directbutton.hover(function () {
                $directbutton_span.toggleClass('button-open');
            });
            $directbutton_download_button.click(downloadClick);
            $directbutton_link_button.click(linkClick);
            $directbutton_batchhttplink_button.click(batchClick);
            $directbutton_batchhttpslink_button.click(batchClick);

            var $apibutton = $('<span class="g-button-menu" style="display:block"></span>');
            var $apibutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            var $apibutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>');
            var $apibutton_menu = $('<span class="menu" style="width:120px;left:77px"></span>');
            var $apibutton_download_button = $('<a id="download-api" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
            var $apibutton_batchhttplink_button = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            var $setting_button = $('<a id="appid-setting" class="g-button-menu" href="javascript:void(0);">脚本配置</a>');
            $apibutton_menu.append($apibutton_download_button).append($apibutton_batchhttplink_button).append($setting_button);
            $apibutton.append($apibutton_span.append($apibutton_a).append($apibutton_menu));
            $apibutton.hover(function () {
                $apibutton_span.toggleClass('button-open');
            });
            $apibutton_download_button.click(downloadClick);
            $apibutton_batchhttplink_button.click(batchClick);
            $setting_button.click(setSetting);

            var $outerlinkbutton = $('<span class="g-button-menu" style="display:block"></span>');
            var $outerlinkbutton_span = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>');
            var $outerlinkbutton_a = $('<a class="g-button" href="javascript:void(0);"><span class="g-button-right"><span class="text" style="width:auto">外链下载</span></span></a>');
            var $outerlinkbutton_menu = $('<span class="menu" style="width:120px;left:79px"></span>');
            var $outerlinkbutton_batchlink_button = $('<a id="batchlink-outerlink" class="g-button-menu" href="javascript:void(0);">显示链接</a>');
            $outerlinkbutton_menu.append($outerlinkbutton_batchlink_button);
            $outerlinkbutton.append($outerlinkbutton_span.append($outerlinkbutton_a).append($outerlinkbutton_menu));
            $outerlinkbutton.hover(function () {
                $outerlinkbutton_span.toggleClass('button-open');
            });
            $outerlinkbutton_batchlink_button.click(batchClick);

            var $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
            //$dropdownbutton_span.append($directbutton).append($apibutton).append($outerlinkbutton);
            $dropdownbutton_span.append($apibutton).append($outerlinkbutton).append($github);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });

            $('.' + classMap['list-tools']).append($dropdownbutton);
            $('.' + classMap['list-tools']).css('height', '40px');
        }

        function setSetting() {
            var str = prompt('请输入神秘代码 , 不懂请勿输入 , 否则后果自负', secretCode);
            if(/^\d{1,6}$/.test(str)){
                GM_setValue('secretCode', str)
                alert('神秘代码执行成功 , 点击确定将自动刷新')
                history.go(0)
            }
        }

        // 我的网盘 - 下载
        function downloadClick(event) {
            slog('选中文件列表：', selectFileList);
            var id = event.target.id;
            var downloadLink;

            if (id == 'download-direct') {
                var downloadType;
                if (selectFileList.length === 0) {
                    alert(errorMsg.unselected);
                    return;
                } else if (selectFileList.length == 1) {
                    if (selectFileList[0].isdir === 1)
                        downloadType = 'batch';
                    else if (selectFileList[0].isdir === 0)
                        downloadType = 'dlink';
                } else if (selectFileList.length > 1) {
                    downloadType = 'batch';
                }

                fid_list = getFidList(selectFileList);
                var result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno === 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch') {
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
                    } else {
                        alert("发生错误！");
                        return;
                    }
                } else if (result.errno == -1) {
                    alert('文件不存在或已被百度和谐，无法下载！');
                    return;
                } else if (result.errno == 112) {
                    alert("页面过期，请刷新重试！");
                    return;
                } else {
                    alert("发生错误！");
                    return;
                }
            } else {
                if (selectFileList.length === 0) {
                    alert("获取选中文件失败，请刷新重试！");
                    return;
                } else if (selectFileList.length > 1) {
                    alert(errorMsg.morethan2);
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        alert(errorMsg.dir);
                        return;
                    }
                }
                if (id == 'download-api') {
                    downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
                }
            }
            execDownload(downloadLink);
        }

        //我的网盘 - 显示链接
        function linkClick(event) {
            slog('选中文件列表：', selectFileList);
            var id = event.target.id;
            var linkList, tip;

            if (id.indexOf('direct') != -1) {
                var downloadType;
                var downloadLink;
                if (selectFileList.length === 0) {
                    alert(errorMsg.unselected);
                    return;
                } else if (selectFileList.length == 1) {
                    if (selectFileList[0].isdir === 1)
                        downloadType = 'batch';
                    else if (selectFileList[0].isdir === 0)
                        downloadType = 'dlink';
                } else if (selectFileList.length > 1) {
                    downloadType = 'batch';
                }
                fid_list = getFidList(selectFileList);
                var result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno === 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch') {
                        slog(selectFileList);
                        downloadLink = result.dlink;
                        if (selectFileList.length === 1)
                            downloadLink = downloadLink + '&zipname=' + encodeURIComponent(selectFileList[0].filename) + '.zip';
                    } else {
                        alert("发生错误！");
                        return;
                    }
                } else if (result.errno == -1) {
                    alert('文件不存在或已被百度和谐，无法下载！');
                    return;
                } else if (result.errno == 112) {
                    alert("页面过期，请刷新重试！");
                    return;
                } else {
                    alert("发生错误！");
                    return;
                }
                var httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                var httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                var filename = '';
                $.each(selectFileList, function (index, element) {
                    if (selectFileList.length == 1)
                        filename = element.filename;
                    else {
                        if (index == 0)
                            filename = element.filename;
                        else
                            filename = filename + ',' + element.filename;
                    }
                });
                linkList = {
                    filename: filename,
                    urls: [
                        {url: httplink, rank: 1},
                        {url: httpslink, rank: 2}
                    ]
                };
                tip = '显示模拟百度网盘网页获取的链接，可以使用右键迅雷或IDM下载，多文件打包(限300k)下载的链接可以直接复制使用';
                dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
            } else {
                if (selectFileList.length === 0) {
                    alert(errorMsg.unselected);
                    return;
                } else if (selectFileList.length > 1) {
                    alert(errorMsg.morethan2);
                    return;
                } else {
                    if (selectFileList[0].isdir == 1) {
                        alert(errorMsg.dir);
                        return;
                    }
                }
                if (id.indexOf('api') != -1) {
                    var downloadLink = getDownloadLinkWithRESTAPIBaidu(selectFileList[0].path);
                    var httplink = downloadLink.replace(/^([A-Za-z]+):/, 'http:');
                    var httpslink = downloadLink.replace(/^([A-Za-z]+):/, 'https:');
                    linkList = {
                        filename: selectFileList[0].filename,
                        urls: [
                            {url: httplink, rank: 1},
                            {url: httpslink, rank: 2}
                        ]
                    };

                    //linkList.urls.push({url: httpslink, rank: 4});
                    tip = '显示模拟APP获取的链接(使用百度云ID)，可以右键使用迅雷或IDM下载，直接复制链接无效';
                    dialog.open({title: '下载链接', type: 'link', list: linkList, tip: tip});
                } else if (id.indexOf('outerlink') != -1) {
                    getDownloadLinkWithClientAPI(selectFileList[0].path, function (result) {
                        if (result.errno == 0) {
                            linkList = {
                                filename: selectFileList[0].filename,
                                urls: result.urls
                            };
                        } else if (result.errno == 1) {
                            alert('文件不存在！');
                            return;
                        } else if (result.errno == 2) {
                            alert('文件不存在或者已被百度和谐，无法下载！');
                            return;
                        } else {
                            alert('发生错误！');
                            return;
                        }
                        tip = '左键点击调用IDM下载（<b>复制链接无效</b>）';
                        dialog.open({
                            title: '下载链接',
                            type: 'GMlink',
                            list: linkList,
                            tip: tip,
                            showcopy: false,
                            showedit: false
                        });
                    });
                }
            }
        }

        // 我的网盘 - 批量下载
        function batchClick(event) {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                alert(errorMsg.unselected);
                return;
            }
            var id = event.target.id;
            var linkType, tip;
            linkType = id.indexOf('https') == -1 ? (id.indexOf('http') == -1 ? location.protocol + ':' : 'http:') : 'https:';
            batchLinkList = [];
            batchLinkListAll = [];
            if (id.indexOf('direct') != -1) {
                batchLinkList = getDirectBatchLink(linkType);
                tip = '显示所有选中文件的直接下载链接，文件夹显示为打包下载的链接';
                if (batchLinkList.length === 0) {
                    alert('没有链接可以显示，API链接不要全部选中文件夹！');
                    return;
                }
                dialog.open({title: '批量链接', type: 'batch', list: batchLinkList, tip: tip, showcopy: true});
            } else if (id.indexOf('api') != -1) {
                batchLinkList = getAPIBatchLink(linkType);
                tip = '直接复制链接无效，请安装 IDM 及浏览器扩展后使用（<a href="https://github.com/syhyz1990/baiduyun/wiki/脚本使用说明" target="_blank">脚本使用说明</a>）';
                if (batchLinkList.length === 0) {
                    alert('没有链接可以显示，API链接不要全部选中文件夹！');
                    return;
                }
                dialog.open({title: '批量链接', type: 'batch', list: batchLinkList, tip: tip, showcopy: true});
            } else if (id.indexOf('outerlink') != -1) {
                getOuterlinkBatchLinkAll(function (batchLinkListAll) {
                    batchLinkList = getOuterlinkBatchLinkFirst(batchLinkListAll);
                    tip = '左键点击调用IDM下载，推荐all开头的地址（<b>复制链接无效</b>）';
                    if (batchLinkList.length === 0) {
                        alert('没有链接可以显示，API链接不要全部选中文件夹！');
                        return;
                    }

                    dialog.open({
                        title: '批量链接',
                        type: 'GMbatch',
                        list: batchLinkList,
                        tip: tip,
                        showcopy: true,
                        alllist: batchLinkListAll,
                        showall: true
                    });
                });
            }
        }

        function getDirectBatchLink(linkType) {
            var list = [];
            $.each(selectFileList, function (index, element) {
                var downloadType, downloadLink, result;
                if (element.isdir == 0)
                    downloadType = 'dlink';
                else
                    downloadType = 'batch';
                fid_list = getFidList([element]);
                result = getDownloadLinkWithPanAPI(downloadType);
                if (result.errno == 0) {
                    if (downloadType == 'dlink')
                        downloadLink = result.dlink[0].dlink;
                    else if (downloadType == 'batch')
                        downloadLink = result.dlink;
                    downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
                } else {
                    downloadLink = 'error';
                }
                list.push({filename: element.filename, downloadlink: downloadLink});
            });
            return list;
        }

        function getAPIBatchLink(linkType) {
            var list = [];
            $.each(selectFileList, function (index, element) {
                if (element.isdir == 1)
                    return;
                var downloadLink;
                downloadLink = getDownloadLinkWithRESTAPIBaidu(element.path);
                downloadLink = downloadLink.replace(/^([A-Za-z]+):/, linkType);
                list.push({filename: element.filename, downloadlink: downloadLink});
            });
            return list;
        }

        function getOuterlinkBatchLinkAll(cb) {
            $.each(selectFileList, function (index, element) {
                if (element.isdir == 1)
                    return;
                getDownloadLinkWithClientAPI(element.path, function (result) {
                    var list = [];
                    if (result.errno == 0) {
                        list.push({filename: element.filename, links: result.urls});
                    } else {
                        list.push({filename: element.filename, links: [{rank: 1, url: 'error'}]});
                    }
                    cb(list)
                });
            });
        }

        function getOuterlinkBatchLinkFirst(list) {
            var result = [];
            $.each(list, function (index, element) {
                result.push({filename: element.filename, downloadlink: element.links[0].url});
            });
            return result;
        }

        function getSign() {
            var signFnc;
            try {
                signFnc = new Function("return " + yunData.sign2)();
            } catch (e) {
                throw new Error(e.message);
            }
            return base64Encode(signFnc(yunData.sign5, yunData.sign1));
        }

        //获取当前目录
        function getPath() {
            var hash = location.hash;
            var regx = new RegExp("path=([^&]*)(&|$)", 'i');
            var result = hash.match(regx);
            //console.log(result);
            return decodeURIComponent(result[1]);
        }

        //获取分类显示的类别，即地址栏中的type
        function getCategory() {
            var hash = location.hash;
            var regx = new RegExp("type=([^&]*)(&|$)", 'i');
            var result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        function getSearchKey() {
            var hash = location.hash;
            var regx = new RegExp("key=([^&]*)(&|$)", 'i');
            var result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        //获取当前页面(all或者category或search)
        function getCurrentPage() {
            var hash = location.hash;
            return hash.substring(hash.indexOf('#') + 2, hash.indexOf('?'));
        }

        //获取文件列表
        function getFileList() {
            var filelist = [];
            var listUrl = panAPIUrl + "list";
            var path = getPath();
            logid = getLogID();
            var params = {
                dir: path,
                bdstoken: bdstoken,
                logid: logid,
                order: 'size',
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: 'chunlei',
                appid: secretCode
            };

            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.list : [];
                }
            });
            return filelist;
        }

        //获取分类页面下的文件列表
        function getCategoryFileList() {
            var filelist = [];
            var listUrl = panAPIUrl + "categorylist";
            var category = getCategory();
            logid = getLogID();
            var params = {
                category: category,
                bdstoken: bdstoken,
                logid: logid,
                order: 'size',
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: 'chunlei',
                appid: secretCode
            };
            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.info : [];
                }
            });
            return filelist;
        }

        function getSearchFileList() {
            var filelist = [];
            var listUrl = panAPIUrl + 'search';
            logid = getLogID();
            searchKey = getSearchKey();
            var params = {
                recursion: 1,
                order: 'time',
                desc: 1,
                showempty: 0,
                web: 1,
                page: 1,
                num: 100,
                key: searchKey,
                channel: 'chunlei',
                app_id: 250258,
                bdstoken: bdstoken,
                logid: logid,
                clienttype: 0
            };
            $.ajax({
                url: listUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    filelist = 0 === response.errno ? response.list : [];
                }
            });
            return filelist;
        }

        //生成下载时的fid_list参数
        function getFidList(list) {
            var fidlist = null;
            if (list.length === 0)
                return null;
            var fileidlist = [];
            $.each(list, function (index, element) {
                fileidlist.push(element.fs_id);
            });
            fidlist = '[' + fileidlist + ']';
            return fidlist;
        }

        function getTimestamp() {
            return yunData.timestamp;
        }

        function getBDStoken() {
            return yunData.MYBDSTOKEN;
        }

        //获取直接下载地址
        //这个地址不是直接下载地址，访问这个地址会返回302，response header中的location才是真实下载地址
        //暂时没有找到提取方法
        function getDownloadLinkWithPanAPI(type) {
            var downloadUrl = panAPIUrl + "download";
            var result;
            logid = getLogID();
            var params = {
                sign: sign,
                timestamp: timestamp,
                fidlist: fid_list,
                type: type,
                channel: 'chunlei',
                web: 1,
                app_id: secretCode,
                bdstoken: bdstoken,
                logid: logid,
                clienttype: 0
            };
            $.ajax({
                url: downloadUrl,
                async: false,
                method: 'GET',
                data: params,
                success: function (response) {
                    result = response;
                }
            });
            return result;
        }

        function getDownloadLinkWithRESTAPIBaidu(path) {
            var link = restAPIUrl + 'file?method=download&path=' + encodeURIComponent(path) + '&random=' + Math.random() + '&app_id=' + secretCode;
            return link;
        }

        function getDownloadLinkWithClientAPI(path, cb) {
            var result;
            var url = clientAPIUrl + 'file?method=locatedownload&app_id='+secretCode+'&ver=4.0&path=' + encodeURIComponent(path);

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
                },
                onload: function (res) {
                    if (res.status === 200) {
                        result = JSON.parse(res.responseText);
                        if (result.error_code == undefined) {
                            if (result.urls == undefined) {
                                result.errno = 2;
                            } else {
                                $.each(result.urls, function (index, element) {
                                    result.urls[index].url = element.url.replace('\\', '');
                                });
                                result.errno = 0;
                            }
                        } else if (result.error_code == 31066) {
                            result.errno = 1;
                        } else {
                            result.errno = -1;
                        }
                    } else {
                        result = {};
                        result.errno = -1;
                    }
                    cb(result)
                }
            });
        }

        function execDownload(link) {
            slog("下载链接：" + link);
            $('#helperdownloadiframe').attr('src', link);
        }

        function createIframe() {
            var $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            var $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);

        }
    }

    //分享页面的下载助手
    function PanShareHelper() {
        var yunData, sign, timestamp, bdstoken, channel, clienttype, web, app_id, logid, encrypt, product, uk,
            primaryid, fid_list, extra, shareid;
        var vcode;
        var shareType, buttonTarget, currentPath, list_grid_status, observer, dialog, vcodeDialog;
        var fileList = [], selectFileList = [];
        var panAPIUrl = location.protocol + "//" + location.host + "/api/";
        var shareListUrl = location.protocol + "//" + location.host + "/share/list";

        this.init = function () {
            yunData = unsafeWindow.yunData;
            slog('yunData:', yunData);
            if (yunData === undefined || yunData.FILEINFO == null) {
                slog('页面未正常加载，或者百度已经更新！');
                return;
            }
            initParams();
            addButton();
            dialog = new Dialog({addCopy: false});
            vcodeDialog = new VCodeDialog(refreshVCode, confirmClick);
            createIframe();

            if (!isSingleShare()) {
                registerEventListener();
                createObserver();
            }

            slog('分享助手加载成功!');
        };

        function initParams() {
            shareType = getShareType();
            sign = yunData.SIGN;
            timestamp = yunData.TIMESTAMP;
            bdstoken = yunData.MYBDSTOKEN;
            channel = 'chunlei';
            clienttype = 0;
            web = 1;
            app_id = secretCode;
            logid = getLogID();
            encrypt = 0;
            product = 'share';
            primaryid = yunData.SHARE_ID;
            uk = yunData.SHARE_UK;

            if (shareType == 'secret') {
                extra = getExtra();
            }
            if (isSingleShare()) {
                var obj = {};
                if (yunData.CATEGORY == 2) {
                    obj.filename = yunData.FILENAME;
                    obj.path = yunData.PATH;
                    obj.fs_id = yunData.FS_ID;
                    obj.isdir = 0;
                } else {
                    obj.filename = yunData.FILEINFO[0].server_filename,
                        obj.path = yunData.FILEINFO[0].path,
                        obj.fs_id = yunData.FILEINFO[0].fs_id,
                        obj.isdir = yunData.FILEINFO[0].isdir
                }
                selectFileList.push(obj);
            } else {
                shareid = yunData.SHARE_ID;
                currentPath = getPath();
                list_grid_status = getListGridStatus();
                fileList = getFileList();
            }
        }

        //判断分享类型（public或者secret）
        function getShareType() {
            return yunData.SHARE_PUBLIC === 1 ? 'public' : 'secret';
        }

        //判断是单个文件分享还是文件夹或者多文件分享
        function isSingleShare() {
            return yunData.getContext === undefined ? true : false;
        }

        //判断是否为自己的分享链接
        function isSelfShare() {
            return yunData.MYSELF == 1 ? true : false;
        }

        function getExtra() {
            var seKey = decodeURIComponent(getCookie('BDCLND'));
            return '{' + '"sekey":"' + seKey + '"' + "}";
        }

        //获取当前目录
        function getPath() {
            var hash = location.hash;
            var regx = new RegExp("path=([^&]*)(&|$)", 'i');
            var result = hash.match(regx);
            return decodeURIComponent(result[1]);
        }

        //获取当前的视图模式
        function getListGridStatus() {
            var status = 'list';
            if ($('.list-switched-on').length > 0) {
                status = 'list';
            } else if ($('.grid-switched-on').length > 0) {
                status = 'grid';
            }
            return status;
        }

        //添加下载助手按钮
        function addButton() {
            if (isSingleShare()) {
                $('div.slide-show-right').css('width', '500px');
                $('div.frame-main').css('width', '96%');
                $('div.share-file-viewer').css('width', '740px').css('margin-left', 'auto').css('margin-right', 'auto');
            } else
                $('div.slide-show-right').css('width', '500px');
            var $dropdownbutton = $('<span class="g-dropdown-button"></span>');
            var $dropdownbutton_a = $('<a class="g-button g-button-blue" data-button-id="b200" data-button-index="200" href="javascript:void(0);"></a>');
            var $dropdownbutton_a_span = $('<span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>');
            var $dropdownbutton_span = $('<span class="menu" style="width:auto;z-index:41"></span>');

            var $downloadButton = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:void(0);">直接下载</a>');
            var $linkButton = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:void(0);">显示链接</a>');

            var $github = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 108px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');

            $dropdownbutton_span.append($downloadButton).append($linkButton).append($github);
            $dropdownbutton_a.append($dropdownbutton_a_span);
            $dropdownbutton.append($dropdownbutton_a).append($dropdownbutton_span);

            $dropdownbutton.hover(function () {
                $dropdownbutton.toggleClass('button-open');
            });

            $downloadButton.click(function () {
                alert('温馨提示 : 百度接口限制, 请先保存到自己网盘 , 去网盘中使用下载助手!!!')
            });
            $linkButton.click(function () {
                alert('温馨提示 : 百度接口限制, 请先保存到自己网盘 , 去网盘中使用下载助手!!!')
            });
            //$downloadButton.click(downloadButtonClick);
            //$linkButton.click(linkButtonClick);

            $('div.module-share-top-bar div.bar div.x-button-box').append($dropdownbutton);
        }

        function createIframe() {
            var $div = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>');
            var $iframe = $('<iframe src="javascript:void(0)" id="helperdownloadiframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        }

        function registerEventListener() {
            registerHashChange();
            registerListGridStatus();
            registerCheckbox();
            registerAllCheckbox();
            registerFileSelect();
        }

        //监视地址栏#标签变化
        function registerHashChange() {
            window.addEventListener('hashchange', function (e) {
                list_grid_status = getListGridStatus();
                if (currentPath == getPath()) {

                } else {
                    currentPath = getPath();
                    refreshFileList();
                    refreshSelectFileList();
                }
            });
        }

        function refreshFileList() {
            fileList = getFileList();
        }

        function refreshSelectFileList() {
            selectFileList = [];
        }

        //监视视图变化
        function registerListGridStatus() {
            var $a_list = $('a[data-type=list]');
            $a_list.click(function () {
                list_grid_status = 'list';
            });

            var $a_grid = $('a[data-type=grid]');
            $a_grid.click(function () {
                list_grid_status = 'grid';
            });
        }

        //监视文件选择框
        function registerCheckbox() {
            var $checkbox = $('span.' + classMap['checkbox']);
            if (list_grid_status == 'grid') {
                $checkbox = $('.' + classMap['chekbox-grid']);
            }
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var $parent = $(this).parent();
                    var filename;
                    var isActive;

                    if (list_grid_status == 'list') {
                        filename = $('div.file-name div.text a', $parent).attr('title');
                        isActive = $(this).parents('dd').hasClass('JS-item-active')
                    } else if (list_grid_status == 'grid') {
                        filename = $('div.file-name a', $(this)).attr('title');
                        isActive = !$(this).hasClass('JS-item-active')
                    }

                    if (isActive) {
                        slog('取消选中文件：' + filename);
                        for (var i = 0; i < selectFileList.length; i++) {
                            if (selectFileList[i].filename == filename) {
                                selectFileList.splice(i, 1);
                            }
                        }
                    } else {
                        slog('选中文件: ' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                var obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterCheckbox() {
            var $checkbox = $('span.' + classMap['checkbox']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视全选框
        function registerAllCheckbox() {
            var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var $parent = $(this).parent();
                    if ($parent.hasClass(classMap['checked'])) {
                        slog('取消全选');
                        selectFileList = [];
                    } else {
                        slog('全部选中');
                        selectFileList = [];
                        $.each(fileList, function (index, element) {
                            var obj = {
                                filename: element.server_filename,
                                path: element.path,
                                fs_id: element.fs_id,
                                isdir: element.isdir
                            };
                            selectFileList.push(obj);
                        });
                    }
                });
            });
        }

        function unregisterAllCheckbox() {
            var $checkbox = $('div.' + classMap['col-item'] + '.' + classMap['check']);
            $checkbox.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视单个文件选中
        function registerFileSelect() {
            var $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).bind('click', function (e) {
                    var nodeName = e.target.nodeName.toLowerCase();
                    if (nodeName != 'span' && nodeName != 'a' && nodeName != 'em') {
                        selectFileList = [];
                        var filename = $('div.file-name div.text a', $(this)).attr('title');
                        slog('选中文件：' + filename);
                        $.each(fileList, function (index, element) {
                            if (element.server_filename == filename) {
                                var obj = {
                                    filename: element.server_filename,
                                    path: element.path,
                                    fs_id: element.fs_id,
                                    isdir: element.isdir
                                };
                                selectFileList.push(obj);
                            }
                        });
                    }
                });
            });
        }

        function unregisterFileSelect() {
            var $dd = $('div.' + classMap['list-view'] + ' dd');
            $dd.each(function (index, element) {
                $(element).unbind('click');
            });
        }

        //监视文件列表显示变化
        function createObserver() {
            var MutationObserver = window.MutationObserver;
            var options = {
                'childList': true
            };
            observer = new MutationObserver(function (mutations) {
                unregisterCheckbox();
                unregisterAllCheckbox();
                unregisterFileSelect();
                registerCheckbox();
                registerAllCheckbox();
                registerFileSelect();
            });

            var list_view = document.querySelector('.' + classMap['list-view']);
            var grid_view = document.querySelector('.' + classMap['grid-view']);

            observer.observe(list_view, options);
            observer.observe(grid_view, options);
        }

        //获取文件信息列表
        function getFileList() {
            var result = [];
            if (getPath() == '/') {
                result = yunData.FILEINFO;
            } else {
                logid = getLogID();
                var params = {
                    uk: uk,
                    shareid: shareid,
                    order: 'other',
                    desc: 1,
                    showempty: 0,
                    web: web,
                    dir: getPath(),
                    t: Math.random(),
                    bdstoken: bdstoken,
                    channel: channel,
                    clienttype: clienttype,
                    app_id: app_id,
                    logid: logid
                };
                $.ajax({
                    url: shareListUrl,
                    method: 'GET',
                    async: false,
                    data: params,
                    success: function (response) {
                        if (response.errno === 0) {
                            result = response.list;
                        }
                    }
                });
            }
            return result;
        }

        function downloadButtonClick() {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                alert(errorMsg.unselected);
                return;
            }
            if (selectFileList.length > 1) {
                return alert(errorMsg.morethan2);
            }

            if (selectFileList[0].isdir == 1) {
                return alert(errorMsg.dir);
            }
            buttonTarget = 'download';
            var downloadLink = getDownloadLink();

            if (downloadLink === undefined) return;

            if (downloadLink.errno == -20) {
                vcode = getVCode();
                if (vcode.errno !== 0) {
                    alert('获取验证码失败！');
                    return;
                }
                vcodeDialog.open(vcode);
            } else if (downloadLink.errno == 112) {
                alert('页面过期，请刷新重试');

            } else if (downloadLink.errno === 0) {
                var link = downloadLink.list[0].dlink;
                execDownload(link);
            } else {
                alert(errorMsg.fail);

            }
        }

        //获取验证码
        function getVCode() {
            var url = panAPIUrl + 'getvcode';
            var result;
            logid = getLogID();
            var params = {
                prod: 'pan',
                t: Math.random(),
                bdstoken: bdstoken,
                channel: channel,
                clienttype: clienttype,
                web: web,
                app_id: app_id,
                logid: logid
            };
            $.ajax({
                url: url,
                method: 'GET',
                async: false,
                data: params,
                success: function (response) {
                    result = response;
                }
            });
            return result;
        }

        //刷新验证码
        function refreshVCode() {
            vcode = getVCode();
            $('#dialog-img').attr('src', vcode.img);
        }

        //验证码确认提交
        function confirmClick() {
            var val = $('#dialog-input').val();
            if (val.length === 0) {
                $('#dialog-err').text('请输入验证码');
                return;
            } else if (val.length < 4) {
                $('#dialog-err').text('验证码输入错误，请重新输入');
                return;
            }
            var result = getDownloadLinkWithVCode(val);
            if (result.errno == -20) {
                vcodeDialog.close();
                $('#dialog-err').text('验证码输入错误，请重新输入');
                refreshVCode();
                if (!vcode || vcode.errno !== 0) {
                    alert('获取验证码失败！');
                    return;
                }
                vcodeDialog.open();
            } else if (result.errno === 0) {
                vcodeDialog.close();
                if (buttonTarget == 'download') {
                    if (result.list.length > 1 || result.list[0].isdir == 1) {
                        return alert(errorMsg.morethan2);
                    }
                    var link = result.list[0].dlink;
                    execDownload(link);
                } else if (buttonTarget == 'link') {
                    var tip = '直接复制链接无效，请安装 IDM 及浏览器扩展后使用（<a href="https://github.com/syhyz1990/baiduyun/wiki/脚本使用说明" target="_blank">脚本使用说明</a>）';
                    dialog.open({title: '下载链接（仅显示文件链接）', type: 'shareLink', list: result.list, tip: tip});
                }
            } else {
                alert('发生错误！');

            }
        }

        //生成下载用的fid_list参数
        function getFidList() {
            var fidlist = [];
            $.each(selectFileList, function (index, element) {
                fidlist.push(element.fs_id);
            });
            return '[' + fidlist + ']';
        }

        function linkButtonClick() {
            slog('选中文件列表：', selectFileList);
            if (selectFileList.length === 0) {
                return alert(errorMsg.unselected);
            }
            if (selectFileList[0].isdir == 1) {
                return alert(errorMsg.dir);
            }

            buttonTarget = 'link';
            var downloadLink = getDownloadLink();

            if (downloadLink === undefined) return;

            if (downloadLink.errno == -20) {
                vcode = getVCode();
                if (!vcode || vcode.errno !== 0) {
                    return alert('获取验证码失败！');
                }
                vcodeDialog.open(vcode);
            } else if (downloadLink.errno == 112) {
                return alert('页面过期，请刷新重试');
            } else if (downloadLink.errno === 0) {
                var tip = "显示获取的链接，可以使用右键迅雷或IDM下载，复制无用，需要传递cookie";
                dialog.open({title: '下载链接（仅显示文件链接）', type: 'shareLink', list: downloadLink.list, tip: tip});
            } else {
                alert(errorMsg.fail);
            }
        }

        //获取下载链接
        function getDownloadLink() {
            if (bdstoken === null) {
                alert(errorMsg.unlogin);
                return '';
            } else {
                var result;
                if (isSingleShare) {
                    fid_list = getFidList();
                    logid = getLogID();
                    var url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
                    var params = {
                        encrypt: encrypt,
                        product: product,
                        uk: uk,
                        primaryid: primaryid,
                        fid_list: fid_list
                    };
                    if (shareType == 'secret') {
                        params.extra = extra;
                    }
                    /*if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
                      params.type = 'batch';
                    }*/
                    $.ajax({
                        url: url,
                        method: 'POST',
                        async: false,
                        data: params,
                        success: function (response) {
                            result = response;
                        }
                    });
                }
                return result;
            }
        }

        //有验证码输入时获取下载链接
        function getDownloadLinkWithVCode(vcodeInput) {
            var result;
            if (isSingleShare) {
                fid_list = getFidList();
                var url = panAPIUrl + 'sharedownload?sign=' + sign + '&timestamp=' + timestamp + '&bdstoken=' + bdstoken + '&channel=' + channel + '&clienttype=' + clienttype + '&web=' + web + '&app_id=' + app_id + '&logid=' + logid;
                var params = {
                    encrypt: encrypt,
                    product: product,
                    vcode_input: vcodeInput,
                    vcode_str: vcode.vcode,
                    uk: uk,
                    primaryid: primaryid,
                    fid_list: fid_list
                };
                if (shareType == 'secret') {
                    params.extra = extra;
                }
                /*if (selectFileList[0].isdir == 1 || selectFileList.length > 1) {
                  params.type = 'batch';
                }*/
                $.ajax({
                    url: url,
                    method: 'POST',
                    async: false,
                    data: params,
                    success: function (response) {
                        result = response;
                    }
                });
            }
            return result;
        }

        function execDownload(link) {
            slog('下载链接：' + link);
            $('#helperdownloadiframe').attr('src', link);
        }
    }

    function base64Encode(t) {
        var a, r, e, n, i, s, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (e = t.length, r = 0, a = ""; e > r;) {
            if (n = 255 & t.charCodeAt(r++), r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4);
                a += "==";
                break;
            }
            if (i = t.charCodeAt(r++), r == e) {
                a += o.charAt(n >> 2);
                a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
                a += o.charAt((15 & i) << 2);
                a += "=";
                break;
            }
            s = t.charCodeAt(r++);
            a += o.charAt(n >> 2);
            a += o.charAt((3 & n) << 4 | (240 & i) >> 4);
            a += o.charAt((15 & i) << 2 | (192 & s) >> 6);
            a += o.charAt(63 & s);
        }
        return a;
    }

    function detectPage() {
        var regx = /[\/].+[\/]/g;
        var page = location.pathname.match(regx);
        return page[0].replace(/\//g, '');
    }

    function getCookie(e) {
        var o, t;
        var n = document, c = decodeURI;
        return n.cookie.length > 0 && (o = n.cookie.indexOf(e + "="), -1 != o) ? (o = o + e.length + 1, t = n.cookie.indexOf(";", o), -1 == t && (t = n.cookie.length), c(n.cookie.substring(o, t))) : "";
    }

    function getLogID() {
        var name = "BAIDUID";
        var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
        var d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var f = String.fromCharCode;

        function l(e) {
            if (e.length < 2) {
                var n = e.charCodeAt(0);
                return 128 > n ? e : 2048 > n ? f(192 | n >>> 6) + f(128 | 63 & n) : f(224 | n >>> 12 & 15) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
            }
            var n = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
            return f(240 | n >>> 18 & 7) + f(128 | n >>> 12 & 63) + f(128 | n >>> 6 & 63) + f(128 | 63 & n);
        }

        function g(e) {
            return (e + "" + Math.random()).replace(d, l);
        }

        function m(e) {
            var n = [0, 2, 1][e.length % 3];
            var t = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
            var o = [u.charAt(t >>> 18), u.charAt(t >>> 12 & 63), n >= 2 ? "=" : u.charAt(t >>> 6 & 63), n >= 1 ? "=" : u.charAt(63 & t)];
            return o.join("");
        }

        function h(e) {
            return e.replace(/[\s\S]{1,3}/g, m);
        }

        function p() {
            return h(g((new Date()).getTime()));
        }

        function w(e, n) {
            return n ? p(String(e)).replace(/[+\/]/g, function (e) {
                return "+" == e ? "-" : "_";
            }).replace(/=/g, "") : p(String(e));
        }

        return w(getCookie(name));
    }

    function Dialog() {
        var linkList = [];
        var showParams;
        var dialog, shadow;

        function createDialog() {
            var screenWidth = document.body.clientWidth;
            var dialogLeft = screenWidth > 800 ? (screenWidth - 800) / 2 : 0;
            var $dialog_div = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + dialogLeft + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>');
            var $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>');
            var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>');
            var $dialog_body = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>');
            var $dialog_tip = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');

            $dialog_div.append($dialog_header.append($dialog_control)).append($dialog_body);

            //var $dialog_textarea = $('<textarea class="dialog-textarea" style="display:none;width"></textarea>');
            var $dialog_radio_div = $('<div class="dialog-radio" style="display:none;width:760px;padding-left:20px;padding-right:20px"></div>');
            var $dialog_radio_multi = $('<input type="radio" name="showmode" checked="checked" value="multi"><span>多行</span>');
            var $dialog_radio_single = $('<input type="radio" name="showmode" value="single"><span>单行</span>');
            $dialog_radio_div.append($dialog_radio_multi).append($dialog_radio_single);
            $dialog_div.append($dialog_radio_div);
            $('input[type=radio][name=showmode]', $dialog_radio_div).change(function () {
                var value = this.value;
                var $textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                var content = $textarea.val();
                if (value == 'multi') {
                    content = content.replace(/\s+/g, '\n');
                    $textarea.css('height', '300px');
                } else if (value == 'single') {
                    content = content.replace(/\n+/g, ' ');
                    $textarea.css('height', '');
                }
                $textarea.val(content);
            });

            var $dialog_button = $('<div class="dialog-button" style="display:none"></div>');
            var $dialog_button_div = $('<div style="display:table;margin:auto"></div>');
            var $dialog_copy_button = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">直接复制无效</button>');
            var $dialog_edit_button = $('<button id="dialog-edit-button" style="display:none">编辑</button>');
            var $dialog_exit_button = $('<button id="dialog-exit-button" style="display:none">退出</button>');

            $dialog_button_div.append($dialog_copy_button).append($dialog_edit_button).append($dialog_exit_button);
            $dialog_button.append($dialog_button_div);
            $dialog_div.append($dialog_button);

            $dialog_copy_button.click(function () {
                var content = '';
                if (showParams.type == 'batch') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.downloadlink;
                        else
                            content = content + element.downloadlink + '\n';
                    });
                } else if (showParams.type == 'link') {
                    $.each(linkList, function (index, element) {
                        if (element.url == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.url;
                        else
                            content = content + element.url + '\n';
                    });
                }
                GM_setClipboard(content, 'text');
                alert('已将链接复制到剪贴板！');
            });

            $dialog_edit_button.click(function () {
                var $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                var $dialog_item = $('div.dialog-body div', dialog);
                $dialog_item.hide();
                $dialog_copy_button.hide();
                $dialog_edit_button.hide();
                $dialog_textarea.show();
                $dialog_radio_div.show();
                $dialog_exit_button.show();
            });

            $dialog_exit_button.click(function () {
                var $dialog_textarea = $('div.dialog-body textarea[name=dialog-textarea]', dialog);
                var $dialog_item = $('div.dialog-body div', dialog);
                $dialog_textarea.hide();
                $dialog_radio_div.hide();
                $dialog_item.show();
                $dialog_exit_button.hide();
                $dialog_copy_button.show();
                $dialog_edit_button.show();
            });

            $dialog_div.append($dialog_tip);
            $('body').append($dialog_div);
            $dialog_div.dialogDrag();
            $dialog_control.click(dialogControl);
            return $dialog_div;
        }

        function createShadow() {
            var $shadow = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
            $('body').append($shadow);
            return $shadow;
        }

        this.open = function (params) {
            $('body').on('click', '.GMlink', function (event) {
                event.preventDefault();
                var link = $(this)[0].innerText;
                GM_download({
                    url: link,
                    name: '非IDM下载请自己改后缀名.zip',
                    headers: {
                        "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
                    }
                });

                return false;
            });

            showParams = params;
            linkList = [];
            if (params.type == 'link' || params.type == 'GMlink') {
                linkList = params.list.urls;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title + "：" + params.list.filename);
                $.each(params.list.urls, function (index, element) {
                    if (params.type == 'GMlink') {
                        var $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a class="GMlink" href="' + element.url + '">' + element.url + '</a></div></div>');
                    } else {
                        var $div = $('<div><div style="width:30px;float:left">' + element.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + element.url + '">' + element.url + '</a></div></div>');
                    }

                    $('div.dialog-body', dialog).append($div);
                });
            }
            if (params.type == 'batch' || params.type == 'GMbatch') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                if (params.showall) {
                    $.each(params.list, function (index, element) {
                        var $item_div = $('<div class="item-container" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>');
                        var $item_name = $('<div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div>');
                        var $item_sep = $('<div style="width:12px;float:left"><span>：</span></div>');
                        var $item_link_div = $('<div class="item-link" style="float:left;width:618px;"></div>');
                        var $item_first = $('<div class="item-first" style="overflow:hidden;text-overflow:ellipsis"><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
                        $item_link_div.append($item_first);
                        $.each(params.alllist[index].links, function (n, item) {
                            if (element.downloadlink == item.url)
                                return;
                            if (params.type == 'GMbatch') {
                                var $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a class="GMlink" href="' + item.url + '">' + item.url + '</a></div>');
                            } else {
                                var $item = $('<div class="item-ex" style="display:none;overflow:hidden;text-overflow:ellipsis"><a href="' + item.url + '">' + item.url + '</a></div>');
                            }

                            $item_link_div.append($item);
                        });
                        var $item_ex = $('<div style="width:15px;float:left;cursor:pointer;text-align:center;font-size:16px"><span>+</span></div>');
                        $item_div.append($item_name).append($item_sep).append($item_link_div).append($item_ex);
                        $item_ex.click(function () {
                            var $parent = $(this).parent();
                            $parent.toggleClass('showall');
                            if ($parent.hasClass('showall')) {
                                $(this).text('-');
                                $('div.item-link div.item-ex', $parent).show();
                            } else {
                                $(this).text('+');
                                $('div.item-link div.item-ex', $parent).hide();
                            }
                        });
                        $('div.dialog-body', dialog).append($item_div);
                    });
                } else {
                    $.each(params.list, function (index, element) {
                        var $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.filename + '">' + element.filename + '</div><span>：</span><a href="' + element.downloadlink + '">' + element.downloadlink + '</a></div>');
                        $('div.dialog-body', dialog).append($div);
                    });
                }
            }
            if (params.type == 'shareLink') {
                linkList = params.list;
                $('div.dialog-header h3 span.dialog-title', dialog).text(params.title);
                $.each(params.list, function (index, element) {
                    if (element.isdir == 1) return;
                    var $div = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + element.server_filename + '">' + element.server_filename + '</div><span>：</span><a href="' + element.dlink + '">' + element.dlink + '</a></div>');
                    $('div.dialog-body', dialog).append($div);
                });
            }

            if (params.tip) {
                $('div.dialog-tip p', dialog).html(params.tip);
            }

            if (params.showcopy) {
                $('div.dialog-button', dialog).show();
                $('div.dialog-button button#dialog-copy-button', dialog).show();
            }
            if (params.showedit) {
                $('div.dialog-button', dialog).show();
                $('div.dialog-button button#dialog-edit-button', dialog).show();
                var $dialog_textarea = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>');
                var content = '';
                if (showParams.type == 'batch') {
                    $.each(linkList, function (index, element) {
                        if (element.downloadlink == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.downloadlink;
                        else
                            content = content + element.downloadlink + '\n';
                    });
                } else if (showParams.type == 'link') {
                    $.each(linkList, function (index, element) {
                        if (element.url == 'error')
                            return;
                        if (index == linkList.length - 1)
                            content = content + element.url;
                        else
                            content = content + element.url + '\n';
                    });
                }
                $dialog_textarea.val(content);
                $('div.dialog-body', dialog).append($dialog_textarea);
            }

            shadow.show();
            dialog.show();
        };

        this.close = function () {
            dialogControl();
        };

        function dialogControl() {
            $('div.dialog-body', dialog).children().remove();
            $('div.dialog-header h3 span.dialog-title', dialog).text('');
            $('div.dialog-tip p', dialog).text('');
            $('div.dialog-button', dialog).hide();
            $('div.dialog-radio input[type=radio][name=showmode][value=multi]', dialog).prop('checked', true);
            $('div.dialog-radio', dialog).hide();
            $('div.dialog-button button#dialog-copy-button', dialog).hide();
            $('div.dialog-button button#dialog-edit-button', dialog).hide();
            $('div.dialog-button button#dialog-exit-button', dialog).hide();
            dialog.hide();
            shadow.hide();
        }

        dialog = createDialog();
        shadow = createShadow();
    }

    function VCodeDialog(refreshVCode, confirmClick) {
        var dialog, shadow;

        function createDialog() {
            var screenWidth = document.body.clientWidth;
            var dialogLeft = screenWidth > 520 ? (screenWidth - 520) / 2 : 0;
            var $dialog_div = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + dialogLeft + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>');
            var $dialog_header = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>');
            var $dialog_control = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>');
            var $dialog_body = $('<div class="dialog-body"></div>');
            var $dialog_body_div = $('<div style="text-align:center;padding:22px"></div>');
            var $dialog_body_download_verify = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>');
            var $dialog_verify_body = $('<div class="verify-body">请输入验证码：</div>');
            var $dialog_input = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">');
            var $dialog_img = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">');
            var $dialog_refresh = $('<a href="javascript:void(0)" style="text-decoration:underline;" class="underline">换一张</a>');
            var $dialog_err = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>');
            var $dialog_footer = $('<div class="dialog-footer g-clearfix"></div>');
            var $dialog_confirm_button = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:void(0)" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>');
            var $dialog_cancel_button = $('<a class="g-button" data-button-id="" data-button-index href="javascript:void(0);" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');

            $dialog_header.append($dialog_control);
            $dialog_verify_body.append($dialog_input).append($dialog_img).append($dialog_refresh);
            $dialog_body_download_verify.append($dialog_verify_body).append($dialog_err);
            $dialog_body_div.append($dialog_body_download_verify);
            $dialog_body.append($dialog_body_div);
            $dialog_footer.append($dialog_confirm_button).append($dialog_cancel_button);
            $dialog_div.append($dialog_header).append($dialog_body).append($dialog_footer);
            $('body').append($dialog_div);

            $dialog_div.dialogDrag();

            $dialog_control.click(dialogControl);
            $dialog_img.click(refreshVCode);
            $dialog_refresh.click(refreshVCode);
            $dialog_input.keypress(function (event) {
                if (event.which == 13)
                    confirmClick();
            });
            $dialog_confirm_button.click(confirmClick);
            $dialog_cancel_button.click(dialogControl);
            $dialog_input.click(function () {
                $('#dialog-err').text('');
            });
            return $dialog_div;
        }

        this.open = function (vcode) {
            if (vcode)
                $('#dialog-img').attr('src', vcode.img);
            dialog.show();
            shadow.show();
        };
        this.close = function () {
            dialogControl();
        };
        dialog = createDialog();
        shadow = $('div.dialog-shadow');

        function dialogControl() {
            $('#dialog-img', dialog).attr('src', '');
            $('#dialog-err').text('');
            dialog.hide();
            shadow.hide();
        }
    }

    $.fn.dialogDrag = function () {
        var mouseInitX, mouseInitY, dialogInitX, dialogInitY;
        var screenWidth = document.body.clientWidth;
        var $parent = this;
        $('div.dialog-header', this).mousedown(function (event) {
            mouseInitX = parseInt(event.pageX);
            mouseInitY = parseInt(event.pageY);
            dialogInitX = parseInt($parent.css('left').replace('px', ''));
            dialogInitY = parseInt($parent.css('top').replace('px', ''));
            $(this).mousemove(function (event) {
                var tempX = dialogInitX + parseInt(event.pageX) - mouseInitX;
                var tempY = dialogInitY + parseInt(event.pageY) - mouseInitY;
                var width = parseInt($parent.css('width').replace('px', ''));
                tempX = tempX < 0 ? 0 : tempX > screenWidth - width ? screenWidth - width : tempX;
                tempY = tempY < 0 ? 0 : tempY;
                $parent.css('left', tempX + 'px').css('top', tempY + 'px');
            });
        });
        $('div.dialog-header', this).mouseup(function (event) {
            $(this).unbind('mousemove');
        });
    };

    (function () {
        if ((/pan.baidu.com\/disk\/home/i).test(videoSite) || (/yun.baidu.com\/disk\/home/i).test(videoSite) || (/pan.baidu.com\/s/i).test(videoSite) || (/yun.baidu.com\/s/i).test(videoSite) || (/pan.baidu.com\/share\/link/i).test(videoSite) || (/yun.baidu.com\/share\/link/i).test(videoSite)) {
            classMap['default-dom'] = ($('.icon-upload').parent().parent().parent().parent().parent().attr('class'));
            classMap['bar'] = ($('.icon-upload').parent().parent().parent().parent().attr('class'));

            switch (detectPage()) {
                case 'disk':
                    var panHelper = new PanHelper();
                    panHelper.init();
                    return;
                case 'share':
                case 's':
                    var panShareHelper = new PanShareHelper();
                    panShareHelper.init();
                    return;
                default:
                    return;
            }
        }
    })();
    /***百度网盘下载助手end  ***/
    (function () {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://js.users.51.la/20061525.js";
        document.getElementsByTagName("head")[0].appendChild(script);
    })();
})();

