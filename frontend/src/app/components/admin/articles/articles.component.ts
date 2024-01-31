import { Component, OnInit } from '@angular/core';
import { CreateArticleComponent } from './create-article/create-article.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PageDataService } from '../../../services/page.data.service';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Article } from '../../../interfaces/article.interface';
import { MatList, MatListItem, MatListItemIcon, MatListItemLine, MatListItemMeta, MatListItemTitle, MatListModule } from '@angular/material/list';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { DeleteArticleComponent } from './delete-article/delete-article.component';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, MatButton, MatPaginatorModule, MatList, MatListItem, MatIcon, MatListItemTitle, MatListItemIcon, MatListItemLine, MatListItemMeta, MatIconButton],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService) { }

  data = this.pds.localData;

  pageSizeOptions = [5, 10, 20, 30];
  pageSize = 5;
  length = this.data.articles.length
  pageIndex = 0;

  displayedArticles: Article[] = [];

  ngOnInit(): void {
    this.setDisplayedArticles();
  }

  setDisplayedArticles() {
    this.displayedArticles = this.data.articles.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  pageEventHandler(e: PageEvent) {
    console.log(e);
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex
    this.setDisplayedArticles();
  }

  addArticle() {
    const dialogRef = this.dialog.open(CreateArticleComponent, {
      width: '500px',
    });
  }

  deleteArticle(id: number) {
    const dialogRef = this.dialog.open(DeleteArticleComponent, {
      width: '200px',
      data: id,
    });
  }
}
