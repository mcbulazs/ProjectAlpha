import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../../delete-modal/delete-modal.component';

@Component({
  selector: 'app-uploads',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatIcon],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss'
})
export class UploadsComponent implements OnInit {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  images: string[] = [];
  empty: boolean = false;

  ngOnInit(): void {
    this.images = this.pds.images;
    this.empty = this.images.length === 0;
  }

  deleteImage(image: string) {
    if (this.dialog.openDialogs.length > 0) return;
    if (this.pds.imageInUse(image)) {
      this.snackBar.open(`Images in use can not be deleted.`, undefined, MAT_SNACKBAR_CONFIG);
      return;
    }
    this.dialog.open(DeleteModalComponent, {
      width: '200px',
    }).afterClosed().subscribe(deleted => {
      if (deleted) {
        this.pds.deleteImage(image).subscribe(success => {
          this.empty = this.images.length === 0;
          this.snackBar.open(`Image delet${success ? 'ed' : 'ion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
        });
      }
    });
  }
}
