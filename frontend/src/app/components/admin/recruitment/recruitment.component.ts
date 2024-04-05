import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { PageDataService } from '../../../services/page.data.service';
import { PRESETS, Preset } from '../../preview/templates';
import { MatGridListModule } from '@angular/material/grid-list';
import { PageData } from '../../../interfaces/page.data.interface';
import { SubclassDialogComponent } from './subclass-dialog/subclass-dialog.component';
import { Recruitment } from '../../../interfaces/recruitment.interface';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton, MatGridListModule],
  templateUrl: './recruitment.component.html',
  styleUrl: './recruitment.component.scss'
})
export class RecruitmentComponent implements OnInit {

  constructor(private dialog: MatDialog, private pds: PageDataService) { }

  preset: Preset = PRESETS[this.pds.data.presetid];

  data!: PageData;
  recruitment: Recruitment[] = [];

  ngOnInit(): void {
    this.data = this.pds.data;
    this.recruitment = this.data.recruitment;
  }

  select(index: number) {
    if (this.dialog.openDialogs.length > 0) return;
    this.dialog.open(SubclassDialogComponent, {
      width: '250px',
      data: {
        preset: this.preset.classes[index],
        userData: this.recruitment[index],
      },
    });
  }
}
