// ==UserScript==
// @name         优惠购
// @namespace    http://tb.newday.me/
// @version      1.3.0
// @icon         http://tb.newday.me/taobao/favicon.ico
// @author       哩呵
// @description  以最优惠的价格，把宝贝抱回家。插件主要功能有：[1] 淘宝全站商品的优惠券查询与领取 [2] 京东商品页的优惠券查询与获取 [3] 展示淘宝、京东等主流商城的商品历史价格图表
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://item.jd.com/*
// @match        *://item.jd.hk/*
// @match        *://goods.kaola.com/product/*
// @match        *://you.163.com/item/*
// @match        *://product.suning.com/*
// @match        *://product.dangdang.com/*
// @match        *://item.gome.com.cn/*
// @match        *://*.newday.me/*
// @connect      taobao.com
// @connect      newday.me
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/qrcode-generator/1.4.3/qrcode.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js
// @require      https://cdn.staticfile.org/vue/2.6.6/vue.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    var injectInfo = {
        enable: false
    };

    var container = (function () {
        var obj = {
            module_defines: {},
            module_objects: {}
        };

        obj.define = function (name, requires, callback) {
            name = obj.processName(name);
            obj.module_defines[name] = {
                requires: requires,
                callback: callback
            };
        };

        obj.require = function (name, cache) {
            if (typeof cache == "undefined") {
                cache = true;
            }

            name = obj.processName(name);
            if (cache && obj.module_objects.hasOwnProperty(name)) {
                return obj.module_objects[name];
            }
            else if (obj.module_defines.hasOwnProperty(name)) {
                var requires = obj.module_defines[name].requires;
                var callback = obj.module_defines[name].callback;

                var module = obj.use(requires, callback);
                cache && obj.register(name, module);
                return module;
            }
        };

        obj.use = function (requires, callback) {
            var module = {
                exports: {}
            };
            var params = obj.buildParams(requires, module);
            var result = callback.apply(this, params);
            if (typeof result != "undefined") {
                return result;
            }
            else {
                return module.exports;
            }
        };

        obj.register = function (name, module) {
            name = obj.processName(name);
            obj.module_objects[name] = module;
        };

        obj.buildParams = function (requires, module) {
            var params = [];
            requires.forEach(function (name) {
                params.push(obj.require(name));
            });
            params.push(obj.require);
            params.push(module.exports);
            params.push(module);
            return params;
        };

        obj.processName = function (name) {
            return name.toLowerCase();
        };

        return {
            define: obj.define,
            use: obj.use,
            register: obj.register,
            modules: obj.module_objects
        };
    })();

    container.define("runtime", [], function () {
        var obj = {
            url: location.href,
            referer: document.referrer,
        };

        obj.getUrl = function () {
            return obj.url;
        };

        obj.setUrl = function (url) {
            obj.url = url;
        };

        obj.getReferer = function () {
            return obj.referer;
        };

        obj.setReferer = function (referer) {
            obj.referer = referer;
        };

        obj.getUrlParam = function (name) {
            var param = obj.parseUrlParam(obj.getUrl());
            if (name) {
                return param.hasOwnProperty(name) ? param[name] : null;
            }
            else {
                return param;
            }
        };

        obj.parseUrlParam = function (url) {
            if (url.indexOf("?")) {
                url = url.split("?")[1];
            }
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while (reg.exec(url)) {
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        };

        return obj;
    });

    container.define("object", [], function () {
        var obj = {};

        obj.keys = function (data) {
            var list = [];
            for (var key in data) {
                list.push(key);
            }
            return list;
        };

        obj.values = function (data) {
            var list = [];
            for (var key in data) {
                list.push(data[key]);
            }
            return list;
        };

        return obj;
    });

    container.define("storage", [], function () {
        var obj = {};

        obj.getValue = function (name, defaultValue) {
            name = obj.processName(name);
            return GM_getValue(name, defaultValue);
        };

        obj.setValue = function (name, value) {
            name = obj.processName(name);
            GM_setValue(name, value);
        };

        obj.getValueList = function () {
            var nameList = GM_listValues();
            var valueList = {};
            nameList.forEach(function (name) {
                if (injectInfo.enable) {
                    if (name.indexOf(injectInfo.name + "_") >= 0) {
                        name = name.replace(injectInfo.name + "_", "");
                        valueList[name] = obj.getValue(name);
                    }
                }
                else {
                    valueList[name] = obj.getValue(name);
                }
            });
            return valueList;
        };

        obj.processName = function (name) {
            if (injectInfo.enable) {
                return injectInfo.name + "_" + name;
            }
            else {
                return name;
            }
        };

        return obj;
    });

    container.define("config", ["storage"], function (storage) {
        var obj = {};

        obj.getConfig = function (name) {
            var configJson = storage.getValue("configJson");
            var configObject = obj.parseJson(configJson);
            if (name) {
                return configObject.hasOwnProperty(name) ? configObject[name] : null;
            }
            else {
                return configObject;
            }
        };

        obj.setConfig = function (name, value) {
            var configObject = obj.getConfig();
            configObject[name] = value;
            storage.setValue("configJson", JSON.stringify(configObject));
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("option", ["storage", "constant", "object"], function (storage, constant, object) {
        var obj = {
            constant: constant.option
        };

        obj.isOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            return option.indexOf(name) >= 0 ? true : false;
        };

        obj.setOptionActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            if (option.indexOf(name) < 0) {
                option.push(name);
                obj.setOption(option);
            }
        };

        obj.setOptionUnActive = function (item) {
            var name = item.name;
            var option = obj.getOption();
            var index = option.indexOf(name);
            if (index >= 0) {
                delete option[index];
                obj.setOption(option);
            }
        };

        obj.getOption = function () {
            var option = [];
            var optionJson = storage.getValue("optionJson");
            var optionObject = obj.parseJson(optionJson);
            object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (optionObject.hasOwnProperty(name)) {
                    if (optionObject[name] != "no") {
                        option.push(name);
                    }
                }
                else if (item.value != "no") {
                    option.push(name);
                }
            });
            return option;
        };

        obj.setOption = function (option) {
            var optionObject = {};
            object.values(obj.constant).forEach(function (item) {
                var name = item.name;
                if (option.indexOf(name) >= 0) {
                    optionObject[name] = "yes";
                } else {
                    optionObject[name] = "no";
                }
            });
            storage.setValue("optionJson", JSON.stringify(optionObject));
        };

        obj.parseJson = function (jsonStr) {
            var jsonObject = {};
            try {
                if (jsonStr) {
                    jsonObject = JSON.parse(jsonStr);
                }
            }
            catch (e) { }
            return jsonObject;
        };

        return obj;
    });

    container.define("mode", [], function () {
        var obj = {
            constant: {
                addon: "addon",
                script: "script"
            }
        };

        obj.getMode = function () {
            if (typeof GM_info == "undefined") {
                return obj.constant.addon;
            }
            else if (GM_info.scriptHandler) {
                return obj.constant.script;
            }
            else {
                return obj.constant.addon;
            }
        };

        return obj;
    });

    container.define("user", ["storage"], function (storage) {
        var obj = {};

        obj.getUid = function () {
            var uid = storage.getValue("uid");
            if (!uid) {
                uid = storage.getValue("_uid_");
            }
            if (!uid) {
                uid = obj.randString(32);
                storage.setValue("uid", uid);
            }
            return uid;
        };

        obj.randString = function (length) {
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
            var text = "";
            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };

        return obj;
    });

    container.define("browser", [], function () {
        var obj = {
            constant: {
                firefox: "firefox",
                edge: "edge",
                baidu: "baidu",
                liebao: "liebao",
                uc: "uc",
                qq: "qq",
                sogou: "sogou",
                opera: "opera",
                maxthon: "maxthon",
                ie2345: "2345",
                se360: "360",
                chrome: "chrome",
                safari: "safari",
                other: "other"
            }
        };

        obj.getBrowser = function () {
            return obj.matchBrowserType(navigator.userAgent);
        };

        obj.matchBrowserType = function (userAgent) {
            var browser = obj.constant.other;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/firefox/) != null) {
                browser = obj.constant.firefox;
            } else if (userAgent.match(/edge/) != null) {
                browser = obj.constant.edge;
            } else if (userAgent.match(/bidubrowser/) != null) {
                browser = obj.constant.baidu;
            } else if (userAgent.match(/lbbrowser/) != null) {
                browser = obj.constant.liebao;
            } else if (userAgent.match(/ubrowser/) != null) {
                browser = obj.constant.uc;
            } else if (userAgent.match(/qqbrowse/) != null) {
                browser = obj.constant.qq;
            } else if (userAgent.match(/metasr/) != null) {
                browser = obj.constant.sogou;
            } else if (userAgent.match(/opr/) != null) {
                browser = obj.constant.opera;
            } else if (userAgent.match(/maxthon/) != null) {
                browser = obj.constant.maxthon;
            } else if (userAgent.match(/2345explorer/) != null) {
                browser = obj.constant.ie2345;
            } else if (userAgent.match(/chrome/) != null) {
                if (obj.existMime("type", "application/vnd.chromium.remoting-viewer")) {
                    browser = obj.constant.se360;
                } else {
                    browser = obj.constant.chrome;
                }
            } else if (userAgent.match(/safari/) != null) {
                browser = obj.constant.safari;
            }
            return browser;
        };

        obj.existMime = function (option, value) {
            if (typeof navigator != "undefined") {
                var mimeTypes = navigator.mimeTypes;
                for (var mt in mimeTypes) {
                    if (mimeTypes[mt][option] == value) {
                        return true;
                    }
                }
            }
            return false;
        };

        return obj;
    });

    container.define("env", ["mode", "user", "browser"], function (mode, user, browser) {
        var obj = {};

        obj.getMode = function () {
            return mode.getMode();
        };

        obj.getAid = function () {
            if (GM_info.addon && GM_info.addon.id) {
                return GM_info.addon.id;
            }
            else if (GM_info.scriptHandler) {
                return GM_info.scriptHandler.toLowerCase();
            }
            else {
                return "unknown";
            }
        };

        obj.getUid = function () {
            return user.getUid();
        };

        obj.getVersion = function () {
            if (injectInfo.enable) {
                return injectInfo.version;
            }
            else {
                return GM_info.script.version;
            }
        };

        obj.getBrowser = function () {
            return browser.getBrowser();
        };

        obj.getInfo = function () {
            return {
                mode: obj.getMode(),
                aid: obj.getAid(),
                uid: obj.getUid(),
                version: obj.getVersion(),
                browser: obj.getBrowser()
            };
        };

        return obj;
    });

    container.define("http", [], function () {
        var obj = {};

        obj.ajax = function (option) {
            var details = {
                method: option.type,
                url: option.url,
                responseType: option.dataType,
                onload: function (result) {
                    option.success && option.success(result.response);
                },
                onerror: function (result) {
                    option.error && option.error(result.error);
                }
            };

            // 提交数据
            if (option.data) {
                if (option.data instanceof FormData) {
                    details.data = option.data;
                }
                else {
                    var formData = new FormData();
                    for (var i in option.data) {
                        formData.append(i, option.data[i]);
                    }
                    details.data = formData;
                }
            }

            // 自定义头
            if (option.headers) {
                details.headers = option.headers;
            }

            // 超时
            if (option.timeout) {
                details.timeout = option.timeout;
            }

            GM_xmlhttpRequest(details);
        };

        return obj;
    });

    container.define("router", [], function () {
        var obj = {};

        obj.goUrl = function (url) {
            obj.eval('location.href = "' + url + '";');
        };

        obj.openUrl = function (url) {
            obj.eval('window.open("' + url + '");');
        };

        obj.openTab = function (url, active) {
            GM_openInTab(url, !active);
        };

        obj.eval = function (script) {
            var node = document.createElementNS(document.lookupNamespaceURI(null) || "http://www.w3.org/1999/xhtml", "script");
            node.textContent = script;
            (document.head || document.body || document.documentElement || document).appendChild(node);
            node.parentNode.removeChild(node);
        };

        return obj;
    });

    container.define("logger", ["env", "constant"], function (env, constant) {
        var obj = {
            level: 3,
            constant: {
                debug: 0,
                info: 1,
                warn: 2,
                error: 3
            }
        };

        obj.debug = function (message) {
            obj.log(message, obj.constant.debug);
        };

        obj.info = function (message) {
            obj.log(message, obj.constant.info);
        };

        obj.warn = function (message) {
            obj.log(message, obj.constant.warn);
        };

        obj.error = function (message) {
            obj.log(message, obj.constant.error);
        };

        obj.log = function (message, level) {
            if (level < obj.level) {
                return false;
            }

            console.group("[" + constant.name + "]" + env.getMode());
            switch (level) {
                case obj.constant.debug:
                    console.log(message);
                    break;
                case obj.constant.info:
                    console.info(message);
                    break;
                case obj.constant.warn:
                    console.warn(message);
                    break;
                case obj.constant.error:
                    console.error(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
            console.groupEnd();
        };

        obj.setLevel = function (level) {
            obj.level = level;
        };

        return obj;
    });

    container.define("meta", ["constant", "$"], function (constant, $) {
        var obj = {};

        obj.existMeta = function (name) {
            name = obj.processName(name);
            if ($("meta[name='" + name + "']").length) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.appendMeta = function (name, content) {
            name = obj.processName(name);
            content || (content = "on");
            $('<meta name="' + name + '" content="on">').appendTo($("head"));
        };

        obj.processName = function (name) {
            return constant.name + "::" + name;
        };

        return obj;
    });

    container.define("calendar", ["object"], function (object) {
        var obj = {};

        obj.formatTime = function (timestamp, format) {
            timestamp || (timestamp = (new Date()).getTime());
            format || (format = "Y-m-d H:i:s");
            var date = new Date(timestamp);
            var year = 1900 + date.getYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hour = "0" + date.getHours();
            var minute = "0" + date.getMinutes();
            var second = "0" + date.getSeconds();
            var vars = {
                "Y": year,
                "m": month.substring(month.length - 2, month.length),
                "d": day.substring(day.length - 2, day.length),
                "H": hour.substring(hour.length - 2, hour.length),
                "i": minute.substring(minute.length - 2, minute.length),
                "s": second.substring(second.length - 2, second.length)
            };
            return obj.replaceVars(vars, format);
        };

        obj.replaceVars = function (vars, value) {
            object.keys(vars).forEach(function (key) {
                value = value.replace(key, vars[key]);
            });
            return value;
        };

        return obj;
    });

    /** custom start **/
    container.define("constant", ["mode", "browser"], function (mode, browser) {
        return {
            name: "yhg",
            mode: mode.constant,
            browser: browser.constant,
            option: {
                chart_scale: {
                    name: "chart_scale",
                    value: "yes"
                },
                chart_point: {
                    name: "chart_point",
                    value: "yes"
                },
                chart_zoom: {
                    name: "chart_zoom",
                    value: "no"
                },
                taobao_detail: {
                    name: "taobao",
                    value: "yes"
                },
                taobao_shop_coupon: {
                    name: "taobao_shop_coupon",
                    value: "no"
                },
                taobao_search: {
                    name: "taobao_search",
                    value: "yes"
                },
                taobao_shop: {
                    name: "taobao_shop",
                    value: "yes"
                },
                jd_detail: {
                    name: "jd",
                    value: "yes"
                },
                kaola_detail: {
                    name: "kaola",
                    value: "yes"
                },
                yanxuan_detail: {
                    name: "yanxuan",
                    value: "yes"
                },
                suning_detail: {
                    name: "suning",
                    value: "yes"
                },
                dangdang_detail: {
                    name: "dangdang",
                    value: "yes"
                },
                guomei_detail: {
                    name: "guomei",
                    value: "yes"
                }
            },
            site: {
                taobao: "taobao",
                jd: "jd",
                kaola: "kaola",
                guomei: "guomei",
                yanxuan: "yanxuan",
                suning: "suning",
                dangdang: "dangdang",
                newday: "newday"
            },
            router: {
                home: "http://tb.newday.me",
                option: "http://tb.newday.me/script/option.html"
            }
        };
    });

    container.define("resource", [], function () {
        var obj = {};

        obj.getText = function (name) {
            if (name == "style") {
                return obj.getStyleText();
            }
            else {
                return null;
            }
        };

        obj.getStyleText = function () {
            return '#tb-cool-area{border:1px solid #eee;margin:0 auto;position:relative;clear:both;display:none}#tb-cool-area .tb-cool-area-home{position:absolute;top:5px;right:10px;z-index:10000}#tb-cool-area .tb-cool-area-home a{color:#515858;font-size:10px;text-decoration:none}#tb-cool-area .tb-cool-area-home a.new-version{color:#ff0036}#tb-cool-area .tb-cool-area-benefit{width:240px;float:left}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode{text-align:center;min-height:150px;margin-top:40px}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode canvas,#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode img{margin:0 auto}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title{margin-top:20px;color:#000;font-size:14px;font-weight:700;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action{margin-top:10px;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action a{text-decoration:none}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button{min-width:120px;padding:0 8px;line-height:35px;color:#fff;background:#ff0036;font-size:13px;font-weight:700;letter-spacing:1.5px;margin:0 auto;text-align:center;border-radius:15px;display:inline-block;cursor:pointer}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button.quan-none{color:#000;background:#bec5c5}#tb-cool-area .tb-cool-area-history{height:300px;overflow:hidden;position:relative}#tb-cool-area .tb-cool-area-history #tb-cool-area-chart,#tb-cool-area .tb-cool-area-history .tb-cool-area-container{width:100%;height:100%}#tb-cool-area .tb-cool-area-history .tb-cool-history-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-area-table{margin-top:10px;position:relative;overflow:hidden}#tb-cool-area .tb-cool-quan-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;opacity:0;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-quan-tip a{color:#333;font-weight:400;text-decoration:none}#tb-cool-area .tb-cool-quan-tip a:hover{color:#ff0036}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table{width:100%;font-size:14px;text-align:center}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td{padding:4px;color:#1c2323;border-top:1px solid #eee;border-left:1px solid #eee}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td:first-child{border-left:none}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link{width:60px;line-height:24px;font-size:12px;background:#ff0036;text-decoration:none;display:inline-block}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-enable{cursor:pointer;color:#fff}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-disable{cursor:default;color:#000;background:#ccc}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-tip{opacity:1}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-table{filter:blur(3px);-webkit-filter:blur(3px);-moz-filter:blur(3px);-ms-filter:blur(3px)}.tb-cool-box-area{position:absolute;top:10px;left:5px;z-index:9999}.tb-cool-box-wait{cursor:pointer}.tb-cool-box-already{position:relative}.tb-cool-box-info{width:auto!important;height:auto!important;padding:6px 8px!important;font-size:12px;color:#fff!important;border-radius:15px;cursor:pointer;text-decoration:none!important}.tb-cool-box-info:hover{text-decoration:none!important}.tb-cool-box-info:visited{text-decoration:none!important}.tb-cool-box-info-default{background:#3186fd!important}.tb-cool-box-info-find{background:#ff0036!important}.tb-cool-box-info-empty{color:#000!important;background:#ccc!important}.tb-cool-box-info-translucent{opacity:.33}.mui-zebra-module .tb-cool-box-info{font-size:10px}.zebra-ziying-qianggou .tb-cool-box-area{right:10px;left:auto}.import-shangou-itemcell .tb-cool-box-area{right:10px;left:auto}.item_s_cpb .tb-cool-box-area{top:auto;bottom:10px}.j-mdv-chaoshi .m-floor .tb-cool-box-area a{width:auto;height:auto}.left-wider .proinfo-main{margin-bottom:40px}.detailHd .m-info{margin-bottom:20px}.tb-cool-quan-date{color: #233b3d;font-weight: normal;font-size: 12px;} .tb-cool-area-has-date .tb-cool-quan-qrcode{margin-top: 30px !important;} .tb-cool-area-has-date .tb-cool-quan-title{margin-top: 10px !important;}';
        };

        return obj;
    });

    container.define("api", ["http", "env", "snap"], function (http, env, snap) {
        var obj = {
            base: "https://api.newday.me"
        };

        obj.versionQuery = function (callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/taobao/tool/version",
                dataType: "json",
                data: {
                    uid: env.getUid(),
                    aid: env.getAid(),
                    version: env.getVersion(),
                    browser: env.getBrowser(),
                    mode: env.getMode()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.itemQuery = function (url, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/taobao/tool/query",
                dataType: "json",
                data: {
                    item_url: url,
                    uid: env.getUid(),
                    aid: env.getAid(),
                    version: env.getVersion(),
                    browser: env.getBrowser(),
                    mode: env.getMode()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.basicQuery = function (itemId, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/taobao/tool/basic",
                dataType: "json",
                data: {
                    item_id: itemId,
                    source: "taobao",
                    uid: env.getUid(),
                    aid: env.getAid(),
                    version: env.getVersion(),
                    browser: env.getBrowser(),
                    mode: env.getMode()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.trendQuery = function (url, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/taobao/tool/trend",
                dataType: "json",
                data: {
                    item_url: url,
                    item_point: obj.getStrPoint(url),
                    uid: env.getUid(),
                    aid: env.getAid(),
                    version: env.getVersion(),
                    browser: env.getBrowser(),
                    mode: env.getMode()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.logOption = function (option, callback) {
            http.ajax({
                type: "post",
                url: obj.base + "/taobao/tool/option",
                dataType: "json",
                data: {
                    option_json: JSON.stringify(option),
                    uid: env.getUid(),
                    aid: env.getAid(),
                    version: env.getVersion(),
                    browser: env.getBrowser(),
                    mode: env.getMode()
                },
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.couponQueryShop = function (itemId, shopId, callback) {
            http.ajax({
                type: "get",
                url: "https://cart.taobao.com/json/GetPriceVolume.do?sellerId=" + shopId,
                dataType: "json",
                success: function (response) {
                    callback && callback(response);
                },
                error: function (error) {
                    callback && callback("");
                }
            });
        };

        obj.getStrPoint = function (str) {
            if (str.length < 2) {
                return "0:0";
            }

            var path = "";
            var current, last = str[0].charCodeAt();
            var sum = last;
            for (var i = 1; i < str.length; i++) {
                current = str[i].charCodeAt();
                if (i == 1) {
                    path = path + "M";
                } else {
                    path = path + " L";
                }
                path = path + current + " " + last;
                last = current;
                sum = sum + current;
            }
            path = path + " Z";
            var index = sum % str.length;
            var data = snap.path.getPointAtLength(path, str[index].charCodeAt());
            return data.m.x + ":" + data.n.y;
        };

        return obj;
    });

    container.define("updater", ["config", "env", "calendar", "api"], function (config, env, calendar, api) {
        var obj = {};

        obj.getLatest = function () {
            var versionLatest = config.getConfig("version_latest");
            if (versionLatest) {
                return versionLatest;
            }
            else {
                return env.getVersion();
            }
        };

        obj.init = function () {
            var versionDate = config.getConfig("version_date");
            var currentDate = calendar.formatTime(null, "Ymd");
            if (!versionDate || versionDate < currentDate) {
                api.versionQuery(function (response) {
                    config.setConfig("version_date", currentDate);
                    if (response && response.code == 1) {
                        config.setConfig("dialog", response.data.dialog);
                        config.setConfig("version_latest", response.data.version);
                    }
                });
            }
        };

        return obj;
    });

    container.define("core", ["config", "env", "router", "constant", "resource", "updater", "$"], function (config, env, router, constant, resource, updater, $) {
        var obj = {};

        obj.appendStyle = function () {
            var styleText = resource.getText("style");
            $("<style></style>").text(styleText).appendTo($("head"));
        };

        obj.jumpLink = function (jumpUrl, jumpMode) {
            switch (jumpMode) {
                case 9:
                    // self
                    router.goUrl(jumpUrl);
                    break;
                case 6:
                    // new
                    router.openUrl(jumpUrl);
                    break;
                case 3:
                    // new & not active
                    router.openTab(jumpUrl, false);
                    break;
                case 1:
                    // new & active
                    router.openTab(jumpUrl, true);
                    break;
            }
        };

        obj.jumpCouponLink = function (jumpUrl, jumpMode) {
            var callback = function () {
                obj.jumpLink(jumpUrl, jumpMode);
            };
            if (!window.layer || env.getMode() == constant.mode.script) {
                callback();
            }
            else if (env.getBrowser() != constant.browser.se360 || config.getConfig("dialog") == 0) {
                callback();
            }
            else if (config.getConfig("remember")) {
                callback();
            }
            else {
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: false,
                    area: "400px",
                    shade: 0.8,
                    id: "nd-coupon-dialog",
                    btn: ["同意跳转", "还是算了"],
                    btnAlign: "c",
                    zIndex: 199999999,
                    content: '<div style="padding: 30px 50px 20px 50px; line-height: 30px; background-color: #008a98; font-size: 13px; color: #fff; text-align: center;">即将跳转到淘宝客链接领取优惠券...<br/>只是去领取优惠券，对购物没有任何影响哦！<br/><input class="nd-ignore-dialog" type="checkbox" style="vertical-align: middle;"> <span>不再提示</span></div>'
                    , success: function (layero) {
                        var $checkbox = layero.find(".nd-ignore-dialog");
                        var $buttonYes = layero.find(".layui-layer-btn0");
                        $buttonYes.on("click", function () {
                            if ($checkbox.prop("checked")) {
                                config.setConfig("remember", "yes");
                            }
                            setTimeout(callback, 500);
                        });
                    }
                });
            }
        };

        obj.openOptionPage = function () {
            if (injectInfo.enable) {
                if (env.getMode() == constant.mode.addon) {
                    router.openTab(injectInfo.router_addon.option, true);
                }
                else {
                    router.openTab(injectInfo.router_script.option, true);
                }
            }
            else if (GM_info.addon && GM_info.addon.options_page) {
                router.openTab(GM_info.addon.options_page, true);
            }
            else {
                router.openTab(constant.router.option, true);
            }
        };

        obj.initVersion = function () {
            updater.init();
        };

        obj.ready = function (callback) {
            obj.initVersion();

            callback && callback();
        };

        return obj;
    });

    /** app start **/
    container.define("app_detail", ["runtime", "object", "option", "env", "logger", "calendar", "constant", "core", "api", "echarts", "$"], function (runtime, object, option, env, logger, calendar, constant, core, api, echarts, $) {
        var obj = {
            trendData: null
        };

        obj.getSite = function () {
            return obj.matchSite(runtime.getUrl());
        };

        obj.getItemUrl = function () {
            return obj.matchItemUrl(runtime.getUrl());
        };

        obj.run = function () {
            var site = obj.getSite();
            switch (site) {
                case constant.site.taobao:
                    option.isOptionActive(option.constant.taobao_detail) && obj.initDetailTaoBao();
                    break;
                case constant.site.jd:
                    option.isOptionActive(option.constant.jd_detail) && obj.initDetailJd();
                    break;
                case constant.site.kaola:
                    option.isOptionActive(option.constant.kaola_detail) && obj.initDetailKaoLa();
                    break;
                case constant.site.yanxuan:
                    option.isOptionActive(option.constant.yanxuan_detail) && obj.initDetailYanXuan();
                    break;
                case constant.site.suning:
                    option.isOptionActive(option.constant.suning_detail) && obj.initDetailSuNing();
                    break;
                case constant.site.dangdang:
                    option.isOptionActive(option.constant.dangdang_detail) && obj.initDetailDangDang();
                    break;
                case constant.site.guomei:
                    option.isOptionActive(option.constant.guomei_detail) && obj.initDetailGuoMei();
                    break;
                default:
                    return false;
            }
            return true;
        };

        obj.initDetailTaoBao = function () {
            if ($('#detail').length || $(".ju-wrapper").length) {
                var html = obj.getAppendHtml();
                if ($("#J_DetailMeta").length) {
                    $("#J_DetailMeta").append(html);
                } else {
                    $("#detail").append(html + "<br/>");
                }

                var onEmpty = function () {
                    obj.showText("打开淘宝扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailTaoBao();
                }, 1000);
            }
        };

        obj.initDetailJd = function () {
            if ($(".product-intro").length) {
                var html = obj.getAppendHtml();
                $(".product-intro").append(html);

                var onEmpty = function () {
                    obj.showText("打开京东扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailJd();
                }, 1000);
            }
        };

        obj.initDetailKaoLa = function () {
            if ($("#j-producthead").length) {
                var html = obj.getAppendHtml();
                $("#j-producthead").after(html);

                var onEmpty = function () {
                    obj.showText("打开考拉扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailKaoLa();
                }, 1000);
            }
        };

        obj.initDetailYanXuan = function () {
            if ($(".detailHd").length) {
                var html = obj.getAppendHtml();
                $(".detailHd").append(html);

                var onEmpty = function () {
                    obj.showText("打开严选扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailYanXuan();
                }, 1000);
            }
        };

        obj.initDetailSuNing = function () {
            if ($(".proinfo-container").length) {
                var html = obj.getAppendHtml();
                $(".proinfo-container").append(html);

                var onEmpty = function () {
                    obj.showText("打开苏宁扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailSuNing();
                }, 1000);
            }
        };

        obj.initDetailDangDang = function () {
            if ($(".product_main").length) {
                var html = obj.getAppendHtml();
                $(".product_main").append(html);

                var onEmpty = function () {
                    obj.showText("打开当当扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailDangDang();
                }, 1000);
            }
        };

        obj.initDetailGuoMei = function () {
            if ($(".gome-container").length) {
                var html = obj.getAppendHtml();
                $(".gome-container").append(html);

                var onEmpty = function () {
                    obj.showText("打开国美扫一扫");
                };
                obj.initDetail(onEmpty);
            } else {
                setTimeout(function () {
                    obj.initDetailGuoMei();
                }, 1000);
            }
        };

        obj.initDetail = function (onEmpty) {
            // 版本信息
            obj.showVersion();

            // 商品查询
            api.itemQuery(runtime.getUrl(), function (response) {
                logger.debug(response);
                $("#tb-cool-area").show();

                if (response && response.code == 1) {
                    var data = response.data;

                    // 价格趋势
                    obj.showChart(data.good_url);

                    // 隐藏优惠券
                    if (data.coupon_money > 0) {
                        obj.showCoupon(data);
                    }
                    else {
                        onEmpty();
                    }

                    // 优惠券列表
                    if (obj.getSite() == constant.site.taobao && option.isOptionActive(option.constant.taobao_shop_coupon)) {
                        obj.showCouponList(data.item_id, data.shop_id);
                    }

                    // 二维码
                    obj.showQrcode(data.app_url);
                }
                else {
                    var itemUrl = obj.getItemUrl();

                    // 价格趋势
                    obj.showChart(itemUrl);

                    // 无优惠券
                    onEmpty();

                    // 二维码
                    obj.showQrcode(itemUrl);
                }
            });
        };

        obj.openCouponLink = function (couponId, shopId) {
            var couponLink = obj.buildCouponLink(couponId, shopId);
            window.open(couponLink, "领取优惠券", "width=600,height=600,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
        };

        obj.showCoupon = function (data) {
            var html = "<p>券后价 <span>" + data.coupon_price.toFixed(2) + "</span> 元</p>";
            if (data.start_time && data.end_time) {
                html += "<p class=\"tb-cool-quan-date\">（" + data.start_time + " ~ " + data.end_time + "）</p>";

                $(".tb-cool-area-benefit").addClass("tb-cool-area-has-date");
            }
            $(".tb-cool-quan-title").html(html);

            html = '<a class="tb-cool-quan-button quan-exist" data-url="' + data.jump_url + '" data-mode="' + data.jump_mode + '">领' + data.coupon_money + '元优惠券</a>';
            $(".tb-cool-quan-action").html(html);

            $(".tb-cool-quan-button.quan-exist").each(function () {
                var $this = this;
                var jumpUrl = $($this).attr("data-url");
                var jumpMode = parseInt($($this).attr("data-mode"));
                $this.onclick = function () {
                    core.jumpCouponLink(jumpUrl, jumpMode);
                };
            });
        };

        obj.showQrcode = function (url) {
            var qr = qrcode(5, "M");
            qr.addData(url);
            qr.make();
            $(".tb-cool-quan-qrcode").html(qr.createImgTag(4, 2));
        };

        obj.showText = function (buttonText, infoText) {
            var infoTextArr = ["移动端<span>快捷</span>购买"];
            if (!infoText) {
                var index = (new Date()).valueOf() % infoTextArr.length;
                infoText = infoTextArr[index];
            }
            var infoHtml = "<p>" + infoText + "</p>";
            $(".tb-cool-quan-title").html(infoHtml);

            buttonText || (buttonText = "手机扫一扫");
            var buttonHtml = '<a class="tb-cool-quan-button quan-none">' + buttonText + '</a>';
            $(".tb-cool-quan-action").html(buttonHtml);
        };

        obj.showVersion = function () {
            var html = '<a class="nd-open-page-option" title="当前版本：' + env.getVersion() + '" href="javascript:;">[ 配置 ]</a>';
            $(".tb-cool-area-home").html(html);

            // 打开配置页
            $(".nd-open-page-option").each(function () {
                this.onclick = function () {
                    core.openOptionPage();
                };
            });
        };

        obj.showChart = function (itemUrl) {
            $(".tb-cool-history-tip").html("查询历史价格中...");

            api.trendQuery(itemUrl, function (response) {
                logger.debug(response);

                obj.trendData = obj.parseTrendResponse(response);
                obj.showChartRefresh();
            });
        };

        obj.showChartRefresh = function () {
            obj.showChartData(obj.trendData);
        };

        obj.showChartData = function (trendData) {
            if (trendData) {
                var option = obj.buildChartOption(trendData);
                $(".tb-cool-area-container").html('<div id="tb-cool-area-chart"></div>');
                echarts.init(document.getElementById("tb-cool-area-chart")).setOption(option);
                $(".tb-cool-history-tip").html("");
            }
            else {
                $(".tb-cool-history-tip").html("暂无商品历史价格信息");
            }
        };

        obj.showCouponList = function (itemId, shopId) {
            api.couponQueryShop(itemId, shopId, function (response) {
                var couponList;
                if (response) {
                    couponList = obj.parseCouponListShop(itemId, shopId, response);
                    obj.showCouponListLoginYes(couponList);
                }
                else {
                    couponList = obj.parseCouponListPadding();
                    obj.showCouponListLoginNo(couponList);
                }
            });
        };

        obj.showCouponListLoginYes = function (couponList) {
            obj.buildCouponListTable(couponList);
        };

        obj.showCouponListLoginNo = function (couponList) {
            obj.buildCouponListTable(couponList);

            var loginUrl = obj.buildLoginUrl();
            $(".tb-cool-quan-tip").html('<a href="' + loginUrl + '">登录后可以查看店铺优惠券哦</a>');
            $(".tb-cool-area-table").addClass("tb-cool-quan-empty");
        };

        obj.buildCouponListTable = function (couponList) {
            var list = object.values(couponList);
            var compare = function (a, b) {
                if (a.coupon_money == b.coupon_money) {
                    if (a.coupon_money_start > b.coupon_money_start) {
                        return 1;
                    } else if (a.coupon_money_start == b.coupon_money_start) {
                        return 0;
                    } else {
                        return -1;
                    }
                } else {
                    if (a.coupon_money > b.coupon_money) {
                        return 1;
                    } else if (a.coupon_money == b.coupon_money) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
            };
            list.sort(compare);

            var html = "";
            list.forEach(function (item) {
                html += "<tr>";
                html += "<td>满 " + item.coupon_money_start + " 减 <span>" + item.coupon_money + "</span> 元</td>";
                var couponCommon;
                if (item.coupon_common == 1) {
                    couponCommon = "限定商品";
                } else if (item.coupon_common == 0) {
                    couponCommon = "<span>通用</span>";
                } else {
                    couponCommon = "--";
                }
                html += "<td> " + couponCommon + "</td>";
                html += "<td>" + item.coupon_start + " ~ <span>" + item.coupon_end + "</span></td>";
                html += "<td>已领 <span>" + item.coupon_num + "</span> 张</td>";
                if (item.coupon_receive) {
                    html += '<td><a class="tb-cool-quan-link tb-cool-quan-link-disable">已领取</a></td>';
                } else {
                    html += '<td><a class="tb-cool-quan-link tb-cool-quan-link-enable" data-shop="' + item.shop_id + '" data-coupon="' + item.coupon_id + '">领 取</a></td>';
                }
                html += "</tr>";
            });
            $(".tb-cool-quan-table").html(html);

            $(".tb-cool-quan-link-enable").each(function () {
                var $this = this;
                var couponId = $($this).attr("data-coupon");
                var shopId = $($this).attr("data-shop");
                $this.onclick = function () {
                    obj.openCouponLink(couponId, shopId);
                };
            });
        };

        obj.buildLoginUrl = function () {
            var itemUrl = obj.getItemUrl();
            return "https://login.tmall.com/?redirectURL=" + escape(itemUrl);
        };

        obj.buildCouponLink = function (couponId, shopId) {
            return "https://market.m.taobao.com/apps/aliyx/coupon/detail.html?wh_weex=true&activity_id=" + couponId + "&seller_id=" + shopId;
        };

        obj.buildChartOption = function (trendData) {
            logger.debug(trendData);

            var text = "历史低价：{red|￥" + parseFloat(trendData.stat.min_price).toFixed(2) + "} ( {red|" + trendData.stat.min_date + "} )";
            var chartOption = {
                title: {
                    left: "center",
                    subtext: text,
                    subtextStyle: {
                        color: "#000",
                        rich: {
                            red: {
                                color: "red"
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross"
                    },
                    formatter: function (params) {
                        params = params[0];
                        var year = params.name.getFullYear();
                        var month = params.name.getMonth() + 1;
                        var day = params.name.getDate();
                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        return "日期：" + year + "-" + month + "-" + day + "<br/>价格：￥" + params.value[1].toFixed(2);
                    }
                },
                grid: {
                    left: 0,
                    right: 20,
                    top: 50,
                    bottom: 10,
                    containLabel: true
                },
                xAxis: {
                    type: "time"
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        type: "line",
                        step: "end",
                        data: trendData.data,
                        symbolSize: 3,
                        lineStyle: {
                            width: 1.5,
                            color: "#ed5700"
                        }
                    }
                ]
            };

            // 自动刻度
            if (option.isOptionActive(option.constant.chart_scale)) {
                var step = 10;
                var Ymin = Math.floor(trendData.stat.min_price * 0.9 / step) * step;
                var Ymax = Math.ceil(trendData.stat.max_price * 1.1 / step) * step;
                chartOption.yAxis.min = Ymin;
                chartOption.yAxis.max = Ymax;
            }

            // 标记极值
            if (option.isOptionActive(option.constant.chart_point)) {
                var series = chartOption.series[0];
                series.markPoint = {
                    data: [
                        {
                            value: trendData.stat.min_price,
                            coord: [trendData.stat.min_time, trendData.stat.min_price],
                            name: "最小值",
                            itemStyle: {
                                color: "green"
                            }
                        },
                        {
                            value: trendData.stat.max_price,
                            coord: [trendData.stat.max_time, trendData.stat.max_price],
                            name: "最大值",
                            itemStyle: {
                                color: "red"
                            }
                        }
                    ]
                };
            }

            // 自由缩放
            if (option.isOptionActive(option.constant.chart_zoom)) {
                chartOption.dataZoom = [
                    {
                        type: "inside",
                        start: 0,
                        end: 100
                    }
                ];
            }

            logger.debug(chartOption);
            return chartOption;
        };

        obj.parseTrendResponse = function (response) {
            if (response && response.code == 1 && response.data.list.length) {
                var list = response.data.list;

                var trendData = {
                    stat: {
                        min_price: 0,
                        min_time: null,
                        min_date: null,
                        max_price: 0,
                        max_time: null,
                        max_date: null
                    },
                    data: []
                };
                list.forEach(function (item, index) {
                    var price = Math.ceil(item.price);
                    var time = new Date(item.time * 1000);
                    var date = calendar.formatTime(item.time * 1000, "Y-m-d");

                    var point = {
                        name: time,
                        value: [
                            date,
                            price
                        ]
                    };
                    trendData.data.push(point);

                    if (trendData.stat.min_price == 0 || trendData.stat.min_price >= price) {
                        trendData.stat.min_price = price;
                        trendData.stat.min_time = time;
                        trendData.stat.min_date = date;
                    }

                    if (trendData.stat.max_price <= price) {
                        trendData.stat.max_price = price;
                        trendData.stat.max_time = time;
                        trendData.stat.max_date = date;
                    }
                });
                return trendData;
            }
            else {
                return null;
            }
        };

        obj.parseCouponListPadding = function () {
            return [
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 10,
                    coupon_money_start: 20,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 0
                },
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 20,
                    coupon_money_start: 40,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 1
                },
                {
                    shop_id: "",
                    coupon_receive: false,
                    coupon_num: 0,
                    coupon_id: "",
                    coupon_money: 40,
                    coupon_money_start: 80,
                    coupon_start: "2018-01-01",
                    coupon_end: "2018-12-12",
                    coupon_common: 0
                }
            ];
        };

        obj.parseCouponListShop = function (itemId, shopId, response) {
            var couponList = {};
            if (response && response.priceVolumes) {
                response.priceVolumes.forEach(function (item) {
                    var couponId = item.id;
                    var receive = item.status == "received";
                    if (couponList.hasOwnProperty(couponId)) {
                        couponList[couponId].coupon_receive = receive;
                        couponList[couponId].coupon_num = item.receivedAmount;
                    }
                    else {
                        var couponMoneyStart = item.condition.replace("满", "").split("减")[0];
                        var couponStart = item.timeRange.split("-")[0];
                        var couponEnd = item.timeRange.split("-")[1];
                        couponList[couponId] = {
                            shop_id: shopId,
                            coupon_receive: receive,
                            coupon_num: item.receivedAmount,
                            coupon_id: couponId,
                            coupon_money: parseFloat(item.price).toFixed(2),
                            coupon_money_start: parseFloat(couponMoneyStart).toFixed(2),
                            coupon_start: couponStart,
                            coupon_end: couponEnd,
                            coupon_common: -1
                        };
                    }
                });
            }
            return couponList;
        };

        obj.matchItemUrl = function (url) {
            var site = obj.matchSite(url);
            var itemId = runtime.getUrlParam("id");

            if (site == constant.site.taobao) {
                if (itemId) {
                    return "https://item.taobao.com/item.htm?id=" + itemId;
                } else {
                    return url;
                }
            }

            if (site == constant.site.yanxuan) {
                if (itemId) {
                    return "http://you.163.com/item/detail?id=" + itemId;
                } else {
                    return url;
                }
            }

            // 去除参数和哈希
            url = url.split("?")[0];
            url = url.split("#")[0];

            if (site == constant.site.guomei) {
                url = url.replace("https", "http");
                return url;
            }

            return url;
        };

        obj.matchSite = function (url) {
            // 淘宝
            if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
                return constant.site.taobao;
            }

            // 京东
            if (url.indexOf("item.jd.com") > 0 || url.indexOf("item.jd.hk") > 0) {
                return constant.site.jd;
            }

            // 考拉
            if (url.indexOf("goods.kaola.com") > 0) {
                return constant.site.kaola;
            }

            // 严选
            if (url.indexOf("you.163.com/item") > 0) {
                return constant.site.yanxuan;
            }

            // 苏宁
            if (url.indexOf("product.suning.com") > 0) {
                return constant.site.suning;
            }

            // 当当
            if (url.indexOf("product.dangdang.com") > 0) {
                return constant.site.dangdang;
            }

            // 国美
            if (url.indexOf("item.gome.com.cn") > 0) {
                return constant.site.guomei;
            }

            return null;
        };

        obj.getAppendHtml = function () {
            return '<div id="tb-cool-area"><div class="tb-cool-area-home"></div><div class="tb-cool-area-benefit"><div class="tb-cool-quan-qrcode"></div><div class="tb-cool-quan-title"></div><div class="tb-cool-quan-action"></div></div><div id="tb-cool-area-history" class="tb-cool-area-history"><div class="tb-cool-area-container"></div><p class="tb-cool-history-tip"></p></div><div class="tb-cool-area-table"><table class="tb-cool-quan-table"></table><p class="tb-cool-quan-tip"></p></div></div>';
        };

        return obj;
    });

    container.define("app_search", ["runtime", "option", "api", "$"], function (runtime, option, api, $, require) {
        var obj = {};

        obj.run = function () {
            var selectorList = [];

            // 搜索页
            if (option.isOptionActive(option.constant.taobao_search)) {
                var url = runtime.getUrl();
                if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0) {
                    selectorList.push(".items .item");
                }
                else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
                    selectorList.push(".product");
                    selectorList.push(".chaoshi-recommend-list .chaoshi-recommend-item");
                }
                else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
                    selectorList.push("#J_ItemList .product");
                }
            }

            // 店铺页
            if (option.isOptionActive(option.constant.taobao_shop)) {
                selectorList.push("#J_ShopSearchResult .item");
            }

            if (selectorList && selectorList.length > 0) {
                obj.initSearchHtml(selectorList);
                obj.initSearchEvent();
                obj.basicQuery();
            }
        };

        obj.initSearchHtml = function (selectorList) {
            setInterval(function () {
                selectorList.forEach(function (selector) {
                    obj.initSearchItemSelector(selector);
                });
            }, 3000);
        };

        obj.initSearchEvent = function () {
            $(document).on("click", ".tb-cool-box-area", function () {
                var $this = $(this);
                if ($this.hasClass("tb-cool-box-wait")) {
                    obj.basicQueryItem(this);
                } else if ($this.hasClass("tb-cool-box-info-translucent")) {
                    $this.removeClass("tb-cool-box-info-translucent");
                } else {
                    $this.addClass("tb-cool-box-info-translucent");
                }
            });
        };

        obj.basicQuery = function () {
            setInterval(function () {
                $(".tb-cool-box-wait").each(function () {
                    obj.basicQueryItem(this);
                });
            }, 3000);
        };

        obj.initSearchItemSelector = function (selector) {
            $(selector).each(function () {
                obj.initSearchItem(this);
            });
        };

        obj.initSearchItem = function (selector) {
            var $this = $(selector);
            if ($this.hasClass("tb-cool-box-already")) {
                return;
            } else {
                $this.addClass("tb-cool-box-already")
            }

            var nid = $this.attr("data-id");
            if (!obj.isVailidItemId(nid)) {
                nid = $this.attr("data-itemid");
            }

            if (!obj.isVailidItemId(nid)) {
                if ($this.attr("href")) {
                    nid = location.protocol + $this.attr("href");
                } else {
                    var $a = $this.find("a");
                    if (!$a.length) {
                        return;
                    }

                    nid = $a.attr("data-nid");
                    if (!obj.isVailidItemId(nid)) {
                        if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
                            nid = location.protocol + $($a[1]).attr("href");
                        } else {
                            nid = location.protocol + $a.attr("href");
                        }
                    }
                }
            }

            if (obj.isValidNid(nid)) {
                obj.appenBasicQueryHtml($this, nid);
            }
        };

        obj.appenBasicQueryHtml = function (selector, nid) {
            selector.append('<div class="tb-cool-box-area tb-cool-box-wait" data-nid="' + nid + '"><a class="tb-cool-box-info tb-cool-box-info-default" title="点击查询">待查询</a></div>');
        };

        obj.basicQueryItem = function (selector) {
            var $this = $(selector);
            $this.removeClass("tb-cool-box-wait");

            var nid = $this.attr("data-nid");
            api.basicQuery(nid, function (response) {
                if (response && response.code == 1) {
                    var data = response.data;
                    if (data.coupon_money > 0) {
                        obj.showBasicQueryFind($this, data.item_id, data.item_price_buy, data.coupon_money);
                    } else {
                        obj.showBasicQueryEmpty($this);
                    }
                } else {
                    obj.showBasicQueryEmpty($this);
                }
            });
        };

        obj.showBasicQueryFind = function (selector, itemId, itemPriceBuy, couponMoney) {
            selector.html('<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="切换透明度">券后 ' + itemPriceBuy + '（减' + couponMoney + '元）</a>');
        };

        obj.showBasicQueryEmpty = function (selector) {
            selector.addClass("tb-cool-box-info-translucent");
            selector.html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" title="切换透明度">暂无优惠</a>');
        };

        obj.isVailidItemId = function (itemId) {
            if (!itemId) {
                return false;
            }

            var itemIdInt = parseInt(itemId);
            if (itemIdInt == itemId && itemId > 10000) {
                return true;
            }
            else {
                return false;
            }
        };

        obj.isValidNid = function (nid) {
            if (!nid) {
                return false;
            }
            else if (nid.indexOf('http') >= 0) {
                if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        };

        obj.isDetailPageTaoBao = function (url) {
            if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 || url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf("//detail.tmall.hk/hk/item.htm") > 0) {
                return true;
            } else {
                return false;
            }
        };

        return obj;
    });

    container.define("app_newday", ["option", "env", "api", "meta", "core", "$", "vue"], function (option, env, api, meta, core, $, vue) {
        var obj = {};

        obj.run = function () {
            if (meta.existMeta("info")) {
                obj.initInfoPage();
                return true;
            }
            else if (meta.existMeta("option")) {
                obj.initOptionPage();
                return true;
            }
            else if (meta.existMeta("dev")) {
                obj.initDevPage();
                return true;
            }
            else {
                return false;
            }
        };

        obj.initInfoPage = function () {
            new vue({
                el: "#container",
                data: {
                    info: env.getInfo()
                },
                mounted: function () {
                    obj.initAddonReady();
                }
            });
        };

        obj.initOptionPage = function () {
            new vue({
                el: "#container",
                data: {
                    info: env.getInfo(),
                    option: option.getOption()
                },
                mounted: function () {
                    obj.initAddonReady();
                },
                watch: {
                    option: function (value) {
                        option.setOption(value);
                        api.logOption(value);
                    }
                }
            });
        };

        obj.initDevPage = function () {
            $("#dev-addon-info").val(JSON.stringify(env.getInfo()));

            $(".dev-open-page-option").addClass("nd-open-page-option").removeClass("dev-open-page-option");
            $(document).on("click", ".nd-open-page-option", function () {
                core.openOptionPage();
            });
        };

        obj.initAddonReady = function () {
            $("body").addClass("nd-addon-ready");
        };

        return obj;
    });

    container.define("app", ["runtime", "meta", "logger", "core", "$"], function (runtime, meta, logger, core, $, require) {
        var obj = {};

        obj.run = function () {
            var metaName = "status";
            if (meta.existMeta(metaName)) {
                logger.warn("setup already");
            }
            else {
                logger.info("setup success");

                // 当前链接
                var url = runtime.getUrl();
                logger.info(url);

                // 添加meta
                meta.appendMeta(metaName);

                // 添加style
                core.appendStyle();

                // 运行应用
                $(obj.runApp);
            }
        };

        obj.runApp = function () {
            var appList = [
                "app_detail",
                "app_newday",
                "app_search"
            ];
            for (var i in appList) {
                if (require(appList[i]).run() == true) {
                    break;
                }
            }
        };

        return obj;
    });

    // lib
    container.define("$", [], function () {
        return window.$;
    });
    container.define("snap", [], function () {
        if (typeof Snap != "undefined") {
            return Snap;
        }
        else {
            return window.Snap;
        }
    });
    container.define("vue", [], function () {
        return window.Vue;
    });
    container.define("echarts", [], function () {
        if (typeof echarts != "undefined") {
            return echarts;
        }
        else {
            return window.echarts;
        }
    });

    container.use(["core", "app", "logger"], function (core, app, logger) {

        // 日志级别
        logger.setLevel(logger.constant.info);

        core.ready(function () {
            app.run();
        });
    });

})();