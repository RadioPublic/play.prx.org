export class Episode {

  constructor(
    public url: string,
    public guid: string,
    public title: string,
    public artist: string,
    public feedImageUrl: string,
    public epImageUrl: string
  ) {}

  paramURL(): string {
    return encodeURIComponent(this.url);
  }

}
