import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageData } from '../../../../interfaces/page.data.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { PLACEHOLDER_DATA } from '../../../../utility/utility';
import { PREVIEW_MODE } from '../../../../../main';

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
  PREVIEWMODE = PREVIEW_MODE;
  usePlaceholders: boolean = true;
  hotlineSub!: Subscription;


  ngOnInit(): void {
    this.data = this.pds.localData;
    this.usePlaceholders = this.pds.usePlaceholders;
    this.pds.getData().subscribe(x => {
      this.data = x;
    });
    this.hotlineSub = this.pds.getPlaceholderHotline().subscribe(x => {
      this.usePlaceholders = x;
    });
  }

  changeTemplate(path: string) {
    this.pds.currentPreviewPath = path;
    this.pds.changeTemplate(this.data.presetId, path);
  }

  ngOnDestroy(): void {
    this.hotlineSub.unsubscribe();
  }
}