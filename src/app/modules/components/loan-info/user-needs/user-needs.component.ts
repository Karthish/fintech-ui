import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { CrudService } from './../../services/crud-service';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-needs',
  templateUrl: './user-needs.component.html',
  styleUrls: ['./user-needs.component.scss']
})

export class UserNeedsComponent implements OnInit {
  pan_verification: boolean = true;
  pan_form!: FormGroup;
  pan_submitted: boolean = false;
  pan_verification_url_type = '/pan/verify';


  displayModal!: boolean;
  amt_need: number = 100000;
  aadhar_id: any;
  invalid_aadhar: boolean = false;
  // aadhar_length!: number;
  tenure: number = 12;
  interest_rate: number = 11;
  interest_payable: number = 6056;
  total_payment: number = 106056;
  monthly_emi: number = 8838;
  showNextBtn = false;
  AadharAuthenticateModal!: boolean;
  // AadharSuccessModal!: boolean;
  pan_verification_con: boolean = false;
  loan_options_con: boolean = true;
  loan_options: any;
  // aadhar_form!: FormGroup;
  // aadhar_submitted: boolean = false;
  // otp_form!: FormGroup;
  // otp_submitted: boolean = false;
  // aadhar_verification_url_type = '/aadhar/generate/accesskey';
  // otp_verification_url_type = '/aadhar/otp/verify';
  loan_list_url_type = '/loan/list';
  userID: any;

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private toaster: ToastrService, 
    private router: Router) {}
  ngOnInit(): void {
    this.primengConfig.ripple = true;

    // get loan options
    this.CrudService.getLoanList().subscribe(
      (response) => {
        console.log('loanoptions', response);
        this.loan_options = response;
      })

      this.pan_form = this.formBuilder.group(
        {
          pan_no: [
            '',
            [
              Validators.required,
              Validators.pattern("[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}")
            ]
          ]
        }
      )
  }

  // getter function for pan form
  get pan(): { [key: string]: AbstractControl } {
    return this.pan_form.controls;
  }


  SubmitPan(): void {
    this.pan_submitted = true;
    
    if (this.pan_form.invalid) {
      return
    } else {
      console.log(JSON.stringify(this.pan_form.value, null, 2));
      this.pan_form.value.loan_description = localStorage.getItem('loan_description');
      this.pan_form.value.loan_ref_id = localStorage.getItem('loan_ref_id');
      this.pan_form.value.loan_type = localStorage.getItem('loan_type');
      this.CrudService.post(this.pan_form.value, this.pan_verification_url_type).subscribe(
        (response: any) => {
          if(response.status == false) {
            this.toaster.error(response.msg);
          } else {
            console.log('Aadhar verification', response);
            this.toaster.success(response.msg);
            this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: response.data._id } });
            // this.pan_verification = false;
            // this.cust_detail_verification = true;
          }
          
        })
    }
  }

  

  // showAadharSuccessModal() {
  //   this.AadharAuthenticateModal = false;
  //   this.AadharSuccessModal = true;
  // }

  

  calculate_emi() {
    this.monthly_emi = (this.amt_need * (this.interest_rate / 1200)) / (1 - (Math.pow(1 / (1 + (this.interest_rate / 1200)), this.tenure)));
    this.interest_payable = Math.ceil((this.tenure * this.monthly_emi) - this.amt_need);
    this.total_payment = this.interest_payable + this.amt_need;
    this.monthly_emi = Math.ceil(this.monthly_emi);
  }

  showModalDialog() {
    this.displayModal = true;
  }


  selectLoan(loan: any): void {
    for (let loan of this.loan_options.data) {
      loan.isClicked = false;
    }
    loan.isClicked = true;
    localStorage.setItem('loan_type', loan.type);
    localStorage.setItem('loan_description', loan.description);
    localStorage.setItem('loan_ref_id', loan._id);
    this.showNextBtn = true;
  }


}

function accesskey(accesskey: any, accessKey: any) {
  throw new Error('Function not implemented.');
}
