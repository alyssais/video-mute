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
    
    var result = ffmpeg_run({
      arguments: [
        "-i", file.name,
        "-vcodec", "copy",
        "-an",
        file.name // doesn't matter as long as extension is the same
      ],
      files: [{data: data, name: file.name}]
    });
    var blob = new Blob([result[0].data], {type: file.type});
    message.innerHTML = "finished converting";
    var a = document.createElement("a");
    a.innerHTML = "download";
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
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
