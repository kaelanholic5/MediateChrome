/*
Created by: Kaelan Holic
Owned By: Media/te Web Works LLC.
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "checkUrl") {
            checkUrl(request, sender, sendResponse);
        }
        return true;
    });

function checkUrl(request, sender, sendResponse) {
    let url = sender.tab.url;
    let website = null;
    let urlEnd1 = "https://api.mediateplugin.org/getAllWebsites";
    var req1 = new XMLHttpRequest();
    req1.responseType = 'json';
    req1.open('GET', urlEnd1, true);
    req1.onload = function () {
        var jsonResponse = req1.response;
        for (let i = 0; i < jsonResponse.length; i++) {
            if (url.includes(jsonResponse[i].url)) {
                website = jsonResponse[i];
                break;
            }
        }
        if (website != null) {
            chrome.browserAction.setIcon({ path: "iconV3.png", tabId: sender.tab.id });
        }else{
            chrome.browserAction.setIcon({ path: "iconV1.png", tabId: sender.tab.id });
        }
    };
    req1.send(null);
}