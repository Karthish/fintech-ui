import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  getStatusDetails! :any; 
  otpVerify_Modal!: boolean;
  otp_form!: FormGroup;
  otp_submitted: boolean = false;
  otp_verification_url_type = '/user/uan/otp/verification';
  token: any;
  request_id: any;
  bank_ref_id: any;


  constructor(private CrudService: CrudService, private toaster: ToastrService, 
    private formBuilder: FormBuilder, private EarlySalaryService: EarlySalaryService,
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
              this.getStatusDetails = response.data;
              return;
            } 
            else if(response.data.next_page == "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } 
            else if (response.data.next_page == "post-esign-process") {
              this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } });
            }
            else if (response.data.next_page == "dashboard") {
                this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID } }); 
              } 
              else if (response.data.next_page == "early-salary-dashboard") {
                this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: this.userID } });
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

    this.otp_form = this.formBuilder.group(
      {
        otp: ['', Validators.required]
      }
    )

  }

  get otp(): { [key: string]: AbstractControl } {
    return this.otp_form.controls;
  }


  update_bank_details(bank_id: string, bank_name: string) {
    let update_bank_details = {
      id: this.userID,
      bank_ref_id : bank_id,
    };
    let updateDetails_url_type = '/bank/update';

    // this.otp_form.value.cust_ref_id = this.userID;
    // this.otp_form.value.bank_ref_id = bank_id;
    console.log('this.userID;',this.userID);
    
    this.bank_ref_id = bank_id;

    let early_salary_details = {
      cust_ref_id: this.userID,
      bank_ref_id: bank_id
    }

    let early_salary_url_type = '/early/salary/token';

    console.log('update_bank_details',update_bank_details);

    // this.submitDetails = true;
    // (document.querySelector('.progress-loader') as HTMLElement).style.display = 'none';
    if(bank_name == "Early Salary") {
      this.CrudService.post(early_salary_details, early_salary_url_type).subscribe(
        (response: any) => {
          console.log('loanoptions', response);
          if(response.status == true) {
            this.toaster.success(response.data.result.message);

            this.otpVerify_Modal = true;
            // this.otp_form.value.token = response.data.token;
            // this.otp_form.value.request_id = response.data.token;

            this.token = response.data.token;
            this.request_id = response.data.request_id;
            // this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: this.userID } });
          } else {
            this.toaster.error(response.data.result.message);
            
            // this.submitDetails = false;
            // (document.querySelector('.progress-loader') as HTMLElement).style.display = 'none';
            // this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: this.userID } });
            
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

  SubmitOtp(): void {
    this.otp_submitted = true;
    if (this.otp_form.invalid) {
      console.log(this.otp_form);
      return;
    } else {
      this.submitDetails = true;
      this.otp_form.value.token = this.token;
      this.otp_form.value.request_id = this.request_id;
      this.otp_form.value.cust_ref_id = this.userID;
      this.otp_form.value.bank_ref_id = this.bank_ref_id;
      
      
      // (document.querySelector('.progress-loader') as HTMLElement).style.display = 'none';
      this.CrudService.post(this.otp_form.value, this.otp_verification_url_type).subscribe(
        (response:any) => {
          debugger;
          if(response.status == true) {
            this.toaster.success(response.msg);
            this.submitDetails = false;
            // (document.querySelector('.progress-loader') as HTMLElement).style.display = 'none';
            this.otpVerify_Modal = false;
            this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: this.userID } });
          } else {
            this.toaster.error(response.msg);

          }
          
      })
    }

  }


}
