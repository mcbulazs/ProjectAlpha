import { AfterViewInit, Component, ComponentRef, OnDestroy, ViewContainerRef, inject } from '@angular/core';
import { COMPONENTS } from '../../components';
import { PageDataService } from '../../../../services/page.data.service';
import { PageData } from '../../../../interfaces/page.data.interface';
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

  constructor(private pds: PageDataService) {}
  
  vcr = inject(ViewContainerRef);
  ref!: ComponentRef<any>;

  data!: PageData;
  sub!: Subscription;

  ngAfterViewInit(): void {
    this.data = this.pds.localData;
    this.pds.getData().subscribe(x => {
      this.data = x;
    })
    this.setComponent(this.data.presetId);
    this.sub = this.pds.componentChangerDev().subscribe(x => {
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
