import { NextRequest, NextResponse } from 'next/server';
import { degrees, PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface TransferData {
  comprobante: string;
  fecha: string;
  valor: string;
  banco: string;
  numeroCuenta: string;
  tipo: string;
  concepto: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json() as TransferData;

    // Validar datos requeridos
    if (!body.comprobante || !body.valor || !body.banco) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
        { status: 400 }
      );
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([610, 1332]);
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageHeight = 1332;
    const rectY = (top: number, height: number) => pageHeight - top - height;
    const textY = (top: number, size: number) => pageHeight - top - size;

    const black = rgb(0.13, 0.12, 0.11);
    const text = rgb(0.15, 0.15, 0.16);
    const muted = rgb(0.34, 0.34, 0.36);
    const background = rgb(0.97, 0.97, 0.98);
    const cyanPanel = rgb(0.79, 0.94, 0.97);
    const cyanBorder = rgb(0.38, 0.78, 0.85);
    const green = rgb(0.32, 0.82, 0.65);
    const yellow = rgb(1, 0.87, 0.14);
    const pink = rgb(0.96, 0.66, 0.79);
    const teal = rgb(0.02, 0.76, 0.57);

    const drawCentered = (value: string, top: number, size: number, font = regular, color = text) => {
      const valueWidth = font.widthOfTextAtSize(value, size);
      page.drawText(value, { x: (610 - valueWidth) / 2, y: textY(top, size), size, font, color });
    };

    const drawText = (value: string, x: number, top: number, size: number, font = regular, color = text) => {
      page.drawText(value, { x, y: textY(top, size), size, font, color });
    };

    const navY = (top: number) => pageHeight - top;

    // Rutas SVG exactas de Lucide (viewBox 24x24)
    const ICON_HOUSE = 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8 M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z';
    const ICON_CREDIT_CARD = 'M2 5 h20 a2 2 0 0 1 2 2 v10 a2 2 0 0 1 -2 2 h-20 a2 2 0 0 1 -2 -2 v-10 a2 2 0 0 1 2 -2 z M2 10 h20';
    const ICON_LAYOUT_GRID = 'M4 3 h5 a1 1 0 0 1 1 1 v5 a1 1 0 0 1 -1 1 h-5 a1 1 0 0 1 -1 -1 v-5 a1 1 0 0 1 1 -1 z M15 3 h5 a1 1 0 0 1 1 1 v5 a1 1 0 0 1 -1 1 h-5 a1 1 0 0 1 -1 -1 v-5 a1 1 0 0 1 1 -1 z M15 14 h5 a1 1 0 0 1 1 1 v5 a1 1 0 0 1 -1 1 h-5 a1 1 0 0 1 -1 -1 v-5 a1 1 0 0 1 1 -1 z M4 14 h5 a1 1 0 0 1 1 1 v5 a1 1 0 0 1 -1 1 h-5 a1 1 0 0 1 -1 -1 v-5 a1 1 0 0 1 1 -1 z';
    const ICON_FILE_TEXT = 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z M14 2v4a2 2 0 0 0 2 2h4 M16 13H8 M16 17H8 M10 9H8';
    const ICON_SETTINGS = 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M9 12 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0';
    const ICON_CHECK = 'M20 6 9 17l-5-5';
    const ICON_LIGHTBULB = 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4';
    const ICON_CHEVRON_UP = 'm18 15-6-6-6 6';
    const ICON_WIFI = 'M12 20h.01 M8.5 16.429a5 5 0 0 1 7 0 M5 12.859a10 10 0 0 1 14 0 M2 8.82a15 15 0 0 1 20 0';
    const ICON_BATTERY = 'M2 7 h16 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 h-16 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2 z M22 11 v2 M6 11 v2 M10 11 v2';
    const ICON_SIGNAL = 'M2 20 h.01 M5 20 v-4 M9 20 v-8 M13 20 V8 M17 20 V4';
    const ICON_ARROW_OUT = 'M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6 M21 3l-7 7 M14 3h7v7';

    const drawLucideIcon = (path: string, x: number, top: number, size: number, color = text, stroke = 2) => {
      const scale = size / 24;
      page.drawSvgPath(path, {
        x,
        y: pageHeight - top,
        scale,
        borderColor: color,
        borderWidth: stroke * scale,
      });
    };

    const drawSection = (title: string, top: number) => {
      page.drawRectangle({ x: 24, y: rectY(top, 88), width: 562, height: 88, color: black });
      drawText(title, 51, top + 32, 26, bold, rgb(1, 1, 1));
      drawLucideIcon(ICON_CHEVRON_UP, 535, top + 26, 36, rgb(1, 1, 1), 2.5);
    };

    page.drawRectangle({ x: 0, y: 0, width: 610, height: 1332, color: background });
    page.drawRectangle({ x: 0, y: rectY(0, 43), width: 610, height: 43, color: rgb(0.73, 0.73, 0.74) });

    // Yellow ring top-left
    page.drawEllipse({
      x: 80,
      y: pageHeight - 320,
      xScale: 110,
      yScale: 100,
      borderColor: yellow,
      borderWidth: 28,
      opacity: 0
    });
    // Pink ring top-left
    page.drawEllipse({
      x: 90,
      y: pageHeight - 430,
      xScale: 90,
      yScale: 80,
      borderColor: pink,
      borderWidth: 22,
      opacity: 0
    });
    // Green ring bottom-right
    page.drawEllipse({
      x: 560,
      y: pageHeight - 1220,
      xScale: 110,
      yScale: 100,
      borderColor: teal,
      borderWidth: 26,
      opacity: 0
    });
    // Small pink dot
    page.drawCircle({
      x: 534,
      y: pageHeight - 1176,
      size: 16,
      color: pink
    });

    // Barra superior con iconos Lucide.
    drawText('1:36', 23, 14, 20, regular, text);
    drawLucideIcon(ICON_SIGNAL, 85, 8, 26, text, 2);
    drawLucideIcon(ICON_WIFI, 115, 8, 26, text, 2);
    drawLucideIcon(ICON_BATTERY, 550, 8, 30, text, 2);
    drawText('Cerrar sesi...', 406, 76, 25, regular, text);
    drawLucideIcon(ICON_ARROW_OUT, 556, 68, 42, black, 2);

    page.drawCircle({ x: 305, y: pageHeight - 190, size: 37.5, color: green });
    drawLucideIcon(ICON_CHECK, 283, 162, 48, black, 3);
    drawCentered('¡Transferencia exitosa!', 257, 34, bold, text);
    drawCentered(`Comprobante No. ${body.comprobante}`, 329, 22, regular, text);
    drawCentered(body.fecha, 359, 22, regular, text);

    page.drawRectangle({ x: 24, y: rectY(431, 327), width: 562, height: 327, color: cyanPanel, borderColor: cyanBorder, borderWidth: 1 });
    page.drawCircle({ x: 75, y: pageHeight - 482, size: 25.5, color: rgb(0.68, 0.91, 0.95), borderColor: cyanBorder, borderWidth: 1 });
    drawLucideIcon(ICON_LIGHTBULB, 62, 467, 30, black, 2);
    drawText('Tus transferencias a Nequi y cuentas', 124, 469, 21, regular, text);
    drawText('Bancolombia no tienen costo.', 124, 500, 21, regular, text);
    drawText('A otros bancos te cuesta $7.590 + IVA cada', 124, 560, 21, regular, text);
    drawText('una. Si tienes Plan Oro o Plan Pensión 035,', 124, 591, 21, regular, text);
    drawText('tienes transferencias sin costo.', 124, 622, 21, regular, text);
    page.drawRectangle({ x: 128, y: rectY(664, 59), width: 225, height: 59, borderColor: black, borderWidth: 2 });
    drawText('Descubre tu plan', 152, 683, 22, bold, text);

    drawSection('Datos de la transferencia', 782);
    page.drawRectangle({ x: 24, y: rectY(870, 119), width: 562, height: 119, color: rgb(1, 1, 1) });
    drawText('Valor de la transferencia', 51, 899, 20, regular, text);
    drawText(`$ ${body.valor}`, 51, 931, 27, bold, text);

    drawSection('Producto destino', 1010);
    page.drawRectangle({ x: 24, y: rectY(1098, 118), width: 562, height: 118, color: rgb(1, 1, 1) });
    drawText(body.banco, 51, 1127, 20, regular, text);
    drawText(body.numeroCuenta, 51, 1162, 26, regular, text);

    page.drawRectangle({ x: 0, y: 0, width: 610, height: 105, color: rgb(1, 1, 1) });
    page.drawLine({ start: { x: 0, y: 105 }, end: { x: 610, y: 105 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
    drawLucideIcon(ICON_HOUSE, 48, 1248, 48, text, 2);
    drawLucideIcon(ICON_CREDIT_CARD, 167, 1248, 48, text, 2);
    drawLucideIcon(ICON_LAYOUT_GRID, 292, 1248, 48, text, 2);
    drawLucideIcon(ICON_FILE_TEXT, 421, 1248, 48, text, 2);
    drawLucideIcon(ICON_SETTINGS, 530, 1248, 48, text, 2);
    drawText('Inicio', 43, 1298, 16, regular, muted);
    drawText('Transacciones', 132, 1298, 16, regular, muted);
    drawText('Explorar', 275, 1298, 16, regular, muted);
    drawText('Tramites y', 389, 1290, 16, regular, muted);
    drawText('solicitudes', 386, 1310, 16, regular, muted);
    drawText('Ajustes', 519, 1298, 16, regular, muted);

    // Generar PDF
    const pdfBytes = await pdfDoc.save();
    
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="transferencia-${body.comprobante}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}

// Endpoint GET para documentación de la API
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    mensaje: 'API de generación de PDFs de transferencia',
    metodo: 'POST',
    campos_requeridos: {
      comprobante: 'string (requerido)',
      fecha: 'string (requerido)',
      valor: 'string (requerido)',
      banco: 'string (requerido)',
      numeroCuenta: 'string (requerido)',
      tipo: 'string',
      concepto: 'string',
    },
    ejemplo: {
      comprobante: 'IVXOB2VGYU',
      fecha: '14 Jun 2026 - 01:36 p m.',
      valor: '72.000',
      banco: 'Nequi',
      numeroCuenta: '3183095726',
      tipo: 'Transferencia bancaria',
      concepto: 'Pago de servicios',
    },
  });
}
