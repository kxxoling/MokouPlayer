<template>
  <section class="video-player">
    <h1>{{ this.file && this.file.name }}</h1>
    <input class="source" type="file" accept=".mp4,.mkv,.webm,.webp" v-on:change="onVideoChanged" multiple="false">
    <button class="snapshot" @click="takeSnapshot">snapshot</button>
    <button class="forward" @click="forward">forward</button>
    <button class="backward" @click="backward">backward</button>
    <video class="video" controls autoplay download>
      <a :href="fileUrl" download>download</a>
    </video>
  </section>
</template>

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

function takeSnapshot(video, filename = 'snapshot') {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const image = canvas.toDataURL('image/png');
  const aLink = document.createElement('a');
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click');

  aLink.download = `${filename}.png`;
  aLink.href = image;

  aLink.dispatchEvent(evt);
  aLink.click();
}

export default {
  data() {
    return {
      video: null,
      file: null,
      fileUrl: null,
    };
  },
  methods: {
    onVideoChanged() {
      this.video = this.$el.querySelector('video');
      const videoNode = this.video;
      this.file = this.$el.querySelector('input').files[0];
      this.fileURL = URL.createObjectURL(this.file);
      videoNode.src = this.fileURL;  // eslint no-param-reassign: 0
    },
    forward(ev, seconds = 5) {
      const video = this.video;
      const currentTime = video.currentTime;
      const end = video.seekable.end(0);
      const next = currentTime + seconds;
      video.currentTime = (end > next) ? next : end;
    },
    backward(ev, seconds = 5) {
      const video = this.video;
      const currentTime = video.currentTime;
      const end = video.seekable.end(0);
      const next = currentTime - seconds;
      video.currentTime = (end > next) ? next : end;
    },
    takeSnapshot() {
      takeSnapshot(this.video);
    },
  },
};
</script>
