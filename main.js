var input = document.getElementById("video-input");
var ffmpeg = document.getElementById("ffmpeg-script");
var message = document.getElementById("loading-message");
var ffmpegLoaded = false;

var processFiles = function() {
  if (!ffmpegLoaded || input.files.length === 0) return;
  message.innerHTML = "converting video";
  
  var file = input.files[0];
  console.log(file);
  var reader = new FileReader();
  
  reader.onload = function(e) {
    var buffer = e.target.result;
    var data = new Uint8Array(buffer);
    
    console.log("running ffmpeg");
    var result = ffmpeg_run({
      arguments: [
        "-i", "pickup1.m4v",
        "-vcodec", "copy",
        "-an",
        "output.m4v"
      ],
      files: [{data: data, name: "pickup1.m4v"}]
    });
    var blob = new Blob([result[0].data], {type: "video/mp4"});
    message.innerHTML = "finished converting";
    var a = document.createElement("a");
    a.innerHTML = "download";
    a.href = URL.createObjectURL(blob);
    a.download = true;
    document.body.appendChild(a);
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
