var url = "http://bukkit.org/";
var dbo_url = "http://dev.bukkit.org/home/";

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': current_url}, function(tab) {});
    chrome.browserAction.setBadgeText({text: ''});
})

var conversations_old = 0;
var alerts_old = 0;
var pms_old = 0;
var total_old = 0;

//default localStorage
localStorage["time_length"] = 30000;
localStorage["sound_play"] = "true";
localStorage["auto_close"] = 60000;

getAlerts();

function getYQLAddress(apikey) {
    return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdev.bukkit.org%2Fhome%2Fprivate-messages%2F%3Fapi-key%3D" + apikey + "%22&format=json&callback=cbfunc";
}

function getAlerts() {
    var conversations = 0;
    var alerts = 0;
    var pms = 0;
    var total = 0;

    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url + '.json', true );
    xhr.onload = function () {
        alerts = window.JSON.parse( xhr.responseText )._visitor_alertsUnread;
        conversations = window.JSON.parse( xhr.responseText )._visitor_conversationsUnread;
    };
    xhr.onerror = function () {
        chrome.browserAction.setBadgeText({text: "Error"});
    };
    xhr.send();
    
    var dbo_key = localStorage["dbo_key"];
    if (!(dbo_key === "Undefined")) {
        var dbo_xhr = new XMLHttpRequest();
        dbo_xhr.open('GET', getYQLAddress(dbo_key), true);
        dbo_xhr.onload = function() {
            pms = dbo_xhr.responseText.split("New messages").length - 1;
        };
        dbo_xhr.onerror = function() {
            chrome.browserAction.setBadgeText({text: "Error"});
        };
        dbo_xhr.send();
    }
    
    total = parseInt(alerts) + parseInt(conversations) + pms;

    if(total != total_old) {
        chrome.browserAction.setBadgeText({text: '' + total});
        chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
    
        if(alerts > alerts_old) {
            notify(alerts, alerts == 1 ? "alert" : "alerts", url + "account/alerts");
            alerts_old = alerts;
        }
        if(conversations > conversations_old) {
            notify(conversations, conversations == 1 ? "conversation" : "conversations", url + "conversations");
            conversations_old = conversations;
        }
        if(pms > pms_old) {
            notify(pms, "Dev PM" + (pms == 1 ? "" : "s"), dbo_url + "private-messages");
            pms_old = pms;
        }
    }

    setTimeout(getAlerts, localStorage["time_length"]);
}
function notify(number, type, url) {
    var notification = webkitNotifications.createNotification(
        'img/48.png',
        'Attention:',
        'You have ' + number + ' unread Bukkit ' + type + '!'
    );
    notification.show();
    playSound();
    notification.onclick = function(tabs)  {
        chrome.tabs.create({'url': url});
        chrome.browserAction.setBadgeText({text: ''});
        notification.cancel();
    }
    
    setTimeout(function(){
        notification.cancel();
    }, localStorage["auto_close"]);
}

function playSound(){
    var snd = new Audio('solemn.mp3');
    if(localStorage["sound_play"] == "true"){
        snd.play(); 
    }
}