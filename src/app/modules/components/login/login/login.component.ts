import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login_form!: FormGroup;
  login_submitted!: boolean;
  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.login_form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          '',
          [
            Validators.required
          ]
        ]
      }
    )
  }
  
  // getter function for login form
  get login(): { [key: string]: AbstractControl } {
    return this.login_form.controls;
  }

  SubmitLogin() {
    this.login_submitted = true;
    if (this.login_form.invalid) {
      return;
    } else {
      console.log(this.login_form.value);
    }
  }
 
}
