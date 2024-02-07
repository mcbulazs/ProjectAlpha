import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavItem } from '../../../interfaces/navbar.interface';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDivider } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { GalleryDialogComponent } from '../uploads/gallery-dialog/gallery-dialog.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, FormsModule, MatInput, CdkDropList, CdkDrag, CommonModule, MatIcon, MatIconButton, MatButton, MatDivider, MatButton],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit, OnDestroy {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  general = new FormGroup({
    title: new FormControl(''),
  })
  data!: PageData;

  navOrderChanged = false;

  initState: any = {};

  ngOnInit(): void {
    this.data = this.pds.data;
    this.initState = {
      title: this.data.title,
      logo: this.data.logo,
      banner: this.data.banner,
      navigation: [],
    }
    for (const navItem of this.data.navbar) {
      this.initState.navigation.push({ ...navItem });
    }
  }

  changeLogo(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!files[0].type.includes('image')) return;
    this.pds.uploadFile(files[0]).subscribe(res => {
      this.data.logo = res;
      if (res === '') return;
      this.pds.updateBasics().subscribe(succeded => {
        if (succeded) {
          this.initState.logo = this.data.logo;
        } else this.data.logo = this.initState.logo;
        this.snackBar.open(`Logo change${succeded ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      })
    });
  }
  // TODO: Refactor
  changeBanner(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!files[0].type.includes('image')) return;
    this.pds.uploadFile(files[0]).subscribe(res => {
      this.data.banner = res;
      if (res === '') return;
      this.pds.updateBasics().subscribe(succeded => {
        if (succeded) {
          this.initState.logo = this.data.logo;
        } else this.data.logo = this.initState.logo;
        this.snackBar.open(`Banner change${succeded ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      })
    });
  }

  checkOrder() {
    for (let i = 0; i < this.initState.navigation.length; i++) {
      if (this.initState.navigation[i].id !== this.data.navbar[i].id) {
        this.navOrderChanged = true;
        return;
      }
    }
    this.navOrderChanged = false;
  }

  ngOnDestroy(): void {
    if (this.navOrderChanged) {
      for (let i = 0; i < this.data.navbar.length; i++) {
        this.data.navbar[i] = this.initState.navigation[i];
      }
    }
    if (this.initState.title !== this.data.title) this.data.title = this.initState.title;
    if (this.initState.logo.path !== this.data.logo) this.data.logo = this.initState.logo;
  }

  drop(event: CdkDragDrop<NavItem[]>) {
    moveItemInArray(this.data.navbar, event.previousIndex, event.currentIndex);
    this.checkOrder();
  }

  // TODO: send to backend
  save() {
    this.navOrderChanged = false;
  }

  openGallery(outputObject: any, key: string) {
    const dialogRef = this.dialog.open(GalleryDialogComponent, {
      width: '800px',
      height: '800px'
    });
    dialogRef.afterClosed().subscribe(selected => {
      
      if (selected === undefined) return;
      outputObject[key] = this.pds.images[selected];
      this.pds.updateBasics().subscribe(succeded => {
        if (succeded) {
          this.initState[key] = outputObject[key];
        } else outputObject[key] = this.initState[key];
        this.snackBar.open(`${key.charAt(0).toUpperCase() + key.slice(1)} change${succeded ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      })
    });
  }
}
