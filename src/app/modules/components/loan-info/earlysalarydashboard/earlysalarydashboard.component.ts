import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { DatePipe } from '@angular/common'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  customerStatus!: any;
  customer_details!:any;
  earlySalary_Modal!: boolean;
  url: string = "https://eswebportalqanew.earlysalary.com/SignUp";
  urlSafe!: SafeResourceUrl;

  constructor(private CrudService: CrudService, private toaster: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute, public datepipe: DatePipe, public sanitizer: DomSanitizer) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            this.userName = response.data.name;
            this.checkStatus();
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })

    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  

  checkStatus() {
    let status_check_obj = {
      cust_ref_id: this.userID 
    }

    this.CrudService.post(status_check_obj, this.early_salary_status).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.status_salary_res = response;
          this.customerStatus = response.data?.customer_details?.loan_details?.status;
          this.customer_details = response.data?.customer_details;
        } else {
          this.customerStatus = response.msg;
        }
    })
  }

  open_earlySalary_modal() {
    this.earlySalary_Modal = true;
  }

}
