import {Component, Input, OnChanges, SimpleChange, OnInit} from 'angular2/core';
import {AsyncPipe} from 'angular2/common';
import {DovetailPlayer} from '../../lib/dovetail-player';
import {Observable, Observer} from 'rxjs/Rx';
import ProgressBarComponent from './progress_bar.component';

const AUDIO_URL = 'audioUrl';

@Component({
  directives: [ProgressBarComponent],
  pipes: [AsyncPipe],
  selector: 'player',
  styleUrls: ['src/app/player/player.component.css'],
  template: `
    <button *ngIf="paused" (click)="play()">Play {{audioUrl}}</button>
    <button *ngIf="!paused" (click)="pause()">Pause {{audioUrl}}</button>
    <progress-bar (seek)="onSeek($event)" (hold)="onHold($event)"
      [value]="currentTime | async" [maximum]="duration | async"></progress-bar>
  `
})
export class PlayerComponent implements OnChanges, OnInit {
  private player: DovetailPlayer;

  @Input() private audioUrl: string;
  private currentTime: Observable<number>;
  private duration: Observable<number>;

  private isHeld: boolean;

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
      observer.next(0);
      this.player.ondurationchange = (event) => observer.next(this.player.duration);
      return (): void => this.player.ondurationchange = undefined;
    });
    this.currentTime = Observable.create((observer: Observer<number>) => {
      observer.next(0);
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

  onSeek(position: number) {
    this.player.currentTime = position;
  }

  onJump(seconds: number) {
    this.player.currentTime = (this.player.currentTime + seconds);
  }

  onHold(hold: boolean) {
    if (hold && !this.paused) {
      this.pause();
      this.isHeld = true;
    } else if (!hold && this.isHeld) {
      this.play();
      this.isHeld = false;
    }
  }
}
