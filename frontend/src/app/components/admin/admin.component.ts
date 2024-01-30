import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page.data.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { PreviewComponent } from '../preview/preview.component';
import { CommonModule } from '@angular/common';
import { LinkActiveDirective } from '../../utility/link-active.directive';
import { MatLine } from '@angular/material/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatSidenavModule, MatLine, LinkActiveDirective, MatListModule, MatToolbarModule, MatIconModule, MatButton, MatFabButton, MatIconButton, PreviewComponent],
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
