import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../../../services/page.data.service';
import { PageData } from '../../../../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER_DATA } from '../../../../../utility/utility';

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

  DEFAULT = PLACEHOLDER_DATA;

  ngOnInit(): void {
    this.data = this.pds.localData;
    this.pds.getData().subscribe(x => {
      this.data = x;
    });
  }
}
