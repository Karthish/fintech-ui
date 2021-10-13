import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanInfoComponent } from './loan-info.component';
import { UserNeedsComponent } from './user-needs/user-needs.component';
import { UserAuthenticationComponent } from './user-authentication/user-authentication.component';
import { LoanOffersComponent } from './loan-offers/loan-offers.component';
import { LoanApprovalComponent } from './loan-approval/loan-approval.component';

const routes: Routes = [
  // { path: '', component: UserNeedsComponent },
  { path: '', component: UserAuthenticationComponent },
  { path: 'user-needs', component: UserNeedsComponent },
  { path: 'user-authentication', component: UserAuthenticationComponent },
  { path: 'loan-offers', component: LoanOffersComponent },
  { path: 'loan-approval', component: LoanApprovalComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanInfoRoutingModule { }
