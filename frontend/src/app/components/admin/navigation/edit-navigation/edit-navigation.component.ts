import { Component, Inject, OnInit } from '@angular/core';
import { PageDataService } from '../../../../services/page.data.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { NavItem } from '../../../../interfaces/navitem.interface';
import { GeneralComponent } from '../../general/general.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_SNACKBAR_CONFIG } from '../../../../constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-navigation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogTitle, MatDialogClose, MatDialogActions, MatButton, MatDialogContent, MatInput, MatFormField, MatLabel, MatCheckbox],
  templateUrl: './edit-navigation.component.html',
  styleUrl: './edit-navigation.component.scss'
})
export class EditNavigationComponent implements OnInit {

  constructor(private pds: PageDataService, public dialogRef: MatDialogRef<GeneralComponent>, @Inject(MAT_DIALOG_DATA) public data: NavItem, private snackBar: MatSnackBar) { }

  navitem!: NavItem;

  ngOnInit(): void {
    this.navitem = this.data;
  }

  save() {
    if (this.navitem.name === '') return; // TODO: Display error when saving empty
    if (this.navitem.path === '') this.navitem.enabled = true; // Ensuring that home page remains enabled
    this.pds.patchNavbar().subscribe(success => {
      this.snackBar.open(`Navigation update${success ? 'd' : ' failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close(true);
    });
  }

  togglePage() {
    this.pds.sendNavbarUpdate();
  }
}
