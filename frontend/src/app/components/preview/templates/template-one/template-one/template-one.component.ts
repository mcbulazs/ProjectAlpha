import { Component } from '@angular/core';
import { PageDataService } from '../../../../../services/page.data.service';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent extends TemplateComponent{
  constructor(public override pds: PageDataService) {
    super(pds);
  }
}
