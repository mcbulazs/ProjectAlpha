import { Component, ComponentRef, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TEMPLATES } from '../components';
import { PageData } from '../../../interfaces/page.data.interface';
import { PageDataService } from '../../../services/page.data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss'
})
export class HubComponent implements OnInit, OnDestroy {

  constructor(private pds: PageDataService, private vcr: ViewContainerRef) { }

  data!: PageData;
  private subs = new Subscription();
  private component!: ComponentRef<any>;

  ngOnInit(): void {
    this.data = this.pds.data;
    this.setComponent(this.data.presetId, '');
    this.subs.add(this.pds.getTemplateHotline().subscribe(x => {
      this.setComponent(x.templateID, x.path);
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setComponent(n: number, page: string) {
    if (this.component) {
      const index = this.vcr.indexOf(this.component.hostView);
      if (index != -1) this.vcr.remove(index);
    }
    this.component = this.vcr.createComponent<any>(TEMPLATES[n][page]);
  }
}
