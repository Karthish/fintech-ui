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
  edit_user_details_form!: FormGroup;
  loan_options!: any;
  selectedLoanOption!: any;
  add_reference_form!: FormGroup;
  addReference_submitted = false;
  add_reference_form_url_type = "/user/reference";
  reference_added_mark = false;
  userEnteredDetails: any;

  default_option = "Home Loan";


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


    this.edit_user_details_form = this.formBuilder.group(
      {
        loandropdown: ['', Validators.required],
        professional_type: ['selectedValue', Validators.required],
        organization_name: ['', Validators.required],
        monthly_income: ['', Validators.required],
        desired_fund_amount: ['', Validators.required],
        loan_tenure : ['', Validators.required],
        mothers_maiden_name: ['', Validators.required],
        accept_terms: [false, Validators.requiredTrue]
      }
    )
  }

  // getter function for addreferenceform
  get addReference(): { [key: string]: AbstractControl } {
    return this.add_reference_form.controls;
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
      this.CrudService.post(this.add_reference_form.value, this.add_reference_form_url_type).subscribe(
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

  showEmailModal() {
    this.email_Modal = true;
  }

  shoAddEditModal() {
    this.addEdit_Modal = true;
  }
}
