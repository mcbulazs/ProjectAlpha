import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';
import { PageBasics } from '../interfaces/page.basics.interface';
import { NavItem } from '../interfaces/navitem.interface';
import { Channel } from '../interfaces/channel.interface';
import { PRESETS } from '../components/preview/components';
import { Progress } from '../interfaces/progress.interface';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export interface TemplateChanger {
  templateID: number,
  path: string
}

export interface HotlineMessage {
  type: HotlineMessageType
  message: any
}

export enum HotlineMessageType {
  TOGGLE, RECRUITMENT_CHECK, CSS_UPDATE
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) { }

  webID!: number;
  data!: PageData;
  images!: string[];

  placeholderHotline = new Subject<HotlineMessage>;
  templateHotline = new Subject<TemplateChanger>;
  navbarUpdateHotline = new Subject<boolean>;

  usePlaceholders: boolean = true;

  currentPreviewPath: string = '';

  errorHandler(error: Response): Observable<null> {
    if (error.status === 0) {
      this.authService.isLoggedIn = false;
      this.router.navigateByUrl('');
    }
    return of(null);
  }

  imageInUse(image: string): boolean {
    let subject = JSON.stringify(this.data);
    let pattern = JSON.stringify(image);
    return subject.includes(pattern);
  }

  getData(): Observable<boolean> {
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.webID}`,
      {
        withCredentials: true, observe: 'response',
      }).pipe(map(res => {
        if (res.status === 200 && res.body) {
          let homeNav = res.body.navbar.find(x => x.path === '')!;
          homeNav.enabled = true;
          this.data = res.body;
          if (this.data.recruitment.length === 0) {
            this.setRecruitment();
          }
          console.log("Page data is ready!");
          return true;
        }
        return false;
      }));
  }

  setRecruitment() {
    PRESETS[this.data.presetid].classes.map(c => {
      this.data.recruitment.push({
        id: -1,
        class: c.class,
        subclasses: [],
      });
    });
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
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          let deletedIndex = this.images.indexOf(image);
          this.images.splice(deletedIndex, 1);
          return true;
        })
      );
  }

  getPlaceholderHotline(): Subject<HotlineMessage> {
    return this.placeholderHotline;
  }

  getTemplateHotline(): Subject<TemplateChanger> {
    return this.templateHotline;
  }

  getNavbarUpdateHotline(): Subject<boolean> {
    return this.navbarUpdateHotline;
  }

  changeTemplate(templateID: number, path: string) {
    this.templateHotline.next({ templateID: templateID, path: path });
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.placeholderHotline.next({
      type: HotlineMessageType.TOGGLE,
      message: this.usePlaceholders,
    });
  }

  sendRecruitmentCheck() {
    this.placeholderHotline.next({
      type: HotlineMessageType.RECRUITMENT_CHECK,
      message: null,
    });
  }

  sendCssUpdate() {
    this.placeholderHotline.next({
      type: HotlineMessageType.CSS_UPDATE,
      message: null,
    });
  }

  sendNavbarUpdate() {
    this.navbarUpdateHotline.next(true);
  }

  postArticle(article: Article): Observable<Boolean> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article,
      {
        withCredentials: true, observe: 'response',
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null || res.body === null) return false;
          this.data.articles.unshift(res.body);
          return true;
        }));
  }

  deleteArticle(id: number): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/${this.webID}/articles/${id}`,
      {
        withCredentials: true, observe: 'response'
      }).pipe(
        catchError(err => this.errorHandler(err)),
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

  patchArticle(article: Article): Observable<boolean> {
    return this.httpClient.patch<Article>(`${environment.backendURL}/page/${this.webID}/articles/${article.id}`, article,
      {
        withCredentials: true, observe: 'response'
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null || res.body === null) return false;
          let oldArticle = this.data.articles.find(x => x.id === res.body?.id);
          if (!oldArticle) return false;
          Object.assign(oldArticle, res.body);
          return true;
        }));
  }

  patchTemplate(): Observable<boolean> {
    return this.httpClient.patch<any>(`${environment.backendURL}/page/${this.webID}/template`, {
      templateid: this.data.templateid,
      presetid: this.data.presetid,
    },
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          return true;
        }));
  }

  patchBasics(): Observable<boolean> {
    const pageBasics: PageBasics = {
      title: this.data.title,
      logo: this.data.logo,
      banner: this.data.banner,
    }
    return this.httpClient.patch<PageBasics>(`${environment.backendURL}/page/${this.webID}/general`, pageBasics,
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
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
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return '';
          const imageURL = this.getImage(res.accessurl);
          this.images.push(imageURL);
          return imageURL;
        })
      );
  }

  patchNavbarOrder(): Observable<boolean> {
    return this.httpClient.patch<boolean>(`${environment.backendURL}/page/${this.webID}/navbar`, this.data.navbar.map(x => x.path),
      {
        withCredentials: true,
        observe: 'response',
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          return res?.status === 200;
        }),
      );
  }

  patchNavbarItem(navItem: NavItem): Observable<boolean> {
    return this.httpClient.patch<NavItem>(`${environment.backendURL}/page/${this.webID}/navbar/${navItem.path}`, navItem,
      {
        withCredentials: true,
        observe: 'response',
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          return res?.status === 200;
        }),
      );
  }

  postChannel(channel: Channel): Observable<boolean> {
    return this.httpClient.post<Channel>(`${environment.backendURL}/page/${this.webID}/channels`, channel,
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          this.data.channels.push(res);
          return true;
        })
      );
  }

  patchChannel(channel: Channel): Observable<boolean> {
    return this.httpClient.patch<Channel>(`${environment.backendURL}/page/${this.webID}/channels/${channel.id}`, channel,
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          let index = this.data.channels.findIndex(x => x.id === res.id);
          this.data.channels[index] = res;
          return true;
        })
      );
  }

  deleteChannel(id: number): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/${this.webID}/channels/${id}`,
      {
        withCredentials: true, observe: 'response'
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res) {
            let deletedIndex = this.data.channels.findIndex(x => x.id === id)
            this.data.channels.splice(deletedIndex, 1);
          }
          return res !== null;
        })
      );
  }

  patchChannelOrder(): Observable<boolean> {
    const order = this.data.channels.map(channel => channel.id);
    return this.httpClient.patch<number[]>(`${environment.backendURL}/page/${this.webID}/channels`, order,
      {
        withCredentials: true, observe: 'response',
      }).pipe(
        map(res => res.status === 200),
      );
  }

  patchRules(): Observable<boolean> {
    return this.httpClient.patch<string>(`${environment.backendURL}/page/${this.webID}/rules`, JSON.stringify(this.data.rules),
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => res !== null),
      );
  }

  postProgress(progress: Progress): Observable<boolean> {
    return this.httpClient.post<Progress>(`${environment.backendURL}/page/${this.webID}/progress`, progress,
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          this.data.progress.push(res);
          return true;
        })
      );
  }

  patchProgress(progress: Progress): Observable<boolean> {
    return this.httpClient.patch<Progress>(`${environment.backendURL}/page/${this.webID}/progress/${progress.id}`, progress,
      {
        withCredentials: true,
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res === null) return false;
          let index = this.data.progress.findIndex(x => x.id === res.id);
          Object.assign(this.data.progress[index], res);
          return true;
        })
      );
  }

  deleteProgress(id: number): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/${this.webID}/progress/${id}`,
      {
        withCredentials: true, observe: 'response'
      }).pipe(
        catchError(err => this.errorHandler(err)),
        map(res => {
          if (res) {
            let deletedIndex = this.data.progress.findIndex(x => x.id === id)
            this.data.progress.splice(deletedIndex, 1);
          }
          return res !== null;
        })
      );
  }
}
