import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';

export class AuthErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) { }

  matcher = new AuthErrorStateMatcher();

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
          if (res.mismatch) {
            this.loginForm.controls.password.reset();
            this.loginForm.controls.email.markAsPristine({ onlySelf: true });
          } else this.router.navigate(['admin']);
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
