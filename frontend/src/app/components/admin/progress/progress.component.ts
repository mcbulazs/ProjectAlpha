import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatList, MatListItem, MatListItemIcon, MatListItemLine, MatListItemMeta, MatListItemTitle } from '@angular/material/list';
import { EditProgressComponent } from './edit-progress/edit-progress.component';
import { DeleteModalComponent } from '../../delete-modal/delete-modal.component';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { Progress } from '../../../interfaces/progress.interface';
import { EditDifficultyComponent } from './edit-difficulty/edit-difficulty.component';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Raid } from '../../../interfaces/raid.interface';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton, MatExpansionModule, MatList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta, CdkDropList, CdkDrag],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService, private snackBar: MatSnackBar) { }

  data!: PageData;
  changed: boolean = false;
  initProgressOrder: number[] = [];
  initDifficultyOrder: Raid[] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    this.data.progress.forEach(progress => {
      this.initProgressOrder.push(progress.id);
      progress.raids.forEach(raid => {
        this.initDifficultyOrder.push(raid);
      });
    });
    console.log(this.initProgressOrder);

  }

  dropDifficulty(event: CdkDragDrop<Raid[]>, progress: Progress) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(progress.raids, event.previousIndex, event.currentIndex);
    this.checkOrder();
  }

  dropProgress(event: CdkDragDrop<Progress[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.data.progress, event.previousIndex, event.currentIndex);
    this.checkProgressOrder();
  }

  checkProgressOrder() {
    this.changed = false;
    this.data.progress.forEach((progress, index) => {
      if (progress.id !== this.initProgressOrder[index]) {
        this.changed = true;
      }
    });
    console.log(this.changed);

  }

  checkOrder() {
    this.changed = false;
  }

  reset() {
    this.data.progress.sort((a, b) => this.initProgressOrder.indexOf(a.id) - this.initProgressOrder.indexOf(b.id));
    this.changed = false;
  }

  saveOrder() {
    this.reset();
  }

  createProgress() {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditProgressComponent).afterClosed().subscribe(success => {
      if (success) {
        this.initProgressOrder.push(this.data.progress[this.data.progress.length - 1].id);
      }
      console.log(this.initProgressOrder);
    });

  }

  editProgress(progress: Progress) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditProgressComponent, {
      data: progress,
    });
  }

  deleteProgress(id: number) {
    if (this.dialog.openDialogs.length > 0) return;
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '200px',
    });
    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.pds.deleteProgress(id).subscribe(success => {
          this.snackBar.open(`Progress ${success ? 'deleted' : 'deletion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
        });
      }
    });
  }

  createDifficulty(progress: Progress) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditDifficultyComponent, {
      data: {
        progress: progress,
        difficultyIndex: -1,
      },
    });
  }

  editDifficulty(progress: Progress, index: number) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditDifficultyComponent, {
      data: {
        progress: progress,
        difficultyIndex: index,
      },
    });
  }

  deleteDifficulty(progress: Progress, index: number) {
    if (this.dialog.openDialogs.length > 0) return;
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '200px',
    });
    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        let removed = progress.raids.splice(index, 1);
        this.pds.patchProgress(progress).subscribe(success => {
          this.snackBar.open(`Difficulty ${success ? 'deleted' : 'deletion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
          if (!success) {
            progress.raids.splice(index, 0, removed[0]);
          }
        });
      }
    });
  }
}
