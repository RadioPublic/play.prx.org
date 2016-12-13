import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DurationPipe } from './duration';
import { PlayerComponent } from './player';
import { ProgressComponent } from './progress';

@NgModule({
  declarations: [
    DurationPipe,
    PlayerComponent,
    ProgressComponent
  ],
  exports: [
    CommonModule,
    DurationPipe,
    PlayerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: []
})

export class SharedModule { }
