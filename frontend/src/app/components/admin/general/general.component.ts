import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDragAndDropComponent } from '../../file-drag-and-drop/file-drag-and-drop.component';
import { PageBasics } from '../../../interfaces/page.basics.interface';
import { Saveable } from '../../../interfaces/saveable.interface';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, FileDragAndDropComponent, MatFormField, MatLabel, FormsModule, MatInput, CommonModule, MatIcon, MatIconButton, MatButton, MatButton],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit, Saveable {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }

  data!: PageData;

  initState!: PageBasics;
  changed: boolean = false;

  ngOnInit(): void {
    this.data = this.pds.data;
    this.initState = {
      title: this.data.title,
      logo: this.data.logo,
      banner: this.data.banner,
    }
  }

  changeLogo(image: string) {
    this.data.logo = image;
    this.changed = this.initState.logo !== image;
  }

  changeBanner(image: string) {
    this.data.banner = image;
    this.changed = this.initState.banner !== image;
  }

  save() {
    this.pds.patchBasics().subscribe(success => {
      if (success) {
        this.initState.title = this.data.title;
        this.initState.logo = this.data.logo;
        this.initState.banner = this.data.banner;
        this.changed = false;
      }
      else this.reset();
      this.snackBar.open(`General settings update${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }

  reset(): void {
    this.data.title = this.initState.title;
    this.data.logo = this.initState.logo;
    this.data.banner = this.initState.banner;
  }
}
