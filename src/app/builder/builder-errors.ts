export class InvalidFeedError extends Error {
  constructor(public url: string) {
    super(`Not an RSS feed URL: ${url}`);
  }
}
