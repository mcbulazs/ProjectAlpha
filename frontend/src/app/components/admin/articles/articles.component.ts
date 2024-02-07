import { Component, OnInit } from '@angular/core';
import { CreateArticleComponent } from './create-article/create-article.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Article } from '../../../interfaces/article.interface';
import { MatList, MatListItem, MatListItemIcon, MatListItemLine, MatListItemMeta, MatListItemTitle } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { DeleteArticleComponent } from './delete-article/delete-article.component';
import { EditArticleComponent } from './edit-article/edit-article.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, MatButton, MatPaginatorModule, MatList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta, MatIconButton],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService) { }

  pageSizeOptions = [5, 10, 20, 30];
  pageSize = 5;
  length = 0;
  pageIndex = 0;

  displayedArticles: Article[] = [];

  ngOnInit(): void {
    this.setDisplayedArticles();
  }

  setDisplayedArticles() {
    this.length = this.pds.data.articles.length
    this.displayedArticles = this.pds.data.articles.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  pageEventHandler(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex
    this.setDisplayedArticles();
  }

  createArticle() {
    const dialogRef = this.dialog.open(CreateArticleComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDisplayedArticles();
    });
  }

  editArticle(article: Article) {
    const dialogRef = this.dialog.open(EditArticleComponent, {
      width: '500px',
      data: article,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDisplayedArticles();
    });
  }

  deleteArticle(id: number) {
    const dialogRef = this.dialog.open(DeleteArticleComponent, {
      width: '200px',
      data: id,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDisplayedArticles();
    });
  }
}
