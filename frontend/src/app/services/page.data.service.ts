import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';
import { PLACEHOLDER_DATA } from '../constants';
import { PageBasics } from '../interfaces/page.basics.interface';

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
  images!: string[];

  placeholderHotline = new Subject<boolean>;
  templateHotline = new Subject<TemplateChanger>;

  usePlaceholders: boolean = true;

  currentPreviewPath: string = '';

  getData(): Observable<boolean> {
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`,
    {
      withCredentials: true, observe: 'response',
    }).pipe(map(res => {
      if (res.status === 200 && res.body) {
        this.data = res.body;
        this.data.backgroundColor = '#333333';
        console.log("Page data is ready!");
        return true;
      }
      return false;
    }))
  }

  getImages(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.backendURL}/page/${this.webID}/files`,
    {
      withCredentials: true,
    }).pipe(
      catchError(() => []),
      map(res => {
        this.images = res.map(x => this.getImage(x));
        return this.images;
      })
    );
  }

  deleteImage(image: string): Observable<boolean> {
    return this.httpClient.delete<any>(image,
    {
      withCredentials: true,
    }).pipe(
      catchError(() => of(null)),
      map(res => {
        if (res === null) return false;
        let deletedIndex = this.images.indexOf(image);
        this.images.splice(deletedIndex, 1);
        return true;
      })
    );
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

  createArticle(article: Article): Observable<Boolean> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article,
    {
      withCredentials: true, observe: 'response',
    }).pipe(
      catchError(() => of(false)),
      map(res => {
        if (typeof res === 'boolean' || res.body === null) return false;
        this.data.articles.unshift(res.body);
        return true;
      }));
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/${this.webID}/articles/${id}`,
    {
      withCredentials: true, observe: 'response'
    }).pipe(
      catchError(() => of(false)),
      map(res => {
        if (res) {
          let deletedIndex = this.data.articles.findIndex(x => x.id === id)
          this.data.articles.splice(deletedIndex, 1);
          return true;
        }
        return false;
      })
    );
  }

  updateArticle(article: Article): Observable<boolean> {
    return this.httpClient.patch<Article>(`${environment.backendURL}/page/${this.webID}/articles/${article.id}`, article,
    {
      withCredentials: true, observe: 'response'
    }).pipe(
      catchError(() => of(false)),
      map(res => {
        if (typeof res === 'boolean' || res.body === null) return false;
        let oldArticle = this.data.articles.find(x => x.id === res.body?.id);
        if (!oldArticle) return false;
        Object.assign(oldArticle, res.body);
        return true;
      }));
  }

  updateBasics(): Observable<boolean> {
    const pageBasics: PageBasics = {
      id: this.webID,
      title: this.data.title,
      templateid: this.data.templateid,
      logo: this.data.logo,
      banner: this.data.banner,
    }
    return this.httpClient.patch<PageBasics>(`${environment.backendURL}/page/${this.webID}`, pageBasics,
    {
      withCredentials: true,
    }).pipe(
      catchError(() => of(false)),
      map(res => {
        if (typeof res === 'boolean') return false;
        return true;
      }),
    );
  }

  getImage(imagePath: string): string {
    return `${environment.backendURL}/page/${this.webID}/files/${imagePath}`;
  }

  uploadFile(file: File): Observable<string> {
    return this.httpClient.post<any>(`${environment.backendURL}/page/${this.webID}/files`, file,
    {
      withCredentials: true,
    }).pipe(
      catchError(() => of(null)),
      map(res => {
        if (res === null) return '';
        const imageURL = this.getImage(res.accessurl);
        this.images.push(imageURL);
        return imageURL;
      })
    );
  }
}
