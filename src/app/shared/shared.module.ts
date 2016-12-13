import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DurationPipe } from './duration';
import { PlayerComponent } from './player';

@NgModule({
  declarations: [
    DurationPipe,
    PlayerComponent
  ],
  exports: [
    CommonModule,
    DurationPipe,
    PlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: []
})

export class SharedModule { }
