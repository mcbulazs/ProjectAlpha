import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TEMPLATES } from '../../preview/components';
import { PageDataService } from '../../../services/page.data.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templates = TEMPLATES;

  selectedTemplate = 0;

  constructor(private pds: PageDataService) {}

  selectTemplate(id: number) {
    this.selectedTemplate = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);

  }
}
