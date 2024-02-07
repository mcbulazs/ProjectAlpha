import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../../services/page.data.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { GeneralComponent } from '../../general/general.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-gallery-dialog',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatDialogClose, MatButton, MatIcon, MatIconButton],
  templateUrl: './gallery-dialog.component.html',
  styleUrl: './gallery-dialog.component.scss'
})
export class GalleryDialogComponent implements OnInit {

  constructor(private pds: PageDataService, public dialogRef: MatDialogRef<GeneralComponent>) { }

  images: string[] = [];
  empty: boolean = false;

  selected: number | null = null;

  ngOnInit(): void {
    this.images = this.pds.images;
    this.empty = this.images.length === 0;
  }

  select(index: number) {
    this.selected = index;
    this.dialogRef.close(index);
  }
}
