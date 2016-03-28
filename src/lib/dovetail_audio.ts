import {AdzerkRequest, AdzerkResponse} from './adzerk';
import {AdzerkFetcher} from './adzerk_fetcher';
import {ExtendableAudio} from '../javascript/extendable_audio';
import {DovetailFetcher, DovetailResponse} from './dovetail_fetcher';
import {DovetailAudioEvent} from './dovetail_audio_event';
import {DovetailArrangement, DovetailArrangementEntry} from './dovetail_arrangement';

type AllUnion = [
  DovetailResponse | PromiseLike<DovetailResponse>,
  AdzerkResponse | PromiseLike<AdzerkResponse>
];

type AllResult = [DovetailResponse, AdzerkResponse];

function sumDuration(collector: number, entry: {duration?: number}) {
  return collector + entry.duration || 0;
}

const DURATION_CHANGE = 'durationchange';
const TIME_UPDATE = 'timeupdate';
const ENDED = 'ended';
const AD_START = 'adstart';
const AD_END = 'adend';

export class DovetailAudio extends ExtendableAudio {
  private arrangement: DovetailArrangement = {entries: []};
  private index: number = 0;

  private _dovetailLoading = false;

  private adzerkFetcher = new AdzerkFetcher();
  private dovetailFetcher = new DovetailFetcher();

  private currentPromise: Promise<any>;
  private currentAdzerkPromise: Promise<AdzerkResponse>;
  private resumeOnLoad = false;

  constructor(url: string) {
    super(url);
    this._audio.addEventListener(DURATION_CHANGE, this.listenerOnDurationChange.bind(this));
    this._audio.addEventListener(ENDED, this.listenerOnEnded.bind(this));
    this._audio.addEventListener(TIME_UPDATE, this.listenerOnTimeUpdate.bind(this));
    this.finishConstructor();
  }

  play() {
    if (this._dovetailLoading) {
      this.resumeOnLoad = true;
    } else {
      this._audio.play();
    }
  }

  pause() {
    if (this._dovetailLoading) {
      this.resumeOnLoad = false;
    } else {
      this._audio.pause();
    }
  }

  get duration() {
    if (typeof this.arrangement.duration === 'undefined') {
      this.arrangement.duration = this.arrangement.entries.reduce(sumDuration, 0);
    }
    return this.arrangement.duration;
  }

  get currentTime() {
    return this._audio.currentTime +
      this.arrangement.entries.slice(0, this.index).reduce(sumDuration, 0);
  }

  set currentTime(position: number) {
    if (this.duration >= position) {
      let soFar = 0, paused = this.paused;
      for (let i = 0; i < this.arrangement.entries.length; i++) {
        let duration = this.arrangement.entries[i].duration;
        if (soFar + duration > position) {
          this.skipToFile(i);
          this._audio.currentTime = position - soFar;
          if (!paused) { this.play(); }
          return;
        } else {
          soFar += duration;
        }
      }
    }
  }

  set src(url: string) {
    this._dovetailLoading = true;
    let promise = this.currentPromise = this.dovetailFetcher.fetch(url).then(
      result => {
        if (this.currentPromise == promise) {
          let data: AllUnion  = [result, this.getArrangement(result.request)];
          return Promise.all<any>(data);
        }
      }
    ).then(([dovetailResponse, adzerkResponse]: AllResult) =>  {
      return this.calculateArrangement(dovetailResponse.arrangement, adzerkResponse);
    }).catch(error => {
      return [{
        audioUrl: url,
        duration: 0,
        id: 'fallback',
        type: 'fallback'
      }];
    }).then(arrangement => {
      if (this.currentPromise == promise) {
        this._dovetailLoading = false;
        this.setSegments(arrangement);
      }
    });
  }

  private getArrangement(adzerkRequestBody: AdzerkRequest, retries = 5) {
    let promise = this.currentAdzerkPromise = this.adzerkFetcher.fetch(adzerkRequestBody).catch(
      error => {
        if (this.currentAdzerkPromise == promise && retries > 0) {
          return this.getArrangement(adzerkRequestBody, retries - 1);
        } else {
          throw error;
        }
      }
    );
    return this.currentAdzerkPromise;
  }

  private calculateArrangement(
    arrangementTemplate: DovetailArrangementEntry[], response: AdzerkResponse) {
    let result: DovetailArrangementEntry[] = [];
    for (let entry of arrangementTemplate) {
      if (response.decisions[entry.id]) {
        result.push(entry);
        entry.audioUrl = response.decisions[entry.id].contents[0].data.imageUrl;
        entry.duration = 0;
      } else if (entry.type == 'original') {
        result.push(entry);
      }
    }
    return result;
  }

  private setSegments(segments: DovetailArrangementEntry[]) {
    this.arrangement = {entries: segments};
    this.skipToFile(0, this.resumeOnLoad);
  }

  private listenerOnDurationChange(event: Event) {
    event.stopImmediatePropagation();
    if (this._audio.src == this.arrangement.entries[this.index].audioUrl) {
      this.arrangement.entries[this.index].duration = this._audio.duration;
      this.arrangement.duration = undefined;
      let e = DovetailAudioEvent.build(DURATION_CHANGE, this);
      this.emit(e);
      if (this.ondurationchange) { this.ondurationchange(e); }
    }
  }

  private listenerOnEnded(event: Event) {
    event.stopImmediatePropagation();
    if (this._audio.src == this.arrangement.entries[this.index].audioUrl) {
      if (!this.skipToFile(this.index + 1, true)) {
        let e = DovetailAudioEvent.build(ENDED, this);
        this.emit(e);
      }
    }
  }

  private listenerOnTimeUpdate(event: Event) {
    event.stopImmediatePropagation();
    let e = DovetailAudioEvent.build(TIME_UPDATE, this);
    this.emit(e);
    if (this.ontimeupdate) {
      this.ontimeupdate(e);
    }
  }

  private skipToFile(index: number, resume = false) {
    if (this.arrangement.entries.length > index) {
      this.index = index;
      this._audio.src = this.arrangement.entries[index].audioUrl;
      if (resume) {
        this.play();
      }

      if (this.arrangement.entries[index].type == 'ad') {
        this.emit(DovetailAudioEvent.build(AD_START, this));
      } else {
        this.emit(DovetailAudioEvent.build(AD_END, this));
      }

      return true;
    } else {
      return false;
    }
  }
}
