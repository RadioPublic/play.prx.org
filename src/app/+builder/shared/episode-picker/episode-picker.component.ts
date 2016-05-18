import {Component, Input, OnChanges, OnInit, SimpleChange,
  Output, EventEmitter} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

const FEED_URL = 'feedUrl'

export class Episode {
  constructor(
    public url: string,
    public guid: string,
    public title: string,
    public artist: string,
    public imageUrl: string
  ) {}

  paramURL(): string {
    return encodeURIComponent(this.url);
  }
}

@Component({
  selector: 'episode-picker',
  templateUrl: 'src/app/+builder/shared/episode-picker/episode-picker.component.html'
})
export class EpisodePickerComponent {
  @Output() select = new EventEmitter<Episode>();
  @Input() private feedUrl: string;

  private episodes: Observable<Episode[]>;

  constructor (private http: Http) {}

  ngOnInit() {
    this.getEpisodes();
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (changes[FEED_URL] && changes[FEED_URL].currentValue) {
      this.feedUrl = changes[FEED_URL].currentValue;
      this.getEpisodes();
    }
  }

  private selectEpisode(episode: Episode) {
    this.select.emit(episode);
  }

  private getEpisodes() {
     this.episodes = this.http.get(this.feedUrl).map((res: Response) => {
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

        let guid = item.querySelector('guid').innerHTML;

        episodes.push(new Episode(encUrl, guid, title, artist, img));
      }

      return episodes;
    });
  }
}
