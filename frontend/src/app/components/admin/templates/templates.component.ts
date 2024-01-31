import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TEMPLATES } from '../../preview/components';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnDestroy {
  templates = TEMPLATES;
  currentTemplate = this.pds.localData.presetId;
  selectedTemplate = this.pds.localData.presetId;

  constructor(private pds: PageDataService, private snackBar: MatSnackBar) {}

  selectTemplate(id: number) {
    this.selectedTemplate = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);
  }

  ngOnDestroy(): void {
    if (this.currentTemplate !== this.selectedTemplate) {
      this.pds.changeTemplate(this.currentTemplate, this.pds.currentPreviewPath);
    }
  }

  // TODO: send to backend
  switchTemplate() {
    this.currentTemplate = this.selectedTemplate;
    this.pds.localData.presetId = this.selectedTemplate;
    this.snackBar.open('Template changed!', '', {
      duration: 2000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
    });
  }
}
