import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, empresa, tipo_documento, fecha_emision, url } = data;

    // 1. Generate QR as PNG buffer
    const qrImageBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      margin: 1,
      width: 300,
      errorCorrectionLevel: 'H'
    });

    // 2. Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 3. Draw Header
    page.drawText('VALIDADOR DE CONTRATOS - DEMO', {
      x: 50,
      y: height - 50,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    // 4. Embed and draw QR
    const qrImage = await pdfDoc.embedPng(qrImageBuffer);
    const qrSize = 100;
    page.drawImage(qrImage, {
      x: width - 50 - qrSize,
      y: height - 50 - qrSize,
      width: qrSize,
      height: qrSize,
    });

    // 5. Draw Content
    page.drawText(tipo_documento, {
      x: 50,
      y: height - 120,
      size: 24,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText(`ID de Validación: ${id}`, {
      x: 50,
      y: height - 150,
      size: 12,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.3),
    });

    const contentY = height - 220;
    const lineSpacing = 25;

    page.drawText('DETALLES DEL DOCUMENTO:', {
      x: 50,
      y: contentY,
      size: 14,
      font: fontBold,
    });

    const details = [
      ['Empresa Emisora:', empresa],
      ['Fecha de Emisión:', fecha_emision],
      ['Estado:', 'VÁLIDO'],
      ['Tipo de Firma:', 'Electrónica Avanzada (Simulada)'],
    ];

    details.forEach((detail, index) => {
      page.drawText(detail[0], {
        x: 50,
        y: contentY - 30 - (index * lineSpacing),
        size: 11,
        font: fontBold,
      });
      page.drawText(detail[1], {
        x: 180,
        y: contentY - 30 - (index * lineSpacing),
        size: 11,
        font: fontRegular,
      });
    });

    // 6. Verification Instruction
    const footerY = 150;
    page.drawRectangle({
      x: 50,
      y: footerY,
      width: width - 100,
      height: 60,
      color: rgb(0.95, 0.95, 0.95),
      borderWidth: 1,
      borderColor: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('INSTRUCCIONES DE VALIDACIÓN:', {
      x: 65,
      y: footerY + 40,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText('Escanea el código QR superior para verificar la autenticidad de este documento en nuestro portal oficial.', {
      x: 65,
      y: footerY + 20,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    // 7. Save PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrato_${id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json({ error: 'Fallo al generar el documento' }, { status: 500 });
  }
}
