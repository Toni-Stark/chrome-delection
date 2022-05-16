/**
 *  author: Gerric
 *  UrlDecode解码
 */
export const UrlDecode = (zipStr) => {
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
export const getSearch = (search) => {
    let obj = {};
    if (search) {
        let list = search.slice(1, search.length-1).split("&");
        for (let i = 0; i < list.length; i ++) {
            let item = list[i].split("=");
            obj[item[0]] = UrlDecode(item[1]);
        }
    }
    return obj;
}

/**
 *  author: Gerric
 *  对象值转面包屑
 */
export const createBreadCrumbs = (obj) => {
    let str = "";
    if (obj) {
        Object.keys(obj).reverse().map((item, index) => {
            str = `${obj[item]}${index>0?" / ":" "}${str}`;
        })
    }
    return str;
}


export const createDom = ({dom, className, style, text}) => {
    const content = document.createElement(dom);
    content.className = className;
    if (style) {
        content.setAttribute("style", style);
    }
    if (text) {
        content.textContent = text;
    }
    return content
}