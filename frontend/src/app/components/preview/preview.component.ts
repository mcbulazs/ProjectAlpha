import { Component } from '@angular/core';
import { HubComponent } from './hub/hub.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [HubComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent { }
