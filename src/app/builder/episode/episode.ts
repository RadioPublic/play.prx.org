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
