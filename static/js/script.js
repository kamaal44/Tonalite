function openTab(evt, tabName) {
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tab-item");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function updateChannels(msg) {
  for (var i = 0; i <= 47; i++) {
    if ($("#cval-" + (i + 1)).text() != msg.channels[i]) {
      $("#cval-" + (i + 1)).addClass('green-text');
      $("#cval-" + (i + 1)).removeClass('red-text');
    } else {
      if ($("#cval-" + (i + 1)).hasClass("green-text")) {
        $("#cval-" + (i + 1)).removeClass('green-text');
      }
      $("#cval-" + (i + 1)).addClass('red-text');
    }
    $("#cval-" + (i + 1)).text(msg.channels[i]);
  };
  return 0;
}

function updateCues(msg) {
  $("#cues").empty();
  if (msg.cues.length != 0) {
    for (var i = 0; i < msg.cues.length; i++) {
      $("#cues").append("<div class=\"cue-item\" cueVal=\"" + i + "\"><h4>" + msg.cues[i].name + "</h4>" + msg.cues[i].description + "</div>");
      if (msg.selected_cue != null) {
        if (msg.selected_cue == i) {
          $("div[cueVal=" + i + "]").addClass("background-green");
        }
      }
    }
  }
  if (msg.selected_cue == null) {
    $("#cueName").val("");
    $("#cueDescription").val("");
    $("#cueTime").val("");
    $("#cueFollow").val("");
  }
  if (msg.cues.length != 0) {
    if ($(".hidden-item").hasClass("hidden")) {
      $(".hidden-item").removeClass('hidden');
    }
  } else {
    $(".hidden-item").addClass('hidden');
  }
  return 0;
}

$(document).ready(function () {
  document.getElementById("keyboardTabBtn").click();

  for (var i = 0; i <= 47; i++) {
    $("#Channels").append("<div class=\"col-1 channel\"><div class=\"channel-item\"><h2>" + (i + 1) + "</h2><h1 id=\"cval-" + (i + 1) + "\">0</h1></div></div>");
  }

  var socket = io.connect('http://' + document.domain + ':' + location.port + '/tonalite');

  socket.on('success', function (msg) {
    updateChannels(msg);
    updateCues(msg);
    console.log(msg.message);
  });

  socket.on('update chans', function (msg) {
    updateChannels(msg);
  });

  socket.on('update cues', function (msg) {
    updateCues(msg);
  });

  socket.on('cue settings', function (msg) {
    updateCues(msg);
    $("#cueName").val(msg.name);
    $("#cueDescription").val(msg.description);
    $("#cueTime").val(msg.time);
    $("#cueFollow").val(msg.follow);
  });

  socket.on('update all', function (msg) {
    updateChannels(msg);
    updateCues(msg);
    if (msg.show.name != "") {
      $("#showName").val(msg.show.name);
      $("#showDescription").val(msg.show.description);
      $("#showAuthor").val(msg.show.author);
      $("#showCopyright").val(msg.show.copyright);
    }
  });

  socket.on('redirect', function (msg) {
    window.location = 'http://' + document.domain + ':' + location.port + msg.url
  });

  $('.kbtn').click(function (event) {
    $('#commandInput').val($('#commandInput').val() + $(this).attr('inputVal'));
  });

  $('#updateCue').click(function (event) {
    socket.emit('update cue', { name: $('#cueName').val(), description: $('#cueDescription').val(), time: $('#cueTime').val(), follow: $('#cueFollow').val() });
  });

  $('#saveCue').click(function (event) {
    socket.emit('save cue', { name: $('#cueName').val(), description: $('#cueDescription').val(), time: $('#cueTime').val(), follow: $('#cueFollow').val() });
  });

  $("#cues").on("click", "div.cue-item", function () {
    socket.emit('cue info', { cue_id: $(this).attr('cueVal') });
  });

  $('#commandSubmitBtn').click(function (event) {
    socket.emit('command message', { command: $('#commandInput').val() });
    $('#commandInput').val("");
    return false;
  });

  $('#recordCueBtn').click(function (event) {
    socket.emit('command message', { command: "r q" });
    return false;
  });

  $("#cueUpBtn").click(function (event) {
    socket.emit('cue move', { action: "up" });
  });

  $("#cueDownBtn").click(function (event) {
    socket.emit('cue move', { action: "down" });
  });

  $("#deleteCue").click(function (event) {
    socket.emit('cue move', { action: "delete" });
  });

  $("#saveShowBtn").click(function (event) {
    socket.emit('save show', { name: $("#showName").val(), description: $("#showDescription").val(), author: $("#showAuthor").val(), copyright: $("#showCopyright").val() });
  });

  $('#commandClearBtn').click(function (event) {
    $('#commandInput').val("");
    return false;
  });
});