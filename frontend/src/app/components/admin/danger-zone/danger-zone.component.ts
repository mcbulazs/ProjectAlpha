import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-danger-zone',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatInputModule, CommonModule, MonacoEditorModule],
  templateUrl: './danger-zone.component.html',
  styleUrl: './danger-zone.component.scss'
})
export class DangerZoneComponent implements OnInit {

  data!: PageData;
  monacoOptions = {
    theme: 'vs-dark',
    language: 'css',
  }

  constructor(private pds: PageDataService) { }

  ngOnInit(): void {
    this.data = this.pds.data;
  }

  updateCss() {
    this.pds.sendCssUpdate();
  }
}
