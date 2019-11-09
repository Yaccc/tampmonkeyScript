// ==UserScript==
// @name         wap版本抢购
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tamptest
// @author       zhaodong.xzd
// @match        https://h5.m.taobao.com/cart/order.html*
// @match        https://detail.m.tmall.com/item.htm
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @grant        GM_openInTab
// @run-at document-end
// ==/UserScript==
(function () {

    $(function () {
        if (window.location.href.indexOf("h5.m.taobao.com/cart/order.html") > 0) {
            var randsom= Math.random();
            GM_openInTab("https://h5.m.taobao.com/cart/order.html?buyNow=false&spm=a220l.110092772.footer.i2&buyParam=45914148703_1_520247365603\"_null_0_null_null_"+randsom+"_qianggou_null_null_0_null_buyerCondition~0~~dpbUpgrade~0~~cartCreateTime~1573052743000_0_0_null_null_null_null_null_null_null_null_null",true)
            setInterval(function () {
                $('#submitOrder_1 > div.mui-flex.align-center > div.cell.fixed.action > div').click()
                var submit=$('#submitOrder_1 > div.mui-flex.align-center > div.cell.fixed.action > div')
                submit.click();
                if (submit.length !== 0) {
                    submit[0].click();
                    submit[0].trigger("click");
                }
            },1000)

        }
    });

})();