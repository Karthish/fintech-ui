import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './modules/components/others/page-not-found/page-not-found.component';
import { CrudService } from './modules/components/services/crud-service';
import { LoaderService } from './modules/components/services/loader.service';
import { LoaderInterceptor } from './modules/components/services/loader-interceptor.service';
import { LoaderComponent } from './modules/components/others/loader/loader.component';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [CrudService, LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
