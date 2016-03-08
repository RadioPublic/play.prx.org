import {
  Component, Input, Output, OnChanges, EventEmitter, SimpleChange, ElementRef
} from 'angular2/core';

const POSITION = 'position';
const MAXIMUM  = 'maximum';

@Component({
  selector: 'progress-bar',
  template: `
    <div (click)="sendSeek($event)">
      <div></div>
    </div>
  `
})
export default class ProgressBarComponent implements OnChanges {
  @Input() position: number;
  @Input() maximum: number;
  @Output() seek = new EventEmitter<number>();

  private currentPosition: number;
  private currentMaximum: number;

  constructor(private element: ElementRef) { }

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

  sendSeek(event: MouseEvent) {
    let percentage = (event.clientX / this.element.nativeElement.clientWidth);
    this.seek.emit(percentage * this.currentMaximum);
  }
}
