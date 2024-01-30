import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateOneComponent } from './templates/template-one/template-one/template-one.component';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [RouterModule, TemplateOneComponent, MatFabButton, MatIcon],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent { }
