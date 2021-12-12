import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { CrudService } from './../../services/crud-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";


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
  empIdDocName!: string;
  file_exceeded: boolean = false;
  file_count_less: boolean = false;

  empId_file_exceeded: boolean = false;
  empId_file_count_less: boolean = false;

  accStatement_file_names: string[] = [];
  accStatement_file_arr: string[] = [];

  empId_file_names: string[] = [];
  empId_file_arr: string[] = [];

  constructor(private primengConfig: PrimeNGConfig, private formBuilder: FormBuilder,
    private CrudService: CrudService, private activatedRoute: ActivatedRoute, private router: Router, private toaster: ToastrService) { 
      this.userID = this.activatedRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.post_esign_form = this.formBuilder.group(
      {
        bank_name: ['', Validators.required],
        acc_num: ['', Validators.required],
        ifsc: ['', Validators.required],
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

  SubmitPostEsign(): void {
    this.post_esign_submitted = true;
    if (this.post_esign_form.invalid) {
      return;
    } 
    else {
      
    }
  }

}
