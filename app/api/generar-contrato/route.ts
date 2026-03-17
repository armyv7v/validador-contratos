import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { tipo_plantilla, id, url } = data;

    // 1. Generate QR as PNG buffer
    const qrImageBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      margin: 1,
      width: 300,
      errorCorrectionLevel: 'H'
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Carta / Letter
    const { width, height } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const qrImage = await pdfDoc.embedPng(qrImageBuffer);

    if (tipo_plantilla === 'medico') {
      // ---------------------------------
      // LÓGICA CERTIFICADO MÉDICO
      // ---------------------------------
      
      // Intentar cargar el logo
      try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const logoImage = await pdfDoc.embedPng(logoBuffer);
            const logoDims = logoImage.scale(0.3); // Ajustar escala para DocDoc
            page.drawImage(logoImage, {
            x: width / 2 - logoDims.width / 2,
            y: height - 150,
            width: logoDims.width,
            height: logoDims.height,
            });
        }
      } catch (e) {
        console.log("No se pudo cargar el logo:", e);
      }

      // Título
      page.drawText('CERTIFICADO', {
        x: width / 2 - 70,
        y: height - 280,
        size: 20,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // Cabecera paciente
      page.drawText(`Paciente: ${data.paciente}   RUN: ${data.rut_paciente}`, { x: 50, y: height - 180, size: 10, font: fontBold });
      page.drawText(`Fec. Nacimiento: ${data.fecha_nacimiento} [${data.edad}]   Dirección: ${data.direccion}`, { x: 50, y: height - 195, size: 10, font: fontRegular });
      
      // Contenido
      const contentY = height - 350;
      page.drawText(`Para: ${data.institucion || '_________________'}`, { x: 50, y: contentY, size: 12, font: fontRegular });
      
      page.drawText(`Se certifica que el paciente acudió a nuestra consulta por presentar`, { x: 50, y: contentY - 40, size: 12, font: fontRegular });
      page.drawText(`${data.diagnostico}, se sugiere mantener reposo en`, { x: 50, y: contentY - 55, size: 12, font: fontRegular });
      page.drawText(`domicilio durante ${data.reposo?.padStart(2, '0') || '01'} días, desde el ${data.fecha_inicio} hasta el ${data.fecha_fin}. Y se`, { x: 50, y: contentY - 70, size: 12, font: fontRegular });
      page.drawText(`indica tratamiento ${data.tratamiento}`, { x: 50, y: contentY - 85, size: 12, font: fontRegular });

      // Zona de Firmas
      const footY = 160;
      page.drawText(`${data.fecha_emision}`, { x: 100, y: footY + 40, size: 10, font: fontRegular });
      page.drawText(`Fecha`, { x: 50, y: footY + 20, size: 10, font: fontRegular });
      page.drawLine({ start: { x: 100, y: footY + 18 }, end: { x: 250, y: footY + 18 }, thickness: 1, color: rgb(0,0,0) });

      // Datos Médico a la derecha
      page.drawLine({ start: { x: 350, y: footY + 18 }, end: { x: 550, y: footY + 18 }, thickness: 1, color: rgb(0,0,0) });
      page.drawText(`Firma`, { x: 435, y: footY + 5, size: 10, font: fontRegular });
      const medNameWidth = fontBold.widthOfTextAtSize(`${data.medico}`, 11);
      page.drawText(`${data.medico}`, { x: 450 - (medNameWidth/2), y: footY - 15, size: 11, font: fontBold });
      
      const espWidth = fontRegular.widthOfTextAtSize(`${data.especialidad}`, 10);
      page.drawText(`${data.especialidad}`, { x: 450 - (espWidth/2), y: footY - 30, size: 10, font: fontRegular });
      
      const rutStr = `RUN: ${data.rut_medico} / REG-SIS`;
      const rutWidth = fontRegular.widthOfTextAtSize(rutStr, 10);
      page.drawText(rutStr, { x: 450 - (rutWidth/2), y: footY - 45, size: 10, font: fontRegular });
      
      const regStr = `N°: ${data.registro_medico}`;
      const regWidth = fontRegular.widthOfTextAtSize(regStr, 10);
      page.drawText(regStr, { x: 450 - (regWidth/2), y: footY - 60, size: 10, font: fontRegular });

      // QR
      const qrSize = 80;
      page.drawImage(qrImage, { x: 50, y: 50, width: qrSize, height: qrSize });
      // Extrae baseUrl
      const baseUrlStr = data.url.split('/validar/')[0] || data.url;
      page.drawText(`Valida en ${baseUrlStr}/validar`, { x: 140, y: 110, size: 9, font: fontRegular });
      page.drawText(`con código: ${id}`, { x: 140, y: 95, size: 9, font: fontRegular });
      
      page.drawLine({ start: { x: 50, y: 30 }, end: { x: 562, y: 30 }, thickness: 2, color: rgb(0,0,0) });
      page.drawText(`NO AUTORIZADO CAMBIO DE MEDICAMENTO`, { x: 180, y: 15, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });

    } else {
      // ---------------------------------
      // LÓGICA CONTRATO LABORAL
      // ---------------------------------
      page.drawText('VALIDADOR DE CONTRATOS', { x: 50, y: height - 50, size: 10, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
      
      const qrSize = 100;
      page.drawImage(qrImage, { x: width - 50 - qrSize, y: height - 50 - qrSize, width: qrSize, height: qrSize });
      
      page.drawText(data.tipo_documento || 'Contrato Laboral', { x: 50, y: height - 120, size: 24, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      page.drawText(`ID de Validación: ${id}`, { x: 50, y: height - 150, size: 12, font: fontBold, color: rgb(0.3, 0.3, 0.3) });

      const contentY = height - 220;
      const lineSpacing = 25;

      page.drawText('DETALLES DEL TRABAJADOR Y CONTRATO:', { x: 50, y: contentY, size: 14, font: fontBold });

      let sueldoFormat = data.sueldo;
      try {
        const formater = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
        sueldoFormat = formater.format(parseInt(data.sueldo || '0'));
      } catch(e) {}

      const details = [
        ['Empresa Emisora:', data.empresa],
        ['RUT Empresa:', data.rut_empresa],
        ['Trabajador:', data.trabajador],
        ['RUT Trabajador:', data.rut_trabajador],
        ['Cargo:', data.cargo],
        ['Sueldo Base:', sueldoFormat],
        ['Estado:', 'VÁLIDO'],
        ['Fecha de Emisión:', data.fecha_emision],
      ];

      details.forEach((detail, index) => {
        page.drawText(detail[0], { x: 50, y: contentY - 30 - (index * lineSpacing), size: 11, font: fontBold });
        page.drawText(detail[1] || 'N/A', { x: 180, y: contentY - 30 - (index * lineSpacing), size: 11, font: fontRegular });
      });

      const footerY = 80;
      page.drawRectangle({ x: 50, y: footerY, width: width - 100, height: 60, color: rgb(0.95, 0.95, 0.95), borderWidth: 1, borderColor: rgb(0.8, 0.8, 0.8) });
      page.drawText('INSTRUCCIONES DE VALIDACIÓN:', { x: 65, y: footerY + 40, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      page.drawText('Escanea el código QR superior para verificar la autenticidad de este documento en el portal oficial.', { x: 65, y: footerY + 20, size: 9, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${tipo_plantilla}_${id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json({ error: 'Fallo al generar el documento' }, { status: 500 });
  }
}
