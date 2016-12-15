import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Episode } from './episode';

@Component({
  selector: 'play-episode-picker',
  styleUrls: ['episode-picker.component.css'],
  template: `
    <select (change)="selectEpisode(select.value)" #select>
      <option value="">Select an episode</option>
      <option *ngFor="let ep of episodes | async" [value]="ep.guid">{{ep.title}}</option>
    </select>
  `
})

export class EpisodePickerComponent implements OnChanges, OnInit {

  @Input() feedUrl: string;
  @Output() select = new EventEmitter<Episode>();

  episodes: Observable<Episode[]>;
  _episodes: Episode[];

  constructor (private http: Http) {}

  ngOnInit() {
    this.getEpisodes();
  }

  ngOnChanges(changes: any) {
    if (changes.feedUrl && changes.feedUrl.currentValue) {
      this.getEpisodes();
    }
  }

  selectEpisode(guid: string) {
    const episode = this._episodes.find(e => e.guid === guid);
    this.select.emit(episode);
  }

  private proxiedFeedUri() {
    const customProxyUrl= window['ENV']['FEED_PROXY_URL'];
    const expressProxyPath = "/proxy?url=";
    let proxyUri;

    if(customProxyUrl != undefined){
      proxyUri = customProxyUrl
    } else { 
      proxyUri = expressProxyPath 
    }
    return `${proxyUri}${this.feedUrl}`;
  }

  private getEpisodes() {
    const feedUri = this.proxiedFeedUri();
    this.episodes = this.http.get(feedUri).map((res: Response) => {
      let episodes: Episode[] = [];

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

      for (let i = 0; i < elements.length; ++i) {
        let item = <Element> elements[i];

        let title = function (html: string) {
          let txt = <HTMLTextAreaElement> document.createElement('textarea');
          txt.innerHTML = html;
          return txt.value;
        }(item.querySelector('title').innerHTML);

        let encUrl = item.querySelector('enclosure').getAttribute('url');

        let __img = Array.from(item.querySelectorAll('*[href]')).filter(e => e.nodeName === 'itunes:image')[0];
        if (__img) {
          img = __img.getAttribute('href');
        }

        let fbOrigEncUrl = item.querySelector('origEnclosureLink');
        if (fbOrigEncUrl) {
          encUrl = fbOrigEncUrl.innerHTML;
        }

        let guid = item.querySelector('guid').innerHTML;

        episodes.push(new Episode(encUrl, guid, title, artist, img));
      }

      this._episodes = episodes;
      return episodes;
    });
  }

}
