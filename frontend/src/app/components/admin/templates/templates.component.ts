import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TEMPLATES } from '../../preview/components';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { TemplateOneComponent } from '../../preview/templates/template-one/template-one/template-one.component';
import { PageBasics } from '../../../interfaces/page.basics.interface';
import { map } from 'rxjs';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButton, TemplateOneComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnDestroy {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }

  /* games = [
    'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png',
    'https://cdn2.steamgriddb.com/logo/941d5007e0a0bd420ca69db03ef54c4d.png',
    'https://i.imgur.com/YZMLxmj.png',
    'https://assets.stickpng.com/images/628c9d899f5557831305934e.png',
    'https://logos-world.net/wp-content/uploads/2021/03/Guild-Wars-Emblem.png',
  ]; */

  games = [
    'https://via.placeholder.com/640x360',
    'https://via.placeholder.com/640x360',
    'https://via.placeholder.com/640x360',
    'https://via.placeholder.com/640x360',
    'https://via.placeholder.com/640x360',
  ]

  templates = TEMPLATES;
  currentGame = 0;
  selectedGame = 0;
  currentTemplate = this.pds.data.templateid;
  selectedTemplate = this.pds.data.templateid;


  selectGame(id: number) {
    this.selectedGame = id;
  }

  selectTemplate(id: number) {
    this.selectedTemplate = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);
  }

  ngOnDestroy(): void {
    if (this.currentTemplate !== this.selectedTemplate) {
      this.pds.changeTemplate(this.currentTemplate, this.pds.currentPreviewPath);
    }
  }

  switchGame() {

  }

  switchTemplate() {
    this.pds.data.templateid = this.selectedTemplate;
    this.pds.patchBasics().subscribe(
      success => {
        if (success) this.currentTemplate = this.selectedTemplate;
        else this.pds.data.templateid = this.currentTemplate;
        this.snackBar.open(`Template change${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      }
    )
  }
}
