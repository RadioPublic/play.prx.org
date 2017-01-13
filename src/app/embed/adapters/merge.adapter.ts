import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DraperAdapter } from './draper.adapter';
import { FeedAdapter } from './feed.adapter';
import { QSDAdapter } from './qsd.adapter';
import { AdapterProperties, PropNames, DataAdapter } from './adapter.properties';

const NO_EMIT_YET = Symbol();

@Injectable()
export class MergeAdapter {

  static REQUIRED = ['audioUrl', 'title', 'subtitle', 'subscribeUrl', 'feedArtworkUrl'];

  private adapters: DataAdapter[];

  constructor(
    private draperAdapter: DraperAdapter,
    private feedAdapter: FeedAdapter,
    private qsdAdapter: QSDAdapter,
  ) {
    this.adapters = [qsdAdapter, draperAdapter, feedAdapter];
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
      return this.getMergedValues(...data);
    }).filter(this.hasAnyParams).filter(this.hasMinimumParams);
  }

  getMergedValues(...data: AdapterProperties[]): AdapterProperties {
    const mergedResult: AdapterProperties = {};
    const resultsInReversePriority = data.reverse();

    for (let result of resultsInReversePriority)  {
      for (let property of PropNames) {
        if (typeof result[property] !== 'undefined') {
          mergedResult[property] = result[property];
        }
      }
    }
    return mergedResult;
  }

  hasAnyParams(props: AdapterProperties): boolean {
    return Object.keys(props).length > 0;
  }

  hasMinimumParams(props: AdapterProperties): boolean {
    for (let key of MergeAdapter.REQUIRED) {
      if (props[key] === undefined) { return false; }
    }
    return true;
  }

}
