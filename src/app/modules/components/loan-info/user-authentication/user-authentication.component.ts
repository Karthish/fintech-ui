import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { CrudService } from './../../services/crud-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

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
  myFiles: string[] = [];
  file_exceeded: boolean = false;
  file_count_less: boolean = false;
  userID;
  pan_verification_url_type = '/pan/verify';
  userdetail__url_type = '/user/details';

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private activatedRoute: ActivatedRoute, private router: Router, private toaster: ToastrService) { 
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.current_page == "pan-verification") {
              this.pan_verification = false;
              this.cust_detail_verification = true;
              this.toaster.success(response.msg);
            }
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
          
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

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

    this.user_details_form = this.formBuilder.group(
      {
        professional_type: ['selectedValue', Validators.required],
        organization_name: ['', Validators.required],
        monthly_income: ['', Validators.required],
        desired_fund_amount: ['', Validators.required],
        loan_tenure : ['', Validators.required],
        mothers_maiden_name: ['', Validators.required],
        // salary_slips: ['',
        //   [Validators.required]
        // ],
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
    if (event.target.files.length == 3) {
      for (var i = 0; i < event.target.files.length; i++) {
        this.myFiles.push(event.target.files[i]);
      }
    } else if (event.target.files.length > 3) {
      this.file_count_less = false;
      this.file_exceeded = true;
    } else if (event.target.files.length < 3) {
      this.file_exceeded = false;
      this.file_count_less = true;
    }
  }


  SubmitPan(): void {
    this.pan_submitted = true;

    if (this.pan_form.invalid) {
      return
    } else {
      console.log(JSON.stringify(this.pan_form.value, null, 2));
      this.pan_form.value.id = this.userID;
      this.CrudService.post(this.pan_form.value, this.pan_verification_url_type).subscribe(
        (response: any) => {
          if(response.status == false) {
            this.toaster.error(response.msg);
          } else {
            console.log('Aadhar verification', response);
            this.toaster.success(response.msg);
            this.pan_verification = false;
            this.cust_detail_verification = true;
          }
          
        })
    }
  }

  SubmitUserDetail(): void {
    delete this.user_details_form.value.accept_terms;
    // delete this.user_details_form.value.salary_slips;
    console.log('user_details_form', this.user_details_form.value);
    this.user_details_submitted = true;
    this.user_details_form.value.id = this.userID;
    debugger;
    if (this.user_details_form.invalid) {
      return;
    } else {
      this.CrudService.post(this.user_details_form.value, this.userdetail__url_type).subscribe(
          (response: any) => {
            if(response.status == true) {
              this.toaster.success(response.msg);
            } else {
              this.toaster.error(response.msg);
            }
          })
    }

    // if (this.myFiles.length == 3) {
    //   const formData = new FormData();
    //   for (var i = 0; i < this.myFiles.length; i++) {
    //     formData.append("salary_slips", this.myFiles[i]);
    //   }
    //   this.user_details_submitted = true;

    //   this.CrudService.post(this.user_details_form.value, this.userdetail__url_type).subscribe(
    //     (response: any) => {

    //     })
    // } else {
    //   this.user_details_submitted = false;
    //   console.log("invalid form");
    //   this.file_exceeded = false;
    //   this.file_count_less = true;
    //   return;
    // }

  }



  // showAuthenticateModalDialog() {
  //   this.AadharAuthenticateModal = true;
  // }


}