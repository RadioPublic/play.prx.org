import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuilderComponent, EpisodePickerComponent } from './builder';
import { EmbedComponent, ShareModalComponent } from './embed';
import { DemoComponent } from './demo';
import { AppLinksComponent } from './embed/app-links/app-links.component';
import { AppIconComponent } from './embed/app-links/app-icon.component';

export const routes: Routes = [
  { path: '',     component: BuilderComponent },
  { path: 'e',    component: EmbedComponent },
  { path: 'demo', component: DemoComponent }
];

export const routingComponents: any[] = [
  BuilderComponent,
  DemoComponent,
  EmbedComponent,
  EpisodePickerComponent,
  ShareModalComponent,
  AppLinksComponent,
  AppIconComponent
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
