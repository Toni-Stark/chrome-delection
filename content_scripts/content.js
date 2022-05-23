import("../static/js/common");
const init = () => {
    let iframe = document.getElementById("body-iframe");
    if(iframe === null && window.self === window.top){
        if (window.location.href.match(/msg/) === null) {
            if (window.location.href.match(/bing.com/)){
                setIframeWindow({init: true});
            }
        } else {
            setIframeWindow({init: false})
        }
    }
};

// 获取需要提交的数据
const getDomainName = () => {
    let data = {};
    data.url = window.location.href;
    data.title = document.title;
    data.type = "submit";
    return data;
}
let timer = true;
const submit = async (e) => {
    if (timer) {
        timer = false;
        e.style.backgroundColor = "#07b52c96"
        chrome.runtime.sendMessage(getDomainName()).then((res) => {
            if (res?.tab_id && res.tab_id > 0) {
                timer = true;
                e.style.backgroundColor = "#07b52c"
                messageTip(res.data.data.msg, "success")
            }
        });
    }

}

const setUpload = () => {
    document.getElementById("body-iframe").addEventListener("load", function(event) {
        let iframe = document.getElementById("body-iframe").contentWindow.document;
        let body = iframe.getElementsByTagName("body");
        let context = createDom({dom: "div", className: "container-modal"});
        let reportTab = createDom({dom: "div", className: "fix-btn-iframe", text: "提交", style: "background: #07b52c", onClick: submit})
        // let submitTab = createDom({dom: "div", className: "fix-btn-iframe", text: "记录", style: "background: #fb1d1d", onClick: sendDataForServer})
        context.appendChild(reportTab);
        // context.appendChild(submitTab);
        body[0].appendChild(context)
    })
}

/**
 *  author: Gerric
 *  Dom工作器
 */
const createDom = ({dom, className, style, text, onClick}) => {
    const content = document.createElement(dom);
    content.className = className;
    if (style) {
        content.setAttribute("style", style);
    }
    if (text) {
        content.textContent = text;
    }
    if (onClick) {
        content.addEventListener("click", (e) => {
            return onClick(content)
        })
    }
    return content
}

/**
 * init: 判断是否从检索页进入详情， 如果是则修改超链接
 */
const setIframeWindow = ({init}) => {

    let iframe = document.createElement("iframe");
    iframe.frameborder = "0";
    iframe.className = "body-iframe";
    iframe.id = "body-iframe";

    // 使用Iframe页面替换原页面
    iframe.src = window.location.href;
    document.body.parentNode.style.overflowY= "hidden";
    document.body.parentNode.style.overflowX= "hidden";
    document.querySelectorAll("body")[0].setAttribute("style", "display: none !important");
    // document.querySelectorAll("html")[0].removeChild(document.querySelectorAll("body")[0]);
    let start = document.createComment("<!--detection_start-->");
    let end = document.createComment("<!--detection_end-->");
    document.querySelectorAll("html")[0].appendChild(start);
    document.querySelectorAll("html")[0].appendChild(iframe);
    document.querySelectorAll("html")[0].appendChild(end);

    if (init) {
        setTimeout(() => {
            listenLinkHref()
            uploadListGet()
        }, 200)
    } else {
        setTimeout(() => {
            setUpload()
        }, 200)
    }
}

const uploadListGet = () => {
    document.getElementById("body-iframe").addEventListener("load", function(event) {
        chrome.storage.sync.get(icp_tools_common_ops.flag_pop_auto_upload, (data) => {
            let {pop_auto_upload_flag} = data
            if (pop_auto_upload_flag === "1") {
                uploadListData()
            }
        })
    })
}

const uploadListData = () => {
    let body = document.getElementById("body-iframe").contentWindow.document;
    let bResults = body.getElementById("b_results");
    if(bResults){
        let bAlgoList = body.getElementsByClassName("b_algo");
        let sbForm= body.getElementById("sb_form_q");
        let data = [];
        for (let i = 0; i < bAlgoList.length; i ++) {
            let a = bAlgoList[i].querySelector("h2>a");
            if (a) {
                let obj = {};
                obj.title = a.textContent;
                if (a.href && a.href.match(/msg/) !== null) {
                    obj.url = a.href.split('#data_type')[0];
                } else {
                    obj.url = a.href;
                }
                data.push(obj);
            }
        }
        let obj = {};
        obj.data = data;
        obj["site_name"] = sbForm.value;
        chrome.runtime.sendMessage({type: "upload", data: obj}).then((res) => {
            messageTip(res.data.data.msg, "success");
            // 跳转到下一页；
            hrefToNextPage()
        });
    }
}

const hrefToNextPage = () => {
    let body = document.getElementById("body-iframe").contentWindow.document;
    let nextHref = body.getElementsByClassName("sb_pagN")[0];
    chrome.storage.sync.get("currentPage", (data) => {
        if (data.currentPage) {
            if(parseInt(data.currentPage) >= 4){
                chrome.storage.sync.set({"currentPage": 0}, (data) => {
                    console.log("上传完毕");
                })
            } else {
                chrome.storage.sync.set({"currentPage": parseInt(data.currentPage)+1}, (data) => {
                    nextHref.click();
                })
            }
        } else {
            chrome.storage.sync.set({"currentPage": "1"}, (data) => {
                nextHref.click();
            })
        }
    })
}

let timerTip = null;
const messageTip = (message, type, time = 2000) => {
    clearTimeout(timerTip);
    timerTip = setTimeout(() => {
        let html = document.getElementById("body-iframe").contentWindow.document;
        let tipCard = createDom({dom: "div", className: `messageTip ${type}`, text: message, style: styles.tip});
        let body = html.querySelector("body");
        body.appendChild(tipCard);
        setTimeout(() => {
            tipCard.style.opacity = "0";
            setTimeout(()=> {
                tipCard.style.display = "none";
            }, 3000)
        }, time)
    }, 3000)
}

const listenLinkHref = () => {
    document.getElementById("body-iframe").addEventListener("load", function(event) {
        let b_algo = document.getElementById("body-iframe").contentWindow.document.getElementsByClassName("b_algo")
        let b_ad = document.getElementById("body-iframe").contentWindow.document.getElementsByClassName("b_ad")
        let na_ccw = document.getElementById("body-iframe").contentWindow.document.getElementsByClassName("na_ccw")
        hrefIncremental(b_algo);
        hrefIncremental(b_ad);
        hrefIncremental(na_ccw);
    })
}

const setLinkHref = (props) => {
    const { msg, data_type, link} = props;
    let url = link;
    if (data_type) {
        url += "#data_type=" + data_type
    }
    if (msg) {
        url += "#msg=" + msg
    }
    return url;
}

const hrefIncremental = (iframe) => {
    for (let i = 0; i < iframe.length; i++) {
        let link = iframe[i].getElementsByTagName("a");
        for (let j = 0; j < link.length; j++) {
            if ( link[j].href.match(/msg/) === null) {
                link[j].href = setLinkHref({link: link[j].href, data_type: "1", msg: "生成扩展"});
                if (!link[j]?.target || link[j].target !== "_blank") {
                    link[j].target = "_blank";
                }
            }
        }
    }
}

const closeModal = () => {
    let body = document.getElementById("body-iframe").contentWindow.document.body;
    let context = body.getElementsByClassName("container-iframe")[0];
    if (context) {
        setTimeout(()=>{
            body.removeChild(context);
            listenLinkHref();
        }, 1500)
    }
}

/**
 * 页面开启逻辑
 */
$(document).ready(function () {
    icp_tools_common_ops.init();
    setTimeout(()=> {
        init()
    }, 2000)
});

const styles = {
    tip:
        "width: 300px;"+
        "position: fixed;"+
        "top: 40px;"+
        "transition:margin-top 2s;"+
        "left: 50%;"+
        "margin-left: -150px;"+
        "z-index: 10000;"+
        "height: 50px;"+
        "font-size: 16px;"+
        "box-sizing: border-box;"+
        "text-align: center;"+
        "border-radius: 7px;"+
        "line-height: 50px;"+
        "box-shadow: 2px 2px 5px 0px #919191;"+
        "color: black;"+
        "font-weight: 700;"
}