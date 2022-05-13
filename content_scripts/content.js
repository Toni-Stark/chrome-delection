const init = () => {
    let iframe = document.getElementById("body-iframe");
    if(iframe === null && window.self === window.top){
        setEmbeddedIframe();
    }

};
const setEmbeddedIframe = () => {
    let iframe = document.createElement("iframe");
    iframe.frameborder = "0";
    iframe.className = "body-iframe";
    iframe.id = "body-iframe";
    document.querySelector("body").appendChild(iframe);

    renderIframePage()
}

const createDom = (dom, className, style) => {
    const text = document.createElement(dom);
    text.className = className;
    if (style) {
       text.setAttribute("style", style)
    }
    return text
}

const renderIframePage = () => {
    let body = document.getElementById('body-iframe').contentWindow.document.body
    body.setAttribute('style', "width: 100%; height: 100%; background: #cdcdcdf0; border-radius: 7px;")
    let context = createDom("div", "container-iframe", "height: 100%;display: flex;flex-direction: column;");
    context.appendChild(createDom("div", "content-header", "height: 400px; background-image: linear-gradient(237deg, rgb(107, 117, 255), rgb(51, 39, 151));"))
    context.appendChild(createDom("div", "content-list","height: 100%; background: #ffffff;"));
    context.appendChild(createDom("div", "content-footer", "height: 80px; background-image: linear-gradient(237deg, rgb(107, 117, 255), rgb(51, 39, 151));"));
    body.appendChild(context)
}

$(document).ready(function () {
    init()
});

setTimeout(function(){
    init();
},3000);
