import {AdzerkRequest, AdzerkResponse} from './adzerk';
import {AdzerkFetcher} from './adzerk_fetcher';
import {ExtendableAudio} from './extendable_audio';
import {AudioSegment} from './audio_segment';
import {DovetailFetcher} from './dovetail_fetcher';

interface ArrangementEntry {
  url: string;
  duration: number;
  type: string;
  impressionUrl?: string;
}

export class DovetailPlayer extends ExtendableAudio {

  private arrangement: ArrangementEntry[] = [];

  private adzerkFetcher = new AdzerkFetcher();
  private dovetailFetcher = new DovetailFetcher();

  private currentPromise: Promise<void>;
  private currentAdzerkPromise: Promise<AdzerkResponse>;

  set src(url: string) {
    let promise = this.currentPromise = this.dovetailFetcher.fetch(url).then(
      result => {
        if (this.currentPromise == promise) {
          return this.getArrangement(result);
        }
      }
    ).then(result =>  {

    }).catch(error => {
      if (this.currentPromise == promise) {
        this.setSegments([url]);
      }
    });
  }

  private getArrangement(adzerkRequestBody: AdzerkRequest, retries = 5) {
    let promise = this.currentAdzerkPromise = this.adzerkFetcher.fetch(adzerkRequestBody).catch(
      error => {
        if (this.currentAdzerkPromise == promise && retries > 0) {
          return this.getArrangement(adzerkRequestBody, retries - 1);
        }
      }
    );
    return this.currentAdzerkPromise;
  }

  private calculateArrangment(data: AdzerkResponse) :  {

  }

  private setSegments(segments: (AudioSegment | string)[]) {
    let results = new Array<AudioSegment>();
    for (let segment of segments) {
      if (typeof segment === 'string') {
        results.push({duration: 0, src: <string> segment});
      } else {
        results.push(<AudioSegment> segment);
      }
    }
    console.log(results);
  }
}
