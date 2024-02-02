import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PasswordValidator } from './password.validator';
import { AuthErrorStateMatcher } from '../login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, MatInputModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) {}

  matcher = new AuthErrorStateMatcher();

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
    acceptRules: new FormControl(false, [
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
        this.router.navigate(['admin/templates']);
      },
      error: err => {
        console.log("Register error:", err)
        this.registerForm.controls.password.reset();
        this.registerForm.controls.passwordConfirm.reset();
        this.registerForm.controls.email.markAsPristine({onlySelf: true});
        this.registerForm.controls.email.setErrors({'taken': true});
      },
    });
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
