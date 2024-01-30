import { Component, ComponentRef, OnDestroy, OnInit, ViewContainerRef, inject } from '@angular/core';
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
  vcr = inject(ViewContainerRef);
  ref!: ComponentRef<any>;

  data!: PageData;
  templateChanger!: Subscription;

  constructor(private pds: PageDataService) {}

  ngOnInit(): void {
    this.data = this.pds.localData;
    this.setComponent(this.data.presetId, '');
    this.templateChanger = this.pds.getTemplateHotline().subscribe(x => {
      this.setComponent(x.templateID, x.path);
    })
  }

  ngOnDestroy(): void {
    this.templateChanger.unsubscribe();
  }

  setComponent(n: number, page: string) {
    if (this.ref) {
      const index = this.vcr.indexOf(this.ref.hostView);
    if (index != -1) this.vcr.remove(index);
    }
    this.ref = this.vcr.createComponent<any>(TEMPLATES[n][page]);
    this.ref.changeDetectorRef.detectChanges();
  }
}
