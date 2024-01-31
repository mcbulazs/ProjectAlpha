import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ArticlesComponent } from '../articles.component';
import { PageDataService } from '../../../../services/page.data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-article',
  standalone: true,
  imports: [MatDialogTitle, MatDialogActions, MatButton, MatDialogTitle, MatDialogContent],
  templateUrl: './delete-article.component.html',
  styleUrl: './delete-article.component.scss'
})
export class DeleteArticleComponent {
  constructor(public dialogRef: MatDialogRef<ArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: number, private pds: PageDataService, private snackBar: MatSnackBar) { }
  deleteArticle() {
    this.pds.deleteArticle(this.data).subscribe(x => {
      this.snackBar.open(`Article ${x ? 'deleted' : 'deletion failed'}!`, '', {
        duration: 2000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
      });
    })
  }
}
