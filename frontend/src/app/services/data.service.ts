import { Injectable } from '@angular/core';
import { Observable, Subject, delay, map, of } from 'rxjs';
import { Data } from '../components/preview/interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  devTool: Subject<number>;

  constructor() {
    this.devTool = new Subject<number>;
  }

  data: Data | undefined;

  mockData: Data[] = [
    {
      articles: [
        {
          author: "admin",
          title: "Lement a full norm",
          content: "Végre valahára lement az a ***** garrosh norm ezekkel a gyökerekkel",
          created: Date.now().toString(),
          id: "article1"
        },
        {
          author: "admin",
          title: "Gyökereket felveszünk",
          content: "Bagnon legyen meg masterys gear, a többi nem számít.",
          created: Date.now().toString(),
          id: "article1"
        },
        {
          author: "Lorem",
          title: "Lorem ipsum",
          content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla molestias doloribus hic consequuntur odit, deleniti illum voluptatem? Numquam mollitia, quasi, vel labore at tempore officiis ad quibusdam nihil voluptate culpa.
          Consequuntur laborum architecto eos voluptas enim dicta praesentium autem soluta, quod nulla tempore. Eligendi dolores magnam consectetur soluta animi. Molestiae ea vitae error provident unde ullam praesentium animi cupiditate illum.
          Non ducimus nam enim natusanditiis doloribus labore totam ex necessitatibus asperiores maxime qui modi! Eaque natus harum blanditiis dolor enim ullam tempora architecto? Debitis molestias reprehenderit expedita non esse?`,
          created: Date.now().toString(),
          id: "article1"
        }
      ],
      component: 0,
      logo: "https://sonceri.art/assets/images/guildhorde-e1c30f3383cfd8415881298f02be1999.png",
      menu: [
        "Home", "Clips", "About us", "Contact"
      ],
      tgf: ["warrior", "druid", "monk", "hunter", "warlock", "demonhunter", "shaman", "priest", "deathknight", "evoker", "paladin", "rogue", "mage"],
      twitch: "https://twitch.com",
      sitename: "Legkedvesebb magyar guild",
      banner: "https://getwallpapers.com/wallpaper/full/0/7/e/998767-large-horde-wallpaper-3840x1080-mobile.jpg",
      progress: [
        {raid: "SoO Normal", progress: "14/14"},
        {raid: "SoO Heroic", progress: "1/14"},
      ]
    }
  ]

  getData(): Observable<Data> {
    return of(this.mockData[0]).pipe(
      map(x => {
        this.data = x;
        return this.data
      })
    );
  }

  componentChangerDev(): Subject<number> {
    return this.devTool;
  }

  sendComponentChange(n: number) {    
    this.devTool.next(n);
  }
}
