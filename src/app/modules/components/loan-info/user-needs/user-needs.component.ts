import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { CrudService } from './../../services/crud-service';

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
  total_payment : number = 106056;
  monthly_emi: number = 8838;
  showNextBtn = false;
  AadharAuthenticateModal!: boolean;
  AadharSuccessModal!: boolean;
  aadhar_verification_con: boolean = false;
  loan_options_con: boolean = true;
  loan_options: any; 
  aadhar_form!: FormGroup;
  aadhar_submitted: boolean = false;
  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder, 
    private CrudService: CrudService) { }
  ngOnInit(): void {
    this.primengConfig.ripple = true;

    // get loan options
    this.CrudService.get().subscribe(
      (response) => {
          console.log('loanoptions',response);
          this.loan_options = response;
    })

    this.aadhar_form = this.formBuilder.group(
      {
        name: ['',Validators.required],
        aadhaarNo: [
          '',
          [
            Validators.required,
          ]
        ]
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

  SubmitAadhar(): void {
    this.aadhar_submitted = true;
    this.aadhar_length = this.aadhar_form.value.aadhaarNo.replace(/ +/g, "").split("").length;
    let aadhar_rm_space = this.aadhar_form.value.aadhaarNo.replace(/ +/g, "");
    this.aadhar_form.value.aadhaarNo = aadhar_rm_space;

    if(this.aadhar_length != 12) {
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

      this.CrudService.post(this.aadhar_form.value).subscribe(
        (response) => {
            console.log('Aadhar verification',response);
            
      })
      // this.AadharAuthenticateModal = true;
    }
  }

  showAadharSuccessModal() {
    this.AadharAuthenticateModal = false;
    this.AadharSuccessModal = true;
  }

  calculate_emi() {
    this.monthly_emi = (this.amt_need * (this.interest_rate/ 1200)) / (1 - (Math.pow(1/(1 + (this.interest_rate/ 1200)), this.tenure)));
    this.interest_payable =  Math.ceil((this.tenure * this.monthly_emi)  - this.amt_need);
    this.total_payment = this.interest_payable + this.amt_need;
    this.monthly_emi = Math.ceil(this.monthly_emi);
  }

  showModalDialog() {
    this.displayModal = true;
  }


  selectLoan(loan: any): void {
    for(let loan of this.loan_options.data) {
      loan.isClicked = false;
    }
    loan.isClicked = true;
    this.showNextBtn = true;
  }


}
