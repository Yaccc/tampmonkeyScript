var jq = $.noConflict(true);
function baidugoogle() {
    var googleUrl = 'https://www.google.com/search?q='
    var kw = jq('#kw');
    // Your code here...
    // alert('Hello, from Tampermonkey.');
    var btngoogle = '<input type="submit" value="Google" id="su2" class=" bg s_btn" style="margin-left: 10px;float: right;">'
    jq('#su').after(btngoogle);
    jq('#su2').click(function () {
        GM_openInTab(googleUrl + kw.val(), false)
    })
    console.log(node)
}

function f() {
    console.log("fff")
}