import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-sanction-letter-pdf',
  templateUrl: './sanction-letter-pdf.component.html',
  styleUrls: ['./sanction-letter-pdf.component.scss']
})
export class SanctionLetterPdfComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  public openPDF():void {
    let DATA = document.getElementById('sanctionLetter_pdfData') as HTMLElement;

    // var doc = new jsPDF();
    // doc.setProperties({
    // title: "new Report"
    // });
    // doc.output('dataurlnewwindow');
        
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        
        PDF.save('Sanction_letter.pdf');
    });     
    }

  // printDiv(title: any) {
  
  //   let mywindow: any = window.open('', 'PRINT');
  
  //   mywindow.document.write(`<html><head><title>${title}</title>`);
  //   mywindow.document.write('</head><body >');
  //   mywindow.document.write(document.getElementById('sanctionLetter_pdfData')!.innerHTML as unknown as HTMLElement);
  //   mywindow.document.write('</body></html>');
  
  //   mywindow.document.close(); // necessary for IE >= 10
  //   mywindow.focus(); // necessary for IE >= 10*/
  
  //   mywindow.print();
  //   mywindow.close();
  
  //   return true;
  // }
  

}
