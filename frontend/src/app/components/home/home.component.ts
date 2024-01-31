import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CommonModule, RouterLink, RegisterComponent, MatTabsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router) { }

  backgrounds = [
    'https://moewalls.com/wp-content/uploads/2023/06/illidan-stormrage-demon-world-of-warcraft-thumb.jpg',
    'https://i.imgur.com/WNbU18l.jpeg',
    'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_world_of_warcraft_shadowlands_01_1920x1080.jpg',
    'https://wallpaperset.com/w/full/5/2/9/212596.jpg',
    'https://initiate.alphacoders.com/images/123/cropped-1920-1080-1230603.jpg?6725',
  ];
  serverState = this.authService.serverState;

  bgChanger!: Subscription;
  @HostBinding('style.background-image') bgImage = `url('${this.backgrounds[this.backgrounds.length-1]}')`;

  ngOnInit(): void {
    this.loadImages();
    this.bgChanger = interval(10000, ).subscribe(() => {
      let next = this.backgrounds.shift()!;
      this.backgrounds.push(next);
      this.bgImage = `url('${next}')`;
    })
  }

  loadImages() {
    for (const image of this.backgrounds) {
      let img = new Image();
      img.src = image;
    }
  }

  ngOnDestroy(): void {
    this.bgChanger.unsubscribe();
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
        }).subscribe(x => this.router.navigate(['admin']));
      } else this.router.navigate(['admin'])
    });
  }
}
