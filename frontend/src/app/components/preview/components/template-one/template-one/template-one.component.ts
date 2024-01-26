import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../services/data.service';
import { Data } from '../../../interfaces/data.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.scss'
})
export class TemplateOneComponent implements OnInit{
  constructor(private dataService: DataService) {}

  data!: Data;

  ngOnInit(): void {
    this.data = this.dataService.data!;
  }
}
