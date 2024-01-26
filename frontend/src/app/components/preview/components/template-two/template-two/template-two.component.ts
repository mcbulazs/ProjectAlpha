import { Component, OnInit } from '@angular/core';
import { Data } from '../../../interfaces/data.interface';
import { DataService } from '../../../../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-two',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-two.component.html',
  styleUrl: './template-two.component.scss'
})
export class TemplateTwoComponent implements OnInit {
  constructor(private dataService: DataService) {}

  data!: Data;

  ngOnInit(): void {
    this.data = this.dataService.data!;
  }
}
