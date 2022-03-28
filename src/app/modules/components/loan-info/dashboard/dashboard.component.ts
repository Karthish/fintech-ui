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
  dashboard__url = "/user/dashboard/";
  dashboard_details: any;
  next_due_date: any;
  prev_due_date: any;
  outstanding_percentage!: number;
  userName!: string;

  constructor(private CrudService: CrudService, private toaster: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            this.userName = response.data.name;
            // if(response.data.next_page == "loan-offer-list") {
            //   this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            // } 
            // else if(response.data.next_page == "cust-details") {
            //   this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            // } else if(response.data.next_page == "loan-offer-details") {
            //   this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            // } else if (response.data.next_page == "post-esign") {
            //   this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } });
            // }  
            // else if (response.data.next_page == "dashboard") {
            //     return 
            //   } 
            //   else if (response.data.next_page == "early-salary-dashboard") {
            //     this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: this.userID } });
            //   } 
            // else {
            //   this.toaster.error(response.msg);
            //   this.router.navigate(['/loan-info/user-needs']);
            // }
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })

    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

    this.CrudService.get(this.dashboard__url, this.userID).subscribe(
      (response: any) => {
        if(response.status == true) {
          // this.dashboard_details = response.data;
          // this.next_due_date = this.dashboard_details.next_due_date;
          // this.next_due_date = this.datepipe.transform(this.next_due_date, 'MMM d, y');

          // this.prev_due_date = this.dashboard_details.previous_due_date;
          // this.prev_due_date = this.datepipe.transform(this.prev_due_date, 'MMM d, y');

          // this.outstanding_percentage = this.dashboard_details.current_outstanding / this.dashboard_details.amount_sanctioned * 100;

          this.dashboard_details = {
            loan_application: "157200568055",
            amount_sanctioned: response.data.desired_fund_amount,
            current_outstanding: response.data.desired_fund_amount - (response.data.desired_fund_amount/4),
            next_due_date: "01 April 2022",
            prev_due_date: "01 March 2022",
            amount_due: 25000,
            customerStatus: "DUE SOON",
            previous_emi_amount: 25000,
            previous_due_status: "PAID"
          }
          
          console.log('dashboarddetails',this.dashboard_details )
          
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

}
