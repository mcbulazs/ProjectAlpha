import { Component } from '@angular/core';
import { HubComponent } from './hub/hub.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [HubComponent],
  template: '<app-hub></app-hub>',
})
export class PreviewComponent { }
