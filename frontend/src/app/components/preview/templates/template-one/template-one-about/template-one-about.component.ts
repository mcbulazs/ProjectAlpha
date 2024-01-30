import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TemplateComponent } from '../../template/template.component';

@Component({
  selector: 'app-template-one-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './template-one-about.component.html',
  styleUrl: './template-one-about.component.scss'
})
export class TemplateOneAboutComponent extends TemplateComponent {

}
