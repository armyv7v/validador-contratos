'use client';
import Scanner from '@/components/Scanner';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="text-left">
             <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-1">Validador de Contratos</h1>
             <p className="text-gray-500 text-sm sm:text-base">
               Sistema seguro para la validación de firmas y autenticidad.
             </p>
          </div>
          <div>
            <Link 
              href="/login"
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
            >
              Acceso Institucional
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col items-center">
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Escanear Documento</h2>
                <p className="text-gray-500">Coloca el código QR del contrato frente a la cámara para verificar su validez.</p>
              </div>
              <Scanner />
            </div>
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

      <footer className="border-t border-gray-200 py-8 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 Validador de Contratos</p>
        </div>
      </footer>
    </div>
  );
}
