export class  AdapterProperties {

  static decode(params: any): AdapterProperties {
    return new AdapterProperties(
      params['audioUrl'],
      params['title'],
      params['subtitle'],
      params['subscribeUrl'],
      params['subscribeTarget'],
      params['artworkUrl'],
      params['feedArtworkUrl']
    );
  }

  public hasMinimumParams(): boolean {
  return (this.audioUrl !== undefined) &&
      (this.title !== undefined) &&
      (this.subtitle !== undefined) &&
      (this.subscribeUrl !== undefined) &&
      (this.subscribeTarget !== undefined) &&
      (this.artworkUrl !== undefined)
  }

  constructor(
    public audioUrl?: string,
    public title?: string,
    public subtitle?: string,
    public subscribeUrl?: string,
    public subscribeTarget?: string,
    public artworkUrl?: string,
    public feedArtworkUrl?: string
  ) {}

}
