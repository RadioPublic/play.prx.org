import { Observable } from 'rxjs/Observable';

export const PropNames = [
  'audioUrl',
  'title',
  'subtitle',
  'subscribeUrl',
  'subscribeTarget',
  'artworkUrl',
  'feedArtworkUrl',
  'episodeLink',
  'programLink',
  'programId',
  'pointerFeedName',
  'pointerFeedUrl'
];

export interface AdapterProperties {
  audioUrl?: string;
  title?: string;
  subtitle?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  artworkUrl?: string;
  feedArtworkUrl?: string;
  episodeLink?: string;
  programLink?: string;
  programId?: string;
  pointerFeedName?: string;
  pointerFeedUrl?: string;
}

export interface DataAdapter {
  getProperties: (params: Object) => Observable<AdapterProperties>;
}
