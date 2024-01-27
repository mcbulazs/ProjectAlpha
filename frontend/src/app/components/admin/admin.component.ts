import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HubComponent } from '../preview/components/hub/hub.component';
import { PreviewComponent } from '../preview/preview.component';
import { PageDataService } from '../../services/page.data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, PreviewComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  constructor(private authService: AuthService, private router: Router, private pds: PageDataService) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/'])
    });
  }

  togglePlaceholders() {
    this.pds.togglePlaceholders();
  }
}
