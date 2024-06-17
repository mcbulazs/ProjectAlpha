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
import { CKEDITOR_CONFIG, MAT_SNACKBAR_CONFIG, UploadAdapterPlugin } from '../../../../constants';
import { PageDataService } from '../../../../services/page.data.service';
import { ArticlesComponent } from '../articles.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from '../../../../../../ckeditor5-custom-build/ckeditor';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, CdkTextareaAutosize, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.scss'
})
export class EditArticleComponent {

  constructor(public dialogRef: MatDialogRef<ArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: Article, private pds: PageDataService, private snackBar: MatSnackBar) { }

  titleMaxLength = 150;
  contentMaxLength = 20000;

  article: Article = { ...this.data };

  public Editor: any = Editor;
  editorConfig = CKEDITOR_CONFIG;
  onReady(editor: any) {
    UploadAdapterPlugin(editor, this.pds);
  }

  update() {
    if (this.article.title === this.data.title && this.article.content === this.data.content) return;
    if (this.article.content === '' || this.article.title === '') return;
    if (this.article.title.length > this.titleMaxLength) return;
    this.pds.patchArticle(this.article).subscribe(success => {
      this.snackBar.open(`Article ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
