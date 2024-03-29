import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import { LoanInfoRoutingModule } from './loan-info-routing.module';
import { UserNeedsComponent } from './user-needs/user-needs.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import { LoanOffersComponent } from './loan-offers/loan-offers.component';
import { LoanApprovalComponent } from './loan-approval/loan-approval.component';
import { LoanInfoComponent } from '../loan-info/loan-info.component';
import {TooltipModule} from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { NumberOnlyDirective } from '../../../shared/directives/onlynumber.directive';
import { floatingnumberDirective} from '../../../shared/directives/floatingvalue.directive';
import { onlyCharactersDirective} from '../../../shared/directives/onlycharacters.directive';
import {RadioButtonModule} from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import {InputMaskModule} from 'primeng/inputmask';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PostESignComponent } from './post-e-sign/post-e-sign.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EarlysalarydashboardComponent } from './earlysalarydashboard/earlysalarydashboard.component';

@NgModule({
  declarations: [
    UserNeedsComponent,
    UserAuthenticationComponent,
    LoanOffersComponent,
    LoanApprovalComponent,
    LoanInfoComponent,
    floatingnumberDirective,
    onlyCharactersDirective,
    NumberOnlyDirective,
    PostESignComponent,
    DashboardComponent,
    EarlysalarydashboardComponent
  ],
  imports: [
    CommonModule,
    LoanInfoRoutingModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    SliderModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    RadioButtonModule,
    CheckboxModule,
    InputMaskModule,
    PdfViewerModule,
    NgbModule,
    NgCircleProgressModule.forRoot()
  ],
  entryComponents: [UserNeedsComponent]
})
export class LoanInfoModule { }
