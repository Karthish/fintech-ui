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

  selectedValue: string = 'salaried';
  consent_value!: boolean;
  cust_detail_verification: boolean = false;
  user_details_form!: FormGroup;
  user_details_submitted: boolean = false;
  myFiles: any[] = [];
  file_exceeded: boolean = false;
  file_count_less: boolean = false;
  userID;
  userdetail__url_type = '/user/details';
  filesUpload_url_type = '/payslip/upload/';
  formData = new FormData();
  file_names: string[] = [];
  file_arr: string[] = [];

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
            if(response.data.current_page == "aadhar-verification") {
              this.aadhar_verification = false;
              this.cust_detail_verification = true;
            } 
            else if(response.data.current_page == "pan-verification") {
              this.aadhar_verification = true;
              this.cust_detail_verification = false;
            }
            else if(response.data.current_page == "cust-details") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } 
            else if(response.data.next_page == "loan-offer-details") {
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } else {
              this.toaster.error(response.msg);
              this.router.navigate(['/loan-info/user-needs']);
            }
          } 
          else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
          
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

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

    this.user_details_form = this.formBuilder.group(
      {
        professional_type: ['selectedValue', Validators.required],
        organization_name: ['', Validators.required],
        monthly_income: ['', Validators.required],
        desired_fund_amount: ['', Validators.required],
        loan_tenure : ['36', Validators.required],
        mothers_maiden_name: ['', Validators.required],
        salary_slips: ['',
          [Validators.required]
        ],
        accept_terms: [false, Validators.requiredTrue]
      }
    )

  }

  // getter function for aadhar form
  get aadhar(): { [key: string]: AbstractControl } {
    return this.aadhar_form.controls;
  }

  get otp(): { [key: string]: AbstractControl } {
    return this.otp_form.controls;
  }

  // getter function for user detail form
  get user_detail(): { [key: string]: AbstractControl } {
    return this.user_details_form.controls;
  }

  onFileChange(event: any) {    
    if (event.target.files.length <= 3) {
      for (var i = 0; i < event.target.files.length; i++) {
        // this.formData.append("payslip", event.target.files[i]);
        this.file_arr.push(event.target.files[i]);
        this.file_names.push(event.target.files[i].name);
        
        this.file_count_less = false;
        this.file_exceeded = false;
      }
      console.log('files',this.formData);
    } 
    else if (event.target.files.length > 3) {
      this.file_count_less = false;
      this.file_exceeded = true;
      this.user_details_form.controls['salary_slips'].setErrors({'incorrect': true});
    } 
    // else if (event.target.files.length < 3) {
    //   this.file_exceeded = false;
    //   this.file_count_less = true;
    //   this.user_details_form.controls['salary_slips'].setErrors({'incorrect': true});
    // }
  }

  delete_file(filename:string) {
    let file_index = this.file_names.indexOf(filename);
    this.file_names.splice(file_index, 1);
    this.file_arr.splice(file_index, 1);
  }


  SubmitAadhar(): void {
    this.aadhar_submitted = true;
    this.aadhar_length = this.aadhar_form.value.aadhar_no.replace(/ +/g, "").split("").length;
    let aadhar_rm_space = this.aadhar_form.value.aadhar_no.replace(/ +/g, "");
    this.aadhar_form.value.aadhar_no = aadhar_rm_space;
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
            this.AadharAuthenticateModal = true;
            
            localStorage.setItem('accessKey', response?.data?.result?.accessKey);
            localStorage.setItem('caseId', response?.data?.clientData?.caseId);
            // localStorage.getItem('loan_type');
            // localStorage.getItem('loan_description');
            // localStorage.getItem('loan_ref_id');
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
      this.otp_form.value.accessKey = localStorage.getItem('accessKey');
      this.otp_form.value.caseId = localStorage.getItem('caseId');
      this.otp_form.value.id = this.userID;
      // this.otp_form.value.aadhar_no = localStorage.getItem('aadhar_no');

      console.log("otp-response",this.otp_form.value);
      this.CrudService.post(this.otp_form.value, this.otp_verification_url_type).subscribe(
        (response:any) => {
          if(response.status == false) {
            this.toaster.error(response.msg.statusMessage);
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
  

  SubmitUserDetail(): void {
    delete this.user_details_form.value.accept_terms;
    delete this.user_details_form.value.salary_slips;
    console.log('user_details_form', this.user_details_form);
    this.user_details_submitted = true;
    this.user_details_form.value.id = this.userID;
    if (this.user_details_form.invalid) {
      return;
    } 
    else {
      this.CrudService.post(this.user_details_form.value, this.userdetail__url_type).subscribe(
          (response: any) => {
            if(response.status == true) {
              for(let i=0;i<this.file_arr.length;i++) {
                this.formData.append("payslip", this.file_arr[i]);
              }
              this.CrudService.put(this.formData,this.filesUpload_url_type,this.userID).subscribe((response: any) => {
                if(response.status == true) {
                  this.toaster.success("User Details Submitted Successfully");
                  this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
                } else {
                  this.toaster.error(response.msg);
                }
              })
              
            } else {
              this.toaster.error(response.msg);
            }
          })
    }


  }


}