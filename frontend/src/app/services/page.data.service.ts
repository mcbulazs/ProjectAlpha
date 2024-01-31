import { Injectable } from '@angular/core';
import { Observable, Subject, map, of, switchMap } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';

export interface TemplateChanger {
  templateID: number,
  path: string
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  placeholderHotline: Subject<boolean>;
  templateHotline: Subject<TemplateChanger>;
  usePlaceholders: boolean = true;
  init = true;
  
  webID!: number;
  data: PageData | undefined;
  
  localData: PageData = {
    articles: [],
    banner: { id: -1, path: "" },
    calendar: [],
    logo: { id: -1, path: ""},
    navbar: [],
    presetId: 0,
    progress: [],
    recruitment: [],
    title: "",
    twitch: [],
    youtube: [],
  }


  constructor(private httpClient: HttpClient) {
    this.placeholderHotline = new Subject<boolean>;
    this.templateHotline = new Subject<TemplateChanger>;
  }

  getData(): Observable<PageData> {
    if (!this.init) return of(this.localData);
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
      withCredentials: true,
    }).pipe(map(res => {
      res.presetId = 0; //! DEFER REMOVE
      res.title = "";
      this.data = res;
      if (this.init) {
        this.data.articles.reverse();
        this.localData = {...this.data!}
        this.init = false;
      }
      return this.localData;
    }))
  }

  getPlaceholderHotline(): Subject<boolean> {
    return this.placeholderHotline;
  }

  getTemplateHotline(): Subject<TemplateChanger> {
    return this.templateHotline;
  }

  changeTemplate(templateID: number, path: string) {
    this.templateHotline.next({templateID: templateID, path: path});
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.placeholderHotline.next(this.usePlaceholders);
  }

  createArticle(article: Article): Observable<Article> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article, {
      withCredentials: true, observe: 'response'
    }).pipe(switchMap(res => {
      if (res.body) {
        this.localData.articles.unshift(res.body);
        return of(res.body);
      }
      return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
        withCredentials: true
      }).pipe(map(x => {
        let createdArticle = x.articles.pop()!
        this.localData.articles.unshift(createdArticle);
        return createdArticle;
      }));
    }));
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.backendURL}/page/articles/${this.webID}`, {
      withCredentials: true, observe: 'response'
    }).pipe(map(res => {
      if (res.status === 200) return true;
      return false;
    }))
  }

  updateArticle(article: Article): Observable<Article> {
    return this.httpClient.patch<Article>(`${environment.backendURL}/page/${this.webID}/${article.id}`, article, {
      withCredentials: true, observe: 'response'
    }).pipe(switchMap(res => {
      if (res.body) {
        let elem = this.localData.articles.find(x => x.id === res.body?.id)!;
        Object.assign(elem, res.body);
        return of(res.body);
      }
      return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`, {
        withCredentials: true
      }).pipe(map(x => {
        let prevArticle = this.localData.articles.find(x => x.id === article.id)!;
        let elem = x.articles.find(item => item.id === article.id)!;
        Object.assign(elem, prevArticle);
        return elem;
      }))
    }));
  }
}
