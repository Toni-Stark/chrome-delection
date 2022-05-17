const getCurrentTabId = (callback) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

const sendMessageToContentScript = (message, callback) => {
    getCurrentTabId((tabId) => {
        console.log("获取当前页面的tabId, 并且发送给contentScript", tabId)
        chrome.tabs.sendMessage(tabId, message, function(response) {
            if(callback) callback(response);
        });
    });
}
setTimeout(() => {
    sendMessageToContentScript('你好，我是background！', (response) => {
        if(response) alert('收到来自content-script的回复：'+response);
    });
}, 3000)
