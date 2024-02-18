import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PRESETS, Preset } from '../../../preview/components';
import { RecruitmentComponent } from '../recruitment.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Recruitment } from '../../../../interfaces/recruitment.interface';
import { MAT_SNACKBAR_CONFIG } from '../../../../constants';

@Component({
  selector: 'app-subclass-dialog',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton, MatGridListModule, MatDialogClose],
  templateUrl: './subclass-dialog.component.html',
  styleUrl: './subclass-dialog.component.scss'
})
export class SubclassDialogComponent implements OnInit, OnDestroy {

  constructor(public dialogRef: MatDialogRef<RecruitmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private pds: PageDataService, private snackBar: MatSnackBar) { }

  userData!: Recruitment;
  selectedSubclasses!: string[];
  preset!: Recruitment;
  selectAllToggle: boolean = false;

  initState!: Recruitment;

  ngOnInit(): void {
    this.userData = this.data.userData;
    this.selectedSubclasses = this.userData.subclasses;
    this.preset = this.data.preset;
    if (this.selectedSubclasses.length === this.preset.subclasses.length) this.selectAllToggle = true;
    this.initState = {
      id: this.userData.id,
      class: this.userData.class,
      subclasses: [ ...this.userData.subclasses ],
    }
  }

  ngOnDestroy(): void {
    this.reset();
    this.pds.sendRecruitmentCheck();
  }

  select(subclass: string) {
    let subjectIndex = this.selectedSubclasses.findIndex(x => x === subclass);
    if (subjectIndex === -1) this.selectedSubclasses.push(subclass);
    else this.selectedSubclasses.splice(subjectIndex, 1);

    if (this.selectedSubclasses.length === this.preset.subclasses.length) this.selectAllToggle = true;
    else this.selectAllToggle = false;
    this.pds.sendRecruitmentCheck();
  }

  selectAll() {
    this.selectAllToggle = !this.selectAllToggle;
    this.selectedSubclasses.splice(0, this.selectedSubclasses.length);
    if (this.selectAllToggle) {
      this.preset.subclasses.map(x => {
        this.selectedSubclasses.push(x);
      });
    }
    this.pds.sendRecruitmentCheck();
  }

  save() {
    this.initState = this.userData;
    this.snackBar.open(`Recruitment ${true ? 'saved' : 'save failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
  }

  reset() {
    this.userData.id = this.initState.id;
    this.userData.class = this.initState.class;
    this.userData.subclasses = [ ...this.initState.subclasses ];
  }
}
