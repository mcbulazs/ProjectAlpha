import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PageDataService } from '../../../services/page.data.service';
import { PageData } from '../../../interfaces/page.data.interface';
import { FormsModule } from '@angular/forms';
import { Article } from '../../../interfaces/article.interface';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit {

  constructor(private pds: PageDataService) { }

  data!: PageData;
  model!: Article;
  initValue: string = '';

  ngOnInit(): void {
    this.data = this.pds.data;
    this.model = this.data.articles[0];
    this.initValue = this.model.content;
    console.clear();
  }

  test(editor: any) {
    var selection = window.getSelection();
    if (!selection) return;
    let range = selection.getRangeAt(0);
    console.log(range.getBoundingClientRect());
    
    
  }

  addFormat(format: string, editor: HTMLDivElement) {
    
    let s = this.model;
    console.log(s.content);
    let selection = window.getSelection();
    console.log(selection);
    
    if (!selection) return;
    let range = selection.getRangeAt(0);
    let offsets = range
    console.log(range);
    
    
    let start = range.startOffset;
    let end = range.endOffset;
    console.log(start, end);
    
    let before = s.content.slice(0, start);
    let middle = s.content.slice(start, end);
    let after = s.content.slice(end);
    
    s.content = before + `<${format}>` + middle + `</${format}>` + after;
    this.initValue = s.content;
  }

}
