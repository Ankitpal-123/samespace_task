class AudioManager {
  constructor() {
    if (AudioManager.instance) return AudioManager.instance;

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.audio.preload = "metadata";
    this.onTimeUpdate = null;
    this.onEnded = null;

    this.audio.addEventListener("timeupdate", () => {
      if (this.onTimeUpdate) this.onTimeUpdate(this.audio.currentTime);
    });
    this.audio.addEventListener("ended", () => {
      if (this.onEnded) this.onEnded();
    });

    AudioManager.instance = this;
  }

  setSrc(src) {
    if (src && this.audio.src !== src) this.audio.src = src;
  }

  async play() {
    try {
      return await this.audio.play();
    } catch (e) {
      console.warn("Audio play blocked:", e);
    }
  }

  pause() {
    this.audio.pause();
  }

  seek(time) {
    try {
      this.audio.currentTime = time;
    } catch (e) {
      console.warn("seek failed", e);
    }
  }

  getCurrentTime() {
    return this.audio.currentTime || 0;
  }

  getDuration() {
    return this.audio.duration || 0;
  }

  /* --- mute API --- */
  setMuted(muted) {
    this.audio.muted = !!muted;
  }
  isMuted() {
    return !!this.audio.muted;
  }
  toggleMute() {
    this.setMuted(!this.isMuted());
  }
}

export default AudioManager;
