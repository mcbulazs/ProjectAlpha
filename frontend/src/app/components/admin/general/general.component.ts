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
  originalNavbar: NavItem[] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    for (const navItem of this.data.navbar) {
      this.originalNavbar.push({ ...navItem });
    }
  }

  checkOrder() {
    for (let i = 0; i < this.originalNavbar.length; i++) {
      if (this.originalNavbar[i].id !== this.data.navbar[i].id) {
        this.navOrderChanged = true;
        return;
      }
    }
    this.navOrderChanged = false;
  }

  ngOnDestroy(): void {
    if (this.navOrderChanged) {
      for (let i = 0; i < this.data.navbar.length; i++) {
        this.data.navbar[i] = this.originalNavbar[i];
      }
    }
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
