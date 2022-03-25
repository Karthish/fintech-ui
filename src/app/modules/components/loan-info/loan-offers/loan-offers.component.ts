import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { EarlySalaryService } from './../../services/EarlySalaryService';

@Injectable()
@Component({
  selector: 'app-loan-offers',
  templateUrl: './loan-offers.component.html',
  styleUrls: ['./loan-offers.component.scss']
})
export class LoanOffersComponent implements OnInit {

  funding_options_list_details!: any;
  userID;
  submitDetails: boolean = false;


  constructor(private CrudService: CrudService, private toaster: ToastrService, private EarlySalaryService: EarlySalaryService,
    private router: Router, private activatedRoute: ActivatedRoute) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {

    let bank_List_url_type = '/bank/list';
    
    this.CrudService.get(bank_List_url_type).subscribe(
      (response) => {
        this.funding_options_list_details = response;
        console.log('loanoptions', response);
    })
    
    if(this.userID) {
      (document.querySelector('.progress-loader') as HTMLElement).style.display = 'unset';
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.next_page == "loan-offer-list") {
              return;
            } 
            else if(response.data.next_page == "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
              // this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } 
            else if (response.data.next_page == "post-esign") {
              this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } });
            }
            else if (response.data.next_page == "dashboard") {
                this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID } }); 
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

  update_bank_details(bank_id: string, bank_name: string) {
    let update_bank_details = {
      id: this.userID,
      bank_ref_id : bank_id,
    };
    let updateDetails_url_type = '/bank/update';
    
    let early_salary_details = {
      cust_ref_id: this.userID,
      bank_ref_id: bank_id
    }

    let early_salary_url_type = '/early/salary/token';

    console.log('update_bank_details',update_bank_details);

    this.submitDetails = true;
    (document.querySelector('.progress-loader') as HTMLElement).style.display = 'none';
    if(bank_name == "Early Salary") {
    //   let earlyRes = {
    //     mobilenumber : "3143424325",
    //     status : "success", 
    //     statuscode : "1234", 
    //     customerid: "213423425", 
    //     reason: "NA", 
    //     product: "NA", 
    //     sanctionLimit: "200000", 
    //     responseDate: "12-30-2021", 
    //     inPrincipleLimit: "NA", 
    //     inPrincipleTenure: "NA" 
    // }
    // let early_salary_bank = true;
    // this.EarlySalaryService.passEarlySalary(earlyRes, early_salary_bank);
    // this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID, bank: "earlysalary" } });

      this.CrudService.post(early_salary_details, early_salary_url_type).subscribe(
        (response: any) => {
          console.log('loanoptions', response);
          if(response.status == true) {
            this.toaster.success(response.msg);
            this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID, bank: "earlysalary" } });
          } else {
            this.toaster.error(response.msg);
          }
      })
      
    } else {
      this.CrudService.post(update_bank_details, updateDetails_url_type).subscribe(
        (response: any) => {
          console.log('loanoptions', response);
          if(response.status == true) {
            this.toaster.success(response.msg);
            this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            this.submitDetails = false;
          } else {
            this.submitDetails = false;
            this.toaster.error(response.msg);
          }
      })
    }
    

  }

}
