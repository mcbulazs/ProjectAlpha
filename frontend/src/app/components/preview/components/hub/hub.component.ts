import { AfterViewInit, Component, ComponentRef, OnDestroy, ViewContainerRef, inject } from '@angular/core';
import { COMPONENTS } from '../../components';
import { DataService } from '../../../../services/data.service';
import { Data } from '../../interfaces/data.interface';
import { Subscription } from 'rxjs';
import { DevtoolsComponent } from '../devtools/devtools.component';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [DevtoolsComponent],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})


export class HubComponent implements AfterViewInit, OnDestroy {

  constructor(private dataService: DataService) {}
  
  vcr = inject(ViewContainerRef);
  ref!: ComponentRef<any>;

  /* data: Data = {
    articles: [],
    component: 0,
    logo: "",
    menu: [],
    tgf: false,
    twitch: ""
  }; */

  data!: Data;

  sub!: Subscription;

  ngAfterViewInit(): void {
    this.dataService.getData().subscribe(data => {
      console.log("Got data!");
      this.data = data;
      this.setComponent(this.data.component)
    })
    this.sub = this.dataService.componentChangerDev().subscribe(x => {
      this.setComponent(x);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setComponent(n: number) {
    if (this.ref) {
      const index = this.vcr.indexOf(this.ref.hostView);
    if (index != -1) this.vcr.remove(index);
    }
    this.ref = this.vcr.createComponent<any>(COMPONENTS[n]);
    this.ref.changeDetectorRef.detectChanges();
  }
}
