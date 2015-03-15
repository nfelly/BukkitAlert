var url = "http://spigotmc.org/";

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
localStorage["badge_link"] = "http://spigotmc.org";

getAlerts();

function getAlerts() {
    console.log("Getting alerts...");

    total = 0;

    console.log("Connecting to Spigot...");
    var xhr = new XMLHttpRequest();
    xhr.open( 'GET', url + '.json', true );
    xhr.onload = function () {
        var alerts = parseInt(window.JSON.parse( xhr.responseText )._visitor_alertsUnread);
        var conversations = parseInt(window.JSON.parse( xhr.responseText )._visitor_conversationsUnread);
        console.log("Connected to Spigot. Alerts: " + alerts + ", Conversations: " + conversations + ".");
        
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
        console.log("An error occurred while connecting to Spigot!");
        chrome.browserAction.setBadgeText({text: "Error"});
    };
    xhr.send();
    
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
        'You have ' + number + ' unread Spigot ' + type + '!'
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
