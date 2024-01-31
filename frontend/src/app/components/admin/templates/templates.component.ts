import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TEMPLATES } from '../../preview/components';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templates = TEMPLATES;
  currentTemplate = this.pds.localData.presetId;
  selectedTemplate = this.pds.localData.presetId;

  constructor(private pds: PageDataService) {}

  selectTemplate(id: number) {
    this.selectedTemplate = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);

  }

  switchTemplate() {
    
  }
}
