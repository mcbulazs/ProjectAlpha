import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PRESETS, TEMPLATES } from '../../preview/components';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { TemplateOneComponent } from '../../preview/templates/template-one/template-one/template-one.component';
import { PageBasics } from '../../../interfaces/page.basics.interface';
import { map } from 'rxjs';
import { PageData } from '../../../interfaces/page.data.interface';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButton, TemplateOneComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit, OnDestroy {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }


  data!: PageData;
  presets = PRESETS;

  templates = TEMPLATES;
  initState = {
    template: this.pds.data.templateid,
    preset: this.pds.preset,
  }
  selectedPreset = this.pds.preset;

  ngOnInit(): void {
    this.data = this.pds.data;
  }

  selectPreset(id: number) {
    if (id === this.selectedPreset) return;
    this.selectedPreset = id;
  }

  selectTemplate(id: number) {
    if (id === this.data.templateid) return;
    this.data.templateid = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);
  }

  ngOnDestroy(): void {
    this.reset();
    /* if (this.currentTemplate !== this.selectedTemplate) {
      this.pds.changeTemplate(this.currentTemplate, this.pds.currentPreviewPath);
    } */
  }

  switch() {
    if (this.data.templateid !== this.initState.template) this.switchTemplate();
    if (this.selectedPreset !== this.initState.preset) this.switchPreset();
  }

  switchPreset() {
    this.pds.preset = this.selectedPreset;
    this.initState.preset = this.selectedPreset; //* when hard-saved
    this.data.recruitment.splice(0, this.pds.data.recruitment.length);
    this.pds.setRecruitment();
    this.pds.sendRecruitmentCheck();
    this.snackBar.open(`Preset change${true ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
  }

  switchTemplate() {
    this.pds.patchBasics().subscribe(
      success => {
        if (success) this.initState.template = this.data.templateid;
        this.snackBar.open(`Template change${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      }
    )
  }

  reset() {
    this.pds.preset = this.initState.preset;
    if (this.data.templateid !== this.initState.template) {
      this.data.templateid = this.initState.template;
      this.pds.changeTemplate(this.initState.template, this.pds.currentPreviewPath);
    }
  }
}
