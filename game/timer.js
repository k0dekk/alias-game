export class Timer {
  constructor(seconds, onTick, onEnd) {
    this.total    = seconds;
    this.remaining = seconds;
    this.onTick   = onTick;
    this.onEnd    = onEnd;
    this._id      = null;
  }

  start() {
    this._id = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining);
      if (this.remaining <= 0) {
        this.stop();
        this.onEnd();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this._id);
    this._id = null;
  }

  reset(seconds) {
    this.stop();
    this.total     = seconds;
    this.remaining = seconds;
  }

  get progress() {
    return this.remaining / this.total;
  }
}