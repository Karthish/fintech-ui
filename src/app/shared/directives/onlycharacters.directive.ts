import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[charactersOnly]',
})
export class onlyCharactersDirective {
  regexStr = '^[a-zA-Z ]*$';
  @Input() isAlphaNumeric!: boolean;

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value
        .replace(/[^A-Za-z ]/g, '')
        .replace(/\s/g, '');
      event.preventDefault();
    }, 100);
  }
}