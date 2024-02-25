import { Component } from '@angular/core';
import { TemplateComponent } from '../../template/template.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterEnabledPipe } from '../../../../../pipes/filter-enabled.pipe';
import { SafeHtmlPipe } from '../../../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-template-one-rules',
  standalone: true,
  imports: [CommonModule, RouterLink, FilterEnabledPipe, SafeHtmlPipe],
  templateUrl: './template-one-rules.component.html',
  styleUrl: './template-one-rules.component.scss'
})
export class TemplateOneRulesComponent extends TemplateComponent {

}
