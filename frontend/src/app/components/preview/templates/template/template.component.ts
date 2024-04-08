import { Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageData } from '../../../../interfaces/page.data.interface';
import { HotlineMessageType, PageDataService } from '../../../../services/page.data.service';
import { PREVIEW_MODE } from '../../../../../main';
import { CHANNEL_TYPES, PLACEHOLDER_DATA } from '../../../../constants';
import { PRESETS, Preset } from '../../templates';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [],
  template: '',
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

  tagElement: any;

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
    this.displayTags = this.displayTags.bind(this);
    document.addEventListener('mouseover', this.displayTags);
  }

  displayTags(e: any) {
    if (this.tagElement && e.target === this.tagElement) return;
    if (this.tagElement) this.tagElement.remove();
    if (!e.target.closest("app-preview > *:nth-child(2)")) return;
    if (this.router.url !== '/admin/settings') return;

    this.tagElement = document.createElement('div');
    this.tagElement.style.cssText = 'top: 0; left: 0; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; position: absolute; color: #111; font-size: 20px; font-weight: bold; background-color: rgba(255, 255, 255, 0.7);';
    this.tagElement.className = 'custom-hover';
    this.tagElement.innerHTML = `${e.target.tagName.toLowerCase()}${e.target.className.length > 0 ? `.${e.target.className.split(" ")[0]}` : ''}`;
    this.tagElement.style.pointerEvents = 'none';
    if (e.target.contains(this.tagElement)) return;
    e.target.appendChild(this.tagElement);
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
    document.removeEventListener('mouseover', this.displayTags);
    this.subs.unsubscribe();
  }
}