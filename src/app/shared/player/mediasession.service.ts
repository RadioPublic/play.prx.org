import { Injectable } from '@angular/core';


const SEEK_BACKWARD = 'seekbackward';
const SEEK_FORWARD = 'seekforward';

@Injectable()
export class MediaSessionService {

    private title?: string;
    private artist?: string;
    private album?: string;
    private albumArtUrl?: string;
    private seekBackwardListener?: () => void;
    private seekForwardListener?: () => void;
    private triggered = false;

    setMediaMetadata(title: string, artist: string, album: string, albumArtUrl: string) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.albumArtUrl = albumArtUrl;
        if (this.triggered) {
            this.playbackStarted();
        }
    }
    playbackStarted() {
        this.triggered = true;
        if (this.title && 'mediaSession' in navigator) {
            console.log('media session ')
            navigator['mediaSession'].metadata = new window['MediaMetadata']({
                title: this.title,
                artist: this.artist,
                artwork: [{src: this.albumArtUrl}]
            });
            navigator['mediaSession'].setActionHandler(SEEK_BACKWARD, this.seekBackwardListener);
            navigator['mediaSession'].setActionHandler(SEEK_FORWARD, this.seekForwardListener);
        }
    }
    setSeekBackwardListener(listener?: () => void) {
        this.seekBackwardListener = listener;
        if (this.triggered) {
            this.playbackStarted();
        }
    }

    setSeekForwardListener(listener?: () => void) {
        this.seekForwardListener = listener;
        if (this.triggered) {
            this.playbackStarted();
        }
    }

    // TODO: add handlers for skipping tracks, when appropriate.
}
