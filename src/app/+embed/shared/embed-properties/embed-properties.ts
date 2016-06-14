import * as constants from '../embed-constants/embed-constants';

export class EmbedProperties {
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

    str.push(`${constants.EMBED_TITLE_PARAM}=${encodeURIComponent(this.title)}`);
    str.push(`${constants.EMBED_SUBTITLE_PARAM}=${encodeURIComponent(this.subtitle)}`);
    str.push(`${constants.EMBED_CTA_TITLE_PARAM}=${encodeURIComponent(this.ctaTitle)}`);
    str.push(`${constants.EMBED_AUDIO_URL_PARAM}=${encodeURIComponent(this.audioUrl)}`);
    str.push(`${constants.EMBED_IMAGE_URL_PARAM}=${encodeURIComponent(this.imageUrl)}`);
    str.push(`${constants.EMBED_FEED_URL_PARAM}=${encodeURIComponent(this.feedUrl)}`);
    str.push(`${constants.EMBED_CTA_URL_PARAM}=${encodeURIComponent(this.ctaUrl)}`);
    str.push(`${constants.EMBED_SUBSCRIBE_URL_PARAM}=${encodeURIComponent(this.subscribeUrl)}`);
    str.push(`${constants.EMBED_SUBSCRIBE_TARGET}=${encodeURIComponent(this.subscribeTarget)}`);

    return str.join('&');
  }

  get embeddableUrl() {
    return `https://play.prx.org/e?${this.paramString}`;
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
}
