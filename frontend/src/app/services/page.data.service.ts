import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Article } from '../interfaces/article.interface';
import { PageBasics } from '../interfaces/page.basics.interface';
import { NavItem } from '../interfaces/navitem.interface';
import { Channel } from '../interfaces/channel.interface';
import { PLACEHOLDER_DATA } from '../constants';

export interface TemplateChanger {
  templateID: number,
  path: string
}

export enum ChannelType {
  TWITCH, YOUTUBE
}

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  constructor(private httpClient: HttpClient) { }

  webID!: number;
  data!: PageData;
  preset: number = 0;
  images!: string[];

  placeholderHotline = new Subject<boolean>;
  templateHotline = new Subject<TemplateChanger>;
  navbarUpdateHotline = new Subject<boolean>;

  usePlaceholders: boolean = true;

  currentPreviewPath: string = '';

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
          res.body.progress = PLACEHOLDER_DATA.progress; //! DEFER REMOVE 
          res.body.youtube = PLACEHOLDER_DATA.youtube; //! DEFER REMOVE
          homeNav.enabled = true;
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

  getNavbarUpdateHotline(): Subject<boolean> {
    return this.navbarUpdateHotline;
  }

  changeTemplate(templateID: number, path: string) {
    this.templateHotline.next({ templateID: templateID, path: path });
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.placeholderHotline.next(this.usePlaceholders);
  }

  sendNavbarUpdate() {
    this.navbarUpdateHotline.next(true);
  }

  postArticle(article: Article): Observable<Boolean> {
    return this.httpClient.post<Article>(`${environment.backendURL}/page/${this.webID}/articles`, article,
      {
        withCredentials: true, observe: 'response',
      }).pipe(
        catchError(() => of(null)),
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
        catchError(() => of(null)),
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
        catchError(() => of(null)),
        map(res => {
          if (res === null || res.body === null) return false;
          let oldArticle = this.data.articles.find(x => x.id === res.body?.id);
          if (!oldArticle) return false;
          Object.assign(oldArticle, res.body);
          return true;
        }));
  }

  patchBasics(): Observable<boolean> {
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
        catchError(() => of(null)),
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
        catchError(() => of(null)),
        map(res => {
          if (res === null) return '';
          const imageURL = this.getImage(res.accessurl);
          this.images.push(imageURL);
          return imageURL;
        })
      );
  }

  patchNavbar(): Observable<boolean> {
    return this.httpClient.patch<NavItem[]>(`${environment.backendURL}/page/${this.webID}/navbar`, this.data.navbar,
      {
        withCredentials: true,
      }).pipe(
        catchError(() => of(null)),
        map(res => {
          if (res === null) return false;
          this.data.navbar = res;
          return true;
        }),
      );
  }

  // TODO: Decide how to create and whether the list could be reordered or not
  //! TEMPORARY solution: wrap new channel in a list
  postChannel(channel: Channel, type: ChannelType): Observable<boolean> {
    return this.httpClient.post<Channel[]>(`${environment.backendURL}/page/${this.webID}/${ChannelType[type].toLowerCase()}`, [channel],
      {
        withCredentials: true,
      }).pipe(
        catchError(() => of(null)),
        map(res => {
          if (res === null) return false;
          if (type === ChannelType.TWITCH) {
            let createdChannel = res.find(x => !this.data.twitch.find(y => y.id === x.id));
            if (!createdChannel) return false;
            this.data.twitch.push(createdChannel);
          }
          if (type === ChannelType.YOUTUBE) {
            let createdChannel = res.find(x => !this.data.youtube.find(y => y.id === x.id));
            if (!createdChannel) return false;
            this.data.youtube.push(createdChannel);
          }
          return true;
        })
      );
  }

  patchChannel(channel: Channel, type: ChannelType): Observable<boolean> {
    return this.httpClient.patch<Channel>(`${environment.backendURL}/page/${this.webID}/${ChannelType[type].toLowerCase()}/${channel.id}`, channel,
      {
        withCredentials: true,
      }).pipe(
        catchError(() => of(null)),
        map(res => {
          if (res === null) return false;
          if (type === ChannelType.TWITCH) {
            let index = this.data.twitch.findIndex(x => x.id === res.id);
            this.data.twitch[index] = res; 
          }
          if (type === ChannelType.YOUTUBE) {
            let index = this.data.youtube.findIndex(x => x.id === res.id);
            this.data.youtube[index] = res; 
          }
          return true;
        })
      );
  }

  deleteChannel(id: number, type: ChannelType): Observable<boolean> {
    return this.httpClient.delete<any>(`${environment.backendURL}/page/${this.webID}/${ChannelType[type].toLowerCase()}/${id}`,
      {
        withCredentials: true, observe: 'response'
      }).pipe(
        catchError(() => of(null)),
        map(res => {
          if (res) {
            if (type === ChannelType.TWITCH) {
              let deletedIndex = this.data.twitch.findIndex(x => x.id === id)
              this.data.twitch.splice(deletedIndex, 1);
            }
            if (type === ChannelType.YOUTUBE) {
              let deletedIndex = this.data.youtube.findIndex(x => x.id === id)
              this.data.youtube.splice(deletedIndex, 1);
            }
            return true;
          }
          return false;
        })
      );
  }
}
