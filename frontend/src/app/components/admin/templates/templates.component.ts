import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PRESETS, TEMPLATES } from '../../preview/templates';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { TemplateOneComponent } from '../../preview/templates/template-one/template-one/template-one.component';
import { PageData } from '../../../interfaces/page.data.interface';
import { Saveable } from '../../../interfaces/saveable.interface';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, MatButton, TemplateOneComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent implements OnInit, Saveable {
  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }

  data!: PageData;
  templates = TEMPLATES;
  presets = PRESETS;

  initState: any;
  changed: boolean = false;

  selectedPreset: any;

  ngOnInit(): void {
    this.initState = {
      template: this.pds.data.templateid,
      preset: this.pds.data.presetid,
    };
    this.selectedPreset = this.pds.data.presetid;
    this.data = this.pds.data;
  }

  selectPreset(id: number) {
    this.selectedPreset = id;
    this.checkChanges();
  }

  selectTemplate(id: number) {
    if (id === this.data.templateid) return;
    this.data.templateid = id;
    this.pds.changeTemplate(id, this.pds.currentPreviewPath);
    this.checkChanges();
  }

  save() {
    this.pds.data.presetid = this.selectedPreset;
    this.pds.patchTemplate().subscribe((success) => {
      this.initState.preset = this.selectedPreset;
      this.initState.template = this.data.templateid;
      this.data.recruitment.splice(0, this.pds.data.recruitment.length);
      this.pds.setRecruitment();
      this.pds.sendRecruitmentCheck();
      this.changed = !success;
      this.snackBar.open(
        `${success ? 'Changes saved' : 'Saving was unsuccessfull'}!`,
        undefined,
        MAT_SNACKBAR_CONFIG
      );
    });
  }

  checkChanges() {
    this.changed = this.initState.preset !== this.selectedPreset || this.data.templateid !== this.initState.template;
  }

  reset() {
    this.pds.data.presetid = this.initState.preset;
    if (this.data.templateid !== this.initState.template) {
      this.data.templateid = this.initState.template;
      this.pds.changeTemplate(
        this.initState.template,
        this.pds.currentPreviewPath
      );
    }
  }
}
