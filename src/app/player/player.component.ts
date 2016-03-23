import {Component, Input, OnChanges, SimpleChange, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {AsyncPipe} from 'angular2/common';
import {DovetailAudio} from '../../lib/dovetail_audio';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import ProgressBarComponent from './progress_bar.component';
import TimeIndicatorComponent from './time_indicator.component';

const AUDIO_URL = 'audioUrl';

@Component({
  directives: [ProgressBarComponent, TimeIndicatorComponent],
  pipes: [AsyncPipe],
  selector: 'player',
  styleUrls: ['src/app/player/player.component.css'],
  templateUrl: 'src/app/player/player.component.html'
})
export class PlayerComponent implements OnChanges, OnInit {
  private player: DovetailAudio;
  private adPlaying = false;

  @Input() private audioUrl: string;
  private currentTime: Observable<number>;
  private duration: Observable<number>;

  private isHeld: boolean;

  constructor(private routeParams: RouteParams) {}

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
<<<<<<< 13c677762913f893e8f42c785507ad93bf3d3052
    this.player = new DovetailAudio(this.audioUrl);
    this.player.addEventListener('adstart', () => this.adPlaying = true);
    this.player.addEventListener('adend', () => this.adPlaying = false);
=======
    this.player = new DovetailPlayer(this.audioUrl);

>>>>>>> Start building out embed player view
    this.duration = Observable.create((observer: Observer<number>) => {
      observer.next(0);
      this.player.ondurationchange = () => observer.next(this.player.duration);
      return (): void => this.player.ondurationchange = undefined;
    }).share();

    this.currentTime = Observable.create((observer: Observer<number>) => {
      observer.next(0);
      this.player.ontimeupdate = () => observer.next(this.player.currentTime);
      return (): void => this.player.ontimeupdate = undefined;
    }).share();
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
