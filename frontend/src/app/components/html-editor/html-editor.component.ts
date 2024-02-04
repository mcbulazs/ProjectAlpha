import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../services/page.data.service';
import { PageData } from '../../interfaces/page.data.interface';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-html-editor',
  standalone: true,
  imports: [CommonModule, MatFormField, MatInput, MatIconButton, MatIcon, MatLabel, FormsModule, CdkTextareaAutosize, QuillModule],
  templateUrl: './html-editor.component.html',
  styleUrl: './html-editor.component.scss'
})
export class HtmlEditorComponent implements OnInit {

  constructor (private pds: PageDataService) { }

  data!: PageData;

  ngOnInit(): void {
    this.data = this.pds.data;
  }

  updateContent(content: string) {
    console.log(content);
    this.data.articles[0].content = content
    
  }

  formatSelection(format: string) {
    let selected = window.getSelection()?.toString();
    if (!selected || selected.trim() === '') return;
    console.log(selected);
    if (format === 'bold') {
      if (selected.includes('<b>') && selected.includes('</b>')) {
        this.data.articles[0].content = this.data.articles[0].content.replace('<b>', '');
        this.data.articles[0].content = this.data.articles[0].content.replace('</b>', '');
        return;
      }
      this.data.articles[0].content = this.data.articles[0].content.replace(selected, `<b>${selected}</b>`)
    }
    else if (format === 'italic') {
      this.data.articles[0].content = this.data.articles[0].content.replace(selected, `<i>${selected}</i>`)
    }
  }
}

export enum Format {
  BOLD, ITALIC, UNDERLINE, COLOR
}