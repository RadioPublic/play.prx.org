import { EMBED_FEED_URL_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AdapterProperties, DataAdapter } from './adapter.properties';
import { sha1 }  from './sha1';

const GUID_PREFIX = 's1!';

@Injectable()
export class FeedAdapter implements DataAdapter {

  constructor(private http: Http) {}

  getProperties(params): Observable<AdapterProperties> {
    let feedUrl = params[EMBED_FEED_URL_PARAM];
    let episodeGuid = params[EMBED_EPISODE_GUID_PARAM];
    if (feedUrl && episodeGuid) {
      return this.fetchFeed(feedUrl).map(body => {
        let props = this.parseFeed(body, episodeGuid);
        Object.keys(props).forEach(key => {
          if (props[key] === undefined) { delete props[key]; }
        });
        return props;
      }).catch(err => {
        console.error(err.message);
        return Observable.of({}); // TODO: really ignore errors?
      });
    } else {
      return Observable.of({});
    }
  }

  fetchFeed(feedUrl: string): Observable<string> {
    let proxied = this.proxyUrl(feedUrl);
    return this.http.get(proxied).map(res => {
      if (res.ok && res.text()) {
        return res.text();
      } else if (res.ok) {
        throw new Error(`Got empty response from ${proxied}`);
      } else {
        throw new Error(`Got ${res.status} from ${proxied}`);
      }
    });
  }

  parseFeed(xml: string, episodeGuid: string): AdapterProperties {
    let parser = new DOMParser();
    let doc = <XMLDocument> parser.parseFromString(xml, 'application/xml');
    let props = this.processDoc(doc);

    let episode = this.parseFeedEpisode(doc, episodeGuid);
    if (episode) {
      props = this.processEpisode(episode, props);
    }

    return props;
  }

  parseFeedEpisode(doc: XMLDocument, episodeGuid: string): Element {
    let items = doc.querySelectorAll('item');
    for (let i = 0; i < items.length; i++) {
      let itemGuid = this.getTagText(items[i], 'guid');
      if (itemGuid) {
        if (!this.isEncoded(itemGuid) && this.isEncoded(episodeGuid)) {
          itemGuid = this.encodeGuid(itemGuid);
        }
        if (itemGuid.indexOf(episodeGuid) !== -1) {
          return items[i];
        }
      }
    }
  }

  processDoc(doc: XMLDocument, props: AdapterProperties = {}): AdapterProperties {
    props.subtitle = this.getTagText(doc, 'title');
    props.subscribeUrl = this.getTagAttributeNS(doc, 'atom', 'link', 'href'); // TODO: what if this isn't the first link?
    props.feedArtworkUrl = this.getTagAttributeNS(doc, 'itunes', 'image', 'href');
    return props;
  }

  processEpisode(item: Element, props: AdapterProperties = {}): AdapterProperties {
    props.title = this.getTagText(item, 'title');
    props.audioUrl = this.getTagTextNS(item, 'feedburner', 'origEnclosureLink');
    if (!props.audioUrl) {
      props.audioUrl = this.getTagAttribute(item, 'enclosure', 'url');
    }
    props.artworkUrl = this.getTagAttributeNS(item, 'itunes', 'image', 'href');
    if (!props.artworkUrl) {
      props.artworkUrl = props.feedArtworkUrl;
    }
    return props;
  }

  proxyUrl(url: string): string {
    if (window['ENV'] && window['ENV']['FEED_PROXY_URL']) {
      return window['ENV']['FEED_PROXY_URL'] + url;
    } else {
      return `/proxy?url=${url}`;
    }
  }

  protected isEncoded(guid): boolean {
    return (guid.indexOf(GUID_PREFIX) === 0);
  }

  protected encodeGuid(guid): string {
    return `${GUID_PREFIX}${sha1.hash(guid)};`;
  }

  protected getTagText(el: Element | XMLDocument, tag: string): string {
    let found = el.getElementsByTagName(tag);
    if (found.length) {
      return found[0].textContent;
    }
  }

  protected getTagTextNS(el: Element | XMLDocument, ns: string, tag: string): string {
    let namespace = el.lookupNamespaceURI(ns);
    let found = el.getElementsByTagNameNS(namespace, tag);
    if (found.length) {
      return found[0].textContent;
    }
  }

  protected getTagAttribute(el: Element | XMLDocument, tag: string, attr: string): string {
    let found = el.getElementsByTagName(tag);
    if (found.length) {
      return found[0].getAttribute(attr);
    }
  }

  protected getTagAttributeNS(el: Element | XMLDocument, ns: string, tag: string, attr: string): string {
    let namespace = el.lookupNamespaceURI(ns);
    let found = el.getElementsByTagNameNS(namespace, tag);
    if (found.length) {
      return found[0].getAttribute(attr);
    }
  }

}
