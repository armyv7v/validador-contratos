import db from '../../../db.json';

type Firmante = {
  nombre: string;
  rut: string;
  email: string;
  fecha: string;
  ip: string;
  token: string;
};

type Documento = {
  empresa: string;
  tipo_documento: string;
  estado: string;
  firmantes: Firmante[];
};

export default async function PaginaValidacion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const documento = (db as Record<string, Documento>)[id];

  if (!documento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="p-8 bg-white rounded-lg shadow-md text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-2">❌ Documento no encontrado</h1>
          <p className="text-gray-600">El código QR escaneado no es válido o el documento no existe en nuestro sistema.</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">Volver al inicio</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">✅ Documento Validado Exitosamente</h1>
          <p className="text-green-100 mt-1">Este documento es auténtico y legal</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Detalles del Documento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Empresa</p>
                <p className="font-semibold text-gray-800">{documento.empresa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Documento</p>
                <p className="font-semibold text-gray-800">{documento.tipo_document_o || documento.tipo_documento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                  {documento.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">ID de Validación</p>
                <p className="font-mono text-sm text-gray-800">{id}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mt-6 mb-4">Información de Firmas Electrónicas</h2>
          
          <div className="space-y-4">
            {documento.firmantes.map((firmante, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-blue-700">{firmante.nombre}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Firmante {index + 1}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                  <p><strong>RUT:</strong> {firmante.rut}</p>
                  <p><strong>Email:</strong> {firmante.email}</p>
                  <p><strong>Fecha:</strong> {firmante.fecha}</p>
                  <p><strong>IP:</strong> {firmante.ip}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Token de Verificación</p>
                  <p className="text-xs font-mono text-gray-500 break-all bg-white p-2 rounded border border-gray-100">
                    {firmante.token}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Este sistema de validación garantiza que el documento físico coincide con el registro digital original.</p>
          </div>
        </div>
        
      </div>
      <a href="/" className="mt-8 text-gray-500 hover:text-gray-700 transition flex items-center gap-2">
        <span>←</span> Volver al inicio
      </a>
    </div>
  );
}
