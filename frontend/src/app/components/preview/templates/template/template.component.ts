import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageData } from '../../../../interfaces/page.data.interface';
import { PageDataService } from '../../../../services/page.data.service';
import { PREVIEW_MODE } from '../../../../../main';
import { PLACEHOLDER_DATA } from '../../../../constants';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [QuillModule],
  template: '',
  styles: '',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export abstract class TemplateComponent implements OnInit, OnDestroy {

  constructor(public pds: PageDataService) { }

  data!: PageData;

  PLACEHOLDERS = PLACEHOLDER_DATA;
  PREVIEWMODE = PREVIEW_MODE;
  usePlaceholders!: boolean;

  private subs = new Subscription();

  ngOnInit(): void {
    this.data = this.pds.data;
    this.usePlaceholders = this.pds.usePlaceholders;
    this.subs.add(this.pds.getPlaceholderHotline().subscribe(command => {
      this.usePlaceholders = command;
    }));
  }

  changeTemplate(path: string) {
    this.pds.currentPreviewPath = path;
    this.pds.changeTemplate(this.data.templateid, path);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}