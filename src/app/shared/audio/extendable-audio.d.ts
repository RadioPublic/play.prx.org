/*
Essentially telling typescript that I have extended Audio even though I have
not. It forces it to assume that implementations of the methods and
properties on Audio already exist, which is helpful because I programatically
add them in a loop later.

I also have an actual Audio element wrapped in here, as _audio, and a hook
for once the constructor has finished (which is a little weird, more soon)
and an emit helper method for us to send events out.
*/

export class ExtendableAudio extends HTMLAudioElement {
  /* tslint:disable */
  protected _audio: HTMLAudioElement;
  /* tslint:enable */
  constructor(url?: string);
  protected finishConstructor(): void;
  protected emit(event: Event): boolean;
}
