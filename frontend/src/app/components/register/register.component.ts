import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router) {}

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    passwordConfirm: new FormControl(''),
  });

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
      },
    });
  }
}
