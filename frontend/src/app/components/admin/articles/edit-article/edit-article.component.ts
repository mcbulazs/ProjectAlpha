import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Article } from '../../../../interfaces/article.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ARTICLE_CONTENT_MAX_LENGTH, ARTICLE_TITLE_MAX_LENGTH } from '../../../../constants';
import { PageDataService } from '../../../../services/page.data.service';
import { AdminComponent } from '../../admin.component';
import { ArticlesComponent } from '../articles.component';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, CdkTextareaAutosize, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent {

  constructor(public dialogRef: MatDialogRef<ArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: Article, private pds: PageDataService, private snackBar: MatSnackBar) { }

  contentMaxLength = ARTICLE_CONTENT_MAX_LENGTH;
  titleMaxLength = ARTICLE_TITLE_MAX_LENGTH;

  article: Article = {...this.data};

  edit() {
    this.pds.updateArticle(this.article).subscribe(x => {
      this.snackBar.open(`Article ${x ? 'deleted' : 'deletion failed'}!`, '', {
        duration: 2000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
      });
    });
  }
}
