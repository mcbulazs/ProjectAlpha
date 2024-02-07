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
import { ARTICLE_CONTENT_MAX_LENGTH, ARTICLE_TITLE_MAX_LENGTH, MAT_SNACKBAR_CONFIG } from '../../../../constants';
import { PageDataService } from '../../../../services/page.data.service';
import { ArticlesComponent } from '../articles.component';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, QuillModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, CdkTextareaAutosize, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent {

  constructor(public dialogRef: MatDialogRef<ArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: Article, private pds: PageDataService, private snackBar: MatSnackBar) { }

  contentMaxLength = ARTICLE_CONTENT_MAX_LENGTH;
  titleMaxLength = ARTICLE_TITLE_MAX_LENGTH;

  article: Article = { ...this.data };

  update() {
    if (this.article.title === this.data.title && this.article.content === this.data.content) return;
    this.pds.updateArticle(this.article).subscribe(success => {
      this.snackBar.open(`Article ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
