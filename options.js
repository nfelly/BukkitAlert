// Saves options to localStorage.
function save_options() {
  //fetch time
  var select = document.getElementById("time");
  var time = select.children[select.selectedIndex].value;
  localStorage["time_length"] = time;
  //autoclose time
  var select_auto = document.getElementById("autoclose");
  var autoclose = select_auto.children[select_auto.selectedIndex].value;
  localStorage["auto_close"] = autoclose;
  
  var select_sounds = document.getElementById("sound");
  var sounds = select_sounds.checked;
  localStorage["sound_play"] = sounds;
  //window.alert(localStorage["sound_play"]);
  //window.alert(localStorage["auto_close"] + "autos");
  // Update status to let user know options were saved.

  var status = document.getElementById("status");
  status.innerHTML = "<div class='well well-small'>Options Saved.</div>";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1000);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  //fetch time
  var default_time = localStorage["time_length"];
  if (!default_time) {
    return;
  }
  var select = document.getElementById("time");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == default_time) {
      child.selected = "true";
      break;
    }
  }
  //autoclose time
    var default_auto = localStorage["auto_close"];
  if (!default_auto) {
    return;
  }
  var select_auto = document.getElementById("autoclose");
  for (var i = 0; i < select_auto.children.length; i++) {
    var child_2 = select_auto.children[i];
    if (child_2.value == default_auto) {
      child_2.selected = "true";
      break;
    }
  }
  var sound_set = localStorage["sound_play"];
  document.getElementById("sound").checked = false;
  if(sound_set == "true"){
      document.getElementById("sound").checked = true;
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);