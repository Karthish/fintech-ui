import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sanction-letter-pdf',
  templateUrl: './sanction-letter-pdf.component.html',
  styleUrls: ['./sanction-letter-pdf.component.scss']
})
export class SanctionLetterPdfComponent implements OnInit {
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  constructor() { }

  ngOnInit(): void {}


}
