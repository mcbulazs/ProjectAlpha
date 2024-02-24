import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import Editor from 'ckeditor5-custom-build';
import { CKEDITOR_CONFIG, MAT_SNACKBAR_CONFIG } from '../../../constants';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guild-rules',
  standalone: true,
  imports: [CommonModule, CKEditorModule, MatButton, FormsModule],
  templateUrl: './guild-rules.component.html',
  styleUrl: './guild-rules.component.scss'
})
export class GuildRulesComponent implements OnInit {
  constructor(private pds: PageDataService, private snackBar: MatSnackBar) { }

  public Editor = Editor;
  editorConfig = CKEDITOR_CONFIG;

  data!: PageData;
  initState: string = '';
  changed: boolean = false;

  ngOnInit(): void {
    this.data = this.pds.data;
    this.initState = this.data.rules;
  }

  save() {
    this.pds.patchRules().subscribe(success => {
      if (success) this.initState = this.data.rules;
      else this.data.rules = this.initState;
      this.changed = false;
      this.snackBar.open(`Rules ${success ? 'saved' : 'save failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
    });
  }
}
