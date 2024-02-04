import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ARTICLE_CONTENT_MAX_LENGTH, ARTICLE_TITLE_MAX_LENGTH, MAT_SNACKBAR_CONFIG } from '../../../../constants';
import { Article } from '../../../../interfaces/article.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { AdminComponent } from '../../admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, CdkTextareaAutosize, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent {

  constructor(public dialogRef: MatDialogRef<AdminComponent>, private pds: PageDataService, private snackBar: MatSnackBar) { }

  contentMaxLength = ARTICLE_CONTENT_MAX_LENGTH;
  titleMaxLength = ARTICLE_TITLE_MAX_LENGTH;

  article: Article = {
    id: -1,
    content: '',
    date: '',
    title: '',
  };

  // TODO: validation for input length AND remove date setting when it is done at backend
  create() {
    if (this.article.content === '' || this.article.title === '') return;
    if (this.article.content.length > ARTICLE_CONTENT_MAX_LENGTH || this.article.title.length > ARTICLE_TITLE_MAX_LENGTH) return;
    let date = new Date();
    this.article.date = date.toISOString();
    this.pds.createArticle(this.article).subscribe(x => {
      this.snackBar.open(`Article ${x ? 'created' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }
}
