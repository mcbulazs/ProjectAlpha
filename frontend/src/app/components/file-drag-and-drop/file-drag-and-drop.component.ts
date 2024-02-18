import { Component, HostListener, Input } from '@angular/core';
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

  @Input() initState: any;
  @Input() data: any;
  @Input() key: any;
  @Input() changeFn: any;

  openGallery() {
    const dialogRef = this.dialog.open(GalleryDialogComponent, {
      width: '800px',
      height: '800px'
    });
    dialogRef.afterClosed().subscribe(selected => {
      if (selected === undefined) return;
      this.data[this.key] = selected;
      this.pds.patchBasics().subscribe(success => {
        if (success) {
          this.initState[this.key] = this.data[this.key];
        } else this.data[this.key] = this.initState[this.key];
        this.snackBar.open(`${this.key.charAt(0).toUpperCase() + this.key.slice(1)} change${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      })
    });
  }

  setFile(file: File, input: HTMLInputElement) {
    this.changeFn(file);
    console.log("file");
    
  }

  deleteImage() {
    const preserveImage = this.data[this.key];
    this.data[this.key] = '';
    this.pds.patchBasics().subscribe(success => {
      if (!success) this.data[this.key] = preserveImage
      this.snackBar.open(`${this.key.charAt(0).toUpperCase() + this.key.slice(1)} ${success ? 'deleted' : 'deletion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }
}
