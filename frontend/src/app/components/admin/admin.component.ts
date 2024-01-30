import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page.data.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, RouterLink, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatButton, MatFabButton, MatIconButton, PreviewComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  constructor(private authService: AuthService, private router: Router, private pds: PageDataService) {}

  togglePlaceholders() {
    this.pds.togglePlaceholders();
  }

  preview = false;

  togglePreview() {
    this.preview = !this.preview;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/'])
    });
  }
}
