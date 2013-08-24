var url = "http://bukkit.org/";
var dbo_url = "http://dev.bukkit.org/home/";

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

var dbo_unread = 0;
var display_dbo = 0;

//default localStorage
localStorage["time_length"] = 30000;
localStorage["sound_play"] = "true";
localStorage["auto_close"] = 60000;
//localStorage["dbo_key"] = "";

getAlerts();

function getYQLAddress(apikey) {
    return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdev.bukkit.org%2Fhome%2Fprivate-messages%2F%3Fapi-key%3D" + apikey + "%22&format=json&callback=cbfunc";
}

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
    
    var dbo_key = localStorage["dbo_key"];
    if (!(dbo_key === "Undefined")) {
        var dbo_xhr = new XMLHttpRequest();
        dbo_xhr.open('GET', getYQLAddress(dbo_key), true);
        console.log("err");
        dbo_xhr.onload = function() {
            console.log(dbo_xhr.responseText);
            if(dbo_xhr.responseText.indexOf('New messages') != -1) {
                dbo_unread = 1;
            }
        };
        dbo_xhr.onerror = function() {
            chrome.browserAction.setBadgeText({text: "Error"});
        };
        dbo_xhr.send();
    }

    if (unread > 0 || con_unread > 0 || dbo_unread > 0){
        var total_unread = parseInt(unread)+parseInt(con_unread)+parseInt(dbo_unread);
        chrome.browserAction.setBadgeText({text: '' + total_unread});
        chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
        if (unread > 0 && window.display_alert == 0) {
            notify();
        }
        if (con_unread > 0 && window.display_con == 0) {
            notify_con();
        }
        if (dbo_unread > 0 && window.display_dbo == 0) {
            notify_dbo();
        }
    }

    else{
        chrome.browserAction.setBadgeText({text: ''});
        window.display_alert = 0;
        window.display_con = 0;
        window.display_dbo = 0;
    }

    setTimeout(getAlerts,localStorage["time_length"]);
}
function notify() {
    var notification = webkitNotifications.createNotification(
        'img/48.png',
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
        'img/48.png',
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

function notify_dbo() {
    var con_notification = webkitNotifications.createNotification(
        'img/48.png',
        'Attention:',
        'You have a new Bukkit Dev message!'
    );
    con_notification.show();
    con_notification.onclick = function(tabc)  {
        chrome.tabs.create({'url': dbo_url + "private-messages/"});
        chrome.browserAction.setBadgeText({text: ''});
        con_notification.cancel();
    }
    setTimeout(function(){
    notification.cancel();
    },localStorage["auto_close"]);
    window.display_dbo = 1;
}

function playSound(){
    var snd = new Audio('solemn.mp3');
    if(localStorage["sound_play"] == "true"){
    snd.play(); 
    }
}