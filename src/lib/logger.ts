import {DovetailAudio} from './dovetail_audio';

// UA-164824-54

const HIT_TYPE_EVENT = 'event';
const EVENT_CATEGORY_AUDIO = 'Audio';
const EVENT_ACTION_PLAYBACK = 'playback';
const METRIC_PLAYBACK = 'metric1';
const BOUNDARY_SPACING = 10;

export class Logger {
  public _ignoreTimeupdates: boolean;
  private previousBoundary: number;

  private listeningBlocks: number[][] = [[]];

  get ignoreTimeupdates() {
    return this._ignoreTimeupdates;
  }

  set ignoreTimeupdates(ignore: boolean) {
    if (this._ignoreTimeupdates !== ignore) {
      this._ignoreTimeupdates = ignore;

      if (ignore) {
        const lastBlock = this.listeningBlocks[this.listeningBlocks.length - 1];

        if (lastBlock.length === 2) {
          this.listeningBlocks.push([]);
        }
      }
    }
  }

  constructor(private player: DovetailAudio, private label: string) {
    player.addEventListener('adstart', () => console.log('>> adstart'));
    player.addEventListener('adend', () => console.log('>> adend'));

    player.addEventListener('play', () => console.log('>> play'));
    player.addEventListener('playing', () => console.log('>> playing'));
    player.addEventListener('pause', () => console.log('>> pause'));

    player.addEventListener('timeupdate', () => this.onTimeupdate());

    // player.addEventListener('seeked', () => console.log('>> seeked'));
    // player.addEventListener('seeking', () => console.log('>> seeking'));
  }

  onTimeupdate() {
    const lastBlock = this.listeningBlocks[this.listeningBlocks.length - 1];

    if (!this.ignoreTimeupdates && !this.player.paused) {
      if (!lastBlock.length) {
        lastBlock[0] = this.player.currentTime;
      } else if (lastBlock[0] !== this.player.currentTime) {
        lastBlock[1] = this.player.currentTime;
      }
    }
  }

  xtimeupdate() {
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
