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

const submit = (e) => {
    console.log("log---------");
    alert("提交失败")
    console.log("log---------");
}

const setUpload = () => {
    document.getElementById("body-iframe").addEventListener("load", function(event) {
        let iframe = document.getElementById("body-iframe").contentWindow.document;
        let body = iframe.getElementsByTagName("body");
        let context = createDom({dom: "div", className: "container-modal"});
        let reportTab = createDom({dom: "div", className: "fix-btn-iframe", text: "举报", style: "background: #fb1d1d", onClick: submit})
        let submitTab = createDom({dom: "div", className: "fix-btn-iframe", text: "记录", style: "background: #07b52c", onClick: sendDataForServer})
        context.appendChild(reportTab);
        context.appendChild(submitTab);
        body[0].appendChild(context)
    })
}

/**
 *  author: Gerric
 *  对象值转面包屑
 */
// const createBreadCrumbs = (obj) => {
//     let str = "";
//     if (obj) {
//         Object.keys(obj).reverse().map((item, index) => {
//             str = `${obj[item]}${index>0?" / ":" "}${str}`;
//         })
//     }
//     return str;
// }

/**
 *  author: Gerric
 *  UrlDecode解码
 */
const UrlDecode = (zipStr) => {
    let uzipStr="";
    for(let i=0;i<zipStr.length;i++){
        let chr = zipStr.charAt(i);
        if(chr === "+"){
            uzipStr+=" ";
        }else if(chr==="%"){
            let asc = zipStr.substring(i+1,i+3);
            if(parseInt("0x"+asc)>0x7f){
                uzipStr+=decodeURI("%"+asc.toString()+zipStr.substring(i+3,i+9).toString());
                i+=8;
            }else{
                uzipStr+=AsciiToString(parseInt("0x"+asc));
                i+=2;
            }
        }else{
            uzipStr+= chr;
        }
    }

    return uzipStr;
}

/**
 *  author: Gerric
 *  UrlSearch格式化
 */
// const getSearch = (search) => {
//     let obj = {};
//     if (search) {
//         let list = search.slice(1, search.length-1).split("&");
//         for (let i = 0; i < list.length; i ++) {
//             let item = list[i].split("=");
//             obj[item[0]] = UrlDecode(item[1]);
//         }
//     }
//     return obj;
// }


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
    document.querySelectorAll("body")[0].setAttribute("style", "display: none !importent");
    // document.querySelectorAll("html")[0].removeChild(document.querySelectorAll("body")[0]);
    document.querySelectorAll("html")[0].appendChild(iframe);

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
        let iframe = document.getElementById("body-iframe").contentWindow.document.getElementsByClassName("b_algo")

        for (let i = 0; i < iframe.length; i++) {
            let link = iframe[i].getElementsByTagName("a");
            for (let j = 0; j < link.length; j++) {
                if (link[j].target === "_blank" && link[j].href.match(/msg/) === null) {
                    link[j].href = setLinkHref({link: link[j].href, data_type: "1", msg: "从扩展跳转"});
                }
            }
        }
        // 弹窗列表需求搁置：双击打开弹窗
        // let a = 0;
        // document.onkeydown = function (e) {
        //     if (e.keyCode === 17) {
        //         a++;
        //         if (a === 2) {
        //             renderIframePage()
        //         }
        //     } else {
        //         a = 0;
        //     }
        // }
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

// 弹窗列表需求搁置： 弹窗生成JSX
// const renderIframePage = () => {
//     // let body = document.getElementById('home-iframe').contentWindow.document.body;
//     if(document.getElementById('body-iframe')){
//         let body = document.getElementById('body-iframe').contentWindow.document.body;
//         if (body.getElementsByClassName("container-iframe").length === 0) {
//             let context = createDom({dom: "div", className: "container-iframe", style: styles.containerIframe});
//             context.appendChild(createDom({dom: "div", className: "content-header", style: styles.contentHeader}))
//             context.appendChild(createDom({dom: "div", className: "content-list", style: styles.contentList}));
//             context.appendChild(createDom({dom: "div", className: "content-footer", style: styles.contentFooter}));
//             body.appendChild(context);
//
//             setTimeout(() => {
//                 setFormLabel();
//             }, 200)
//         }
//     }
// }


// 弹窗列表需求搁置：弹窗列表JSX
// const createCardItem = () => {
//     let bAlgoList = document.getElementsByClassName("b_algo");
//     let list = createDom({dom: "div", className: "contentPage", style: styles.contentPage});
//     for (let i = 0; i < bAlgoList.length; i++) {
//         let a = bAlgoList[i].querySelector("h2>a");
//         let card = createDom({dom: "div", className: "cardItem", style: styles.cardItem});
//         let titleText = createDom({dom: "div", className: "titleText", style: styles.titleText, text: a.textContent});
//         let hrefText = createDom({dom: "div", className: "hrefText", style: styles.hrefText, text: a.href});
//         card.appendChild(titleText);
//         card.appendChild(hrefText);
//         card.addEventListener("click",() => {
//             window.open(`${a.href}#msg=从扩展跳转#data_type=1`);
//         })
//         list.appendChild(card);
//     }
//     return list
// }

// 弹窗列表需求搁置：内容填充JSX
// const setFormLabel = () => {
//     // let body = document.getElementById("home-iframe").contentWindow.document;
//     let body = document.getElementById("body-iframe").contentWindow.document;
//
//     // header
//     let links = document.getElementsByClassName("b_algo");
//     let container = body.getElementsByClassName("container-iframe")[0];
//     let iframeTitle = createDom({
//         dom: "div",
//         className: "iframeTitle",
//         style: styles.iframeTitle,
//         text: window.location.host
//     });
//     let tabList = createDom({dom: "div", className: "tabList", style: styles.tabList});
//     let tabItem = createDom({dom: "div", className: "tabItem", style: styles.tabItem});
//     let searchText = createDom({
//         dom: "div",
//         className: "searchText",
//         style: styles.itemSearch,
//         text: `搜索条件：${createBreadCrumbs(getSearch(window.location.search))}`
//     });
//     let itemText = createDom({
//         dom: "div",
//         className: "itemText",
//         style: styles.itemText,
//         text: `本页共${links.length}条结果`
//     });
//     tabItem.appendChild(searchText);
//     tabItem.appendChild(itemText);
//     tabList.appendChild(tabItem);
//     container.getElementsByClassName("content-header")[0].appendChild(iframeTitle);
//     container.getElementsByClassName("content-header")[0].appendChild(tabList);
//
//     // list
//     container.getElementsByClassName("content-list")[0].appendChild(createCardItem());
//     container.addEventListener("click", (event) => {
//         event.stopPropagation();
//     })
//     // 弹窗列表需求搁置：关闭弹窗
//     // body.addEventListener("click", () => {
//     //     initState.modalState = false;
//     //     container.style.left = "-600px";
//     //     closeModal();
//     // })
// };

/**
 * 页面开启逻辑
 */
$(document).ready(function () {
    init()
});

setTimeout(function(){
    init();
},3000);

// 弹窗列表需求搁置：功能按钮打开弹窗
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         setTimeout(()=> {
//             renderIframePage();
//         }, 200)
//     }
// )

// 弹窗列表需求搁置：弹窗列表样式
// const styles = {
    // containerIframe:
    //     "width: 525px!important;" +
    //     "position: fixed;" +
    //     "top: 0;" +
    //     "left: 2px;" +
    //     "transition: left 1.2s;" +
    //     "bottom: 0;" +
    //     "z-index: 99999;" +
    //     "background: rgba(213, 213, 213, 0.94);" +
    //     "border-top-right-radius: 7px;" +
    //     "border-bottom-right-radius: 7px;" +
    //     "border: none;" +
    //     "display: flex;" +
    //     "flex-direction: column;",
    // contentHeader:
    //     "height: 18%;" +
    //     "min-height: 185px;" +
    //     "padding: 30px;" +
    //     "box-sizing: border-box;" +
    //     "background-image: linear-gradient(237deg, rgb(107, 117, 255), rgb(51, 39, 151));" +
    //     "border-radius: 7px;",
    // contentList:
    //     "height: 75%;" +
    //     "background: #ffffff;",
    // contentFooter:
    //     "height: 7%;" +
    //     "background-image: linear-gradient(237deg, rgb(107, 117, 255), rgb(51, 39, 151));" +
    //     "border-radius: 7px;",
    // tabList: "",
    // iframeTitle:
    //     "font-size: 21px;" +
    //     "color: white;" +
    //     "font-weight: 700;",
    // tabItem:
    //     "height: 50px;" +
    //     "margin-top: 10px;",
    // itemText:
    //     "color: #ffffffa6;" +
    //     "font-size: 13px;" +
    //     "margin-top: 10px;",
    // itemSearch:
    //     "color: white;" +
    //     "font-size: 14px;" +
    //     "font-weight: 500;",
    // contentPage:
    //     "height: 100%;" +
    //     "overflow-y: scroll;" +
    //     "overflow-x: hidden;",
    // cardItem:
    //     "margin: 7px;" +
    //     "padding: 20px 10px;" +
    //     "box-shadow: 0px 0px 4px -1px #747474;" +
    //     "border-radius: 5px;" +
    //     "cursor: pointer;",
    // titleText:
    //     "font-size: 18px;" +
    //     "font-weight: 600;" +
    //     "color: #0051e5;",
    // hrefText:
    //     "font-size: 14px;" +
    //     "margin-top: 10px;",
// }