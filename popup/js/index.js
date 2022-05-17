// 弹窗按钮需求搁置：消息通知content_script打开弹窗；
// document.addEventListener('DOMContentLoaded', (e) => {
//     let btn = document.getElementsByClassName("popup-style")[0];
//     btn.addEventListener("click", async (e) => {
//         console.log("打开抽屉");
//         let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//         chrome.tabs.sendMessage(tab.id, {type: "getText"}, function (response) {
//             console.log("popup:", response)
//         })
//     })
// })
