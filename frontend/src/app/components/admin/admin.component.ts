import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';
import { PageDataService } from '../../services/page.data.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageData } from '../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, PreviewComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private pds: PageDataService) {}

  general = new FormGroup({
    title: new FormControl(''),
  })
  localData!: PageData;

  ngOnInit(): void {
    this.localData = this.pds.localData;
    this.pds.getData().subscribe(x => {
      console.log("Admin got");
      this.localData = x;
    })
  }

  addArticle() {
    this.localData.articles.push({
      id: -1,
      content: "Teszt",
      date: Date.now().toString(),
      title: "Cím",
    })
  }

  togglePlaceholders() {
    this.pds.togglePlaceholders();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/'])
    });
  }
}
