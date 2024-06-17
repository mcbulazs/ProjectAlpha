import { Component } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CKEDITOR_CONFIG, MAT_SNACKBAR_CONFIG, UploadAdapterPlugin } from '../../../../constants';
import { Article } from '../../../../interfaces/article.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { AdminComponent } from '../../admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from '../../../../../../ckeditor5-custom-build/ckeditor';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatError, CdkTextareaAutosize, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent {

  constructor(public dialogRef: MatDialogRef<AdminComponent>, private pds: PageDataService, private snackBar: MatSnackBar) { }

  titleMaxLength = 150;
  contentMaxLength = 20000;

  public Editor: any = Editor;
  editorConfig = CKEDITOR_CONFIG;
  onReady(editor: any) {
    UploadAdapterPlugin(editor, this.pds);
  }

  article: Article = {
    id: -1,
    content: '',
    date: '',
    title: '',
  };

  valid = false;
  contentTooLong = false;

  checkValidity(): void {
    this.valid = !(this.article.content === '' || this.article.title === '' || this.article.title.length > this.titleMaxLength || this.article.content.length > this.contentMaxLength);
    this.contentTooLong = this.article.content.length > this.contentMaxLength;
  }

  create() {
    if (this.article.content === '' || this.article.title === '') return;
    if (this.article.title.length > this.titleMaxLength || this.article.content.length > this.contentMaxLength) return;

    let date = new Date();
    this.article.date = date.toISOString();
    this.pds.postArticle(this.article).subscribe(success => {
      this.snackBar.open(`Article ${success ? 'created' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
