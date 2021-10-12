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
  displayModal!: boolean;
  amt_need: number = 100000;
  aadhar_id: any;
  invalid_aadhar: boolean = false;
  aadhar_length!: number;
  tenure: number = 12;
  interest_rate: number = 11;
  interest_payable: number = 6056;
  total_payment: number = 106056;
  monthly_emi: number = 8838;
  showNextBtn = false;
  AadharAuthenticateModal!: boolean;
  AadharSuccessModal!: boolean;
  aadhar_verification_con: boolean = false;
  loan_options_con: boolean = true;
  loan_options: any;
  aadhar_form!: FormGroup;
  aadhar_submitted: boolean = false;
  otp_form!: FormGroup;
  otp_submitted: boolean = false;
  aadhar_verification_url_type = '/aadhar/generate/accesskey';
  otp_verification_url_type = '/aadhar/otp/verify';
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

    this.aadhar_form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        aadhar_no: [
          '',
          [
            Validators.required,
          ]
        ]
      }
    )

    this.otp_form = this.formBuilder.group(
      {
        otp: ['', Validators.required]
      }
    )

  }


  // showAadharCon() {
  //   this.loan_options_con = false;
  //   this.aadhar_verification_con = true;
  // }


  // getter function for aadhar form
  get aadhar(): { [key: string]: AbstractControl } {
    return this.aadhar_form.controls;
  }

  get otp(): { [key: string]: AbstractControl } {
    return this.otp_form.controls;
  }

  SubmitAadhar(): void {
    this.aadhar_submitted = true;
    this.aadhar_length = this.aadhar_form.value.aadhar_no.replace(/ +/g, "").split("").length;
    let aadhar_rm_space = this.aadhar_form.value.aadhar_no.replace(/ +/g, "");
    this.aadhar_form.value.aadhar_no = aadhar_rm_space;

    if (this.aadhar_length != 12) {
      this.invalid_aadhar = true;
      console.log(this.aadhar_form);
      this.aadhar_form.setErrors({ 'invalid': true });
      return;
    }

    if (this.aadhar_form.invalid) {
      console.log(this.aadhar_form);
      return;
    } else {
      this.aadhar_form.setErrors(null);
      console.log(this.aadhar_form.value);
      this.invalid_aadhar = false;

      this.CrudService.post(this.aadhar_form.value, this.aadhar_verification_url_type).subscribe(
        (response: any) => {
          if(response.status == false) {
            if(response.msg == 'Aadhar number is already exists') {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: response.data[0]._id } });
            }
            this.toaster.error(response.msg);
          } else {
            this.toaster.success(response.msg);
            console.log('Aadhar verification',response);
            this.AadharAuthenticateModal = true;
            
            localStorage.setItem('accessKey', response?.data?.result?.accessKey);
            localStorage.setItem('caseId', response?.data?.clientData?.caseId);
            localStorage.getItem('loan_type');
            localStorage.getItem('loan_description');
            localStorage.getItem('loan_ref_id');
            localStorage.setItem('aadhar_no',this.aadhar_form.value.aadhar_no);
          }
            
      })
      
    }
  }

  // showAadharSuccessModal() {
  //   this.AadharAuthenticateModal = false;
  //   this.AadharSuccessModal = true;
  // }

  SubmitOtp(): void {
    this.otp_submitted = true;
    if (this.otp_form.invalid) {
      console.log(this.otp_form);
      return;
    } else {
      this.otp_form.value.accessKey = localStorage.getItem('accessKey');
      this.otp_form.value.caseId = localStorage.getItem('caseId');
      this.otp_form.value.loan_type = localStorage.getItem('loan_type');
      this.otp_form.value.loan_description = localStorage.getItem('loan_description');
      this.otp_form.value.loan_ref_id = localStorage.getItem('loan_ref_id');
      this.otp_form.value.current_page = "aadhar-verification";
      this.otp_form.value.aadhar_no = localStorage.getItem('aadhar_no');
      console.log("otp-response",this.otp_form.value);
      this.CrudService.post(this.otp_form.value, this.otp_verification_url_type).subscribe(
        (response:any) => {
          if(response.status == false) {
            this.toaster.error(response.msg);
          } else {
            this.toaster.success(response.msg);
            console.log('otpverifyresponse',response);
            this.userID = response?.data?._id;
            this.AadharAuthenticateModal = false;
            this.AadharSuccessModal = true;
          }
          
      })
    }

  }

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
