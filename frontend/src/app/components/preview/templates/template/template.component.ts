import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageData } from '../../../../interfaces/page.data.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { PLACEHOLDER_DATA } from '../../../../utility/utility';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export abstract class TemplateComponent implements OnInit, OnDestroy {
  constructor(public pds: PageDataService) {}

  data!: PageData;

  PLACEHOLDERS = PLACEHOLDER_DATA;
  usePlaceholders: boolean = true;
  hotlineSub!: Subscription;

  ngOnInit(): void {
    this.data = this.pds.localData;
    this.usePlaceholders = this.pds.usePlaceholders;
    this.pds.getData().subscribe(x => {
      this.data = x;
    });
    this.hotlineSub = this.pds.placeholderHotline().subscribe(x => {
      this.usePlaceholders = x;
    });
  }

  ngOnDestroy(): void {
    this.hotlineSub.unsubscribe();
  }
}