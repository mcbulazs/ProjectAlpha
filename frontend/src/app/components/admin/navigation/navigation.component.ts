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
import { Saveable } from '../../../interfaces/saveable.interface';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule, MatIcon, MatIconButton, MatButton, MatButton],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, Saveable {

  constructor(private pds: PageDataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  data!: PageData;
  changed = false;
  initState: NavItem[] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    this.setInitState();
  }

  setInitState(): void {
    this.initState = [];
    for (const navItem of this.data.navbar) {
      this.initState.push({ ...navItem });
    }
  }

  drop(event: CdkDragDrop<NavItem[]>): void {
    moveItemInArray(this.data.navbar, event.previousIndex, event.currentIndex);
    this.pds.sendNavbarUpdate();
    this.checkOrder();
  }

  checkOrder(): void {
    for (let i = 0; i < this.initState.length; i++) {
      if (this.initState[i].id !== this.data.navbar[i].id) {
        this.changed = true;
        return;
      }
    }
    this.changed = false;
  }

  save(): void {
    this.pds.patchNavbarOrder().subscribe(success => {
      if (success) {
        this.changed = false;
        this.setInitState();
      }
      this.snackBar.open(`Navigation ${success ? 'reordered' : 'reorder failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    })
  }

  editNavigation(id: number): void {
    if (this.dialog.openDialogs.length > 0) return;

    const navItem = this.data.navbar.find(x => x.id === id);
    if (!navItem) return;

    const oldName: string = navItem.name;
    const oldEnabled: boolean = navItem.enabled;

    this.dialog.open(EditNavigationComponent, { data: navItem })
      .afterClosed().subscribe(changed => {
        if (changed) {
          const initNavItem = this.initState.find(x => x.id === id);
          if (!initNavItem) return;
          initNavItem.enabled = navItem.enabled;
          initNavItem.name = navItem.name;
        } else {
          navItem.name = oldName;
          navItem.enabled = oldEnabled;
          this.pds.sendNavbarUpdate();
        }
      });
  }

  reset(): void {
    for (let i = 0; i < this.data.navbar.length; i++) {
      this.data.navbar[i] = this.initState[i];
    }
    this.pds.sendNavbarUpdate();
  }
}
