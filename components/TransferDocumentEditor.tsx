'use client';

import React, { useState } from 'react';
import {
  House, CreditCard, LayoutGrid, FileText, Settings,
  Wifi, BatteryMedium, Signal,
  SquareArrowOutUpRight,
  Check,
  Lightbulb,
  ChevronUp,
} from 'lucide-react';

interface TransferData {
  comprobante: string;
  fecha: string;
  valor: string;
  banco: string;
  numeroCuenta: string;
  tipo: string;
  concepto: string;
}

export default function TransferDocumentEditor() {
  const [formData, setFormData] = useState<TransferData>({
    comprobante: 'IVXOB2VGYU',
    fecha: '14 Jun 2026 - 01:36 p m.',
    valor: '72.000',
    banco: 'Nequi',
    numeroCuenta: '3183095726',
    tipo: 'Transferencia bancaria',
    concepto: 'Pago de servicios',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleGeneratePDF = async () => {
    // Validar que los campos no estén vacíos
    if (!formData.comprobante || !formData.valor || !formData.banco) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/transfer-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transferencia-${formData.comprobante}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al generar PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      comprobante: '',
      fecha: new Date().toLocaleString('es-CO'),
      valor: '',
      banco: 'Nequi',
      numeroCuenta: '',
      tipo: 'Transferencia bancaria',
      concepto: '',
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Comprobante editable</h1>
          <p className="text-gray-600">Reconstrucción editable del comprobante de transferencia enviado como referencia</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de edición */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos de la Transferencia</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                ✓ PDF generado correctamente
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Comprobante *
                </label>
                <input
                  type="text"
                  name="comprobante"
                  value={formData.comprobante}
                  onChange={handleChange}
                  placeholder="Ej: IVXOB2VGYU"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="text"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  placeholder="Ej: 14 Jun 2026 - 01:36 p m."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor de la Transferencia *
                </label>
                <input
                  type="text"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  placeholder="Ej: 72.000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banco / Producto *
                </label>
                <input
                  type="text"
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                  placeholder="Ej: Nequi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  name="numeroCuenta"
                  value={formData.numeroCuenta}
                  onChange={handleChange}
                  placeholder="Ej: 3183095726"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Transacción
                </label>
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  placeholder="Ej: Transferencia bancaria"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Concepto
                </label>
                <textarea
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleChange}
                  placeholder="Describe el propósito de la transferencia"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '⏳ Generando PDF...' : '📥 Descargar PDF'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  🔄 Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Panel de vista previa */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 sticky top-8 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vista previa del comprobante</h2>

            <div className="mx-auto h-[786px] w-[360px] overflow-hidden rounded-[3px] border border-gray-200 bg-[#f5f5f7] shadow-2xl">
              <div className="relative h-[1332px] w-[610px] origin-top-left scale-[0.590164] overflow-hidden bg-[#f7f7f8] text-[#242424]">
                <div className="absolute left-[-120px] top-[-40px] h-[260px] w-[320px] rotate-[35deg] rounded-[50%] border-[28px] border-[#ffdf20] bg-transparent" />
                <div className="absolute left-[-80px] top-[-10px] h-[220px] w-[280px] rotate-[38deg] rounded-[50%] border-[22px] border-[#f5a8c8] bg-transparent" />
                <div className="absolute right-[-160px] bottom-[-60px] h-[240px] w-[300px] -rotate-[30deg] rounded-[50%] border-[26px] border-[#05c493] bg-transparent" />
                <div className="absolute right-[100px] bottom-[120px] h-[32px] w-[32px] rounded-full bg-[#f5a8c8]" />

                <div className="absolute left-0 top-0 flex h-[43px] w-full items-center bg-[#b8b8ba] px-[23px] text-[20px] text-[#242424]">
                  <span>1:36</span>
                  <Signal size={22} strokeWidth={2} color="#242424" className="ml-[14px]" />
                  <Wifi size={22} strokeWidth={2} color="#242424" className="ml-[8px]" />
                  <BatteryMedium size={26} strokeWidth={2} color="#242424" className="ml-auto" />
                </div>

                <div className="absolute left-[281px] top-[64px] h-[44px] w-[51px] rotate-[-12deg]">
                  <span className="absolute left-[0px] top-[0px] h-[9px] w-[43px] rounded-sm bg-[#242424]" />
                  <span className="absolute left-[3px] top-[19px] h-[9px] w-[43px] rounded-sm bg-[#242424]" />
                  <span className="absolute left-[7px] top-[38px] h-[9px] w-[43px] rounded-sm bg-[#242424]" />
                </div>

                <div className="absolute right-[15px] top-[68px] flex items-center gap-[20px] text-[25px] text-[#242424]">
                  <span>Cerrar sesi...</span>
                  <SquareArrowOutUpRight size={42} strokeWidth={2} color="#242424" />
                </div>

                <div className="absolute left-[267px] top-[152px] flex h-[75px] w-[75px] items-center justify-center rounded-full border border-[#13a77d] bg-[#59d8b5]">
                  <Check size={42} strokeWidth={3} color="#202020" />
                </div>

                <h3 className="absolute left-0 top-[257px] w-full text-center text-[34px] font-extrabold leading-none tracking-[-0.035em] text-[#252525]">
                  ¡Transferencia exitosa!
                </h3>

                <p className="absolute left-0 top-[329px] w-full text-center text-[22px] leading-[28px] text-[#34343a]">
                  Comprobante No. {formData.comprobante || '—'}
                  <br />
                  {formData.fecha || '—'}
                </p>

                <div className="absolute left-[24px] top-[431px] h-[327px] w-[562px] rounded-[8px] border border-[#73ccd7] bg-[#d1f3fa] px-[25px] py-[27px] text-[#263238]">
                  <div className="flex gap-[23px]">
                    <div className="relative mt-[-1px] flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-full border border-[#76c9d4] bg-[#a9e8f1]">
                      <Lightbulb size={28} strokeWidth={2} color="#242424" />
                    </div>
                    <div className="w-[405px] text-[21px] leading-[1.42]">
                      <p>Tus transferencias a Nequi y cuentas Bancolombia no tienen costo.</p>
                      <p className="mt-[32px]">A otros bancos te cuesta $7.590 + IVA cada una. Si tienes Plan Oro o Plan Pensión 035, tienes transferencias sin costo.</p>
                      <button className="mt-[24px] rounded-full border-[2px] border-[#252525] px-[23px] py-[10px] text-[22px] font-extrabold">
                        Descubre tu plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="absolute left-[24px] top-[782px] w-[562px] overflow-hidden rounded-[8px] bg-white">
                  <div className="flex h-[87px] items-center justify-between bg-[#252320] px-[26px] text-white">
                    <span className="text-[25px] font-extrabold tracking-[0.01em]">Datos de la transferencia</span>
                    <ChevronUp size={28} strokeWidth={3} color="#ffffff" />
                  </div>
                  <div className="h-[119px] px-[27px] py-[29px]">
                    <p className="text-[20px] leading-none text-[#242424]">Valor de la transferencia</p>
                    <p className="mt-[12px] text-[27px] font-extrabold leading-none text-[#242424]">$ {formData.valor || '0'}</p>
                  </div>
                </div>

                <div className="absolute left-[24px] top-[1010px] w-[562px] overflow-hidden rounded-[8px] bg-white">
                  <div className="flex h-[88px] items-center justify-between bg-[#252320] px-[26px] text-white">
                    <span className="text-[26px] font-extrabold tracking-[0.01em]">Producto destino</span>
                    <ChevronUp size={28} strokeWidth={3} color="#ffffff" />
                  </div>
                  <div className="h-[118px] px-[27px] py-[29px]">
                    <p className="text-[20px] leading-none text-[#242424]">{formData.banco || '—'}</p>
                    <p className="mt-[15px] text-[26px] leading-none text-[#242424]">{formData.numeroCuenta || '—'}</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 flex h-[105px] items-start justify-around border-t border-gray-200 bg-white pt-[19px] text-center text-[16px] leading-[1.15] text-[#242424]">
                  <div className="flex w-[96px] flex-col items-center">
                    <House size={48} strokeWidth={2} color="#242424" />
                    <span className="mt-[8px]">Inicio</span>
                  </div>
                  <div className="flex w-[130px] flex-col items-center">
                    <CreditCard size={48} strokeWidth={2} color="#242424" />
                    <span className="mt-[8px]">Transacciones</span>
                  </div>
                  <div className="flex w-[90px] flex-col items-center">
                    <LayoutGrid size={48} strokeWidth={2} color="#242424" />
                    <span className="mt-[8px]">Explorar</span>
                  </div>
                  <div className="flex w-[125px] flex-col items-center">
                    <FileText size={48} strokeWidth={2} color="#242424" />
                    <span className="mt-[7px]">Trámites y<br />solicitudes</span>
                  </div>
                  <div className="flex w-[96px] flex-col items-center">
                    <Settings size={48} strokeWidth={2} color="#242424" />
                    <span className="mt-[8px]">Ajustes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
