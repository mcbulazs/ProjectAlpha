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
  initDifficultyOrder: Raid[][] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    this.data.progress.forEach(progress => {
      this.initProgressOrder.push(progress.id);
      this.initDifficultyOrder.push([...progress.raids]);
    });
  }

  dropDifficulty(event: CdkDragDrop<Raid[]>, progress: Progress) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(progress.raids, event.previousIndex, event.currentIndex);
    this.checkDifficultyOrder();
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
  }

  checkDifficultyOrder() {
    this.changed = false;
    this.data.progress.forEach(progress => {
      let difficultyOrder = this.initDifficultyOrder[this.initProgressOrder.indexOf(progress.id)];
      progress.raids.forEach((difficulty, i) => {
        if (difficulty !== difficultyOrder[i]) {
          this.changed = true;
        }
      });
    });
  }

  reset() {
    this.data.progress.sort((a, b) => this.initProgressOrder.indexOf(a.id) - this.initProgressOrder.indexOf(b.id));
    this.data.progress.forEach(progress => {
      Object.assign(progress.raids, this.initDifficultyOrder[this.initProgressOrder.indexOf(progress.id)]);
    });
    this.checkDifficultyOrder();
  }

  saveDifficultyOrder() {
    this.data.progress.forEach(progress => {
      let difficultyOrder = this.initDifficultyOrder[this.initProgressOrder.indexOf(progress.id)];
      let progressChanged = false;
      let i = 0;
      while (i < progress.raids.length && !progressChanged) {
        if (progress.raids[i] !== difficultyOrder[i]) {
          console.log(progress.raids[i], difficultyOrder[i]);

          progressChanged = true;
          this.pds.patchProgress(progress).subscribe(success => {
            this.snackBar.open(`Difficulty order ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
            if (success) {
              this.initDifficultyOrder[this.initProgressOrder.indexOf(progress.id)] = [...progress.raids];
              this.checkDifficultyOrder();
            }
          });
        }
        i++;
      }
    });
  }

  saveProgressOrder() {

    // TODO: finish when backend is ready

    // send order to backend

    // if request was successful
    let newOrder = this.data.progress.map(progress => progress.id);
    let newDifficultyOrder: Raid[][] = [];
    newOrder.forEach(id => {
      newDifficultyOrder.push(this.initDifficultyOrder[this.initProgressOrder.indexOf(id)]);
    });
    this.initDifficultyOrder = newDifficultyOrder;
    this.initProgressOrder = newOrder;
    this.checkProgressOrder();
  }

  save() {
    this.saveDifficultyOrder();
    this.saveProgressOrder();
  }

  createProgress() {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditProgressComponent).afterClosed().subscribe(success => {
      if (success) {
        this.initProgressOrder.push(this.data.progress[this.data.progress.length - 1].id);
        this.initDifficultyOrder.push([]);
      }
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
          if (success) {
            let index = this.initProgressOrder.indexOf(id);
            this.initDifficultyOrder.splice(index, 1);
            this.initProgressOrder.splice(index, 1);
          }
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
    }).afterClosed().subscribe(difficulty => {
      if (difficulty) {
        this.initDifficultyOrder[this.initProgressOrder.indexOf(progress.id)].push(difficulty);
        console.log(difficulty === progress.raids[progress.raids.length - 1]);

      }
    });
  }

  editDifficulty(progress: Progress, index: number) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(EditDifficultyComponent, {
      data: {
        progress: progress,
        difficultyIndex: index,
      },
    }).afterClosed().subscribe(x => {
      this.checkDifficultyOrder();
      //TODO: currently all difficulties are new when edited or new created, find out a way to not owerwrite the old ones
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
