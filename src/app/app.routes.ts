import { provideRouter, RouterConfig } from '@angular/router';

import {EmbedComponent} from './+embed/index.ts';
import {DemoComponent} from './+demo/index.ts';
import {BuilderComponent} from './+builder/index.ts';

export const routes: RouterConfig = [
  { component: EmbedComponent, path: 'e'},
  { component: BuilderComponent, path: 'builder'},
  { component: DemoComponent, path: 'demo'}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
