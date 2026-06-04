/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import fs from 'fs';
import type { PDFForm, PDFTextField } from 'pdf-lib';
import { PDFDocument } from 'pdf-lib';

async function fillForm() {
  const formPdfBytes: Uint8Array = new Uint8Array(fs.readFileSync('./certificate-template.pdf'));
  const pdfDoc: PDFDocument = await PDFDocument.load(formPdfBytes);

  const form: PDFForm = pdfDoc.getForm();
  form.getFields().forEach(field => console.log(field.getName()));

  const field1: PDFTextField = form.getTextField('FieldName1');
  const field2: PDFTextField = form.getTextField('FieldName2');

  field1.setText('Jane Doe');
  field2.setText('June 3, 2026');

  const pdfBytes: Uint8Array = await pdfDoc.save();
  fs.writeFileSync('filled.pdf', Buffer.from(pdfBytes));
  console.log('✅ Saved to filled.pdf');
}

void fillForm();
