import { testService, injectHttp } from '../../../testing';
import { Subject } from 'rxjs';
import { AdapterProperties } from './adapter.properties';
import { MergeAdapter } from './merge.adapter';
import { FeedAdapter } from './feed.adapter';
import { QSDAdapter } from './qsd.adapter';

describe('MergeAdapter', () => {

  let qsd: Subject<AdapterProperties>, feed: Subject<AdapterProperties>;
  testService(MergeAdapter, [
    {
      provide: QSDAdapter,
      useFactory: () => {
        return {getProperties: () => qsd = new Subject()};
      }
    },
    {
      provide: FeedAdapter,
      useFactory: () => {
        return {getProperties: () => feed = new Subject()};
      }
    }
  ]);

  it('waits the 1st adapter before using the 2nd', injectHttp((merge: MergeAdapter) => {
    spyOn(merge, 'hasMinimumParams').and.returnValue(true);
    let props: AdapterProperties;
    merge.getProperties({}).subscribe(p => props = p);
    expect(props).toBeUndefined();
    feed.next({title: 'feed-title'});
    expect(props).toBeUndefined();
    qsd.next({});
    expect(props).toEqual({title: 'feed-title'});
  }));

  it('overrides adapters by priority', injectHttp((merge: MergeAdapter) => {
    spyOn(merge, 'hasMinimumParams').and.returnValue(true);
    let props: AdapterProperties;
    merge.getProperties({}).subscribe(p => props = p);
    feed.next({title: 'feed-title'});
    qsd.next({title: 'qsd-title'});
    expect(props).toEqual({title: 'qsd-title'});
  }));

  it('always uses the latest values', injectHttp((merge: MergeAdapter) => {
    spyOn(merge, 'hasMinimumParams').and.returnValue(true);
    let props: AdapterProperties;
    merge.getProperties({}).subscribe(p => props = p);
    feed.next({title: 'feed-title-1'});
    feed.next({title: 'feed-title-2'});
    qsd.next({});
    expect(props).toEqual({title: 'feed-title-2'});
  }));

  describe('with lax required properties', () => {

    let oldRequired;
    beforeEach(() => {
      oldRequired = MergeAdapter.REQUIRED;
      MergeAdapter.REQUIRED = ['title', 'subtitle'];
    });
    afterEach(() => MergeAdapter.REQUIRED = oldRequired);

    it('enforces required properties', injectHttp((merge: MergeAdapter) => {
      MergeAdapter.REQUIRED = ['title', 'subtitle'];
      let props: AdapterProperties;
      merge.getProperties({}).subscribe(p => props = p);
      qsd.next({title: 'qsd-title'});
      expect(props).toBeUndefined();
      qsd.next({subtitle: 'qsd-subtitle'});
      expect(props).toBeUndefined();
      qsd.next({title: 'qsd-title', subtitle: 'qsd-subtitle'});
      expect(props.title).toEqual('qsd-title');
      expect(props.subtitle).toEqual('qsd-subtitle');
    }));

  });

});
