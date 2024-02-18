import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { PRESETS, TEMPLATES } from '../../preview/components';
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

  presets = PRESETS;

  templates = TEMPLATES;
  currentPreset = this.pds.preset;
  selectedPreset = this.pds.preset;
  currentTemplate = this.pds.data.templateid;
  selectedTemplate = this.pds.data.templateid;


  selectPreset(id: number) {
    this.selectedPreset = id;
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

  switch() {
    if (this.currentTemplate !== this.selectedTemplate) this.switchTemplate();
    if (this.currentPreset !== this.selectedPreset) this.switchPreset();
  }

  switchPreset() {
    this.pds.preset = this.selectedPreset;
    this.currentPreset = this.selectedPreset;
    this.pds.data.recruitment.splice(0, this.pds.data.recruitment.length);
    this.pds.setRecruitment();
    this.pds.sendRecruitmentCheck();
    this.snackBar.open(`Preset change${true ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
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
