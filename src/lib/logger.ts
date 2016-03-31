import {DovetailAudio} from './dovetail_audio';

// UA-164824-54

const HIT_TYPE_EVENT = 'event';
const EVENT_CATEGORY_AUDIO = 'Audio';
const EVENT_ACTION_PLAYBACK = 'playback';
const METRIC_PLAYBACK = 'metric1';
const BOUNDARY_SPACING = 10;

export class Logger {
  private previousBoundary: number;

  constructor(private player: DovetailAudio, private label: string) {
    player.addEventListener('adstart', () => console.log('>> adstart'));
    player.addEventListener('adend', () => console.log('>> adend'));

    player.addEventListener('play', () => console.log('>> play'));
    player.addEventListener('playing', () => console.log('>> playing'));
    player.addEventListener('pause', () => console.log('>> pause'));

    player.addEventListener('timeupdate', () => this.timeupdate());

    // player.addEventListener('seeked', () => console.log('>> seeked'));
    // player.addEventListener('seeking', () => console.log('>> seeking'));
  }

  timeupdate() {
    // Only send heartbeats during playback
    if (this.player.paused) { return; }

    const roundedCurrentTime = Math.round(this.player.currentTime);
    const isNearBoundary = ((roundedCurrentTime % BOUNDARY_SPACING) == 0)

    // console.log(this.player.currentTime);

    if (isNearBoundary && this.previousBoundary != roundedCurrentTime) {
      this.previousBoundary = roundedCurrentTime;

      const fields = {
        [METRIC_PLAYBACK]: BOUNDARY_SPACING,
        eventAction: EVENT_ACTION_PLAYBACK,
        eventCategory: EVENT_CATEGORY_AUDIO,
        eventLabel: this.label,
        hitType: HIT_TYPE_EVENT,
      }
      // window.ga('send', fields);
    }
  }
}
