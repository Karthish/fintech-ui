import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-authentication',
  templateUrl: './user-authentication.component.html',
  styleUrls: ['./user-authentication.component.scss']
})
export class UserAuthenticationComponent implements OnInit {
  selectedValue: string = 'salaried';
  consent_value!: boolean;
  pan_verification: boolean = true;
  cust_detail_verification: boolean = false;
  pan_form!: FormGroup;
  pan_submitted: boolean = false;
  user_details_form!: FormGroup;
  user_details_submitted: boolean = false;
  myFiles: string [] = [];
  file_exceeded: boolean= false;
  file_count_less: boolean = false;

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.pan_form = this.formBuilder.group(
      {
        pan_number: [
          '',
          [
            Validators.required,
            Validators.pattern("[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}")
          ]
        ]
      }
    )

    this.user_details_form = this.formBuilder.group(
      {
        profession: ['selectedValue', Validators.required],
        organization: ['', Validators.required],
        income: ['', Validators.required],
        funding_amt: ['', Validators.required],
        tenure: ['', Validators.required],
        mothers_maiden_name:['', Validators.required],
        salary_slips:['', 
          [Validators.required]
        ],
        accept_terms: [false, Validators.requiredTrue]
      }
    )

  }

  // getter function for pan form
  get pan(): { [key: string]: AbstractControl } {
    return this.pan_form.controls;
  }

  // getter function for user detail form
  get user_detail(): { [key: string]: AbstractControl } {
    return this.user_details_form.controls;
  }

  onFileChange(event: any) {
    if(event.target.files.length == 3) {
      for (var i = 0; i < event.target.files.length;i++) {
        this.myFiles.push(event.target.files[i]);
      }
    } else if(event.target.files.length > 3) {
      this.file_count_less = false;
      this.file_exceeded = true;
    } else if(event.target.files.length < 3) {
      this.file_exceeded = false;
      this.file_count_less = true;
    } 
  }


  SubmitPan(): void {
    this.pan_submitted = true;

    if(this.pan_form.invalid) {
      return
    } else {
      this.pan_verification = false;
      this.cust_detail_verification = true;
      console.log(JSON.stringify(this.pan_form.value, null, 2))
    }
  }

  SubmitUserDetail(): void {
    console.log('user_details_form',this.user_details_form);
    this.user_details_submitted = true;
    if(this.user_details_form.invalid) {
      return;
    }
    
    if(this.myFiles.length == 3) {
      const formData = new FormData();
      for (var i = 0; i < this.myFiles.length;i++) {
        formData.append("salary_slips", this.myFiles[i]);
      }
      this.user_details_submitted = true;
    } else {
      this.user_details_submitted = false;
      console.log("invalid form");
      this.file_exceeded = false;
      this.file_count_less = true;
      return;
    }
    
  }

  

  // showAuthenticateModalDialog() {
  //   this.AadharAuthenticateModal = true;
  // }
  

}
