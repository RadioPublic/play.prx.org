import {Component} from 'angular2/core';
import {
  NgForm,
  FormBuilder,
  FORM_DIRECTIVES,
  Control,
  ControlGroup
} from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';

import {EpisodePickerComponent, Episode} from './shared/index';
import {EmbedProperties} from '../+embed/shared/index';

@Component({
  directives: [NgForm, EpisodePickerComponent, FORM_DIRECTIVES],
  selector: 'player',
  styleUrls: ['app/+builder/builder.component.css'],
  templateUrl: 'app/+builder/builder.component.html'
})
export class BuilderComponent {
  private feedUrl: string;
  private embedProps: EmbedProperties;
  private previewIframeSrc: string;
  private specsForm: ControlGroup;

  constructor(
    private router: Router,
    private routeParams: RouteParams,
    private formBuilder: FormBuilder
  ) {
    this.specsForm = new ControlGroup({
      title: new Control(''),
      subtitle: new Control(''),
      subscribeUrl: new Control(''),
      subscribeTarget: new Control(''),
      ctaUrl: new Control(''),
      ctaTitle: new Control(''),
      imageUrl: new Control(''),
      audioUrl: new Control('')
    });

    this.specsForm.valueChanges
    .debounceTime(3500)
    .subscribe(d => this.previewIframeSrc = this._previewIframeSrc);

    if (this.routeParams.get('feedUrl')) {
      this.feedUrl = decodeURIComponent(this.routeParams.get('feedUrl'));
    }
  }

  get _previewIframeSrc() {
    return `/e?${this.embedProps.paramString}`;
  }

  onFeedUrlSubmit(url: string): void {
    let encodedUrl = encodeURIComponent(url);
    this.router.navigate(['Builder', { feedUrl: encodedUrl }]);
  }

  resetCopyButton(el: Element) {
    el.innerHTML = 'Copy';
  }

  // Copies the HTML code in an input associated with the element (<button>)
  // that is passed in
  copyCode(inp: Element, button: Element) {
    if (inp && inp.select) {
      inp.select();

      try {
        document.execCommand('copy');
        inp.blur();
        el.innerHTML = 'Copied';
      } catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
      }
    }
  }

  private onEpisodeSelect(episode: Episode) {
    this.embedProps = new EmbedProperties(
      episode.title,
      episode.artist,
      '',
      episode.url,
      episode.imageUrl,
      this.feedUrl,
      '',
      '',
      '_blank'
    );
  }
};
