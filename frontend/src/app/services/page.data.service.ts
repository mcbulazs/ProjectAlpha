import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  hotline: Subject<boolean>;
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
    this.hotline = new Subject<boolean>;
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
        this.localData = {...this.data!}
        this.init = false;
      }
      return this.localData;
    }))
  }

  placeholderHotline(): Subject<boolean> {
    return this.hotline;
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.hotline.next(this.usePlaceholders);
  }

  createArticle(article: Article): Observable<Article> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article, {
      withCredentials: true,
    })
  }
}
