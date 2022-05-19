import('../../static/js/common.js');
let index_ops = {
    init: function () {
        this.eventBind();
        this.checkLogin();
    },
    eventBind: function () {
        let that = this;
        $(".wrap_login .login").click( function(){
            that.openUrl( buildUrl("/home/user/login?from=ctbox") );
        });

        $(".wrap_profile .scrm").click(function(){
            that.openUrl( buildUrl("/scrm") );
        });

        $(".wrap_profile .icp").click(function(){
            that.openUrl( buildUrl("/icp") );
        });

        $(".wrap_profile .setting").click(function(){
            chrome.runtime.openOptionsPage();
            window.close();
        });

        $(".wrap_profile .extend_list").click(function(){
            that.openUrl( "chrome://extensions/" );
        });
    },
    checkLogin:function(){
        let that = this;
        chrome.cookies.get({name: icp_tools_common_ops.getTokenName(), url: icp_tools_common_ops.buildUrl("/") }, (function (a) {
            let is_login = false;
            if (a && a.value) {
                is_login = true;
            }
            that.renderPop( is_login );
        }));
    },
    renderPop:function ( is_login ) {
        is_login ? $(".wrap_profile").show():$(".wrap_login").show();
    },
    openUrl:function( url ){
        chrome.tabs.create({url:  url });
    }
};
const buildUrl = (path, params) => {
    let host = icp_tools_common_ops.getHost();
    let url = host + path;
    let _paramUrl = '';
    if (params) {
        _paramUrl = Object.keys(params).map(function (k) {
            return [encodeURIComponent(k), encodeURIComponent(params[k])].join("=");
        }).join('&');
        _paramUrl = "?" + _paramUrl;
    }
    return url + _paramUrl
}
$(document).ready(function () {
    icp_tools_common_ops.init();//初始化，保证所有页面都一致
    index_ops.init();
});
