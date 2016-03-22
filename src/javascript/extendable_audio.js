/// <reference path="./extendable_audio.d.ts" />

const SKIP_PROPERTIES = ['dispatchEvent', 'addEventListener', 'removeEventListener'];

export class ExtendableAudio extends DocumentFragment {
  constructor(url) {
    this._audio = new Audio();
    this._documentFragment = document.createDocumentFragment();
    this._toSetUrl = url;
    var proto = Object.getPrototypeOf(this);
    for (let property in this._audio) {
      if (SKIP_PROPERTIES.indexOf(property) == -1 &&
        !(proto.hasOwnProperty(property) || this.hasOwnProperty(property))) {
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
  }

  finishConstructor() {
    if (this._toSetUrl) { this.src = this._toSetUrl; }
  }

  emit() {
    return this._documentFragment.dispatchEvent.apply(this._documentFragment, arguments);
  }

  addEventListener() {
    return this._documentFragment.addEventListener.apply(this._documentFragment, arguments);
  }

  removeEventListener() {
    return this._documentFragment.removeEventListener.apply(this._documentFragment, arguments);
  }

}
