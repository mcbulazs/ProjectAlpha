import { Injectable } from '@angular/core';
import { Observable, Subject, map, of } from 'rxjs';
import { PageData } from '../interfaces/page.data.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { PLACEHOLDER_DATA, getPlaceholders } from '../utility/utility';

@Injectable({
  providedIn: 'root'
})
export class PageDataService {

  devTool: Subject<number>;
  placeholderLine: Subject<boolean>

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.devTool = new Subject<number>;
    this.placeholderLine = new Subject<boolean>;
  }

  data: PageData | undefined;

  usePlaceholders: boolean = false;

  //TODO: implement viewPresetId based on presetId

  getData(): Observable<PageData> {
    return this.httpClient.get<PageData>(`${environment.backendURL}/page/${this.authService.webID}`, {
      withCredentials: true,
    }).pipe(map(res => {
      res.presetId = 0; //! DEFER REMOVE
      this.data = res;
      return res;
    }))
  }

  componentChangerDev(): Subject<number> {
    return this.devTool;
  }

  sendComponentChange(n: number) {    
    this.devTool.next(n);
  }

  // Notifying component of changing to placeholder data
  placeholderHotline(): Subject<boolean> {
    return this.placeholderLine;
  }

  togglePlaceholders() {
    this.usePlaceholders = !this.usePlaceholders;
    this.placeholderLine.next(this.usePlaceholders);
  }
}
