import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../services/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginFail = {
    occured: false,
    message: "Invalid credentials"
  }


  loginForm = new FormGroup({
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
  });

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as User).subscribe({
        next: res => {
          this.router.navigate(['admin']);
        },
        error: () => {
          this.loginForm.controls.password.reset();
          this.loginForm.controls.email.markAsPristine({onlySelf: true});
          this.loginFail.occured = true;
        }
      });
    }
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }
}
