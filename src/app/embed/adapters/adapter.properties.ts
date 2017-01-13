import { Observable } from 'rxjs/Observable';

export const PropNames = [
  'audioUrl',
  'title',
  'subtitle',
  'subscribeUrl',
  'subscribeTarget',
  'artworkUrl',
  'feedArtworkUrl'
];

export interface AdapterProperties {
  audioUrl?: string;
  title?: string;
  subtitle?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  artworkUrl?: string;
  feedArtworkUrl?: string;
}

export interface DataAdapter {
  getProperties: (params: Object) => Observable<AdapterProperties>;
}
