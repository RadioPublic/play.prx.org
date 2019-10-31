import { testService, injectHttp } from '../../../testing';
import { QSDAdapter } from './qsd.adapter';
import { EMBED_AUDIO_URL_PARAM, EMBED_TITLE_PARAM, EMBED_SUBTITLE_PARAM, EMBED_SUBSCRIBE_URL_PARAM,
  EMBED_SUBSCRIBE_TARGET, EMBED_IMAGE_URL_PARAM, EMBED_EP_IMAGE_URL_PARAM } from './../embed.constants';

describe('QSDAdapter', () => {

  testService(QSDAdapter);

  const mapParams = {
    audioUrl:        EMBED_AUDIO_URL_PARAM,
    title:           EMBED_TITLE_PARAM,
    subtitle:        EMBED_SUBTITLE_PARAM,
    subscribeUrl:    EMBED_SUBSCRIBE_URL_PARAM,
    subscribeTarget: EMBED_SUBSCRIBE_TARGET,
    feedArtworkUrl:  EMBED_IMAGE_URL_PARAM,
    artworkUrl:      EMBED_EP_IMAGE_URL_PARAM
  };

  // helper to sync-get properties
  const getProperties = (qsd, params = {}): any => {
    const props = {};
    Object.keys(params).filter(k => mapParams[k]).forEach(k => {
      params[mapParams[k]] = params[k];
      delete params[k];
    });
    qsd.getProperties(params).subscribe(result => {
      Object.keys(result).forEach(k => props[k] = result[k]);
    });
    return props;
  };

  it('only runs when a known param is set', injectHttp((qsd: QSDAdapter) => {
    expect(getProperties(qsd, {})).toEqual({});
    expect(getProperties(qsd, {foo: 'bar'})).toEqual({});
    expect(getProperties(qsd, {title: undefined})).toEqual({});
    expect(getProperties(qsd, {title: ''})).not.toEqual({});
  }));

  it('decodes params', injectHttp((qsd: QSDAdapter) => {
    const props = getProperties(qsd, {
      audioUrl:        'audio-url',
      title:           'the title',
      subtitle:        'the subtitle',
      subscribeUrl:    'subscribe-url',
      subscribeTarget: 'subscribe-target',
      artworkUrl:      'artwork-url',
      feedArtworkUrl:  'feed-artwork-url',
      foobar:          'the foobar'
    });
    expect(props.audioUrl).toEqual('audio-url');
    expect(props.title).toEqual('the title');
    expect(props.subtitle).toEqual('the subtitle');
    expect(props.subscribeUrl).toEqual('subscribe-url');
    expect(props.subscribeTarget).toEqual('subscribe-target');
    expect(props.artworkUrl).toEqual('artwork-url');
    expect(props.feedArtworkUrl).toEqual('feed-artwork-url');
    expect(props.foobar).toBeUndefined();
  }));

});
