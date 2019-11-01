import { Component, Input } from '@angular/core';
import { AppLink } from './app-links.component';

@Component({
  selector: 'app-icon',
  styles: [`
    :host {
      border-radius: 8px;
      overflow: hidden;
      display: inline-block;
      width: 48px;
      height: 48px;
      margin-right: 15px;
      position: relative;
      box-shadow: 0 0 5px -3px rgba(0, 0, 0, 0.3);
    }

    :host::after {
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      border-radius: 8px;
      display: block;
      content: '';
      box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3);
    }

    img {
      width: 100%;
    }
  `],
  template: `
    <img [src]="imageUrl" />
  `
})
export class AppIconComponent  {
  @Input() appName: string;

  get imageUrl() {
    return `/assets/images/app-icons/${this.appName}.png`;
  }
}
