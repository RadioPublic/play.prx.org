import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';

import { AdapterProperties } from './adapter.properties'

export class MergeAdapter {
  private Adapters: Observable<AdapterProperties>
  constructor(
		private params: Object,
    private concatAdapter: any, 
    ...adapters: Array<any>
	) {
    this.params = params;
    this.Adapters  = Observable.of(...adapters).
      map( x => x.getProperties(this.params)).
      mergeAll();
  }

  get getProperties(): Observable<AdapterProperties> {

    return this.Adapters.
      concat(this.concatAdapter.getProperties(this.params));
	}
}



