var is_playing = false;
var there_afile = false;
var sliderng = false;
var audio = document.getElementById("audio_id");
var file_picker = document.getElementById('file_picker');
var play_button = document.getElementById('play');
var mute = document.getElementById('mute');
var slider = document.getElementById('myBar');
var volume = document.getElementById('mute_bar');
var c_time = document.getElementById("c_time");
var full_time = document.getElementById("fulltime");

slider.addEventListener("mousedown", function() { sliderng = true; });
slider.addEventListener("mouseup", function(event) { sliderng = false; seek(event); });
slider.addEventListener("mousemove", function(event) { if(sliderng) seek(event); });
volume.addEventListener("mousemove", setvolume);

var toHHMMSS = (secs) => {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

var URL = window.URL || window.webkitURL;

function toggle_play(){
  if(is_playing && there_afile){ 
    audio.pause();
    is_playing = false;
    play_button.style.cssText = "background:url('logo and icon for music/play-button.png') no-repeat; background-position: 6px 3.7px; background-size: 0.7cm";
  } else if(!is_playing && there_afile){
    audio.play();
    is_playing = true;
    play_button.style.cssText = "background:url('logo and icon for music/pause-button.png') no-repeat; background-position: 2px 2.5px; background-size: 0.8cm";
  }
}

file_picker.addEventListener('change', (event) => {
  var file = file_picker.files[0];
  const fileURL = URL.createObjectURL(file);

  alert("file: loaded");
  document.getElementById("audio_file").src = fileURL;
  audio.load();
  there_afile = true;
  is_playing = false;
  audio.addEventListener('loadedmetadata', () => {
    full_time.innerHTML = toHHMMSS(audio.duration);
  });
});

audio.onended = function() {
  is_playing = false;
  play_button.style.cssText = "background:url('logo and icon for music/play-button.png') no-repeat; background-position: 6px 3.7px; background-size: 0.7cm";
};

setInterval(function() {
  c_time.innerHTML = toHHMMSS(audio.currentTime);
  if(there_afile) {
    full_time.innerHTML = toHHMMSS(audio.duration);
  }
  if (!sliderng) {
    var per = (audio.currentTime / audio.duration) * 100;
    slider.value = per;
  }
}, 1000);

function setvolume() {
  audio.volume = volume.value / 100;
  if (!audio.muted) {
    if (audio.volume === 0.0) {
      mute.style.cssText = "background: url('logo and icon for music/mute.png') no-repeat;background-size: 90% 90%;background-position: 0ex 0.2ex;";
    } else if (audio.volume > 0.0 && audio.volume < 0.5) {
      mute.style.cssText = "background: url('logo and icon for music/low val.png') no-repeat;background-size: 90% 90%;background-position: 0ex 0.2ex;";
    } else if (audio.volume >= 0.5) {
      mute.style.cssText = "background: url('logo and icon for music/high val.png') no-repeat;background-size: 90% 90%;background-position: 0ex 0.2ex;";
    }
  }
}

function muted(){
  if(audio.muted) {
    audio.muted = false;
    setvolume();
  } else {
    audio.muted = true;
    mute.style.cssText = "background: url('logo and icon for music/mute.png') no-repeat;background-size: 90% 90%;background-position: 0ex 0.2ex;";
  }
}

function seek(event){
  if(sliderng) {
    var rect = slider.getBoundingClientRect();
    var offsetX = event.clientX - rect.left;
    var seekto = offsetX / rect.width * audio.duration;
    audio.currentTime = seekto;
  }
}
