import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GalleryDialogComponent } from '../admin/uploads/gallery-dialog/gallery-dialog.component';
import { PageDataService } from '../../services/page.data.service';
import { MAT_SNACKBAR_CONFIG } from '../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DndDirective } from '../../directives/dnd.directive';

@Component({
  selector: 'file-drag-and-drop',
  standalone: true,
  imports: [GalleryDialogComponent, MatButton, MatIcon, CommonModule, DndDirective],
  templateUrl: './file-drag-and-drop.component.html',
  styleUrl: './file-drag-and-drop.component.scss'
})
export class FileDragAndDropComponent {

  constructor(private pds: PageDataService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  @Input() displayedImage: string = '';
  @Output() fileDrop = new EventEmitter<string>();

  openGallery(btn: MatButton) {
    btn.disabled = true;
    this.dialog.open(GalleryDialogComponent, {
      width: '800px',
      height: '800px'
    }).afterClosed().subscribe(selected => {
      btn.disabled = false;
      if (selected === undefined) return;
      this.displayedImage = selected;
      this.emitChange();
    });
  }

  uploadFile(files: FileList | null) {
    if (!files) return;
    this.pds.uploadFile(files[0]).subscribe(res => {
      if (res) {
        this.displayedImage = res;
        this.emitChange();
      }
      this.snackBar.open(`File upload${res ? 'ed' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }

  deleteImage() {
    this.displayedImage = '';
    this.emitChange();
  }

  emitChange() {
    this.fileDrop.emit(this.displayedImage);
  }
}
