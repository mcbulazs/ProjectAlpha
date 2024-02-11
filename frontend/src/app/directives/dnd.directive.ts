import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dragAndDrop]',
  standalone: true
})
export class DndDirective {

  // finally functions as intended, beautify later
  // TODO: REFACTOR

  constructor() { }

  @Output() file = new EventEmitter<File>();

  @HostListener('dragover', ['$event']) onDragOver(e: any) {
    e.target.closest('.dropzone').classList.add('drag')
    e.target.closest('.dropzone').classList.add('disable-pointer-events')
    
    e.preventDefault();
    e.stopPropagation();
    console.log("over");
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.target);
    
    if (!e.target.matches('.dropzone')) return;
    e.target.closest('.dropzone').classList.remove('drag')
    e.target.closest('.dropzone').classList.remove('disable-pointer-events')
    
    console.log("leave");
  }

  @HostListener('drop', ['$event']) onDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest('.dropzone').classList.remove('drag')
    e.target.closest('.dropzone').classList.remove('disable-pointer-events')
    console.log("drop");
    let files = e.dataTransfer?.files;
    if (!files) return;
    this.file.emit(files)
  }

}
