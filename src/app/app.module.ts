import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Request, XSRFStrategy } from '@angular/http';
import { SharedModule } from './shared';


import { routing, routingProviders, routingComponents } from './app.routing';

import { AppComponent } from './app.component';

export class NullXSRFStrategy implements XSRFStrategy {
  configureRequest(req: Request): void { }
}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    routing
  ],
  providers: [
    routingProviders,
    {provide: XSRFStrategy, useClass: NullXSRFStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
