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
      
      const margin = 50;
      const contentWidth = width - (margin * 2);
      
      // Intentar cargar el logo
      let logoBottomY = height - 120;
      try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const logoImage = await pdfDoc.embedPng(logoBuffer);
            // Escalar el logo proporcionalmente a un tamaño decente
            const logoDims = logoImage.scaleToFit(200, 80); 
            page.drawImage(logoImage, {
              x: width / 2 - logoDims.width / 2,
              y: height - 50 - logoDims.height,
              width: logoDims.width,
              height: logoDims.height,
            });
            logoBottomY = height - 50 - logoDims.height - 15;
        }
      } catch (e) {
        console.log("No se pudo cargar el logo:", e);
      }

      // Dirección centrada
      const textCenter = (txt: string, size: number, y: number, font = fontRegular) => {
          const txtWidth = font.widthOfTextAtSize(txt, size);
          page.drawText(txt, { x: width / 2 - txtWidth / 2, y, size, font, color: rgb(0.2, 0.2, 0.2) });
      };

      textCenter('Clinica DocDoc', 12, logoBottomY, fontRegular);
      textCenter('Ulriksen #.4105 , La Serena,', 12, logoBottomY - 14, fontRegular);
      textCenter('Coquimbo  TELÉFONO:+56', 12, logoBottomY - 28, fontRegular);
      textCenter('948472266', 12, logoBottomY - 42, fontRegular);

      // Cabecera paciente
      const headerY = logoBottomY - 70;
      
      // Dibujar "Paciente: Nombre RUN: 123" en negritas
      page.drawText(`Paciente: ${data.paciente || ''}  RUN: ${data.rut_paciente || ''}`, { 
        x: margin, 
        y: headerY, 
        size: 11, 
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      });
      
      // Dibujar Fecha de nacimiento y dirección
      const fechaLinea = `Fec. Nacimiento: ${data.fecha_nacimiento || ''} [${data.edad || ''}] Dirección: ${data.direccion || ''}`;
      // Wrap manual si sobrepasa el ancho
      const wordsHeader = fechaLinea.split(' ');
      let currentHeader = '';
      let headYOffset = headerY - 15;
      for (let i = 0; i < wordsHeader.length; i++) {
        const testLine = currentHeader + wordsHeader[i] + ' ';
        const testWidth = fontRegular.widthOfTextAtSize(testLine, 11);
        if (testWidth > contentWidth && i > 0) {
          page.drawText(currentHeader, { x: margin, y: headYOffset, size: 11, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
          currentHeader = wordsHeader[i] + ' ';
          headYOffset -= 15;
        } else {
          currentHeader = testLine;
        }
      }
      page.drawText(currentHeader, { x: margin, y: headYOffset, size: 11, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
      
      // Título
      const titleY = headYOffset - 50;
      textCenter('CERTIFICADO', 16, titleY, fontBold);
      
      // Contenido (Justificado simulado a la izquierda respetando márgenes)
      const contentY = titleY - 40;
      page.drawText(`Para: ${data.institucion || '_________________'}`, { x: margin, y: contentY, size: 12, font: fontRegular });
      
      // Párrafo grande dinámico
      const rawText = `Se certifica que el paciente acudió a nuestra consulta por presentar ${data.diagnostico || ''}, se sugiere mantener reposo en domicilio durante ${data.reposo ? data.reposo.toString().padStart(2, '0') : '01'} días, desde el ${data.fecha_inicio || ''} hasta el ${data.fecha_fin || ''}. Y se indica tratamiento ${data.tratamiento || ''}`;
      
      const words = rawText.split(' ');
      let currentLine = '';
      let currentY = contentY - 40;

      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const testWidth = fontRegular.widthOfTextAtSize(testLine, 12);
        if (testWidth > contentWidth && i > 0) {
          page.drawText(currentLine, { x: margin, y: currentY, size: 12, font: fontRegular });
          currentLine = words[i] + ' ';
          currentY -= 15;
        } else {
          currentLine = testLine;
        }
      }
      page.drawText(currentLine, { x: margin, y: currentY, size: 12, font: fontRegular });

      // Zona de Firmas
      const footY = 160;
      page.drawText(`${data.fecha_emision || ''}`, { x: 100, y: footY + 40, size: 10, font: fontRegular });
      page.drawText(`Fecha`, { x: margin, y: footY + 20, size: 10, font: fontRegular });
      page.drawLine({ start: { x: 100, y: footY + 18 }, end: { x: 250, y: footY + 18 }, thickness: 1, color: rgb(0,0,0) });

      // Cargar imagen de la firma (si existe)
      let signatureOffset = 0;
      try {
        const firmaPath = path.join(process.cwd(), 'public', 'firma.png');
        if (fs.existsSync(firmaPath)) {
            const firmaBuffer = fs.readFileSync(firmaPath);
            const firmaImage = await pdfDoc.embedPng(firmaBuffer);
            const firmaDims = firmaImage.scaleToFit(160, 80);
            
            page.drawImage(firmaImage, {
              x: 430 - (firmaDims.width / 2),
              y: footY - 10,
              width: firmaDims.width,
              height: firmaDims.height,
            });
            signatureOffset = 15;
        }
      } catch (e) {
        console.log("No se pudo cargar la firma:", e);
      }

      // Datos Médico a la derecha (Línea de firma igual a la de Fecha)
      const medY = footY - 15 - signatureOffset; // Bajar los nombres si hay firma grande arriba
      
      // Dibujar línea inferior para la firma (mismo grosor y ancho aproximado que Fecha)
      page.drawLine({ start: { x: 350, y: medY + 15 }, end: { x: 500, y: medY + 15 }, thickness: 1, color: rgb(0,0,0) });
      
      const medNameWidth = fontBold.widthOfTextAtSize(`${data.medico || ''}`, 11);
      page.drawText(`${data.medico || ''}`, { x: 425 - (medNameWidth/2), y: medY, size: 11, font: fontBold });
      
      const espWidth = fontRegular.widthOfTextAtSize(`${data.especialidad || ''}`, 10);
      page.drawText(`${data.especialidad || ''}`, { x: 450 - (espWidth/2), y: medY - 15, size: 10, font: fontRegular });
      
      const rutStr = `RUN: ${data.rut_medico || ''} / REG-SIS`;
      const rutWidth = fontRegular.widthOfTextAtSize(rutStr, 10);
      page.drawText(rutStr, { x: 450 - (rutWidth/2), y: medY - 30, size: 10, font: fontRegular });
      
      const regStr = `N°: ${data.registro_medico || ''}`;
      const regWidth = fontRegular.widthOfTextAtSize(regStr, 10);
      page.drawText(regStr, { x: 450 - (regWidth/2), y: medY - 45, size: 10, font: fontRegular });

      // QR más pequeño para dar espacio (antes era 80, ahora 55)
      const qrSize = 55;
      page.drawImage(qrImage, { x: margin, y: 50, width: qrSize, height: qrSize });
      // Extrae baseUrl
      const baseUrlStr = (data.url || '').split('/validar/')[0] || '';
      page.drawText(`Valida en ${baseUrlStr}/validar`, { x: 115, y: 92, size: 9, font: fontRegular });
      page.drawText(`con código: ${id}`, { x: 115, y: 77, size: 9, font: fontRegular });
      
      page.drawLine({ start: { x: margin, y: 30 }, end: { x: 562, y: 30 }, thickness: 2, color: rgb(0,0,0) });
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
