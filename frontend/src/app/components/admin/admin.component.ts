import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PageDataService } from '../../services/page.data.service';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { PreviewComponent } from '../preview/preview.component';
import { CommonModule } from '@angular/common';
import { LinkActiveDirective } from '../../directives/link-active.directive';
import { MatLine } from '@angular/material/core';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, MatSidenavModule, MatLine, LinkActiveDirective, MatListModule, MatToolbarModule, MatIconModule, MatButton, MatFabButton, MatIconButton, PreviewComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private pds: PageDataService) { }

  BREAKPOINT = 1530;

  preview = false;
  drawerMode: MatDrawerMode = 'side';
  drawerBackdrop: BooleanInput = false;
  drawerOpened: BooleanInput = true;

  setView() {
    if (window.screen.width < this.BREAKPOINT) {
      this.drawerMode = 'over';
      this.drawerBackdrop = true;
      this.drawerOpened = false;
    } else {
      this.drawerMode = 'side';
      this.drawerBackdrop = false;
      this.drawerOpened = true;
    }
  }

  ngOnInit(): void {
    this.setView();
    window.onresize = () => this.setView();
  }

  closeDrawerMobile(drawer: MatDrawer) {
    if (window.screen.width < this.BREAKPOINT) {
      drawer.close();
    }
  }

  togglePlaceholders() {
    this.pds.togglePlaceholders();
  }

  togglePreview() {
    this.preview = !this.preview;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/'])
    });
  }
}
