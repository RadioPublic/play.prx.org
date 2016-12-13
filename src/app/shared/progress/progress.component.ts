import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter,
  HostListener, Input, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'play-progress',
  styleUrls: ['progress.component.css'],
  template: `
    <div class="bar" [class.disabled]="isDisabled" [style.width.%]="progress * 100.0"></div>
    <div class="highlight" *ngIf="isHover && !isScrubbing && !isDisabled"
      [style.width.%]="provisionalProgress * 100.0"></div>
    <div class="scrub-detector" *ngIf="isScrubbing"></div>
  `
})

export class ProgressComponent {

  @Input() value: number = 0;
  @Input() minimum: number = 0;
  @Input() maximum: number = 1;
  @Input() disabled = false;

  @Output() seek = new EventEmitter<number>();
  @Output() scrubbing = new EventEmitter<boolean>();

  provisionalValue: number;
  previousMousemoveEvent: MouseEvent;

  isScrubbing = false;
  isHover = false;
  didMove = false;
  isMousedown = false;

  constructor(private el: ElementRef) {}

  get isDisabled() {
    return this.disabled;
  }

  get range() {
    return this.maximum - this.minimum;
  }

  get progress() {
    return this.value / this.range;
  }

  get provisionalProgress() {
    return this.provisionalValue / this.range;
  }

  @HostListener('mouseover', ['$event'])
  onMouseover(event: MouseEvent) {
    if (event.target === this.el.nativeElement) {
      this.isHover = true;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.didMove = false;
    this.isMousedown = true;

    if (event.target === this.el.nativeElement) {
      const width = this.el.nativeElement.getBoundingClientRect().width;
      const ratio = event.offsetX / width;
      this.provisionalValue = this.range * ratio;
      this.sendSeek();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (!this.didMove && this.isMousedown) {
      this.didMove = true;
      this.isScrubbing = true;
      this.scrubbing.emit(true);
    }

    if (event.target === this.el.nativeElement) {
      this.onBasicMousemove(event);
    } else if (event.target === this.el.nativeElement.querySelector('scrub-detector')) {
      this.onFancyMousemove(event);
    }

    if (this.isScrubbing) {
      this.sendSeek();
    }

    this.previousMousemoveEvent = event;
  }

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.isMousedown = false;

    if (this.didMove) {
      this.isScrubbing = false;
      this.sendSeek();
      this.scrubbing.emit(false);
    }
  }

  @HostListener('mouseout', ['$event'])
  onMouseout(event: MouseEvent) {
    if (event.target === this.el.nativeElement) {
      this.isHover = false;
    }
  }

  private onBasicMousemove(event: MouseEvent) {
    const width = this.el.nativeElement.getBoundingClientRect().width;
    const ratio = event.offsetX / width;
    this.provisionalValue = this.range * ratio;
  }

  private onVariableSpeedMousemove(event: MouseEvent) {
    let barRect = this.el.nativeElement.getBoundingClientRect();

    const secondsPerPixel = this.range / barRect.width;

    const max = 50;
    let factor: number;

    if (event.offsetY > barRect.bottom) {
      let amt = Math.min(max, event.offsetY - barRect.bottom);
      factor = amt / max;
    } else if (event.offsetY < barRect.top) {
      let amt = Math.min(max, barRect.top - event.offsetY);
      factor = amt / max;
    } else {
      factor = 0;
    }

    let rate = 1.0 - (0.95 * factor);

    let mouseDeltaX = 0;

    if (this.previousMousemoveEvent) {
      mouseDeltaX = event.offsetX - this.previousMousemoveEvent.offsetX;
    }

    let adjMouseDeltaX = mouseDeltaX * rate;
    let deltaValue = adjMouseDeltaX * secondsPerPixel;
    this.provisionalValue = this.value + deltaValue;
  }

  private onFancyMousemove(event: MouseEvent) {
    let barRect = this.el.nativeElement.getBoundingClientRect();

    let inBarX = event.offsetX >= barRect.left && event.offsetX <= barRect.right;
    let inBarY = event.offsetY >= barRect.top && event.offsetY <= barRect.bottom;
    let inBar = inBarX && inBarY;

    if (inBar) {
      const xOffsetInBar = event.offsetX - barRect.left;
      const ratio = xOffsetInBar / barRect.width;
      this.provisionalValue = this.range * ratio;
    } else {
      this.onVariableSpeedMousemove(event);
    }
  }

  private sendSeek() {
    this.seek.emit(this.provisionalValue);
  }

}
