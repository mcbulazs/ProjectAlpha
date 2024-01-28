import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';
import { PageDataService } from '../../services/page.data.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageData } from '../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, PreviewComponent, MatListModule, MatButtonModule, MatIconModule, MatToolbarModule, FormsModule, ReactiveFormsModule, CommonModule, MatSlideToggleModule, MatSidenavModule, MatInputModule, MatSnackBarModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private pds: PageDataService, private snackBar: MatSnackBar) { }

  general = new FormGroup({
    title: new FormControl(''),
  })
  localData!: PageData;

  ngOnInit(): void {
    this.localData = this.pds.localData;
    this.pds.getData().subscribe(x => {
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
    let snackBarRef = this.snackBar.open('Article added!', undefined, {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
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
