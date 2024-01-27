import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  devTool: Subject<number>;
  hotline: Subject<boolean>;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.devTool = new Subject<number>;
    this.hotline = new Subject<boolean>;
  }

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

  usePlaceholders: boolean = true;
  init = true;

  getData(): Observable<PageData> {
    if (!this.init) return of(this.localData);
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.authService.webID}`, {
      withCredentials: true,
    }).pipe(map(res => {
      res.presetId = 0; //! DEFER REMOVE
      res.title = "";
      this.data = res;
      if (this.init) {
        console.log("Overwritten");
        this.localData = {...this.data!}
        this.init = false;
      }
      return this.localData;
    }))
  }

  componentChangerDev(): Subject<number> {
    return this.devTool;
  }

  sendComponentChange(n: number) {    
    this.devTool.next(n);
  }

  placeholderHotline(): Subject<boolean> {
    return this.hotline;
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.hotline.next(this.usePlaceholders);
  }
}
