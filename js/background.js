var url = "http://bukkit.org/";
var dbo_url = "http://dev.bukkit.org/home/";

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': localStorage["badge_link"]}, function(tab) {});
    chrome.browserAction.setBadgeText({text: ''});
})

var conversations_old = 0;
var alerts_old = 0;
var pms_old = 0;
var total = 0;

//default localStorage
localStorage["time_length"] = 30000;
localStorage["sound_play"] = "true";
localStorage["auto_close"] = 60000;
localStorage["badge_link"] = "http://bukkit.org";

getAlerts();

function getYQLAddress(apikey) {
    return "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fdev.bukkit.org%2Fhome%2Fprivate-messages%2F%3Fapi-key%3D" + apikey + "%22&format=json&callback=cbfunc";
}

function getAlerts() {
    console.log("Getting alerts...");

    total = 0;

    console.log("Connecting to Bukkit...");
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url + '.json', true );
    xhr.onload = function () {
        var alerts = parseInt(window.JSON.parse( xhr.responseText )._visitor_alertsUnread);
        var conversations = parseInt(window.JSON.parse( xhr.responseText )._visitor_conversationsUnread);
        console.log("Connected to Bukkit. Alerts: " + alerts + ", Conversations: " + conversations + ".");
        
        if(alerts > alerts_old) {
            console.log("Incoming alert notification!");
            notify(alerts, alerts == 1 ? "alert" : "alerts", url + "account/alerts");
            alerts_old = alerts;
            total += alerts;
            updateBadge();
        }
        if(conversations > conversations_old) {
            console.log("Incoming conversation notification!");
            notify(conversations, conversations == 1 ? "conversation" : "conversations", url + "conversations");
            conversations_old = conversations;
            total += conversations;
            updateBadge();
        }
    };
    xhr.onerror = function () {
        console.log("An error occurred while connecting to Bukkit!");
        chrome.browserAction.setBadgeText({text: "Error"});
    };
    xhr.send();
    
    var dbo_key = localStorage["dbo_key"];
    if (!(dbo_key === "Undefined" || dbo_key === "")) {
        console.log("Connecting to Bukkit Dev...");
        var dbo_xhr = new XMLHttpRequest();
        dbo_xhr.open('GET', getYQLAddress(dbo_key), true);
        dbo_xhr.onload = function() {
            var pms = dbo_xhr.responseText.split("New messages").length - 1;
            console.log("Connected to Bukkit Dev. PMs: " + pms + ".");
            
            if(pms > pms_old) {
                console.log("Incoming PM notification!");
                notify(pms, "Dev PM" + (pms == 1 ? "" : "s"), dbo_url + "private-messages");
                pms_old = pms;
                total += pms;
                updateBadge();
            }
        };
        dbo_xhr.onerror = function() {
            console.log("An error occurred while connecting to Bukkit Dev!");
            chrome.browserAction.setBadgeText({text: "Error"});
        };
        dbo_xhr.send();
    }
    
    setTimeout(getAlerts, localStorage["time_length"]);
}

function updateBadge() {
    chrome.browserAction.setBadgeText({text: '' + total});
    chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
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