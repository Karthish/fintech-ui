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
  martial_selectedValue: string = 'single';
  address_selectedValue: string = 'owned';
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
  earlySalary_url_type = '/early/salary/token';
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
            if(response.data.next_page == "cust-details") {
              return;
            } 
            else if(response.data.next_page == "loan-offer-list") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } 
            else if(response.data.next_page == "loan-offer-details") {
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
          } 
          else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
          
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }


    this.user_details_form = this.formBuilder.group(
      {
        professional_type: ['selectedValue', Validators.required],
        organization_name: ['', Validators.required],
        monthly_income: ['', Validators.required],
        desired_fund_amount: ['', Validators.required],
        loan_tenure : ['36', Validators.required],
        mothers_maiden_name: ['', Validators.required],
        father_name: ['', Validators.required],
        marital_status: ['martial_selectedValue', Validators.required],
        address_type: ['address_selectedValue', Validators.required],
        office_pin_code: ['',Validators.required],
        mobile_no: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email_id: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        salary_slips: ['',
          [Validators.required]
        ],
        accept_terms: [false, Validators.requiredTrue]
      }
    )

  }

  // getter function for user detail form
  get user_detail(): { [key: string]: AbstractControl } {
    return this.user_details_form.controls;
  }

  onFileChange(event: any) {    
    
    if (event.target.files.length <= 3) {
        if(this.file_names.length + event.target.files.length <= 3) {
          for (var i = 0; i < event.target.files.length; i++) {
          this.file_arr.push(event.target.files[i]);
          this.file_arr = this.file_arr.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          this.file_names.push(event.target.files[i].name);
          this.file_names = this.file_names.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          }
          this.file_count_less = false;
          this.file_exceeded = false;
          event.target.value = "";
        } else {
          this.file_exceeded = true; 
        }
        
      console.log('file_arr',this.file_arr);
    } 
    else if (event.target.files.length > 3) {
      this.file_count_less = false;
      this.file_exceeded = true;
      this.user_details_form.controls['salary_slips'].setErrors({'incorrect': true});
    } 
  }

  delete_file(filename:string) {
    let file_index = this.file_names.indexOf(filename);
    this.file_names.splice(file_index, 1);
    this.file_arr.splice(file_index, 1);
    if(this.file_names.length <= 3) {
      this.file_exceeded = false;
    }
    console.log('remainingfiles',this.file_names);
  }


  SubmitUserDetail(): void {
    delete this.user_details_form.value.accept_terms;
    delete this.user_details_form.value.salary_slips;
    console.log('user_details_form', this.user_details_form);
    this.user_details_submitted = true;
    this.user_details_form.value.id = this.userID;
    if (this.user_details_form.invalid) {
      console.log(this.user_details_form);
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

                  let user_obj = {
                    id: this.userID
                  }
                  this.CrudService.post(user_obj, this.earlySalary_url_type).subscribe((response: any) => {
                    console.log(response.msg);
                  })

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