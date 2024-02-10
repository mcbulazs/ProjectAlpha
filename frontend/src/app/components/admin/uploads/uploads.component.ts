import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';

@Component({
  selector: 'app-uploads',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatIcon],
  templateUrl: './uploads.component.html',
  styleUrl: './uploads.component.scss'
})
export class UploadsComponent implements OnInit {
  
  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }

  images: string[] = [];
  empty: boolean = false;

  ngOnInit(): void {
    this.images = this.pds.images;
    this.empty = this.images.length === 0;
  }

  // TODO: Confirmation dialog
  deleteImage(image: string) {
    if (this.pds.imageInUse(image)) {
      this.snackBar.open(`Images in use can not be deleted.`, undefined, MAT_SNACKBAR_CONFIG);
      return;
    }
    this.pds.deleteImage(image).subscribe(succeeded => {
      this.empty = this.images.length === 0;
      this.snackBar.open(`Image delet${succeeded ? 'ed' : 'ion failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    })
  }
}
