export class Timer {
  constructor(seconds, onTick, onEnd) {
    this.total = seconds;
    this.remaining = seconds;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this._id = null;
    this._paused = false;
  }

  start() {
    this.stop();
    this._paused = false;
    this._id = setInterval(() => {
      if (this._paused) return;
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.stop();
        this.onEnd();
      }
    }, 1000);
  }

  pause() {
    this._paused = true;
  }

  resume() {
    if (this.remaining <= 0) return;
    this._paused = false;
  }

  stop() {
    clearInterval(this._id);
    this._id = null;
    this._paused = false;
  }

  reset(seconds) {
    this.stop();
    this.total = seconds;
    this.remaining = seconds;
  }

  get progress() {
    return this.remaining / this.total;
  }
}
