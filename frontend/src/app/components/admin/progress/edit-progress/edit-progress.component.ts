import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ProgressComponent } from '../progress.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../../services/page.data.service';
import { FileDragAndDropComponent } from '../../../file-drag-and-drop/file-drag-and-drop.component';
import { Progress } from '../../../../interfaces/progress.interface';
import { MAT_SNACKBAR_CONFIG } from '../../../../constants';

@Component({
  selector: 'app-edit-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose, FileDragAndDropComponent],
  templateUrl: './edit-progress.component.html',
  styleUrl: './edit-progress.component.scss'
})
export class EditProgressComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProgressComponent>, private pds: PageDataService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: Progress | undefined) { }

  progress: Progress = {
    id: -1,
    name: '',
    background: '',
    raids: [],
  }

  ngOnInit(): void {
    if (this.data) {
      this.progress = { ...this.data };
    }
  }

  setBackground(image: string) {
    this.progress.background = image;
  }

  submit() {
    if (this.progress.name === '') return;
    if (this.data) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.pds.postProgress(this.progress).subscribe(success => {
      this.snackBar.open(`Progress ${success ? 'added' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }

  update() {
    this.pds.patchProgress(this.progress).subscribe(success => {
      this.snackBar.open(`Progress ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
