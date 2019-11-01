import { Observable } from 'rxjs/Observable';
import { AppLinks } from './applinks';
export { AppLinks, toAppLinks } from './applinks';

export const PropNames = [
  'audioUrl',
  'duration',
  'title',
  'subtitle',
  'subscribeUrl',
  'subscribeTarget',
  'artworkUrl',
  'feedArtworkUrl',
  'episodes',
  'appLinks'
];

export interface AdapterProperties {
  audioUrl?: string;
  duration?: number;
  title?: string;
  subtitle?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  artworkUrl?: string;
  feedArtworkUrl?: string;
  episodes?: Array<AdapterProperties>;
  appLinks?: AppLinks;
  index?: number;
}

export interface DataAdapter {
  getProperties: (params: {}) => Observable<AdapterProperties>;
}
