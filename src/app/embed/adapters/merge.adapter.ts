import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { QSDAdapter } from './qsd.adapter';
import { FeedAdapter } from './feed.adapter';
import { AdapterProperties, hasMinimumParams, DataAdapter, getMergedValues } from './adapter.properties';

const NO_EMIT_YET = Symbol();

@Injectable()
export class MergeAdapter {

  private adapters: DataAdapter[];

  constructor(private feedAdapter: FeedAdapter, private qsdAdapter: QSDAdapter) {
    this.adapters = [qsdAdapter, feedAdapter];
  }

  getProperties(params): Observable<AdapterProperties> {
    let chosenAdapters: Observable<AdapterProperties>[];

    chosenAdapters = this.adapters
      .map(obs => obs.getProperties(params))
      .map(obs => obs.startWith(NO_EMIT_YET));

    return Observable.combineLatest(...chosenAdapters).map(sources => {
      let data = [];
      for (let source of sources) {
        if (source === NO_EMIT_YET) { break; }
        data.push(source);
      }
      return getMergedValues(...data);
    }).filter(hasMinimumParams);
  }

}
