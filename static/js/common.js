let icp_tools_common_ops = {
    init: function () {
        this.env = "dev";//当前环境，dev（本地开发环境） | inner (内部环境) | prod (生产环境)
        this.flag_pop_auto_upload = "pop_auto_upload_flag"
    },
    getHost:function(){
        let host_map = {
            // "dev":"http://cmsv2.yyjun.pctop.cc/",
            "dev":"http://www.dev.cms.cn/",
            "inner":"http://cms.corp.jia10000.cn",
            "prod":"http://www.corp.360zhishu.cn",
        }
        return host_map[ this.env ];
    },
    buildUrl: function (path, params) {
        let host = this.getHost();
        let url = host + path;
        let _paramUrl = '';
        if (params) {
            _paramUrl = Object.keys(params).map(function (k) {
                return [encodeURIComponent(k), encodeURIComponent(params[k])].join("=");
            }).join('&');
            _paramUrl = "?" + _paramUrl;
        }
        return url + _paramUrl
    },
    getTokenName:function () {
        return "cms_home_" + this.env;
    },
};
