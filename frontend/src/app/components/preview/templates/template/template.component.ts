import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageData } from '../../../../interfaces/page.data.interface';
import { HotlineMessageType, PageDataService } from '../../../../services/page.data.service';
import { PREVIEW_MODE } from '../../../../../main';
import { CHANNEL_TYPES, PLACEHOLDER_DATA } from '../../../../constants';
import { PRESETS, Preset } from '../../templates';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [],
  template: '',
  styles: '',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export abstract class TemplateComponent implements OnInit, OnDestroy {

  constructor(public pds: PageDataService, public router: Router, private el: ElementRef) { }

  data!: PageData;
  preset!: Preset;

  PLACEHOLDERS = PLACEHOLDER_DATA;
  PREVIEWMODE = PREVIEW_MODE;
  usePlaceholders!: boolean;
  recruitmentEmpty: boolean = false;
  public channelTypes: any = CHANNEL_TYPES;

  private subs = new Subscription();

  ngOnInit(): void {
    this.data = this.pds.data;
    this.preset = PRESETS[this.pds.data.presetid];

    let style = document.createElement('style');
    style.innerHTML = "app-preview{" + this.data.customcss + "}";
    this.el.nativeElement.appendChild(style);

    this.usePlaceholders = this.pds.usePlaceholders;
    this.subs.add(this.pds.getPlaceholderHotline().subscribe(message => {
      if (message.type === HotlineMessageType.TOGGLE) this.usePlaceholders = message.message;
      if (message.type === HotlineMessageType.RECRUITMENT_CHECK) {
        this.preset = PRESETS[this.pds.data.presetid];
        this.recruitmentEmptyCheck();
      }
      if (message.type === HotlineMessageType.CSS_UPDATE) {
        style.innerHTML = "app-preview{" + this.data.customcss + "}";
      }
    }));
    this.subs.add(this.pds.getNavbarUpdateHotline().subscribe(() => {
      this.data.navbar = [...this.pds.data.navbar];
    }));
    this.recruitmentEmptyCheck();
  }

  changeTemplate(path: string) {
    this.pds.currentPreviewPath = path;
    this.pds.changeTemplate(this.data.templateid, path);
  }

  recruitmentEmptyCheck(): boolean {
    this.recruitmentEmpty = this.data.recruitment.every(x => x.subclasses.length === 0);
    return this.recruitmentEmpty;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}