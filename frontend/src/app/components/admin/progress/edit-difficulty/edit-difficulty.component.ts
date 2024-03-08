import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../../services/page.data.service';
import { ProgressComponent } from '../progress.component';
import { Raid } from '../../../../interfaces/raid.interface';
import { MAT_SNACKBAR_CONFIG } from '../../../../constants';

@Component({
  selector: 'app-edit-difficulty',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './edit-difficulty.component.html',
  styleUrl: './edit-difficulty.component.scss'
})
export class EditDifficultyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProgressComponent>, private pds: PageDataService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { }

  difficulty: Raid = {
    difficulty: '',
    max: 1,
    current: 0,
  }

  createMode = true;

  ngOnInit(): void {
    if (this.data.difficultyIndex !== -1) {
      this.difficulty = { ...this.data.progress.raids[this.data.difficultyIndex] };
      this.createMode = false;
    }
  }

  submit() {
    if (this.difficulty.difficulty === '' || this.difficulty.max === null || this.difficulty.current === null || this.difficulty.max < 1) return;
    if (this.createMode) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this.data.progress.raids.push(this.difficulty);
    this.pds.patchProgress(this.data.progress).subscribe(success => {
      this.snackBar.open(`Difficulty ${success ? 'added' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }

  update() {
    this.data.progress.raids[this.data.difficultyIndex] = this.difficulty;
    this.pds.patchProgress(this.data.progress).subscribe(success => {
      this.snackBar.open(`Difficulty ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
