import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from '../../template/template.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent extends TemplateComponent { }
