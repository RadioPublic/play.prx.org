import { EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM, EMBED_CTA_TITLE_PARAM,
  EMBED_AUDIO_URL_PARAM, EMBED_IMAGE_URL_PARAM, EMBED_FEED_URL_PARAM,
  EMBED_CTA_URL_PARAM, EMBED_SUBSCRIBE_URL_PARAM, EMBED_SUBSCRIBE_TARGET } from '../embed';

export class BuilderProperties {

  static decode(params: any): BuilderProperties {
    return new BuilderProperties(
      params[EMBED_TITLE_PARAM],
      params[EMBED_SUBTITLE_PARAM],
      params[EMBED_CTA_TITLE_PARAM],
      params[EMBED_AUDIO_URL_PARAM],
      params[EMBED_IMAGE_URL_PARAM],
      params[EMBED_FEED_URL_PARAM],
      params[EMBED_CTA_URL_PARAM],
      params[EMBED_SUBSCRIBE_URL_PARAM],
      params[EMBED_SUBSCRIBE_TARGET]
    );
  }

  static hasParams(params: any): boolean {
    return params[EMBED_TITLE_PARAM] !== undefined;
  }

  constructor(
    public title?: string,
    public subtitle?: string,
    public ctaTitle?: string,
    public audioUrl?: string,
    public imageUrl?: string,
    public feedUrl?: string,
    public ctaUrl?: string,
    public subscribeUrl?: string,
    public subscribeTarget?: string
  ) {}

  get paramString() {
    let str: string[] = [];

    str.push(`${EMBED_TITLE_PARAM}=${this.encode(this.title)}`);
    str.push(`${EMBED_SUBTITLE_PARAM}=${this.encode(this.subtitle)}`);
    str.push(`${EMBED_CTA_TITLE_PARAM}=${this.encode(this.ctaTitle)}`);
    str.push(`${EMBED_AUDIO_URL_PARAM}=${this.encode(this.audioUrl)}`);
    str.push(`${EMBED_IMAGE_URL_PARAM}=${this.encode(this.imageUrl)}`);
    str.push(`${EMBED_FEED_URL_PARAM}=${this.encode(this.feedUrl)}`);
    str.push(`${EMBED_CTA_URL_PARAM}=${this.encode(this.ctaUrl)}`);
    str.push(`${EMBED_SUBSCRIBE_URL_PARAM}=${this.encode(this.subscribeUrl)}`);
    str.push(`${EMBED_SUBSCRIBE_TARGET}=${this.encode(this.subscribeTarget)}`);

    return str.join('&');
  }

  get embeddableUrl() {
    return `${window.location.origin}/e?${this.paramString}`;
  }

  iframeHtml(width: string, height: string) {
    const url = this.embeddableUrl;
    return `<iframe frameborder="0" height="${height}" width="${width}" src="${url}"></iframe>`;
  }

  get squareIframeHtml() {
    return this.iframeHtml('500', '500');
  }

  get horizontalIframeHtml() {
    return this.iframeHtml('100%', '200');
  }

  private encode(str: string) {
    return encodeURIComponent(str)
      .replace(/[!'()*]/g, (c) => (`%${c.charCodeAt(0).toString(16)}`));
  }

}
