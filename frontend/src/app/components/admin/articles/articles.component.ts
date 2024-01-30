import { Component, OnInit } from '@angular/core';
import { CreateArticleComponent } from './create-article/create-article.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageDataService } from '../../../services/page.data.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService) {}

  data = this.pds.localData;

  ngOnInit(): void {
    
  }

  addArticle() {
    const dialogRef = this.dialog.open(CreateArticleComponent, {
     width: '500px',
   });
   /* this.snackBar.open('Article added!', undefined, {
     duration: 2000,
     horizontalPosition: 'start',
     verticalPosition: 'bottom',
   }); */
 }
}
