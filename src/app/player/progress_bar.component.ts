import {
  Component, Input, Output, OnChanges, EventEmitter, SimpleChange, ElementRef,
  HostListener
} from 'angular2/core';

const POSITION = 'position';
const MAXIMUM  = 'maximum';

@Component({
  selector: 'progress-bar',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--progress-track-background, #333);
    }

    bar {
      background: var(--bar-background, #999);
      display: block;
      height: 100%;
      pointer-events: none;
    }
  `],
  template: `
    <bar [style.width.%]="currentPosition / currentMaximum * 100.0"></bar>
  `
})
export default class ProgressBarComponent implements OnChanges {
  @Input() position: number;
  @Input() maximum: number;
  @Output() seek = new EventEmitter<number>();

  private currentPosition: number;
  private currentMaximum: number;

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    for (let property in changes) {
      if (changes.hasOwnProperty(property)) {
        if (property == POSITION) {
          this.currentPosition = changes[POSITION].currentValue || 0;
        } else if (property == MAXIMUM) {
          this.currentMaximum = changes[MAXIMUM].currentValue || 100;
        }
      }
    }
  }

  @HostListener('click', ['$event'])
  sendSeek(event: MouseEvent) {
    const el = <HTMLElement> event.target;
    let percentage = (event.offsetX / el.clientWidth);
    this.seek.emit(percentage * this.currentMaximum);
  }
}
