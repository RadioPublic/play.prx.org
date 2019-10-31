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

    <a [href]="customizeHref" id="customize-btn" target="_blank">Customize this player</a>
  `
})

export class ShareModalComponent {

  @Output() close = new EventEmitter<boolean>();

  get horizontalCode() {
    const href = window.location.href;
    const iframe = `<iframe frameborder="0" height="200" scrolling="no" src="${href}" width="100%"></iframe>`;
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
    const sel = el.dataset.copytarget;
    const inp = document.querySelector(sel);

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
