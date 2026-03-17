'use client';
import { useState } from 'react';
import Scanner from '@/components/Scanner';
import GeneradorQR from '@/components/GeneradorQR';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Validador de Contratos</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Sistema seguro para la validación de firmas y autenticidad de documentos mediante tecnología QR.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-10 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
              activeTab === 'scan' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Validar (Escanear)
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${
              activeTab === 'generate' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generar QR
          </button>
        </div>

        <div className="flex flex-col items-center">
          {activeTab === 'scan' ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Escanear Documento</h2>
                <p className="text-sm text-gray-500">Coloca el código QR del contrato frente a la cámara.</p>
              </div>
              <Scanner />
            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Crear Nuevo Registro</h2>
                <p className="text-sm text-gray-500">Genera un contrato de prueba y descarga el PDF con su QR único.</p>
              </div>
              <GeneradorQR />
            </div>
          )}
        </div>

        {/* Info Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-blue-600 font-bold">1</div>
            <h3 className="font-bold mb-2">Seguridad</h3>
            <p className="text-sm text-gray-500">Cada QR contiene una firma criptográfica única vinculada al documento original.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-green-600 font-bold">2</div>
            <h3 className="font-bold mb-2">Transparencia</h3>
            <p className="text-sm text-gray-500">Cualquier persona con acceso al documento físico puede validar su autenticidad en segundos.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-purple-600 font-bold">3</div>
            <h3 className="font-bold mb-2">Eficiencia</h3>
            <p className="text-sm text-gray-500">Elimina la necesidad de validaciones manuales o llamadas a la entidad emisora.</p>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-gray-200 py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 Validador de Contratos - Demo para Vercel</p>
        </div>
      </footer>
    </div>
  );
}
