import { Component, OnInit , Injectable} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { PrimeNGConfig } from 'primeng/api';
import { CrudService } from './../../services/crud-service';
import { EarlySalaryService } from './../../services/EarlySalaryService';

@Injectable()
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
  esign_Modal!:boolean;
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
  showDownload: boolean = false;
  pdfSrc: any;
  esignVerified:boolean = false;
  selected_bank_details: any;
  early_bank_details: any;
  userdetail__url_type = '/user/details/update/';
  download__url_type = '/user/sanction/download';
  send_email__url_type = '/user/sanction/attachment';
  verification__url = '/user/sanction/esign';
  get_selected_bank_detail__url = '/bank/detail';
  early_salary_bank: boolean = false;
  

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private EarlySalaryService: EarlySalaryService,private toaster: ToastrService, private router: Router,
    private activatedRoute: ActivatedRoute) {
     console.log('current url', this.router.url);
      this.userID = this.activatedRoute.snapshot.queryParams.id;
      // this.early_bank_details = EarlySalaryService.EarlySalaryDataUpdated;
      // this.early_salary_bank = EarlySalaryService.early_salary_bank_updated;
    }

  ngOnInit(): void {
    
    if(this.userID) {
      
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {

            this.checkNextPg(response);

            let selectedBankDetail = {
              bank_ref_id: response.data.bank_ref_id
            }
            this.CrudService.post(selectedBankDetail, this.get_selected_bank_detail__url).subscribe(
              (response: any) => {
                if(response.status == true) {
                  this.selected_bank_details = response.data;
                  //this.toaster.success(response.msg);
                } else {
                  this.toaster.error(response.msg);
                }
            })

            this.userEnteredDetails = response.data;
            this.selectedValue = this.userEnteredDetails?.professional_type;
            if(this.userEnteredDetails?.references.length > 0 ) {
              this.reference_added_mark = true;
            }
            // if(this.userEnteredDetails.email_id != null) {
            //   this.email_form.controls['email'].setValue(this.userEnteredDetails.email_id);
            // }

            if(response.data.is_esigned == true) {
              this.esignVerified = true;
            }

            if(response.data.references.length > 0) {
              this.showDownload = true;
              this.add_reference_form.controls['name'].setValue(response.data.references[0].name);
              this.add_reference_form.controls['phone_number'].setValue(response.data.references[0].phone_number);
              this.add_reference_form.controls['pin_code'].setValue(response.data.references[0].pin_code);
              this.add_reference_form.controls['relationship'].setValue(response.data.references[0].relationship);
              this.add_reference_form.controls['name1'].setValue(response.data.references[1].name);
              this.add_reference_form.controls['phone_number1'].setValue(response.data.references[1].phone_number);
              this.add_reference_form.controls['pin_code1'].setValue(response.data.references[1].pin_code);
              this.add_reference_form.controls['relationship1'].setValue(response.data.references[1].relationship);
            }

            this.user_details_form.controls['organization_name'].setValue(this.userEnteredDetails.organization_name);
            this.user_details_form.controls['monthly_income'].setValue(this.userEnteredDetails.monthly_income);
            this.user_details_form.controls['desired_fund_amount'].setValue(this.userEnteredDetails.desired_fund_amount);
            this.user_details_form.controls['loan_tenure'].setValue(this.userEnteredDetails.loan_tenure);
            this.user_details_form.controls['mothers_maiden_name'].setValue(this.userEnteredDetails.mothers_maiden_name);
            this.user_details_form.controls['loandropdown'].setValue(this.userEnteredDetails.loan_type);
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

  checkNextPg(response: any) {
    if(response.data.next_page == "loan-offer-details") {
      console.log('here')
      debugger;
      return;
    }

    else if(response.data.next_page == "cust-details") {
      this.router.navigate(['/loan-info/customer-details'], { queryParams: { id: this.userID } });
    } else if(response.data.next_page == "loan-offer-list") {
      this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
    } else if (response.data.next_page == "post-esign-process") {
      this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } });
    } else if (response.data.next_page == "dashboard") {
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
            this.showDownload = true;
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

  // download sanction letter
  download_sanction_letter() {
    let download_sanction_letter_obj = {
      id: this.userID
    }
    this.CrudService.post(download_sanction_letter_obj, this.download__url_type).subscribe(
      (response: any) => {
        if(response.status == true) {
          window.open(response.data);
          this.toaster.success(response.msg);
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

  // Send email id
  send_email() {
    this.email_detail_submitted = true;
    if(this.email_form.invalid) {
      return
    } else {
      this.email_form.value.id = this.userID;
      this.CrudService.post(this.email_form.value, this.send_email__url_type).subscribe(
        (response: any) => {
          if(response.status == true) {
            debugger;
            this.pdfSrc = response.data;
            this.toaster.success(response.msg);
            this.email_Modal = false;
            this.showEsignModel();
          } else {
            this.toaster.error(response.msg);
          }
      })
    }
  }

  doEsign() {
    let verificationObj = {
      id: this.userID
    }
    this.CrudService.post(verificationObj, this.verification__url).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.toaster.success(response.msg);
         this.esignVerified = true;
         this.esign_Modal = false;
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

  goToPostEsign() {
    let user_target_url = "/user/target/update"
    let id = {
      id: this.userID
    }

    this.CrudService.post(id, user_target_url).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.router.navigate(['/loan-info/post-Esign'], { queryParams: { id: this.userID } }); 
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

  showEmailModal() {
    this.email_Modal = true;
  }

  shoAddEditModal() {
    this.addEdit_Modal = true;
  }

  showEsignModel() {
    this.esign_Modal = true;
  }
}


