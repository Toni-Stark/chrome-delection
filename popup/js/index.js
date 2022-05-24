import('../../static/js/common.js');
let index_ops = {
    init: function () {
        this.eventBind();
        this.checkLogin();
    },
    eventBind: function () {
        $(".wrap_login .login").click( function(){
            icp_tools_ops.openUrl( icp_tools_ops.buildUrl("/home/user/login?from=ctbox") );
        });

        $(".wrap_profile .scrm").click(function(){
            icp_tools_ops.openUrl( icp_tools_ops.buildUrl("/scrm") );
        });

        $(".wrap_profile .icp").click(function(){
            icp_tools_ops.openUrl( icp_tools_ops.buildUrl("/icp") );
        });

        $(".wrap_profile .setting").click(function(){
            chrome.runtime.openOptionsPage();
            window.close();
        });

        $(".wrap_profile .extend_list").click(function(){
            icp_tools_ops.openUrl( "chrome://extensions/" );
        });
    },
    checkLogin:function(){
        icp_tools_ops.checkLogin((res, is_token)=>{
            this.renderPop(is_token)
        });
    },
    renderPop:function ( is_login ) {
        is_login ? $(".wrap_profile").show():$(".wrap_login").show();
    },
};
$(document).ready(function () {
    icp_tools_ops.init();//初始化，保证所有页面都一致
    index_ops.init();
});
