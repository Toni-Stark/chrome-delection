let options_index_ops = {
    init: function () {
        this.flag_pop_auto_upload = icp_tools_common_ops.flag_pop_auto_upload;
        this.eventBind();
    },
    eventBind: function () {
        //初始化
        chrome.storage.sync.get(icp_tools_common_ops.flag_pop_auto_upload, (data) => {
            let {pop_auto_upload_flag} = data
            $(".form_wrap input[name=" + this.flag_pop_auto_upload + "][value='" + pop_auto_upload_flag + "']").prop('checked',true);
        })
        $(".form_wrap input[name=" + this.flag_pop_auto_upload + "]").change(function () {
            let data = {};
            data[icp_tools_common_ops.flag_pop_auto_upload] = $(this).val();
            chrome.storage.sync.set(data);
        });
    }
};

$(document).ready(function () {
    icp_tools_common_ops.init();//初始化，保证所有页面都一致
    options_index_ops.init();
});