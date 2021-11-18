import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { CrudService } from './../../services/crud-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-loan-approval',
  templateUrl: './loan-approval.component.html',
  styleUrls: ['./loan-approval.component.scss']
})
export class LoanApprovalComponent implements OnInit {
  userID;
  referenceModal!: boolean;
  email_Modal!: boolean;
  addEdit_Modal!: boolean;
  user_details_form!: FormGroup;
  email_form!: FormGroup;
  loan_options!: any;
  selectedLoanOption!: any;
  add_reference_form!: FormGroup;
  addReference_submitted = false;
  add_reference_form_url_type = "/user/reference";
  reference_added_mark = false;
  userEnteredDetails: any;
  selectedValue!: string;
  user_details_submitted: boolean = false;
  email_detail_submitted: boolean = false;
  userdetail__url_type = '/user/details/update/';
  



  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private toaster: ToastrService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            this.userEnteredDetails = response.data;
            // set value to user details form
            if(this.userEnteredDetails?.professional_type == 'salaried') {
              this.selectedValue = this.userEnteredDetails?.professional_type;
            } 
            if(this.userEnteredDetails?.references.length > 0 ) {
              this.reference_added_mark = true;
            }
            if(this.userEnteredDetails.email_id != null) {
              this.email_form.controls['email'].setValue(this.userEnteredDetails.email_id);
            }
            
            this.user_details_form.controls['organization_name'].setValue(this.userEnteredDetails.organization_name);
            this.user_details_form.controls['monthly_income'].setValue(this.userEnteredDetails.monthly_income);
            this.user_details_form.controls['desired_fund_amount'].setValue(this.userEnteredDetails.desired_fund_amount);
            this.user_details_form.controls['loan_tenure'].setValue(this.userEnteredDetails.loan_tenure);
            this.user_details_form.controls['mothers_maiden_name'].setValue(this.userEnteredDetails.mothers_maiden_name);
            this.user_details_form.controls['loandropdown'].setValue(this.userEnteredDetails.loan_type);
            // this.loan_options = [{type: this.userEnteredDetails.loan_type}];
            this.selectedLoanOption = this.loan_options.find((val:any) => val.type === this.userEnteredDetails.loan_type);

            
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

    this.primengConfig.ripple = true;
    // get loan options
    this.CrudService.getLoanList().subscribe(
      (response: any) => {
        if(response.status == true) { 
          this.loan_options = response.data;
        } else {
          this.toaster.error(response.msg);
        }
      })

      this.add_reference_form = this.formBuilder.group(
        {
          name: ['', Validators.required],
          relationship: ['', Validators.required],
          pin_code: ['', [Validators.required, Validators.pattern("[0-9]{6}")]],
          phone_number: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
          name1: ['', Validators.required],
          relationship1: ['', Validators.required],
          pin_code1: ['', [Validators.required, Validators.pattern("[0-9]{6}")]],
          phone_number1: ['', [Validators.required, Validators.pattern("[0-9]{10}")]]
        }
      )


    this.user_details_form = this.formBuilder.group(
      {
        loandropdown: ['', Validators.required],
        professional_type: ['selectedValue', Validators.required],
        organization_name: ['', Validators.required],
        monthly_income: ['', Validators.required],
        desired_fund_amount: ['', Validators.required],
        loan_tenure : ['', Validators.required],
        mothers_maiden_name: ['', Validators.required]
      }
    )
    
    // Email form
    this.email_form = this.formBuilder.group(
      {
        email: ['', [Validators.required, 
        Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      }
    )

    
  }

  // getter function for addreferenceform
  get addReference(): { [key: string]: AbstractControl } {
    return this.add_reference_form.controls;
  }

  // getter function for user detail form
  get user_detail(): { [key: string]: AbstractControl } {
    return this.user_details_form.controls;
  }

  // getter function for email form
  get email_detail(): { [key: string]: AbstractControl } { 
    return this.email_form.controls;
  }
  
  SubmitAddReference() {
    this.addReference_submitted = true;
    console.log('add_reference_form',this.add_reference_form);
    if (this.add_reference_form.invalid) {
      return;
    } else {
      let add_reference_form_value = {
        id: this.userID,
        references: [
          {
            name: this.add_reference_form.value.name,
            relationship: this.add_reference_form.value.relationship,
            pin_code: this.add_reference_form.value.pin_code,
            phone_number: this.add_reference_form.value.phone_number
          },
          {
            name: this.add_reference_form.value.name1,
            relationship: this.add_reference_form.value.relationship1,
            pin_code: this.add_reference_form.value.pin_code1,
            phone_number: this.add_reference_form.value.phone_number1
          }
        ]
      }
      this.CrudService.post(add_reference_form_value, this.add_reference_form_url_type).subscribe(
        (response: any) => {
          if(response.status == true) { 
            this.reference_added_mark = true;
            this.toaster.success(response.msg);
          } else {
            this.toaster.error(response.msg);
          }
        })
    }
  }
  

  show_addReference() {
    this.referenceModal = true;
  }

  SubmitUserDetail(): void {
    this.user_details_submitted = true;

    this.user_details_form.value.loan_description = this.user_details_form.value.loandropdown.description;
    this.user_details_form.value.loan_ref_id = this.user_details_form.value.loandropdown._id;
    this.user_details_form.value.loan_type = this.user_details_form.value.loandropdown.type;
    delete this.user_details_form.value.loandropdown;

    console.log('userdetailsUpdated', this.user_details_form.value);
    if (this.user_details_form.invalid) {
      return;
    } 
    else {
      this.CrudService.put(this.user_details_form.value, this.userdetail__url_type,this.userID).subscribe(
          (response: any) => {
            if(response.status == true) {
              this.toaster.success(response.msg);
            } else {
              this.toaster.error(response.msg);
            }
          })
    }
  }

  SubmitEmail(): void {
    this.email_detail_submitted = true
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["loan-info/sanction-letter"], {queryParams: {id: this.userID}})
    );
  
    window.open(url, '_blank');
  }

  showEmailModal() {
    this.email_Modal = true;
  }

  shoAddEditModal() {
    this.addEdit_Modal = true;
  }
}
