import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, RouterLink, RegisterComponent, MatTabsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) { }

  serverState = this.authService.serverState;

  devPass() {
    this.authService.login({
      email: "a@a",
      password: "password",
    }).subscribe(x => {
      if (x.mismatch) {
        this.authService.register({
          email: "a@a",
          password: "password",
        }).subscribe(x => this.router.navigate(['admin']));
      } else this.router.navigate(['admin'])
    });
  }
}
