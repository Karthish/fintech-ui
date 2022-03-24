import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userID;
  bankName;
  dashboard__url = "/user/dashboard/";
  early_salary_status = "/early/salary/status";
  dashboard_details: any;
  next_due_date: any;
  prev_due_date: any;
  outstanding_percentage!: number;
  status_salary_res: any;
  userName!: string;

  constructor(private CrudService: CrudService, private toaster: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
      this.bankName = this.activatedRoute.snapshot.queryParams.bank;
    }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          this.userName = response.data.name;
          // if(response.status == true) {
          //   if(response.data.next_page == "dashboard") {
          //     return;
          //   } 
          //   else if(response.data.next_page == "cust-details") {
          //     this.router.navigate(['/loan-info/customer-details'], { queryParams: { id: this.userID } });
          //   } 
          //   else if(response.data.next_page == "loan-offer-list") {
          //     this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
          //   } 
          //   else if(response.data.next_page == "loan-offer-details") {
          //     this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
          //   } else {
          //     this.toaster.error(response.msg);
          //     this.router.navigate(['/loan-info/user-needs']);
          //   }
          // } 
          // else {
          //   this.toaster.error(response.msg);
          //   this.router.navigate(['/loan-info/user-needs']);
          // }
          
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

    if(this.bankName == "earlysalary") {
      let status_check_obj = {
        cust_ref_id: this.userID 
      }
      this.CrudService.post(status_check_obj, this.early_salary_status).subscribe(
        (response: any) => {
          this.status_salary_res = response;
      })
    }
    

    this.CrudService.get(this.dashboard__url, this.userID).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.dashboard_details = response.data;
          this.next_due_date = this.dashboard_details.next_due_date;
          this.next_due_date = this.datepipe.transform(this.next_due_date, 'MMM d, y');

          this.prev_due_date = this.dashboard_details.previous_due_date;
          this.prev_due_date = this.datepipe.transform(this.prev_due_date, 'MMM d, y');

          this.outstanding_percentage = this.dashboard_details.current_outstanding / this.dashboard_details.amount_sanctioned * 100
          
          console.log('dashboarddetails',this.dashboard_details )
          
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

  checkStatus() {
    let status_check_obj = {
      cust_ref_id: this.userID 
    }
    this.CrudService.post(status_check_obj, this.early_salary_status).subscribe(
      (response: any) => {
        this.status_salary_res = response;
    })
  }

}
