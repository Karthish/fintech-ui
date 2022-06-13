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
  tenure: number = 12;
  interest_rate: number = 11;
  interest_payable: number = 6056;
  total_payment: number = 106056;
  monthly_emi: number = 8838;
  showNextBtn = false;
  showSubCategory = false;
  pan_verification_con: boolean = false;
  loan_options_con: boolean = true;
  loan_options: any;
  sub_loan_options: any;
  loan_list_url_type = '/loan/list';
  sub_category__url_type = '/loan/subcategory/list';
  userID: any;

  aadhar_id: any;
  invalid_aadhar: boolean = false;
  aadhar_length!: number;
  AadharAuthenticateModal!: boolean;
  AadharSuccessModal!: boolean;
  aadhar_verification_con: boolean = false;
  aadhar_form!: FormGroup;
  aadhar_submitted: boolean = false;
  otp_form!: FormGroup;
  otp_submitted: boolean = false;
  aadhar_verification_url_type = '/aadhar/generate/accesskey';
  otp_verification_url_type = '/aadhar/otp/verify';
  aadhar_verification: boolean = true;
  requestId!: string;

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private toaster: ToastrService, private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }
  ngOnInit(): void {
    this.primengConfig.ripple = true;

    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.next_page == "aadhar-verification" || "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-list") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } else {
              this.toaster.error(response.msg);
              this.router.navigate(['/loan-info/user-needs']);
            }
          } 
        })
      
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

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

      this.aadhar_form = this.formBuilder.group(
        {
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
  

  // getter function for pan form
  get pan(): { [key: string]: AbstractControl } {
    return this.pan_form.controls;
  }

  // getter function for aadhar form
  get aadhar(): { [key: string]: AbstractControl } {
    return this.aadhar_form.controls;
  }

  get otp(): { [key: string]: AbstractControl } {
    return this.otp_form.controls;
  }


  SubmitPan(): void {
    this.pan_submitted = true;
    
    if (this.pan_form.invalid) {
      return
    } else {
      console.log(JSON.stringify(this.pan_form.value, null, 2));
      

      this.pan_form.value.pan_no = this.pan_form.value.pan_no.toUpperCase();
      localStorage.setItem('pan_no',this.pan_form.value.pan_no);
      
      this.CrudService.post(this.pan_form.value, this.pan_verification_url_type).subscribe(
        (response: any) => {
          if(response.status == false) {
            if(response.msg == "PAN details already exists") {
              let user_id = response.data._id;
              if(response.data.next_page == "cust-details") {
                this.router.navigate(['/loan-info/customer-details'], { queryParams: { id: user_id } });
              } else if (response.data.next_page == "loan-offer-list") {
                this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: user_id } });
              } else if (response.data.next_page == "loan-offer-details") {
                this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: user_id } });
              } else if (response.data.next_page == "post-esign-process") {
                this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: user_id } });
              } else if (response.data.next_page == "dashboard") {
                this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: user_id } }); 
              }
              else if (response.data.next_page == "early-salary-dashboard") {
                this.router.navigate(['/loan-info/early-salary-dashboard'], { queryParams: { id: user_id } });
              } 
              else {
                this.toaster.error(response.msg);
              }
            }
          } else {
              this.pan_verification_con = false;
              this.aadhar_verification_con = true;
              localStorage.setItem('pan_name',response.data.result.name);
              this.toaster.success(response.msg);
            
          }
          
        })
    }
  }

  SubmitAadhar(): void {
    this.aadhar_submitted = true;
    this.aadhar_length = this.aadhar_form.value.aadhar_no.replace(/ +/g, "").split("").length;
    let aadhar_rm_space = this.aadhar_form.value.aadhar_no.replace(/ +/g, "");
    this.aadhar_form.value.aadhar_no = aadhar_rm_space;
    this.aadhar_form.value.pan_name = localStorage.getItem('pan_name');
    this.otp_form.reset();

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
            this.pan_verification_con = false;
            this.AadharAuthenticateModal = true;
            this.requestId = response.data.requestId;
            localStorage.setItem('accessKey', response?.data?.result?.accessKey);
            localStorage.setItem('caseId', response?.data?.clientData?.caseId);
            localStorage.setItem('aadhar_no',this.aadhar_form.value.aadhar_no);
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
      this.otp_form.value.requestId = this.requestId;
      this.otp_form.value.accessKey = localStorage.getItem('accessKey');
      this.otp_form.value.caseId = localStorage.getItem('caseId');
      this.otp_form.value.id = this.userID;
      
      this.otp_form.value.loan_description = localStorage.getItem('loan_description');
      this.otp_form.value.loan_ref_id = localStorage.getItem('loan_ref_id');
      this.otp_form.value.loan_type = localStorage.getItem('loan_type');
      
      this.otp_form.value.loan_subcategory_type = localStorage.getItem('sub_loan_type');
      this.otp_form.value.loan_subcategory_description = localStorage.getItem('sub_loan_description');
      this.otp_form.value.loan_subcategory_ref_id = localStorage.getItem('sub_loan_ref_id');

      this.otp_form.value.aadhar_no = localStorage.getItem('aadhar_no');
      this.otp_form.value.pan_no = localStorage.getItem('pan_no');
      this.otp_form.value.name = localStorage.getItem('pan_name');

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
            localStorage.clear();
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
    let loan_cate_obj = {
      loan_ref_id : loan._id
    }
    this.CrudService.post(loan_cate_obj, this.sub_category__url_type).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.toaster.success(response.msg);
          this.sub_loan_options = response.data;
          this.showSubCategory = true;
          
        } else {
          this.toaster.error(response.msg);
        }
        
    })
  }

  selectSubLoan(subLoan: any) {
    for (let subLoan of this.sub_loan_options) {
      subLoan.isClicked = false;
    }
    subLoan.isClicked = true;
    this.showNextBtn = true;
    localStorage.setItem('sub_loan_type', subLoan.type);
    localStorage.setItem('sub_loan_description', subLoan.description);
    localStorage.setItem('sub_loan_ref_id', subLoan._id);
  }


}

function accesskey(accesskey: any, accessKey: any) {
  throw new Error('Function not implemented.');
}

