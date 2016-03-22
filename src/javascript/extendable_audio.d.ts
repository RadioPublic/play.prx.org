export class ExtendableAudio extends Audio {
  /* tslint:disable */
  protected _audio: HTMLAudioElement;
  /* tslint:enable */
  constructor(url?: string);
  protected finishConstructor(): void;
  protected emit(event: Event): boolean;
}
