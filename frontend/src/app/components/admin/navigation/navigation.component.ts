import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MAT_SNACKBAR_CONFIG } from '../../../constants';
import { NavItem } from '../../../interfaces/navitem.interface';
import { EditNavigationComponent } from './edit-navigation/edit-navigation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, MatIcon, MatIconButton, MatButton, MatButton],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  data!: PageData;
  changed = false;
  initState: NavItem[] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    for (const navItem of this.data.navbar) {
      this.initState.push({ ...navItem });
    }
  }


  drop(event: CdkDragDrop<NavItem[]>) {
    moveItemInArray(this.data.navbar, event.previousIndex, event.currentIndex);
    this.pds.sendNavbarUpdate();
    this.checkOrder();
  }

  checkOrder() {
    for (let i = 0; i < this.initState.length; i++) {
      if (this.initState[i].id !== this.data.navbar[i].id) {
        this.changed = true;
        return;
      }
    }
    this.changed = false;
  }

  save() {
    this.pds.patchNavbar().subscribe(success => {
      if (success) this.changed = false;
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

  reset() {
    if (this.changed) {
      for (let i = 0; i < this.data.navbar.length; i++) {
        this.data.navbar[i] = this.initState[i];
      }
      this.pds.sendNavbarUpdate();
    }
  }
}
