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
 		return this.http.get(this.draperUrl).map(this.parseResponse)
	}

	private get draperUrl(): string { 
		let feedUrl = `https://draper.radiopublic.com/transform?url=${this.feedUrl}`
		let feedId;
		
		return (feedUrl || feedId)
	}

	private parseResponse(res: Response): Object {
		let xml = res.text();
		let parser = new DOMParser();
		let doc = <XMLDocument> parser.parseFromString(xml, 'application/xml');
		let img: string;
		let _img = Array.from(doc.querySelectorAll('channel > *[href]')).filter(e => e.nodeName === 'itunes:image')[0];
		if (_img) {
			img = _img.getAttribute('href');
		}

		let artist = doc.querySelector('channel > title').innerHTML;

		let elements = doc.querySelectorAll('item');

		let episode;
		for (let i = 0; i < elements.length; ++i) {
			let item = <Element> elements[i];
			let guid = item.querySelector('guid').innerHTML;

			if(guid == this.guid){ episode =  item }
		};

    episode = episode || elements[0]

		let title = function (html: string) {
			let txt = <HTMLTextAreaElement> document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		}(episode.querySelector('title').innerHTML);

    let audioUrl = episode.querySelector('enclosure').getAttribute('url');

		return {
			audioUrl:         audioUrl,
			title:            title,
      // subtitle:         subtitle,
      // subscribeUrl:     subscribeUrl,
      // subscribeTarget:  subscribeTarget,
      // artworkUrl:       artworkUrl
		}
	}
}



