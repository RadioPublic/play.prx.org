export interface AdapterProperties { 
  audioUrl?: string;
  title?: string;
  subtitle?: string;
  subscribeUrl?: string;
  subscribeTarget?: string;
  artworkUrl?: string;
  feedArtworkUrl?: string;
} 


export function hasMinimumParams(props) {
  return (props.audioUrl !== undefined) &&
    (props.title !== undefined) &&
    (props.subtitle !== undefined) &&
    (props.subscribeUrl !== undefined) &&
    (props.subscribeTarget !== undefined) &&
    (props.artworkUrl !== undefined)
}

