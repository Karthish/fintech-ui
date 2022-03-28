import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { PrimeNGConfig } from 'primeng/api';
import { CrudService } from './../../services/crud-service';


@Component({
  selector: 'app-post-e-sign',
  templateUrl: './post-e-sign.component.html',
  styleUrls: ['./post-e-sign.component.scss']
})
export class PostESignComponent implements OnInit {
  post_esign_form!: FormGroup;
  userID;
  post_esign_submitted = false;
  checkDocName!: string;
  checkDocFile!: any;
  empIdDocName!: string;
  file_exceeded: boolean = false;
  file_count_less: boolean = false;

  empId_file_exceeded: boolean = false;
  empId_file_count_less: boolean = false;

  accStatement_file_names: string[] = [];
  accStatement_file_arr: string[] = [];

  empId_file_names: string[] = [];
  empId_file_arr: string[] = [];

  formData_cancelled_cheque = new FormData();
  formData_IDcard = new FormData();
  formData_accountStatement = new FormData();
  // post_eSign__url = "/post/esign";
  cancelled_cheque_upload_url = "/cancelledcheck/upload";
  empId_upload_url = "/empId/upload";
  bankstatment_upload_url = "/bankstatement/upload";

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private activatedRoute: ActivatedRoute, 
    private router: Router, private toaster: ToastrService) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    if(!this.userID) {
      this.router.navigate(['/loan-info/user-needs']);
    }

    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.next_page == "loan-offer-list") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } 
            else if(response.data.next_page == "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } else if (response.data.next_page == "post-esign-process") {
              return;
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
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })

    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }

    this.post_esign_form = this.formBuilder.group(
      {
        bank_name: ['', Validators.required],
        account_no: ['', Validators.required],
        ifsc_code: ['', Validators.required],
        check: ['', Validators.required],
        emp_id: ['', Validators.required],
        acc_statement: ['', Validators.required],
      }
    )
    
  }

  // getter function for post esign form
  get post_esign(): { [key: string]: AbstractControl } {
    return this.post_esign_form.controls;
  }
  

  onFileChange_Check(event: any) {
    this.checkDocName = event.target.files[0].name;
    this.checkDocFile = event.target.files[0];
  }


  onFileChange_acc_statement(event: any) {
    if (event.target.files.length <= 3) {
        if(this.accStatement_file_names.length + event.target.files.length <= 3) {
          for (var i = 0; i < event.target.files.length; i++) {
          this.accStatement_file_arr.push(event.target.files[i]);
          this.accStatement_file_arr = this.accStatement_file_arr.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          this.accStatement_file_names.push(event.target.files[i].name);
          this.accStatement_file_names = this.accStatement_file_names.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          }
          this.file_count_less = false;
          this.file_exceeded = false;
          event.target.value = "";
        } else {
          this.file_exceeded = true;
        }

      console.log('file_arr',this.accStatement_file_arr);
    }
    else if (event.target.files.length > 3) {
      this.file_count_less = false;
      this.file_exceeded = true;
      this.post_esign_form.controls['acc_statement'].setErrors({'incorrect': true});
    }
  }

  delete_file(filename:string) {
    let file_index = this.accStatement_file_names.indexOf(filename);
    this.accStatement_file_names.splice(file_index, 1);
    this.accStatement_file_arr.splice(file_index, 1);
    if(this.accStatement_file_names.length == 0) {
      this.file_count_less = true;
      this.post_esign_form.controls['acc_statement'].setErrors({'incorrect': true});
    } else if(this.accStatement_file_names.length <= 3) {
      this.file_exceeded = false;
    }

    console.log('remainingfiles',this.accStatement_file_names);
  }

  onFileChange_emp_id(event: any) {
    if (event.target.files.length <= 2) {
        if(this.empId_file_names.length + event.target.files.length <= 2) {
          for (var i = 0; i < event.target.files.length; i++) {
          this.empId_file_arr.push(event.target.files[i]);
          this.empId_file_arr = this.empId_file_arr.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          this.empId_file_names.push(event.target.files[i].name);
          this.empId_file_names = this.empId_file_names.filter( function( item, index, inputArray ) {
            return inputArray.indexOf(item) == index;
          });
          }
          this.empId_file_count_less = false;
          this.empId_file_exceeded = false;
          event.target.value = "";
        } else {
          this.empId_file_exceeded = true;
        }

      console.log('file_arr',this.empId_file_arr);
    }
    else if (event.target.files.length > 2) {
      this.empId_file_count_less = false;
      this.empId_file_exceeded = true;
      this.post_esign_form.controls['emp_id'].setErrors({'incorrect': true});
    }
  }

  empId_delete_file(filename:string) {
    let file_index = this.empId_file_names.indexOf(filename);
    this.empId_file_names.splice(file_index, 1);
    this.empId_file_arr.splice(file_index, 1);
    if(this.empId_file_names.length == 0) {
      this.empId_file_count_less = true;
      this.post_esign_form.controls['emp_id'].setErrors({'incorrect': true});
    } else if(this.empId_file_names.length <= 2) {
      this.file_exceeded = false;
    }

    console.log('remainingfiles',this.empId_file_names);
  }

  upload_empID() {
    for(let i=0;i<this.empId_file_arr.length;i++) {
      this.formData_IDcard.append("empId", this.empId_file_arr[i]);
    }

    let empid_esign = {
      id: this.userID
    }
    this.formData_IDcard.append("empid_esign", JSON.stringify(empid_esign));

    this.CrudService.post(this.formData_IDcard, this.empId_upload_url).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.toaster.success(response.msg);

        } else {
          this.toaster.error(response.msg);
          return;
      }
    })
  }

  upload_accStatement() {
    for(let i=0;i<this.accStatement_file_arr.length;i++) {
      this.formData_accountStatement.append("bankstatement", this.accStatement_file_arr[i]);
    }
    let accstatement_esign = {
      id: this.userID
     }
     this.formData_accountStatement.append("accstatement_esign", JSON.stringify(accstatement_esign));

    this.CrudService.post(this.formData_accountStatement, this.bankstatment_upload_url).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.toaster.success(response.msg);

        } else {
          this.toaster.error(response.msg);
          return;
      }
    })
  }

  SubmitPostEsign(): void {
    this.post_esign_submitted = true;
    if (this.post_esign_form.invalid) {
      return;
    }
    else {
      console.log('post_esign_form.value',this.post_esign_form.value);

      this.formData_cancelled_cheque.append("cancelledcheck", this.checkDocFile);
      
      // for(let i=0;i<this.empId_file_arr.length;i++) {
      //   this.formData_IDcard.append("empId", this.empId_file_arr[i]);
      // }
      // for(let i=0;i<this.accStatement_file_arr.length;i++) {
      //   this.formData_accountStatement.append("bankstatement", this.accStatement_file_arr[i]);
      // }

      let eSingData = {
          id: this.userID,
          bank_name: this.post_esign_form.value.bank_name,
          account_no: this.post_esign_form.value.account_no,
          ifsc_code: this.post_esign_form.value.ifsc_code
      }
      this.formData_cancelled_cheque.append("eSingData", JSON.stringify(eSingData));


      this.CrudService.post(this.formData_cancelled_cheque, this.cancelled_cheque_upload_url).subscribe(
        (response: any) => {
          if(response.status == true) {
            this.upload_empID();
            this.upload_accStatement();
            this.toaster.success(response.msg);
            this.router.navigate(['/loan-info/dashboard'], { queryParams: { id: this.userID } });
          } else {
            this.toaster.error(response.msg);
            return;
        }
      })
    }
  }

}
