/// <reference path="./extendable-audio.d.ts" />

const SKIP_PROPERTIES = ['dispatchEvent', 'addEventListener', 'removeEventListener', 'paused'];

export class ExtendableAudio {

  _audio: HTMLAudioElement;
  _documentFragment: DocumentFragment;
  _toSetUrl: string;

  // TODO: only defining to make typescript happy - why doesn't the d.ts work?
  src: string;
  ondurationchange: Function;
  ontimeupdate: Function;
  onseeking: Function;
  volume: number;

  constructor(url) {
    if (typeof window['Audio'] !== 'undefined') {
      this._audio = new Audio();
    } else {
      // Basically make audio a noop on phantom or browsers with no Audio support
      this._audio = ({addEventListener: noop} as any) as HTMLAudioElement;
      // TODO: maybe we should detect this and throw up a warning for those
      // people on ie6?
    }

    // This is our proxy for DOM events
    this._documentFragment = document.createDocumentFragment();
    this._toSetUrl = url;
    let proto = Object.getPrototypeOf(this);
    for (let property in this._audio) {
      if (SKIP_PROPERTIES.indexOf(property) === -1 &&
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

  emit(e: Event) {
    return this._documentFragment.dispatchEvent.apply(this._documentFragment, arguments);
  }

  addEventListener(event: string, callback: Function) {
    return this._documentFragment.addEventListener.apply(this._documentFragment, arguments);
  }

  removeEventListener() {
    return this._documentFragment.removeEventListener.apply(this._documentFragment, arguments);
  }

  get paused(): boolean {
    return this._audio.paused;
  }

}

function noop() { }
