import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavItem } from '../../../interfaces/navbar.interface';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, FormsModule, MatInput, CdkDropList, CdkDrag, CommonModule, MatIcon, MatIconButton, MatButton],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit, OnDestroy {

  constructor(private pds: PageDataService) { }

  general = new FormGroup({
    title: new FormControl(''),
  })
  data!: PageData;

  navOrderChanged = false;

  initState: any = {};

  ngOnInit(): void {
    this.data = this.pds.data;
    this.initState = {
      title: this.data.title,
      logo: {...this.data.logo},
      banner: {...this.data.banner},
      navigation: [],
    }
    for (const navItem of this.data.navbar) {
      this.initState.navigation.push({ ...navItem });
    }
  }

  changeLogo(e: any) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.data.logo.path = reader.result?.toString()!;
    reader.readAsDataURL(file);
  }

  checkOrder() {
    for (let i = 0; i < this.initState.navigation.length; i++) {
      if (this.initState.navigation[i].id !== this.data.navbar[i].id) {
        this.navOrderChanged = true;
        return;
      }
    }
    this.navOrderChanged = false;
  }

  ngOnDestroy(): void {
    if (this.navOrderChanged) {
      for (let i = 0; i < this.data.navbar.length; i++) {
        this.data.navbar[i] = this.initState.navigation[i];
      }
    }
    if (this.initState.title !== this.data.title) this.data.title = this.initState.title;
    if (this.initState.logo.path !== this.data.logo.path) this.data.logo = this.initState.logo;
  }

  drop(event: CdkDragDrop<NavItem[]>) {
    moveItemInArray(this.data.navbar, event.previousIndex, event.currentIndex);
    this.checkOrder();
  }

  // TODO: send to backend
  save() {
    this.navOrderChanged = false;
  }
}
