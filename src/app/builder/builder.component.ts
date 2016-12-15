import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Episode } from './episode';
import { BuilderProperties } from './builder.properties';

@Component({
  selector: 'play-builder',
  styleUrls: ['builder.component.css'],
  templateUrl: 'builder.component.html'
})

export class BuilderComponent implements OnInit {

  feedUrl: string;
  props: BuilderProperties;
  previewIframeSrc: SafeResourceUrl;
  editMode = false;

  @ViewChild('builderForm') builderForm;

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.queryParams.forEach((params: any) => {
      if (params.feedUrl) {
        this.editMode = false;
        this.feedUrl = params.feedUrl;
        this.props = null;
      } else if (BuilderProperties.hasParams(params)) {
        this.editMode = true;
        this.feedUrl = null;
        this.props = BuilderProperties.decode(params);
      } else {
        this.editMode = false;
        this.feedUrl = null;
        this.props = null;
      }
    });
    this.builderForm.control.valueChanges.debounceTime(3500).forEach(() => {
      this.previewIframeSrc = this._previewIframeSrc;
    });
  }

  get _previewIframeSrc() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`/e?${this.props.paramString}`);
  }

  onFeedUrlSubmit(value: string) {
    if (value) {
      this.router.navigate(['/'], { queryParams: { feedUrl: value } });
    }
  }

  onEpisodeSelect(episode: Episode) {
    this.props = new BuilderProperties(
      episode.title,
      episode.artist,
      '',
      episode.url,
      episode.imageUrl,
      this.feedUrl,
      '',
      this.feedUrl,
      '_blank'
    );
  }

  resetCopyButton(el: Element) {
    el.innerHTML = 'Copy';
  }

  // Copies the HTML code in an input associated with the element (<button>)
  // that is passed in
  copyCode(inp: HTMLInputElement, button: Element) {
    if (inp && inp.select) {
      inp.select();
      try {
        document.execCommand('copy');
        inp.blur();
        button.innerHTML = 'Copied';
      } catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
      }
    }
  }

}
