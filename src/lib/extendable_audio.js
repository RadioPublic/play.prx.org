/// <reference path="./extendable_audio.d.ts" />

export class ExtendableAudio {
  constructor(url) {
    this._audio = new Audio();
    var proto = Object.getPrototypeOf(this);
    for (let property in this._audio) {
      if (!(proto.hasOwnProperty(property) || this.hasOwnProperty(property))) {
        if (typeof this._audio[property] === 'function') {
          Object.defineProperty(this, property, {
            enumerable: false,
            value: this._audio[property].bind(this._audio),
            writable: false
          });
        } else {
          Object.defineProperty(this, property, {
            get: () => this._audio[property],
            set: (value: any)  => this._audio[property] = value
          });
        }
      }
    }

    if (url) { this.src = url; }
  }
}
