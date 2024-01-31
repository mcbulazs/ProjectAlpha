import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
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

  constructor(private pds: PageDataService) {}

  general = new FormGroup({
    title: new FormControl(''),
  })
  localData!: PageData;

  navOrderChanged = false;
  originalNavbar: NavItem[] = [];

  ngOnInit(): void {
    this.localData = this.pds.localData;
    this.pds.getData().subscribe(x => {
      this.localData = x;
      for (const item of this.localData.navbar) {
        this.originalNavbar.push({...item});
      }
    })
  }

  checkOrder() {
    for (let i = 0; i < this.originalNavbar.length; i++) {
      if (this.originalNavbar[i].id !== this.localData.navbar[i].id) {
        this.navOrderChanged = true;
        return;
      }
    }
    this.navOrderChanged = false;
  }

  ngOnDestroy(): void {
    if (this.navOrderChanged) {
      for (let i = 0; i < this.localData.navbar.length; i++) {
        this.localData.navbar[i] = this.originalNavbar[i];
      }
    }
  }

  drop(event: CdkDragDrop<NavItem[]>) {
    moveItemInArray(this.localData.navbar, event.previousIndex, event.currentIndex);
    this.checkOrder();
    console.log(this.originalNavbar);
    console.log(this.localData.navbar);
  }

  // TODO: send to backend
  save() {
    this.navOrderChanged = false;
  }
}
