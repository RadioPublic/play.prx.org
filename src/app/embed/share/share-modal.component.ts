import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'play-share-modal',
  styleUrls: ['share-modal.component.css'],
  template: `
    <button class="close-btn" (click)="closeModal()">✖</button>
    <h1>Use this player on your site</h1>
    <p>You can embed this player on your own site by including the following <code>iframe</code> tag.</p>

    <div class="embed-code">
    <strong>Horizontal</strong>
    <input type="text" [value]="horizontalCode" id="share-embed-small" readonly>
    <button (mouseover)="reset(small)" (click)="copy(small)" data-copytarget="#share-embed-small" #small>Copy</button>
    </div>

    <div class="embed-code">
    <strong>Square</strong>
    <input type="text" [value]="squareCode" id="share-embed-square" readonly>
    <button (mouseover)="reset(square)" (click)="copy(square)" data-copytarget="#share-embed-square" #square>Copy</button>
    </div>

    <a [href]="customizeHref" id="customize-btn" target="_blank">Customize this player</a>
  `
})

export class ShareModalComponent {

  @Output() close = new EventEmitter<boolean>();

  get horizontalCode() {
    let href = window.location.href;
    let iframe = `<iframe frameborder="0" height="200" scrolling="no" src="${href}" width="100%"></iframe>`;
    return iframe;
  }

  get squareCode() {
    let href = window.location.href;
    let iframe = `<iframe frameborder="0" height="500" scrolling="no" src="${href}" width="500"></iframe>`;
    return iframe;
  }

  get customizeHref() {
    return `/${window.location.search}`;
  }

  closeModal() {
    this.close.emit(true);
  }

  reset(el: any) {
    el.innerHTML = 'Copy';
  }

  copy(el: any) {
    let sel = el.dataset.copytarget;
    let inp = document.querySelector(sel);

    if (inp && inp['select']) {
      inp['select']();
      try {
        document.execCommand('copy');
        inp.blur();
        el.innerHTML = 'Copied';
      } catch (err) {
        /// alert('please press Ctrl/Cmd+C to copy');
      }
    }
  }
}
