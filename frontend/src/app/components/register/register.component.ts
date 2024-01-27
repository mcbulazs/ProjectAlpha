import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordValidator } from './password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) {}

  registerForm = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required, Validators.email
      ]
    }),
    password: new FormControl('', {
      validators: [
        Validators.required, Validators.minLength(8)
      ]
    }),
    passwordConfirm: new FormControl('', [
      Validators.required
    ]),
    acceptRules: new FormControl('', [
      Validators.requiredTrue
    ])
  }, {validators: PasswordValidator });

  registerFail = {
    occured: false,
    message: "Email is already registered"
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: x => {
        console.log("Register success:", x);
        this.router.navigate(['admin']);
      },
      error: err => {
        console.log("Register error:", err)
        this.registerForm.controls.password.reset();
        this.registerForm.controls.passwordConfirm.reset();
        this.registerForm.controls.email.markAsPristine({onlySelf: true});
        this.registerFail.occured = true;
      },
    });
  }
  devPass() { //! DEFER REMOVE
    this.authService.register({
      email: "a@a",
      password: "password",
    }).subscribe(x=>this.router.navigate(['admin']));
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get passwordConfirm() {
    return this.registerForm.get("passwordConfirm");
  }

  get acceptRules() {
    return this.registerForm.get("acceptRules");
  }
}
