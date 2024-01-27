import { Component, NgIterable, OnDestroy, OnInit } from '@angular/core';
import { PageDataService } from '../../../../../services/page.data.service';
import { PageData } from '../../../../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER_DATA } from '../../../../../utility/utility';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent implements OnInit, OnDestroy {
  constructor(private pds: PageDataService) {}

  data!: PageData;

  PLACEHOLDERS = PLACEHOLDER_DATA;
  usePlaceholders: boolean = true;
  hotlineSub!: Subscription;

  ngOnInit(): void {
    this.data = this.pds.localData;
    this.usePlaceholders = this.pds.usePlaceholders;
    this.pds.getData().subscribe(x => {
      console.log("Template got");
      this.data = x;
    });
    this.hotlineSub = this.pds.placeholderHotline().subscribe(x => {
      this.usePlaceholders = x;
    });
  }

  ngOnDestroy(): void {
    this.hotlineSub.unsubscribe();
  }

  getDefault(field: string): string | any[] | NgIterable<any> {
    console.log("call", field);
    
    let d = this.data as any
    if (Array.isArray(d[field])) return d[field].length === 0 ? this.PLACEHOLDERS[field] : d[field]
    return d[field] === '' ? this.PLACEHOLDERS[field] : d[field]
  }
}
