import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'play-demo',
  styleUrls: ['demo.component.css'],
  template: `
    <div id="color" [style.background-color]="backgroundColor">

      <div id="toolbar">
        <label for="bg-color">Background color:</label>
        <input type="text" id="bg-color" (change)="setColor(colorInput.value)" #colorInput>
      </div>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Natus, ratione ad labore nobis ipsam nihil atque. Harum necessitatibus a,
        commodi impedit corrupti asperiores. Recusandae error soluta ut. Eius modi, non.</p>

      <div style="margin: 20px auto; width: 650px; height: 200px; z-index: 20; position: relative;">
        <iframe [src]="demoSrc" frameborder="0" width="650" height="200"></iframe>
      </div>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus, r
        atione ad labore nobis ipsam nihil atque. Harum necessitatibus a, commodi
        impedit corrupti asperiores. Recusandae error soluta ut. Eius modi, non.</p>

      <div style="margin: 20px auto; width: 500px; height: 500px; z-index: 20; position: relative;">
        <iframe [src]="demoSrc" frameborder="0" width="500" height="500"></iframe>
      </div>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.</p>

    </div>
  `
})

export class DemoComponent {

  backgroundColor = 'white';

  demoSrc: SafeResourceUrl;

  demoParams = {
    tt: '214- Loud and Clear',
    ts: '99% Invisible',
    tc: '',
    ua: 'http://www.podtrac.com/pts/redirect.mp3/media.blubrry.com/99percentinvisible' +
        '/dovetail.prxu.org/99pi/874c3465-0dfc-456e-bf4b-14dcfc29b665/214-Loud-and-Clear.mp3',
    ui: 'http://cdn.99percentinvisible.org/wp-content/uploads/powerpress/99invisible-logo-1400.jpg',
    uf: 'https://prx-feed.s3.amazonaws.com/99pi/feed-rss.xml',
    uc: '',
    us: 'https://itunes.apple.com/us/podcast/99-invisible/id394775318',
    gs: '_blank'
  };

  constructor(sanitizer: DomSanitizer) {
    let src = '/e?' + this.toQueryString(this.demoParams);
    this.demoSrc = sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  setColor(color: string) {
    this.backgroundColor = color;
  }

  private toQueryString(obj: {}) {
    return Object.keys(obj).reduce((a, k) => {
      a.push(k + '=' + encodeURIComponent(obj[k]));
      return a;
    }, []).join('&');
  }

}
