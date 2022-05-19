importScripts('/static/js/common.js');
icp_tools_common_ops.init();//初始化，保证所有页面都一致

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

const Submit = function ( data, tab_id, sendResponse) {
    chrome.cookies.get({name: icp_tools_common_ops.getTokenName(), url: icp_tools_common_ops.buildUrl("/")}, (function (a) {
        if (a && a.value) {//已登录~~
            let url = icp_tools_common_ops.buildUrl( "/icp/keyword/lib-check"  );
            fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    Authorization: a.value
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.status === 200) {
                    res.text().then((result) => {
                        let resultData = JSON.parse(result);
                        if (res.code === 200) {
                            sendResponse(sendNotice( "提交成功",resultData.msg,tab_id ));
                        }else{
                            sendResponse(sendNotice("提交失败","失败原因：" + resultData.msg,tab_id));
                        }
                    })
                } else {
                    sendResponse(sendNotice("提交失败","失败原因：" + res.statusText,tab_id));
                }
            }).catch((err) => {
                window.confirm(" 提交失败 ,请咨询开发者 ：" + icp_tools_common_ops.buildUrl("/") );
            })
        }else{//未登录~~
            window.confirm( '请先登录 内部系统\r\n登录地址：' + icp_tools_common_ops.buildUrl("/") );
            chrome.script.create({url:  icp_tools_common_ops.buildUrl("/") });
        }
    }));
};
const Upload = function ( data, tab_id, sendResponse) {
    chrome.cookies.get({name: icp_tools_common_ops.getTokenName(), url: icp_tools_common_ops.buildUrl("/")}, (function (a) {
        setTimeout(()=> {
            console.log(data, '数据');
            sendResponse("提交成功","提交成功",tab_id )
        }, 3000)
        if (a && a.value) {//已登录~~
            let url = icp_tools_common_ops.buildUrl( "/icp/keyword/lib-check"  );
            fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                    Authorization: a.value
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.status === 200) {
                    res.text().then((result) => {
                        let resultData = JSON.parse(result);
                        if (res.code === 200) {
                            sendResponse(sendNotice( "提交成功",resultData.msg,tab_id ));
                        }else{
                            sendResponse(sendNotice("提交失败","失败原因：" + resultData.msg,tab_id));
                        }
                    })
                } else {
                    sendResponse(sendNotice("提交失败","失败原因：" + res.statusText,tab_id));
                }
            }).catch((err) => {
                window.confirm(" 提交失败 ,请咨询开发者 ：" + icp_tools_common_ops.buildUrl("/") );
            })
        }else{//未登录~~
            window.confirm( '请先登录 内部系统\r\n登录地址：' + icp_tools_common_ops.buildUrl("/") );
            chrome.script.create({url:  icp_tools_common_ops.buildUrl("/") });
        }
    }));
};

const sendNotice = function (title,message,tab_id, tip_class = undefined) {
    let data = { "act":"msg_alert",data:{ "msg":message ? (title + "：" + message) : title } };
    if( tab_id !== undefined && tab_id > 0 ){
        return {tab_id,data}
    }
};