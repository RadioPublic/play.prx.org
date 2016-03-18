import {
  Component, Input, Output, EventEmitter, ElementRef,
  HostListener, ChangeDetectionStrategy
} from 'angular2/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'progress-bar',
  styleUrls: ['src/app/player/progress_bar.component.css'],
  template: `
    <bar [style.width.%]="progressPercentage"></bar>
    <highlight *ngIf="isHover && !isScrubbing" [style.width.%]="highlightPercentage"></highlight>
    <scrub-detector [style.display]="isScrubbing ? 'block' : 'none'"></scrub-detector>
  `
})
export default class ProgressBarComponent {
  @Input() value: number;
  @Input() maximum: number;
  @Output() seek = new EventEmitter<number>();
  @Output() hold = new EventEmitter<boolean>();

  private pointerRatio: number;

  private isScrubbing = false;
  private isHover = false;

  constructor(private el: ElementRef) {}

  private get progressRatio() {
    if (!this.maximum) {
      return 0.0;
    }

    return this.value / this.maximum;
  }

  private get progressPercentage() {
    return this.progressRatio * 100.0;
  }

  private get highlightPercentage() {
    return this.pointerRatio * 100.0;
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(event: MouseEvent) {
    if (event.target === this.el.nativeElement) {
      this.isHover = true;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.isScrubbing = true;
    this.hold.emit(true);

    if (event.target === this.el.nativeElement) {
      const width = this.el.nativeElement.getBoundingClientRect().width;
      this.pointerRatio = event.offsetX / width;
      this.sendSeek(this.pointerRatio);
    }
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (event.target === this.el.nativeElement) {
      const width = this.el.nativeElement.getBoundingClientRect().width;
      this.pointerRatio = event.offsetX / width;
    } else if (event.target === this.el.nativeElement.querySelector('scrub-detector')) {
      let barRect = this.el.nativeElement.getBoundingClientRect();

      let inBarX = event.offsetX >= barRect.left && event.offsetX <= barRect.right;
      let inBarY = event.offsetY >= barRect.top && event.offsetY <= barRect.bottom;
      let inBar = inBarX && inBarY;

      if (inBar) {
        let xOffsetInBar = event.offsetX - barRect.left;
        this.pointerRatio = xOffsetInBar / barRect.width;
      } else {
        // TODO Add variable-speed scrubbing
        let garbageX = Math.min(Math.max(event.offsetX - barRect.left, 0), barRect.width);
        this.pointerRatio = garbageX / barRect.width;
      }
    }

    if (this.isScrubbing) {
      this.sendSeek(this.pointerRatio);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.isScrubbing = false;

    // During a click (ie, no mousemove) this seek ends up being
    ///a dupe of the seek from mousedown
    this.sendSeek(this.pointerRatio);

    this.hold.emit(false);
  }

  @HostListener('mouseout', ['$event'])
  onMouseout(event: MouseEvent) {
    if (event.target === this.el.nativeElement) {
      this.isHover = false;
    }
  }

  // Takes a ratio and emits the position
  private sendSeek(ratio: number) {
    this.seek.emit(ratio * this.maximum);
  }
}
