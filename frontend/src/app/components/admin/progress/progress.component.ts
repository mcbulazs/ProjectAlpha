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
  initState: Raid[][] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    for (const progress of this.data.progress) {
      this.initState.push([...progress.raids]);
    }
    console.log(this.initState[0][0] === this.data.progress[0].raids[0]);

  }

  drop(event: CdkDragDrop<Raid[]>, progress: Progress) {
    moveItemInArray(progress.raids, event.previousIndex, event.currentIndex);
    this.checkOrder();
  }

  checkOrder() {
    this.changed = false;
    this.initState.forEach((difficulties, i) => {
      difficulties.forEach((difficulty, j) => {
        console.log(difficulty, this.data.progress[i].raids[j]);

        if (this.data.progress[i].raids[j] !== difficulty) {
          this.changed = true;
          return;
        }
      })
    })
  }

  saveOrder() { }

  createProgress() {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditProgressComponent).afterClosed().subscribe(() => {
      this.initState.push([]);
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
