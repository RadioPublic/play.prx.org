import {AdzerkRequest, AdzerkResponse} from './adzerk';
import AdzerkRequester from './adzerk_requester';

const GET = 'GET',
  ACCEPT = 'Accept',
  CONTENT_TYPE = 'Content-Type',
  APPLICATION_JSON = 'application/json',
  MIME_TYPE = 'application/vnd.dovetail.v1+json';

enum State { ERROR, SUCCESS }

interface ArrangementEntry {
  url: string;
  type: string;
  impressionUrl?: string;
}

export class DovetailPlayer extends HTMLAudioElement {

  private currentRequest: XMLHttpRequest;
  private currentAdRequest: XMLHttpRequest;
  private audio: HTMLAudioElement;
  private currentResponse: AdzerkResponse;

  constructor(url?: string) {
    try { super(); } catch (e) { /* Make TS Happy */ }
    this.audio = new Audio();

    for (let property in this.audio) {
      if (!(DovetailPlayer.prototype.hasOwnProperty(property) ||
        this.hasOwnProperty(property))) {
        if (typeof this.audio[property] === 'function') {
          Object.defineProperty(this, property, {
            enumerable: false,
            value: this.audio[property].bind(this.audio),
            writable: false
          });
        } else {
          Object.defineProperty(this, property, {
            get: () => this.audio[property],
            set: (value: any)  => this.audio[property] = value
          });
        }

      }
    }

    if (url) {
      this.src = url;
    }
  }

  set src(url: string) {
    if (this.currentRequest) { this.currentRequest.abort(); }

    this.currentRequest = new XMLHttpRequest();
    this.currentRequest.onreadystatechange =
      this.handleCallback.bind(this, State.SUCCESS, this.currentRequest, url);
    this.currentRequest.onerror =
      this.handleCallback.bind(this, State.ERROR, this.currentRequest, url);

    this.currentRequest.open(GET, url, true);
    this.currentRequest.setRequestHeader(ACCEPT, MIME_TYPE);
    this.currentRequest.send();
  }

  private handleCallback(state: State, request: XMLHttpRequest, originalUrl: string) {
    if (this.currentRequest == request) {
      if (state == State.SUCCESS && request.readyState >= 2) {
        if (request.getResponseHeader(CONTENT_TYPE) == APPLICATION_JSON) {
          if (request.readyState == 4) {
            let response = JSON.parse(this.currentRequest.responseText);
            console.log(this);
            console.log(response);
            let adzerkRequest = <AdzerkRequest> response.request;
            new AdzerkRequester(adzerkRequest, (error?: Error, adResponse?: AdzerkResponse) => {
              let arrangement: ArrangementEntry[] = [];
              let audioUrls: string[] = response.audioUrls.slice(0);
              if (adResponse) {
                for (let placement of response.program.placements) {
                  if (placement.type == 'original') {
                    let audioUrl = audioUrls.shift();
                    if (audioUrl) {
                      arrangement.push({
                        type: 'original',
                        url: audioUrl
                      });
                    }
                  } else {
                    if (adResponse.decisions[placement.id]) {
                      arrangement.push({
                        impressionUrl: adResponse.decisions[placement.id].impressionUrl,
                        type: placement.type || 'ad',
                        url: adResponse.decisions[placement.id].contents[0].data.imageUrl
                      });
                    }
                  }
                }
                this.audio.src = arrangement[0].url;
                console.log(JSON.stringify(arrangement, undefined, 2));
              }
            });
          }
        } else {
          this.currentRequest.abort();
          this.handleError(originalUrl);
        }
      } else if (state == State.ERROR) {
        this.handleError(originalUrl);
      }
    }
  }

  private handleError(url: string) {
    this.audio.src = url;
  }
}
