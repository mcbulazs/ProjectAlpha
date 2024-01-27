import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageDataService } from '../../../../../services/page.data.service';
import { PageData } from '../../../../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER_DATA, getPlaceholders } from '../../../../../utility/utility';
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

  placeholderSub!: Subscription;

  ngOnInit(): void {
    this.data = this.pds.data!;
    if (this.pds.usePlaceholders) getPlaceholders(this.data);
    this.placeholderSub = this.pds.placeholderHotline().subscribe(x => {
      if (x) this.data = getPlaceholders(this.data);
      else this.getPageData();
    });
  }

  getPageData() {
    this.pds.getData().subscribe(data => {
      this.data = data;
    })
  }

  ngOnDestroy(): void {
    this.placeholderSub.unsubscribe();
  }
}
