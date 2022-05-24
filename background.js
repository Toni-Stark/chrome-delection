importScripts('/static/js/common.js');
icp_tools_ops.init();//初始化，保证所有页面都一致

chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse) {
        if (response?.type === "submit") {
            Submit({url:sender.origin, title: sender.tab.title}, sender.tab.id, sendResponse)
            return true
        } else if (response.type === "upload") {
            Upload(response.data, sender.tab.id, sendResponse);
            return true
        }
    }
);

const FetchApi = ({url, method, token, data, sendResponse, tab_id}) => {
    const option = {
        method,
        mode: "cors",
        headers: {
            Authorization: token
        },
        body: JSON.stringify(data),
    }
    fetch(url, option).then((res) => {
        console.log(res, "res");
        switch (res.status) {
            case 200:
                res.text().then((result) => {
                    let resultData = JSON.parse(result);
                    if (result.code === 200) {
                        sendResponse({data: resultData, tab_id});
                    } else {
                        sendResponse({data: resultData, tab_id});
                    }
                });
                break;
            default:
                sendResponse({data: {code: res.status, msg: res.statusText}, tab_id});
                break;
        }
    });
}

const Submit = function ( data, tab_id, sendResponse) {
    icp_tools_ops.checkLogin((storage,is_token)=>{
        if(is_token) {
            let url = icp_tools_ops.buildUrl( "/icp/keyword/lib-check");
            FetchApi({url,method: "POST",token:storage.value,data, tab_id, sendResponse})
        } else {
            window.confirm( '请先登录 内部系统\r\n登录地址：' + icp_tools_ops.buildUrl("/") );
            chrome.script.create({url:  icp_tools_ops.buildUrl("/") });
        }
    });

};
const Upload = function ( data, tab_id, sendResponse) {
    icp_tools_ops.checkLogin((storage,is_token)=> {
        if (is_token) {
            let url = icp_tools_ops.buildUrl("/icp/keyword/get-multi-url");
            FetchApi({url,method: "POST",token:storage.value,data, tab_id, sendResponse})
        } else {
            window.confirm( '请先登录 内部系统\r\n登录地址：' + icp_tools_ops.buildUrl("/") );
            chrome.script.create({url:  icp_tools_ops.buildUrl("/") });
        }
    })
};