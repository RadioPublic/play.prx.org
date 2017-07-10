export class DovetailAudioEvent {
  static build(eventName: string, audio: any, extras?: {}) {
    let event: Event = createEvent(eventName);
    Object.defineProperty(event, 'target', {
      value: audio,
      writable: false
    });
    Object.defineProperty(event, 'currentTarget', {
      value: audio,
      writable: false
    });
    if (extras) {
      for (let property in extras) {
        if (extras.hasOwnProperty(property)) {
          try {
            event[property] = extras[property];
          } catch (e) {/* Noop */}
        }
      }
    }
    return event;
  }
}

function createEvent(name): Event {
  try {
    return new Event(name);
  } catch (e) {
    let event: any = document.createEvent('CustomEvent');
    event.initCustomEvent(name, false, false, undefined);
    return <Event>event;
  }
}
