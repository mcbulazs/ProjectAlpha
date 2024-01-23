import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './services/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'projectalpha';

  constructor(private user: UserService) {}

  userData: User = {
    users: []
  };

  ngOnInit(): void {
    this.user.getUsers().subscribe(x => {
      console.log(x);
      
      this.userData = x;
    })
  }
}
