export class NonDovetailUrlError extends Error {
  constructor(public url: string) {
    super(`Not a dovetail URL: ${url}`);
  }
}

export class HttpRequestError extends Error {
  constructor(private statusText: string, public url: string) {
    super(`${statusText}: ${url}`);
  }
}

export class CancelledError extends Error { }

export type DovetailFetchError = NonDovetailUrlError | HttpRequestError | CancelledError;
