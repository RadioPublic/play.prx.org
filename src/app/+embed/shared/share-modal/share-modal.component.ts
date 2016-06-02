import {Component, EventEmitter, Output} from 'angular2/core';

@Component({
  selector: 'share-modal',
  styleUrls: ['app/+embed/shared/share-modal/share-modal.component.css'],
  templateUrl: 'app/+embed/shared/share-modal/share-modal.component.html'
})
export class ShareModalComponent {
  @Output() toggleShareModal = new EventEmitter<boolean>();

  get horizontalCode() {
    const href = window.location.href;
    const iframe = `<iframe frameborder="0" height="200" scrolling="no" src="${href}" width="100%"></iframe>`;

    return iframe;
  }

  get squareCode() {
    const href = window.location.href;
    const iframe = `<iframe frameborder="0" height="500" scrolling="no" src="${href}" width="500"></iframe>`;

    return iframe;
  }

  close() {
    this.toggleShareModal.emit(false);
  }

  reset(el: any) {
    el.innerHTML = 'Copy';
  }

  copy(el: any) {
    const sel = el.dataset.copytarget;
    const inp = document.querySelector(sel);

    if (inp && inp.select) {
      inp.select();

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
