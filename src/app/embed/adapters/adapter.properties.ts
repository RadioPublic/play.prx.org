import { Observable } from 'rxjs/Observable';


export const PropNames = [
  'audioUrl',
  'title',
  'subtitle',
  'subscribeUrl',
  'subscribeTarget',
  'artworkUrl',
  'feedDescription',
  'feedArtworkUrl',
  'episodes'
]

export interface AdapterProperties { 
  audioUrl?: string;
  title?: string;
  subtitle?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  artworkUrl?: string;
  feedArtworkUrl?: string;
  feedDescription?: string;
  episodes?: Array<AdapterProperties>;
} 

export interface DataAdapter {
  getProperties: (params:Object) => Observable<AdapterProperties>
}

export function hasMinimumParams(props): boolean {
  return (props.audioUrl !== undefined) &&
    (props.title !== undefined) &&
    (props.subtitle !== undefined) &&
    (props.subscribeUrl !== undefined) &&
    (props.artworkUrl !== undefined)
}
export function getMergedValues(...data: AdapterProperties[]):AdapterProperties {
  const mergedResult: AdapterProperties = {};
  const resultsInReversePriority = data.reverse();

  for (let result of resultsInReversePriority)  {
    for (let property of PropNames) {
      if (typeof result[property] !== 'undefined') {
        mergedResult[property] = result[property];
      }
    }
  }
  return mergedResult;
}

