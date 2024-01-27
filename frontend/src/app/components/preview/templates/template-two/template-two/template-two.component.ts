import { Component } from '@angular/core';
import { PageDataService } from '../../../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { TemplateOneComponent } from '../../template-one/template-one/template-one.component';

@Component({
  selector: 'app-template-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-two.component.html',
  styleUrl: './template-two.component.scss'
})
export class TemplateTwoComponent extends TemplateOneComponent {
  constructor(public override pds: PageDataService) {
    super(pds)
  }
}