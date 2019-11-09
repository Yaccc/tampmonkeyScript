// ==UserScript==
// @name         我的脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tamptest
// @author       zhaodong.xzd
// @match        https://www.baidu.com/*
// @match        https://blog.csdn.net/*/article*
// @exclude      https://www.baidu.com/link*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @grant        GM_openInTab
// @run-at document-body
// ==/UserScript==

function baiduGoogle() {
    var googleUrl = 'https://www.google.com/search?q='
    var kw = $('#kw');
    // Your code here...
    // alert('Hello, from Tampermonkey.');
    var btngoogle = '<input type="submit" value="Google" id="su2" class=" bg s_btn" style="margin-left: 10px;float: right;">'
    $('#su').after(btngoogle);
    $('#su2').click(function () {
        GM_openInTab(googleUrl + kw.val(), false)
    })
}

function csdn() {

    var interval = setTimeout(function(){
        $('.btn-readmore').get(0).click();
    }, 2000);

}

(function () {

    var host = window.location.href;
    console.log('进入自定义脚本')
    if (host.indexOf('blog.csdn.net')) {
        csdn();
    }

    if (host.indexOf('www.baidu.com')) {
        baiduGoogle()
    }

})();