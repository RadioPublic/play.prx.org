import { Component, Input } from '@angular/core';
import { AdapterProperties } from '../adapters/adapter.properties'
@Component({
  selector: 'playlist',
  styleUrls: ['playlist.component.css'],
  templateUrl: `
    <div> 
    </div> 
    <p class="playlist-info">
      {{ length }}  Episodes
      <span> 
        {{ duration }}
      </span> 
    </p>
    <ul class='playlist-container'>
      <li class='playlist-entry' *ngFor="let episode of episodes; let i = index" [attr.data-index]="i">
        <div> 
          {{ i + 1 }}
        </div>
        <div> 
          <img [src]="episode.artworkUrl" />
        </div> 
        <div> 
          {{ episode.title }} 
          {{ episode.subtitle }} 
        </div> 
        <div> 
          30:00
        </div> 
      </li> 
    </ul>
  `
})

export class PlaylistComponent {
  @Input() episodes: Array<AdapterProperties>;
  @Input() duration: string;
  @Input() length: number;

}
