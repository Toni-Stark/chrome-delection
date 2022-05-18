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

const sendDataForServer = (e) => {
    console.log("log---------");
    console.log(e);
    console.log("log---------");
}

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
                alert(res.data.data.msg);
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
        }, 200)
    } else {
        setTimeout(() => {
            setUpload()
        }, 200)
    }
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
    init()
});