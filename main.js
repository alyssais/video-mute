var input = document.getElementById("video-input");
var ffmpeg = document.getElementById("ffmpeg-script");
var message = document.getElementById("loading-message");
var link = document.getElementById("download-link");
var ffmpegLoaded = false;

// ffmpeg keeps calling this but from what I can tell the result doesn't matter.
window.prompt = function() {
  return "";
};

var processFiles = function() {
  if (!ffmpegLoaded || input.files.length === 0) return;
  link.hidden = true;
  message.innerHTML = "removing audio";
  
  var file = input.files[0];
  var reader = new FileReader();
  
  reader.onload = function(e) {
    var buffer = e.target.result;
    var data = new Uint8Array(buffer);
    
    var result = ffmpeg_run({
      arguments: [
        "-i", file.name,
        "-vcodec", "copy",
        "-an",
        file.name // doesn't matter as long as extension is the same
      ],
      files: [{data: data, name: file.name}]
    });
    var blob = new Blob([result[0].data], {type: "video/mp4"});
    message.innerHTML = "finished";
    link.hidden = false;
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
  };
  
  reader.readAsArrayBuffer(file);
};

ffmpeg.onload = function() {
  ffmpegLoaded = true;
  message.innerHTML = "";
  processFiles();
};

ffmpeg.onerror = function(e) {
  input.innerHTML = "couldn't load ffmpeg. try again. :("
};

input.addEventListener("change", processFiles);

input.hidden = false;
message.hidden = false;
