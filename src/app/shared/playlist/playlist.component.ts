import { Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'play-playlist',
  styleUrls: ['playlist.component.css'],
  templateUrl: 'playlist.component.html'
})

export class PlaylistComponent {
  @Input() episodes: Array<any>;
  @Input() subtitle: string;
  @Input() episodeIndex: number;
  @Input() playing: boolean;
  @Input() channelArt: string;
  @Output() playlistItemClicked = new EventEmitter<number>();

  get totalDuration(): number {
    return this.episodes.reduce((accum, ep) => accum + +ep.duration, 0);
  }

  estDuration(seconds: number): string {
    const secPerUnit = { d: 86400, h: 3600, m: 60 };
    let timeEst = '';
    Object.keys(secPerUnit).forEach(unit => {
      if (seconds / secPerUnit[unit] > 1) {
        timeEst += `${Math.floor(seconds / secPerUnit[unit])}${unit} `;
        seconds %= secPerUnit[unit];
      }
    });
    return timeEst.trim();
  }
}
