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

  games = [
    'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png',
    'https://cdn2.steamgriddb.com/logo/941d5007e0a0bd420ca69db03ef54c4d.png',
    'https://i.imgur.com/YZMLxmj.png',
    'https://assets.stickpng.com/images/628c9d899f5557831305934e.png',
    'https://logos-world.net/wp-content/uploads/2021/03/Guild-Wars-Emblem.png',
  ];
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
    let basics: PageBasics = {
      id: this.pds.webID,
      templateid: this.selectedTemplate,
      title: this.pds.data.title,
    }
    this.pds.updateBasics(basics).subscribe(
      succeded => {
        if (succeded) {
          this.pds.data.templateid = this.selectedTemplate;
          this.currentTemplate = this.selectedTemplate;
        }
        this.snackBar.open(`Template change${succeded ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      }
    )
  }
}
