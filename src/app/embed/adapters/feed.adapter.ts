import { EMBED_FEED_URL_PARAM, EMBED_FEED_ID_PARAM, EMBED_EPISODE_GUID_PARAM } from './../embed.constants'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class FeedAdapter {
	private feedUrl: string
	private feedId: string
	private guid: string

  constructor(
		private params: Object,
		private http: Http
	) {
		this.feedUrl = params[EMBED_FEED_URL_PARAM]
		this.feedId  = params[EMBED_FEED_ID_PARAM]
		this.guid = params[EMBED_EPISODE_GUID_PARAM]
  }

	public get getParams(): Observable<Object> { 
 		return this.http.get(this.draperUrl).map(this.parseResponse.bind(this))
	}

	private get draperUrl(): string { 
    let feedUrl, feedId;
    if (this.feedUrl) { 
      feedUrl = `https://draper.radiopublic.com/transform?url=${this.feedUrl}`
    } else if (this.feedId) {
      feedId = `https://draper.radiopublic.com/transform?program_id=${this.feedId}`
    }
		return (feedUrl || feedId)
	}

	private parseResponse(res: Response): Object {
		let xml = res.text();
		let parser = new DOMParser();
		let doc = <XMLDocument> parser.parseFromString(xml, 'application/xml');
    let rpNamespace = doc.lookupNamespaceURI('rp')
    let atomNamespace = doc.lookupNamespaceURI('atom')
		let elements = doc.querySelectorAll('item');

		let episode;
		for (let i = 0; i < elements.length; ++i) {
			let item = <Element> elements[i];
      let guid = item.getElementsByTagName('guid')[0].textContent

			if(guid == this.guid){ episode = item }
		};

    //temp
    episode = episode || elements[0]

    let title = episode.getElementsByTagName('title')[0].textContent
    let audioUrl = episode.getElementsByTagName('enclosure')[0].getAttribute('url')

    let subtitle = doc.getElementsByTagName('title')[0].textContent
    let subscribeUrl = doc.getElementsByTagNameNS(atomNamespace, 'link')[0].getAttribute('href')
    let feedArtworkUrl  = doc.getElementsByTagNameNS(rpNamespace, 'image')[0].getAttribute('href')
    let artworkUrl  = episode.getElementsByTagNameNS(rpNamespace, 'image') 
    if (artworkUrl.length == 0){ 
      artworkUrl = feedArtworkUrl
    } else { 
      artworkUrl = artworkUrl[0].getAttribute('href')
    };

    console.log(doc);
		let parsed = { 
      audioUrl, 
      title, 
      subtitle, 
      subscribeUrl, 
      feedArtworkUrl,
      artworkUrl 
    }
    return parsed;
	}

}



