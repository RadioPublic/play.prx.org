import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppLinks } from '../adapters/applinks';

@Component({
  selector: 'app-links',
  styleUrls: ['app-links.component.css'],
  template: `
    <app-icon *ngFor="let link of sortedAppLinks" [appName]="link.appName" ></app-icon>
  `
})
export class AppLinksComponent implements OnChanges {
  @Input() appLinks: AppLinks;
  sortedAppLinks: AppLink[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appLinks) {
      this.sortedAppLinks = getSortedAppLinks(changes.appLinks.currentValue);
    }
  }

}


export interface AppLink {
  appName: keyof AppLinks;
  url: string;
}

const APP_PRIORITY_ORDER: (keyof AppLinks)[] = [
  'apple',
  'spotify',
  'radiopublic',
  'stitcher',
  'overcast',
  'pocketcasts',
  'google',
  'iheartradio',
  'googleplay',
  'playerfm',
  'tunein',
  'soundcloud',
  'castbox',
  'breaker',
  'castro',
  'podbean',
  'anchor'
];

function getSortedAppLinks(appLinks?: AppLinks): AppLink[] {
  const result = [];
  if (appLinks) {
    for (const appName of APP_PRIORITY_ORDER) {
      if (appLinks[appName]) {
        result.push({ appName, url: appLinks[appName] });
      }
    }
  }
  return result;
}
