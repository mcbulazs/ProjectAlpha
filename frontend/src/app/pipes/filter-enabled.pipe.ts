import { Pipe, PipeTransform } from '@angular/core';
import { NavItem } from '../interfaces/navitem.interface';

@Pipe({
  name: 'filterEnabled',
  standalone: true,
})
export class FilterEnabledPipe implements PipeTransform {

  transform(navbar: NavItem[], ...args: unknown[]): NavItem[] {    
    return navbar.filter(x => x.enabled);
  }

}
