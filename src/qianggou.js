// ==UserScript==
// @name         抢购脚本final
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tamptest
// @author       zhaodong.xzd
// @match        https://detail.tmall.com/item.htm*
// @match        https://buy.tmall.com/order*
// @match        https://item.taobao.com/item.htm*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @grant        GM_openInTab
// @run-at document-body
// ==/UserScript==

function getXiancheng(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return -1;
}

function renderOrder() {
    setInterval(function () {
        var display = $('.tb-action').css('display')
        if ('none' == display) {

            var msg = new Date()+"--【"+new Date().getMilliseconds() + "】还未开始抢购【注意!如果有sku请抢购前提前选中】";
            console.log(msg)
            $('#qianggoumsg').text(msg)
        } else if ('block' == display) {
            $('#qianggoumsg').text( new Date()+"【"+new Date().getMilliseconds() + "】可以开始抢购了")
            var haveSku = $('.tb-sku,dl.tb-prop').size() > 2;
            if (!haveSku) {
                console.log("该商品没有sku，直接提交")
                //直接提交
                document.getElementById("J_LinkBuy").click();
                console.log(rederCount)
            } else {
                //
                document.getElementById("J_LinkBuy").click();

            }

        }

    }, 500)
}

function replaceParamVal(url, paramName, replaceVal) {
    var oUrl = url.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oUrl.replace(re, paramName + '=' + replaceVal);
    return nUrl;
}

(function () {

    $(function () {
        var detailhtml = 'detail.tmall.com'
        var taobaohtml = 'item.taobao.com'
        var currentUrl = window.location.href;
        if (currentUrl.indexOf(detailhtml)) {
            console.log("进入详情页抢购逻辑")
            $('#J_Progressive').after("<div id='qianggoumsg' style='color: red'></div>")
            $('#J_Progressive').after("<button id='startqianggou' class='cptkl-btn' style=''>开始秒杀</button>")
            $('#J_Progressive').after("<input id='xianchengshu' placeholder='线程数量' ></input>")

            var paramCount = getXiancheng("xianchengcount");
            if (paramCount > 0) {
                //说明已经开始了，不用点开始,直接打开详情页，执行定时任务
                paramCount -= 1;
                renderOrder()                    //传递的参数为0的时候，就不要再开启新的了
                if (paramCount > 0) {
                    GM_openInTab(replaceParamVal(currentUrl, 'xianchengcount', paramCount));
                }
            } else {
                //如果没传，需要手动点击，选择线程数量
                $('#startqianggou').bind('click', function () {
                    //点击开始的时候开启多个页面开始抢购
                    GM_openInTab(window.location.href + "&xianchengcount=" + $('#xianchengshu').val());
                    renderOrder()

                })
            }
        }

        if (window.location.href.indexOf("confirm_order") > 0) {
            $(".go-btn").trigger("click");
            $(".go-btn").trigger("click");
            var submit = document.getElementsByClassName('go-btn');
            console.log("是否能拿到节点")
            if (submit.length !== 0) {
                submit[0].click();
                submit[0].trigger("click");
            }
        }
    });

})();