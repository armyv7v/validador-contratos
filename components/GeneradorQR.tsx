'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function GeneradorQR() {
  const [contratoGenerado, setContratoGenerado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const crearNuevoContrato = async () => {
    setLoading(true);
    // Simulation: In a real app, this would be a POST to an API/DB
    const idUnico = `CM-${Date.now()}`;
    
    // In production, use your real domain. For now, we use a placeholder.
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const urlValidacion = `${baseUrl}/validar/${idUnico}`;

    setContratoGenerado({
      id: idUnico,
      empresa: "Consultora Manzano SpA",
      tipo_documento: "Contrato de Prestación de Servicios",
      fecha_emision: new Date().toLocaleDateString(),
      url: urlValidacion
    });
    setLoading(false);
  };

  const descargarPDF = async () => {
    if (!contratoGenerado) return;
    
    try {
      const response = await fetch('/api/generar-contrato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contratoGenerado)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrato_${contratoGenerado.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm">QR</span>
        Generador de Contratos
      </h2>
      
      {!contratoGenerado ? (
        <button 
          onClick={crearNuevoContrato}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Generando...' : 'Generar Nuevo Contrato'}
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-inner mb-4">
            <QRCodeCanvas 
              value={contratoGenerado.url} 
              size={180} 
              level={"H"}
              includeMargin={true}
            />
          </div>
          
          <div className="w-full space-y-3 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">ID de Contrato</p>
              <p className="text-sm font-semibold text-gray-700">{contratoGenerado.id}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">URL de Validación</p>
              <p className="text-xs font-mono text-blue-600 break-all">{contratoGenerado.url}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => setContratoGenerado(null)}
              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Nuevo
            </button>
            <button 
              onClick={descargarPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center justify-center gap-1"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
