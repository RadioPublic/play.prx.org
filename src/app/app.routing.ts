import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuilderComponent } from './builder';
import { EmbedComponent } from './embed';
import { DemoComponent } from './demo';

export const routes: Routes = [
  { path: '',     component: BuilderComponent },
  { path: 'e',    component: EmbedComponent },
  { path: 'demo', component: DemoComponent }
];

export const routingComponents: any[] = [
  BuilderComponent,
  EmbedComponent,
  DemoComponent
];

export const routingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
