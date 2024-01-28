import { Component } from '@angular/core';
import { PageDataService } from '../../../../services/page.data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-devtools',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './devtools.component.html',
  styleUrl: './devtools.component.scss'
})
export class DevtoolsComponent {
  constructor(private dataService: PageDataService) {}

  setComponent(n: number) {
    this.dataService.sendComponentChange(n);
  }
}
