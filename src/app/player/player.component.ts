import {Component, Input, OnChanges, SimpleChange, OnInit} from 'angular2/core';
import {DovetailPlayer} from '../../lib/dovetail-player';
import {Observable, Observer} from 'rxjs/Rx';

const AUDIO_URL = 'audioUrl';

@Component({
  selector: 'player',
  styleUrls: ['src/app/player/player.component.css'],
  template: `
    <button *ngIf="paused" (click)="play()">Play {{audioUrl}}</button>
    <button *ngIf="!paused" (click)="pause()">Pause {{audioUrl}}</button>
    <span>{{currentTime | async}}</span>
    <span>{{duration | async}}</span>
  `
})
export class PlayerComponent implements OnChanges, OnInit {
  private player: DovetailPlayer;

  @Input() private audioUrl: string;
  private currentTime: Observable<number>;
  private duration: Observable<number>;

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  get paused() {
    return this.player.paused;
  }

  ngOnInit() {
    this.player = new DovetailPlayer(this.audioUrl);
    this.duration = Observable.create((observer: Observer<number>) => {
      this.player.ondurationchange = (event) => observer.next(this.player.duration);
      return (): void => this.player.ondurationchange = undefined;
    });
    this.currentTime = Observable.create((observer: Observer<number>) => {
      this.player.ontimeupdate = (event) => observer.next(this.player.currentTime);
      return (): void => this.player.ontimeupdate = undefined;
    });
  }

  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (changes[AUDIO_URL]) {
      // TODO: fix this stupid thing.
      console.error('if this were real, it would handle this.');
    }
  }
}
