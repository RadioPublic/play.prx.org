import {Injectable} from '@angular/core';

export const VISIBLE = false, HIDDEN = true;
export type Visibility = true | false;

type VisibilityListener = ((event: Event, hidden: Visibility) => any) & {$$VisibilityCallback?: (event:Event) => any};

@Injectable()
export class VisibilityService {
  private VISIBILITYEVENT: string;
  private HIDDENPROP: string;

  constructor() {
    const props = getPropNames();
    this.VISIBILITYEVENT = props.VISIBILITYEVENT;
    this.HIDDENPROP = props.HIDDENPROP;
  }

  addVisibilityListener(callback: VisibilityListener) {
    callback.$$VisibilityCallback = (event) => callback(event, document[this.HIDDENPROP]);
    document.addEventListener(this.VISIBILITYEVENT, callback.$$VisibilityCallback);
  }

  removeVisibilityListener(callback: VisibilityListener) {
    document.removeEventListener(this.VISIBILITYEVENT, callback.$$VisibilityCallback);
  }
}


function getPropNames() : {HIDDENPROP: string, VISIBILITYEVENT: string} {
  if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    return {HIDDENPROP: 'hidden', VISIBILITYEVENT: 'visibilitychange'};
  } else if (typeof document['msHidden'] !== "undefined") {
    return {HIDDENPROP: 'msHidden', VISIBILITYEVENT: 'msvisibilitychange'};
  } else if (typeof document['webkitHidden'] !== "undefined") {
    return {HIDDENPROP: 'webkitHidden', VISIBILITYEVENT: 'webkitvisibilitychange'};
  } else {
    return {HIDDENPROP: 'hidden', VISIBILITYEVENT: 'visibilitychange'};
  }
}
