import { EMBED_FEED_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants'
import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AdapterProperties, DataAdapter } from './adapter.properties';
let sha1 = require('sha1');

const GUID_PREFIX = 's1!'
@Injectable()
export class FeedAdapter implements DataAdapter {
	private feedUrl: string
	private feedId: string
	private guid: string

  constructor(private http: Http) {}

	public getProperties(params): Observable<AdapterProperties> { 
    this.feedUrl = params[EMBED_FEED_URL_PARAM]
    this.feedId  = params[EMBED_FEED_ID_PARAM]
    this.guid    = params[EMBED_EPISODE_GUID_PARAM] 

 		return this.http.get(this.draperUrl).map((res: Response) => {
      let xml = res.text();
      let parser = new DOMParser();
      let doc = <XMLDocument> parser.parseFromString(xml, 'application/xml');
      let rpNamespace = doc.lookupNamespaceURI('rp')
      let atomNamespace = doc.lookupNamespaceURI('atom')
      let elements = doc.querySelectorAll('item');

      let episode;
      if(this.guid) { 
        for (let i = 0; i < elements.length; ++i) {
          let item = <Element> elements[i];
          let episodeGuid = item.getElementsByTagName('guid')[0].textContent;
          if(this.isEncoded(this.guid) && !this.isEncoded(episodeGuid)){
            episodeGuid = this.encodeGuid(episodeGuid);
          };
          if(episodeGuid.indexOf(this.guid) !== -1){ 
            episode = item;
						break;
          }
        };
      } 
			episode = episode || elements[0]

      let title = episode.getElementsByTagName('title')[0].textContent
      let audioUrl = episode.getElementsByTagName('enclosure')[0].getAttribute('url')
      let subtitle = doc.getElementsByTagName('title')[0].textContent
      let subscribeUrl = doc.getElementsByTagNameNS(atomNamespace, 'link')[0].getAttribute('href')
      // Future feeds may not include RP-namespaced data!
      let feedArtworkUrl  = doc.getElementsByTagNameNS(rpNamespace, 'image')[0].getAttribute('href')
      let artworkUrl  = episode.getElementsByTagNameNS(rpNamespace, 'image') 

      if (artworkUrl.length == 0){ 
        artworkUrl = feedArtworkUrl
      } else { 
        artworkUrl = artworkUrl[0].getAttribute('href')
      };

      return { 
        audioUrl, 
        title, 
        subtitle, 
        subscribeUrl, 
        feedArtworkUrl,
        artworkUrl 
      }
    })
	}

  private isEncoded(guid): boolean { 
    return (guid.indexOf(GUID_PREFIX) == 0)
  }

  private encodeGuid(guid): string {
    return `${GUID_PREFIX}${sha1(guid)};`
  }

	private get draperUrl(): string { 
    let feedUrl, feedId;
    if (this.feedUrl) { 
      feedUrl = `${window['ENV']['FEED_PROXY_URL']}${this.feedUrl}`
    } else if (this.feedId) {
      feedId = `https://draper.radiopublic.com/transform?program_id=${this.feedId}`
    }
		return (feedUrl || feedId)
	}
}
