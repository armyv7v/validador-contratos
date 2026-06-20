'use client';

/**
 * Ejemplo de cómo integrar el módulo de documentos en otras páginas
 * 
 * Este archivo muestra diferentes formas de usar la funcionalidad
 * de generación de PDFs desde distintas partes de tu aplicación
 */

import { useState } from 'react';

export default function DocumentosExamplesPage() {
  const [result, setResult] = useState<string | null>(null);

  /**
   * Ejemplo 1: Generar PDF desde un objeto de datos
   */
  const generatePDFFromData = async () => {
    const transferData = {
      comprobante: 'TEST123456',
      fecha: new Date().toLocaleString('es-CO'),
      valor: '150.000',
      banco: 'Bancolombia',
      numeroCuenta: '04055108829',
      tipo: 'Transferencia a otra cuenta',
      concepto: 'Pago de servicios profesionales',
    };

    try {
      const response = await fetch('/api/transfer-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) throw new Error('Error en la API');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transferencia-${transferData.comprobante}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setResult('✅ PDF generado y descargado correctamente');
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  /**
   * Ejemplo 2: Generar PDF y guardarlo en variable (sin descargar)
   */
  const generatePDFAndStore = async () => {
    const transferData = {
      comprobante: 'STORE789',
      fecha: '15 Jun 2026 - 02:45 p m.',
      valor: '50.000',
      banco: 'Davivienda',
      numeroCuenta: '1234567890',
      tipo: 'Transferencia inmediata',
      concepto: 'Compra de productos',
    };

    try {
      const response = await fetch('/api/transfer-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) throw new Error('Error en la API');

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      setResult(
        `✅ PDF almacenado (${(blob.size / 1024).toFixed(2)} KB)\n` +
        `Base64: ${base64.substring(0, 50)}...`
      );
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  /**
   * Ejemplo 3: Generar múltiples PDFs en batch
   */
  const generateMultiplePDFs = async () => {
    const transfers = [
      {
        comprobante: 'BATCH001',
        fecha: '15 Jun 2026 - 10:00 a m.',
        valor: '100.000',
        banco: 'Nequi',
        numeroCuenta: '1111111111',
        tipo: 'Transferencia',
        concepto: 'Pago 1',
      },
      {
        comprobante: 'BATCH002',
        fecha: '15 Jun 2026 - 10:15 a m.',
        valor: '200.000',
        banco: 'Daviplata',
        numeroCuenta: '2222222222',
        tipo: 'Transferencia',
        concepto: 'Pago 2',
      },
      {
        comprobante: 'BATCH003',
        fecha: '15 Jun 2026 - 10:30 a m.',
        valor: '150.000',
        banco: 'Banco AV Villas',
        numeroCuenta: '3333333333',
        tipo: 'Transferencia',
        concepto: 'Pago 3',
      },
    ];

    try {
      for (const transfer of transfers) {
        const response = await fetch('/api/transfer-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transfer),
        });

        if (!response.ok) throw new Error(`Error con ${transfer.comprobante}`);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `transferencia-${transfer.comprobante}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Pequeña pausa entre descargas
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResult(`✅ ${transfers.length} PDFs generados y descargados`);
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ejemplos de Uso</h1>
        <p className="text-gray-600 mb-8">
          Prueba diferentes formas de generar PDFs con el módulo de documentos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Generar un PDF</h2>
            <p className="text-gray-600 text-sm mb-4">
              Crea un comprobante de transferencia y descárgalo automáticamente
            </p>
            <button
              onClick={generatePDFFromData}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              📥 Descargar PDF
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Almacenar PDF</h2>
            <p className="text-gray-600 text-sm mb-4">
              Genera el PDF y almacénalo en base64 para procesamiento posterior
            </p>
            <button
              onClick={generatePDFAndStore}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              💾 Guardar en Memoria
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Generar múltiples PDFs</h2>
            <p className="text-gray-600 text-sm mb-4">
              Crea y descarga varios comprobantes en un lote (con pequeños delays)
            </p>
            <button
              onClick={generateMultiplePDFs}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              🔄 Generar Lote (3 PDFs)
            </button>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-800 mb-2">Resultado:</h3>
            <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
              {result}
            </p>
          </div>
        )}

        {/* Documentación */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📖 Documentación Rápida</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-800">Endpoint de API</h4>
              <code className="bg-gray-100 p-2 rounded block text-sm mt-1">
                POST /api/transfer-document
              </code>
            </div>

            <div>
              <h4 className="font-bold text-gray-800">Estructura de datos requeridos</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  comprobante: "IVXOB2VGYU",
  fecha: "14 Jun 2026 - 01:36 p m.",
  valor: "72.000",
  banco: "Nequi",
  numeroCuenta: "3183095726",
  tipo: "Transferencia bancaria",
  concepto: "Pago de servicios"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-bold text-gray-800">Respuesta</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
                <li>Content-Type: application/pdf</li>
                <li>PDF descargable y editable</li>
                <li>Nombre: transferencia-{'{comprobante}'}.pdf</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Links útiles */}
        <div className="bg-blue-50 rounded-lg shadow-lg p-6 mt-8">
          <h3 className="font-bold text-gray-800 mb-3">🔗 Enlaces útiles</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/admin/documentos" className="text-blue-600 hover:underline">
                → Editor principal de documentos
              </a>
            </li>
            <li>
              <a href="/api/transfer-document" className="text-blue-600 hover:underline">
                → Documentación de API (GET)
              </a>
            </li>
            <li>
              <a href="/admin" className="text-blue-600 hover:underline">
                → Panel administrativo
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
