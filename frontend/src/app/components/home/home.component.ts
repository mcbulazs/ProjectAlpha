import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, RouterLink, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  switch: boolean = false;

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe({
      next: () => {
        if (this.authService.isLoggedIn) {
          this.router.navigate(['admin']);
        }
      }
    });
  }

  devPass() {
    this.authService.login({
      email: "a@a",
      password: "password",
    }).subscribe(x => {
      if (x.mismatch) {
        this.authService.register({
          email: "a@a",
          password: "password",
        }).subscribe(x=>this.router.navigate(['admin']));
      } else this.router.navigate(['admin'])
    });
  }

  switchForms(mode: boolean) {
    this.switch = mode;
  }
}
