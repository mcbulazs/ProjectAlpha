import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, FormsModule, MatInput],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {

  constructor(private pds: PageDataService) {}

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
}
