import {AdzerkRequest} from './adzerk';

const GET = 'GET';
const ACCEPT = 'Accept';
const MIME_TYPE = 'application/vnd.dovetail.v1+json';
const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

class NonDovetailUrlError extends Error {
  constructor(public url: string) {
    super(`Not a dovetail URL: ${url}`);
  }
}

class HttpRequestError extends Error {
  constructor(private statusText: string, public url: string) {
    super(`${statusText}: ${url}`);
  }
}

class CancelledError extends Error { }

export type DovetailFetchError = NonDovetailUrlError | HttpRequestError | CancelledError;

export class DovetailFetcher {
  private activePromise: Promise<AdzerkRequest>;
  private currentRequest: XMLHttpRequest;
  private currentUrl: string;
  private toResolve: (value?: AdzerkRequest | PromiseLike<AdzerkRequest>) => void;
  private toReject: (reason?: DovetailFetchError) => any;

  public fetch(url: string) {
    if (this.currentUrl !== url) {
      this.cancel();
      this.currentUrl = url;

      this.activePromise = new Promise<AdzerkRequest>((resolve, reject) => {
        this.toResolve = resolve;
        this.toReject = reject;

        let request = this.currentRequest = new XMLHttpRequest();
        request.onreadystatechange = this.onReadyStateChange.bind(this, request);
        request.onerror = this.onError.bind(this, request);

        this.currentRequest.open(GET, url, true);
        this.currentRequest.setRequestHeader(ACCEPT, MIME_TYPE);
        this.currentRequest.send();
      });
    }

    return this.activePromise;
  }

  public cancel() {
    if (this.currentRequest) { this.currentRequest.abort(); }
    if (this.toReject) { this.toReject(new CancelledError); }
  }

  private onReadyStateChange(request: XMLHttpRequest) {
    if (request == this.currentRequest && request.readyState >= 2) {
      if (request.getResponseHeader(CONTENT_TYPE) == APPLICATION_JSON) {
        if (request.readyState >= 4) {
          this.toResolve(<AdzerkRequest> JSON.parse(request.responseText).request);
        }
      } else {
        request.abort();
        this.toReject(new NonDovetailUrlError(this.currentUrl));
      }
    }
  }

  private onError(request: XMLHttpRequest) {
    if (request == this.currentRequest) {
      this.toReject(new HttpRequestError(request.statusText, this.currentUrl));
    }
  }
}
