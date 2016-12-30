import { EMBED_FEED_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants'
import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AdapterProperties, DataAdapter } from './adapter.properties';
import { sha1 }  from './sha1'

const GUID_PREFIX = 's1!'
@Injectable()
export class FeedAdapter implements DataAdapter {
	private feedUrl: string
	private feedId: string
	private guid: string
  private doc: XMLDocument
  private namespaces: Object
  private feedArtworkUrl: string
  private subtitle: string
  private subscribeUrl: string

  constructor(private http: Http) {}

	public getProperties(params): Observable<AdapterProperties> {
    this.feedUrl = params[EMBED_FEED_URL_PARAM]
    this.feedId  = params[EMBED_FEED_ID_PARAM]
    this.guid    = params[EMBED_EPISODE_GUID_PARAM]

 		return this.http.get(this.draperUrl).map((res: Response) => {
      let xml = res.text();
      let parser = new DOMParser();
      this.doc = <XMLDocument> parser.parseFromString(xml, 'application/xml'); 

      // Future feeds may not include RP-namespaced data!
      this.namespaces = {
        rp: this.doc.lookupNamespaceURI('rp'),
        atom: this.doc.lookupNamespaceURI('atom')
      }

      let elements = this.doc.querySelectorAll('item');
      this.subtitle = this.doc.getElementsByTagName('title')[0].textContent
      this.subscribeUrl = this.doc.getElementsByTagNameNS(this.namespaces['atom'], 'link')[0].getAttribute('href')
      this.feedArtworkUrl  = this.doc.getElementsByTagNameNS(this.namespaces['rp'], 'image')[0].getAttribute('href')

      return this.mapElementsToProperties(elements);
    })
	}

  private wrap(episode) { 
    let title = episode.getElementsByTagName('title')[0].textContent
    let audioUrl = episode.getElementsByTagName('enclosure')
    let artworkUrl  = episode.getElementsByTagNameNS(this.namespaces['rp'], 'image')

    if (audioUrl.length == 0){
      audioUrl = undefined
    } else {
      audioUrl = audioUrl[0].getAttribute('url')
    }
    if (artworkUrl.length == 0){
      artworkUrl = this.feedArtworkUrl
    } else {
      artworkUrl = artworkUrl[0].getAttribute('href')
    };

    return {
      audioUrl,
      title,
      subtitle: this.subtitle,
      subscribeUrl: this.subscribeUrl,
      feedArtworkUrl: this.feedArtworkUrl,
      artworkUrl
    }
  }

  private mapElementsToProperties(elements) { 
    let properties = { episodes: [] }

    for (let i = 0; i < elements.length; ++i) {
      let item = <Element> elements[i];
      let episodeGuid = item.getElementsByTagName('guid')[0].textContent;

      let episode = this.wrap(item);
      properties.episodes.push(episode)

      if(this.guid) {
        if(this.isEncoded(this.guid) && !this.isEncoded(episodeGuid)){
          episodeGuid = this.encodeGuid(episodeGuid);
        };
        if(episodeGuid.indexOf(this.guid) !== -1){
           properties = Object.assign({}, properties, episode) 
        }
      } else { 
        if (i === 0){ properties = Object.assign({}, properties, episode) }
      }
    }
    return properties;
  }

  private isEncoded(guid): boolean {
    return (guid.indexOf(GUID_PREFIX) == 0)
  }

  private encodeGuid(guid): string {
    return `${GUID_PREFIX}${sha1.hash(guid)};`
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
