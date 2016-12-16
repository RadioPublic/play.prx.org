import { Observable } from 'rxjs/Observable';

export class FeedAdapter {
  constructor(private params: Object) {
    this.params = params
  }

  public get getParams(): Observable<Object> {
    return Observable.of({
        artworkUrl: this.artworkUrl
    });
  }

  get artworkUrl(): string {
    return "http://static.libsyn.com/p/assets/7/4/f/d/74fdaa8be1b5684f/The_Adventure_Zone_Flat.jpg"
  }
}



