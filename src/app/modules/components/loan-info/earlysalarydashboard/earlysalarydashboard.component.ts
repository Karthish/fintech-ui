import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-earlysalarydashboard',
  templateUrl: './earlysalarydashboard.component.html',
  styleUrls: ['./earlysalarydashboard.component.scss']
})
export class EarlysalarydashboardComponent implements OnInit {
  userID;
  early_salary_status = "/early/salary/status";
  status_salary_res: any;
  userName!: string;
  customerStatus!: string;

  constructor(private CrudService: CrudService, private toaster: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            this.checkStatus();
            response.data.name = this.userName;
            if(response.data.next_page == "loan-offer-list") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } 
            else if(response.data.next_page == "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } else if (response.data.next_page == "post-esign") {
              this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } });
            }  
            else if (response.data.next_page == "dashboard") { 
                this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID } });
              } 
              else if (response.data.next_page == "early-salary-dashboard") {
                return;
              } 
            else {
              this.toaster.error(response.msg);
              this.router.navigate(['/loan-info/user-needs']);
            }
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })

    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }
  }

  checkStatus() {
    let status_check_obj = {
      cust_ref_id: this.userID 
    }
    this.CrudService.post(status_check_obj, this.early_salary_status).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.status_salary_res = response;
          this.customerStatus = response.customerStatus;
        } else {
          this.customerStatus = response.msg;
        }
    })
  }

}
