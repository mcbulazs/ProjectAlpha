import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
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

  imageSrc = [
    'https://moewalls.com/wp-content/uploads/2023/06/illidan-stormrage-demon-world-of-warcraft-thumb.jpg',
    'https://i.imgur.com/WNbU18l.jpeg',
    'https://www.gamewallpapers.com/wallpapers_slechte_compressie/wallpaper_world_of_warcraft_shadowlands_01_1920x1080.jpg',
    'https://wallpaperset.com/w/full/5/2/9/212596.jpg',
    'https://i.imgur.com/ubjAfCO.jpeg',
  ];

  backgrounds = new Array();
  serverState = this.authService.backendState;

  private bgChanger = new Subscription();
  @HostBinding('style.background-image') bgImage: string = '';

  ngOnInit(): void {
    this.loadImages();
    this.bgImage = `url('${this.backgrounds[this.backgrounds.length - 1].src}')`;
    this.bgChanger.add(interval(10000).subscribe(() => {
      const next = this.backgrounds.shift()!;
      this.backgrounds.push(next);
      this.bgImage = `url('${next.src}')`;
    }));
  }

  loadImages() {
    for (const image of this.imageSrc) {
      let img = new Image();
      img.src = image;
      this.backgrounds.push(img);
    }
  }

  ngOnDestroy(): void {
    this.bgChanger.unsubscribe();
  }

  //! DEFER REMOVE
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
