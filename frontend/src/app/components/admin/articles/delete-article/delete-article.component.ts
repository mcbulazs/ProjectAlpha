import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ArticlesComponent } from '../articles.component';
import { PageDataService } from '../../../../services/page.data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-article',
  standalone: true,
  imports: [MatDialogModule ,MatButtonModule, MatDialogActions], //TODO: OPTIMIZE IMPORTS
  templateUrl: './delete-article.component.html',
  styleUrl: './delete-article.component.scss'
})
export class DeleteArticleComponent {
  constructor(public dialogRef: MatDialogRef<ArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: number, private pds: PageDataService, private snackBar: MatSnackBar) {}
  deleteArticle() {
    this.pds.deleteArticle(this.data).subscribe(x => {
      console.log(x);
      
      this.snackBar.open(`Article ${x ? 'deleted' : 'deletion failed'}!`, '', {
        duration: 2000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
      });
    })
  }
}
