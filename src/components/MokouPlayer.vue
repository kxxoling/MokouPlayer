<template>
  <section class="video-player">
    <input class="source" type="file" accept=".mp4,.mkv,.webm,.webp">
    <button class="snapshot">snapshot</button>
    <button class="forward">forward</button>
    <button class="backward">backward</button>
    <video class="video" controls autoplay download>
    </video>
  </section>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  video, input {
  display: block;
  }

  ::cue {
  color: #444;
  font: 1em sans-serif;
  }

  ::cue .warning {
  color: red;
  font: bold;
  }
</style>

<script type="text/javascript">
const URL = window.URL || window.webkitURL;

function downloadCanvas(canv) {
  const image = canv.toDataURL('image/png');
  const aLink = document.createElement('a');
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click');

  aLink.download = 'snapshot.png';
  aLink.href = image;

  aLink.dispatchEvent(evt);
  aLink.click();
}
function takeSnapshot() {
  const video = this.parentNode.querySelector('video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  downloadCanvas(canvas);
}

function forward(seconds = 5) {
  const video = this.parentNode.querySelector('video');
  const currentTime = video.currentTime;
  const end = video.seekable.end(0);
  const next = currentTime + seconds;
  video.currentTime = (end > next) ? next : end;
}

function backward(seconds = 5) {
  const video = this.parentNode.querySelector('video');
  const currentTime = video.currentTime;
  const end = video.seekable.end(0);
  const next = currentTime - seconds;
  video.currentTime = (end > next) ? next : end;
}

function localFileVideoPlayer(videoNode) {
  const parentNode = videoNode.parentNode;
  function playSelectedFile() {
    const file = this.files[0];
    // const type = file.type;

    const fileURL = URL.createObjectURL(file);
    videoNode.src = fileURL;  // eslint no-param-reassign: 0

    const downloadNode = document.createElement('a');
    downloadNode.innerText = 'download';
    downloadNode.setAttribute('href', fileURL);
    downloadNode.setAttribute('download', 'download');
    videoNode.innerHTML = '';
    videoNode.appendChild(downloadNode);
  }
  const inputNode = parentNode.querySelector('input');
  inputNode.addEventListener('change', playSelectedFile, false);
  const snapshotBtn = parentNode.querySelector('.snapshot');
  snapshotBtn.addEventListener('click', takeSnapshot, false);
  const forwardButton = parentNode.querySelector('.forward');
  const backwardButton = parentNode.querySelector('.backward');
  forwardButton.addEventListener('click', forward, false);
  backwardButton.addEventListener('click', backward, false);
}

export default {
  data() {
    return {};
  },
  mounted() {
    localFileVideoPlayer(this.$el.querySelector('video'));
  },
};
</script>
