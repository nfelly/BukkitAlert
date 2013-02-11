var url = "http://bukkit.org/";


chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': url + "account/alerts"}, function(tab) {
    });
    chrome.browserAction.setBadgeText({text: ''});
})

var xhr;
var unread = 0;
var display_alert = 0;
var con_unread = 0;
var display_con = 0;
//default localStorage
localStorage["time_length"] = 30000;
localStorage["sound_play"] = "true";
localStorage["auto_close"] = 60000;

getAlerts();

function getAlerts() {
    xhr = new XMLHttpRequest();
    xhr.open( 'GET', url + '.json', true );
    xhr.onload = function () {
        unread = window.JSON.parse( xhr.responseText )._visitor_alertsUnread;
        con_unread = window.JSON.parse( xhr.responseText )._visitor_conversationsUnread;
    };
    xhr.onerror = function () {
        chrome.browserAction.setBadgeText({text: "Error"});

    };
    xhr.send();

    if (unread > 0 || con_unread > 0){
        var total_unread = parseInt(unread)+parseInt(con_unread);
        chrome.browserAction.setBadgeText({text: '' + total_unread});
        chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
        if (unread > 0) {
            if (window.display_alert == 0) {
                notify();
            }
        }
        if (con_unread > 0) {
            if (window.display_con == 0) {
                notify_con();
            }
        }
    }

    else{
        chrome.browserAction.setBadgeText({text: ''});
        window.display_alert = 0;
        window.display_con = 0;
    }

    setTimeout(getAlerts,localStorage["time_length"]);
}
function notify() {
    var notification = webkitNotifications.createNotification(
        '48.png',
        'Attention:',
        'You have a new Bukkit alert!'
    );
    notification.show();
    playSound();
    notification.onclick = function(tabs)  {
        chrome.tabs.create({'url': url + "account/alerts"});
        chrome.browserAction.setBadgeText({text: ''});
        notification.cancel();
    }
       setTimeout(function(){
    notification.cancel();
    },localStorage["auto_close"]);
    window.display_alert = 1;
}

function notify_con() {
    var con_notification = webkitNotifications.createNotification(
        '48.png',
        'Attention:',
        'You have a new Bukkit message!'
    );
    con_notification.show();
    con_notification.onclick = function(tabc)  {
        chrome.tabs.create({'url': url + "/conversations"});
        chrome.browserAction.setBadgeText({text: ''});
        con_notification.cancel();
    }
    setTimeout(function(){
    notification.cancel();
    },localStorage["auto_close"]);
    window.display_con = 1;
}
function playSound(){
    var snd = new Audio('solemn.mp3');
    if(localStorage["sound_play"] == "true"){
    snd.play(); 
    }
}