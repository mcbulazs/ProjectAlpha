import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { Progress } from '../../../interfaces/progress.interface';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatListItemMeta } from '@angular/material/list';

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatIconButton, MatTreeModule, MatListItemMeta],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit {

  treeControl = new NestedTreeControl<any>(node => node.raids);
  dataSource = new MatTreeNestedDataSource<any>();

  constructor(private dialog: MatDialog, private pds: PageDataService, private snackBar: MatSnackBar) {
    this.dataSource.data = pds.data.progress;
  }
  
  data!: PageData;
  
  ngOnInit(): void {
    this.data = this.pds.data;
    this.treeControl.dataNodes = this.dataSource.data;
    this.treeControl.expandAll();
  }

  hasChild = (_: number, node: any) => !!node.raids && node.raids.length > 0;

  createProgress() {

  }

  updateProgress(progress: Progress, editBtn: MatIconButton) {

  }

  deleteProgress(id: number, deleteBtn: MatIconButton) {

  }

}
