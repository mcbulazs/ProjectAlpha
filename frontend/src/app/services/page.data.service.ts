import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';
import { PLACEHOLDER_DATA } from '../constants';

export interface TemplateChanger {
  templateID: number,
  path: string
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  constructor(private httpClient: HttpClient) { }

  webID!: number;
  data!: PageData;

  placeholderHotline = new Subject<boolean>;
  templateHotline = new Subject<TemplateChanger>;

  usePlaceholders: boolean = true;

  currentPreviewPath: string = '';

  getData(): Observable<boolean> {
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
      withCredentials: true, observe: 'response',
    }).pipe(map(res => {
      if (res.status === 200 && res.body) {
        res.body.presetId = 0; //! DEFER REMOVE
        res.body.navbar = PLACEHOLDER_DATA.navbar;
        res.body.title = "";
        this.data = res.body;
        console.log("Page data is ready!");
        this.data.articles.reverse();
        return true;
      }
      return false;
    }))
  }

  getPlaceholderHotline(): Subject<boolean> {
    return this.placeholderHotline;
  }

  getTemplateHotline(): Subject<TemplateChanger> {
    return this.templateHotline;
  }

  changeTemplate(templateID: number, path: string) {
    this.templateHotline.next({ templateID: templateID, path: path });
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.placeholderHotline.next(this.usePlaceholders);
  }

  // TODO: remove temporary measures when backend is working
  createArticle(article: Article): Observable<Boolean> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article, {
      withCredentials: true, observe: 'response',
    }).pipe(
      catchError(() => of(false)),
      switchMap(res => {
        if (!res) return of(false);
        if (typeof res !== 'boolean' && res.body) {
          this.data.articles.unshift(res.body);
          return of(true);
        }
        return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
          withCredentials: true,
        }).pipe(
          map(x => {
            let createdArticle = x.articles.pop()!
            this.data.articles.unshift(createdArticle);
            return true;
          }));
      }));
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/articles/${id}`, {
      withCredentials: true, observe: 'response'
    }).pipe(
      catchError(() => of(false)),
      map(res => {
        if (res) return true;
        return false;
      })
    );
  }

  // TODO: remove temporary measures when backend is working
  updateArticle(article: Article): Observable<boolean> {
    return this.httpClient.patch<Article>(`${environment.backendURL}/page/${this.webID}/${article.id}`, article, {
      withCredentials: true, observe: 'response'
    }).pipe(
      catchError(() => of(false)),
      switchMap(res => {
        if (!res) return of(false);
        if (typeof res !== 'boolean' && res.body) {
          let elem = this.data.articles.find(x => x.id === res.body?.id)!;
          Object.assign(elem, res.body);
          return of(true);
        }
        //! TEMPORARY
        return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
          withCredentials: true
        }).pipe(
          map(x => {
            let prevArticle = this.data.articles.find(x => x.id === article.id)!;
            let elem = x.articles.find(item => item.id === article.id)!;
            Object.assign(elem, prevArticle);
            return true;
          }));
      }));
  }
}
