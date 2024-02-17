import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageData } from '../../../interfaces/page.data.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { PageDataService } from '../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavItem } from '../../../interfaces/navitem.interface';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditNavigationComponent } from './edit-navigation/edit-navigation.component';
import { FileDragAndDropComponent } from '../../file-drag-and-drop/file-drag-and-drop.component';
import { PageBasics } from '../../../interfaces/page.basics.interface';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ReactiveFormsModule, FileDragAndDropComponent, MatFormField, MatLabel, FormsModule, MatInput, CdkDropList, CdkDrag, CommonModule, MatIcon, MatIconButton, MatButton, MatButton],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  general = new FormGroup({
    title: new FormControl(''),
  })
  data!: PageData;

  navOrderChanged = false;

  initState!: PageBasics;
  navigation: NavItem[] = [];

  changed: boolean = false;

  ngOnInit(): void {
    this.data = this.pds.data;
    this.initState = {
      id: -1,
      templateid: -1,
      title: this.data.title,
      logo: this.data.logo,
      banner: this.data.banner,
    }
    for (const navItem of this.data.navbar) {
      this.navigation.push({ ...navItem });
    }
  }

  changeLogo(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!files[0].type.includes('image')) return;
    this.pds.uploadFile(files[0]).subscribe(res => {
      this.data.logo = res;
      if (res === '') return;
      this.pds.patchBasics().subscribe(success => {
        if (success) {
          this.initState.logo = this.data.logo;
        } else this.data.logo = this.initState.logo;
        this.snackBar.open(`Logo change${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
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
      this.pds.patchBasics().subscribe(success => {
        if (success) {
          this.initState.logo = this.data.logo;
        } else this.data.logo = this.initState.logo;
        this.snackBar.open(`Banner change${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      })
    });
  }

  saveBasics() {
    this.pds.patchBasics().subscribe(success => {
      if (success) {
        this.changed = false;
        this.initState.title = this.data.title;
      } else this.data.title = this.initState.title;
      this.snackBar.open(`General settings update${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }

  checkOrder() {
    for (let i = 0; i < this.navigation.length; i++) {
      if (this.navigation[i].id !== this.data.navbar[i].id) {
        this.navOrderChanged = true;
        return;
      }
    }
    this.navOrderChanged = false;
  }

  discardChanges(): void {
    if (this.navOrderChanged) {
      for (let i = 0; i < this.data.navbar.length; i++) {
        this.data.navbar[i] = this.navigation[i];
      }
      this.pds.sendNavbarUpdate();
    }
    if (this.initState.title !== this.data.title) this.data.title = this.initState.title;
    //if (this.initState.logo !== this.data.logo) this.data.logo = this.initState.logo;
  }

  drop(event: CdkDragDrop<NavItem[]>) {
    moveItemInArray(this.data.navbar, event.previousIndex, event.currentIndex);
    this.pds.sendNavbarUpdate();
    this.checkOrder();
  }

  save() {
    this.pds.patchNavbar().subscribe(success => {
      if (success) this.navOrderChanged = false;
      this.snackBar.open(`Navigation ${success ? 'reordered' : 'reorder failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    })
  }

  editNavigation(id: number) {
    let navitem = this.data.navbar.find(x => x.id === id);
    if (!navitem) return;
    const preserveTitle: string = navitem.name;
    const preserveEnabled: boolean = navitem.enabled;
    const dialogRef = this.dialog.open(EditNavigationComponent, {
      data: navitem,
    });
    dialogRef.afterClosed().subscribe(changed => {
      if (!changed) {
        if (!navitem) return;
        navitem.name = preserveTitle;
        navitem.enabled = preserveEnabled;
        this.pds.sendNavbarUpdate();
      }
    })
  }
}
