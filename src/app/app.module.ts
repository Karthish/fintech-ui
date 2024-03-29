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
import { HandleErrorService } from './modules/components/services/HandleErrorService';
import {ToastrModule} from 'ngx-toastr';
import { DatePipe } from '@angular/common'



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
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 2000,
      preventDuplicates : true
    })
  ],
  providers: [CrudService, LoaderService,HandleErrorService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
