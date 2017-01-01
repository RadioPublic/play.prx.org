import { Component, Input } from '@angular/core';
import { AdapterProperties } from '../adapters/adapter.properties'
@Component({
  selector: 'playlist',
  styleUrls: ['playlist.component.css'],
  templateUrl: `
    <div *ngIf="feedDescription" class="description"> 
      <div class="description-header"> 
        <img class="logo" src="/assets/images/rp-avatar.svg" /> 
        <h1> Why you should listen </h1>
      </div>
      {{ feedDescription }} 
    </div> 
    <p class="playlist-info">
      {{ length }}  Episodes
      <span> 
        - {{ duration }}
      </span> 
    </p>
    <ul class='playlist-container'>
      <li class='playlist-entry' *ngFor="let episode of episodes; let i = index" [attr.data-index]="i">
        <p class="playlist-number"> 
          {{ i + 1 }}
        </p>
        <img [src]="episode.artworkUrl" />
        <div class="title-container">
          <div class="title"> 
            {{ episode.title }} 
          </div>
          <div class="subtitle"> 
            {{ episode.subtitle }} 
          </div>
        </div> 
        <p class="duration"> 
          30:00
        </p> 
      </li> 
    </ul>
  `
})

export class PlaylistComponent {
  @Input() episodes: Array<AdapterProperties>;
  @Input() duration: string;
  @Input() length: number;
  @Input() feedDescription: string;

}
