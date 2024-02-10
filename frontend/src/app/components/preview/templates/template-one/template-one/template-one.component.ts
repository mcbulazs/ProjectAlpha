import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from '../../template/template.component';
import { RouterLink } from '@angular/router';
import { FilterEnabledPipe } from "../../../../../pipes/filter-enabled.pipe";

@Component({
    selector: 'app-template-one',
    standalone: true,
    templateUrl: './template-one.component.html',
    styleUrl: './template-one.component.scss',
    imports: [CommonModule, RouterLink, FilterEnabledPipe]
})
export class TemplateOneComponent extends TemplateComponent { }
