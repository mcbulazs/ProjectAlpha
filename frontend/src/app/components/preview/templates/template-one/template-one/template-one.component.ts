import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from '../../template/template.component';
import { RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [CommonModule, RouterLink, QuillModule],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent extends TemplateComponent { }
