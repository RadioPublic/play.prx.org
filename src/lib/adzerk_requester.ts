import {AdzerkRequest, AdzerkResponse} from './adzerk';

const API_ENDPOINT = 'https://engine.adzerk.net/api/v2';
const POST = 'POST';
const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

export default class AdzerkRequester {
  private request: XMLHttpRequest;
  private callback: (error?: Error, response?: AdzerkResponse) => any;

  constructor(request: AdzerkRequest, callback: (error?: Error, response?: AdzerkResponse) => any) {
    this.callback = callback;

    this.request = new XMLHttpRequest();
    this.request.onreadystatechange = this.onsuccess.bind(this);
    this.request.onerror = this.onerror.bind(this);
    this.request.open(POST, API_ENDPOINT);
    this.request.setRequestHeader(CONTENT_TYPE, APPLICATION_JSON);
    this.request.send(JSON.stringify(request));
  }

  onsuccess() {
    if (this.request.readyState == 4) {
      this.callback(undefined, <AdzerkResponse> JSON.parse(this.request.responseText));
    }
  }

  onerror() {
    this.callback(new Error('Error requesting from adzerk'));
  }
}
