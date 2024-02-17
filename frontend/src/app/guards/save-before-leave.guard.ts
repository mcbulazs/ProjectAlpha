import { CanDeactivateFn } from '@angular/router';
import { GeneralComponent } from '../components/admin/general/general.component';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { map } from 'rxjs';

export const saveBeforeLeaveGuard: CanDeactivateFn<GeneralComponent> = (component, currentRoute, currentState, nextState) => {

  let dialog = inject(MatDialog);
  if (component.navOrderChanged || component.changed) {
    const dialogRef = dialog.open(SaveBeforeLeaveComponent);
    return dialogRef.afterClosed().pipe(
      map(save => {
        if (!save) {
          component.discardChanges();
          return true;
        }
        if (component.navOrderChanged) component.save();
        if (component.changed) component.saveBasics();
        return true;
      })
    );
  }
  return true;
  //return !(component.navOrderChanged || component.changed);
};


@Component({
  selector: 'app-save-before-leave',
  standalone: true,
  imports: [MatDialogTitle, MatDialogActions, MatButton, MatDialogTitle, MatDialogContent, MatDialogClose],
  template: `
  <h1 mat-dialog-title>Changes unsaved</h1>
  <div mat-dialog-content>Do you want to save?</div>
  <div mat-dialog-actions class="buttons">
      <button mat-raised-button color="primary" (click)="keepChanges()">Save</button>
      <button mat-dialog-close mat-button>Discard</button>
  </div>
  `,
  styles: `.buttons {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }`
})
export class SaveBeforeLeaveComponent {

  constructor(public dialogRef: MatDialogRef<any>) { }

  keepChanges() {
    this.dialogRef.close(true);
  }
}