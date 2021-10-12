import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/components/others/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/loan-info', pathMatch: 'full'
  },
  { path: 'loan-info', 
    loadChildren: () => import('./modules/components/loan-info/loan-info.module').then(m => m.LoanInfoModule) 
  },
  {
    path: '**', component: PageNotFoundComponent, data: { title: 'Page Not Found' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
