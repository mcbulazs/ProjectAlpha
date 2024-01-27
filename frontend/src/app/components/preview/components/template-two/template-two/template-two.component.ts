import { Component, OnInit } from '@angular/core';
import { PageData } from '../../../../../interfaces/page.data.interface';
import { PageDataService } from '../../../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { getPlaceholders } from '../../../../../utility/utility';

@Component({
  selector: 'app-template-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-two.component.html',
  styleUrl: './template-two.component.scss'
})
export class TemplateTwoComponent implements OnInit {
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
