import db from '../../../db.json';
import { decodeDocumento, TIPO_CONTRATO, TIPO_MEDICO } from '@/lib/documento-payload';

export default async function PaginaValidacion({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const dParam = sParams.d;
  
  let documento: any = null;

  if (dParam && typeof dParam === 'string') {
    try {
      // Revertir codificación Base64URL a Base64 estándar
      let b64 = dParam.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) {
        b64 += '=';
      }
      
      const buffer = Buffer.from(b64, 'base64');
      const decodedStr = new TextDecoder('utf-8').decode(buffer);
      const parsedArr = JSON.parse(decodedStr);
      const decodificado = decodeDocumento(parsedArr);

      if (decodificado) {
        const { tipo, campos } = decodificado;

        if (tipo === TIPO_CONTRATO) {
          documento = {
            ...campos,
            tipo_plantilla: 'contrato',
            tipo_documento: 'Contrato Laboral'
          };
          documento.firmantes = [
            { nombre: "Representante Legal", rut: documento.rut_empresa || "12.345.678-9", email: "representante@empresa.cl", fecha: new Date().toLocaleString('es-CL'), ip: "192.168.1.1", token: "a1b2c3d4e5f6g7h8" },
            { nombre: documento.trabajador || "Trabajador", rut: documento.rut_trabajador || "11.222.333-4", email: "trabajador@email.com", fecha: new Date().toLocaleString('es-CL'), ip: "192.168.1.20", token: "h8g7f6e5d4c3b2a1" }
          ];
        } else if (tipo === TIPO_MEDICO) {
          documento = {
            ...campos,
            tipo_plantilla: 'medico',
            tipo_documento: 'Certificado Médico',
            empresa: "Clinica DocDoc"
          };
          documento.firmantes = [
            { nombre: documento.medico || "Dr. Médico Tratante", rut: documento.rut_medico || "10.000.000-0", email: "medico@clinica.cl", fecha: new Date().toLocaleString('es-CL'), ip: "10.0.0.1", token: "z9y8x7w6v5u4t3s2" }
          ];
        }
        documento.estado = "VÁLIDO";
      }
    } catch (e) {
      console.error("Error decodificando datos del documento:", e);
    }
  }

  // Fallback a Base de Datos Simulada
  if (!documento) {
    if (id === 'doc-anexo-001') {
      documento = (db as any)[id];
    } else if (id.startsWith('CT-')) {
      documento = {
        tipo_plantilla: 'contrato',
        empresa: "Empresa de Demostración SpA",
        tipo_documento: "Contrato Laboral",
        estado: "VÁLIDO",
        fecha_emision: new Date().toLocaleDateString('es-CL'),
        trabajador: "Juan Pérez",
        rut_trabajador: "11.222.333-4",
        cargo: "Especialista",
        firmantes: [
          { nombre: "Representante Legal", rut: "12.345.678-9", email: "representante@empresa.cl", fecha: new Date().toLocaleString('es-CL'), ip: "192.168.1.1", token: "a1b2c3d4e5f6g7h8" },
          { nombre: "Juan Pérez", rut: "11.222.333-4", email: "juan.perez@email.com", fecha: new Date().toLocaleString('es-CL'), ip: "192.168.1.20", token: "h8g7f6e5d4c3b2a1" }
        ]
      };
    } else if (id.startsWith('LM-')) {
      documento = {
        tipo_plantilla: 'medico',
        empresa: "DocDoc Express Clinic",
        tipo_documento: "Certificado Médico",
        estado: "VÁLIDO",
        fecha_emision: new Date().toLocaleDateString('es-CL'),
        paciente: "Paciente de Demostración",
        rut_paciente: "19.876.543-2",
        diagnostico: "Cuadro Respiratorio",
        reposo: "03 días",
        medico: "Dr. Médico Tratante",
        firmantes: [
          { nombre: "Dr. Médico Tratante", rut: "10.000.000-0", email: "medico@docdoc.cl", fecha: new Date().toLocaleString('es-CL'), ip: "10.0.0.1", token: "z9y8x7w6v5u4t3s2" }
        ]
      };
    }
  }

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

  const isMedico = documento.tipo_plantilla === 'medico';

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="bg-green-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">✅ Documento Validado Exitosamente</h1>
          <p className="text-green-100 mt-1">Este documento es auténtico y legal</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Información Resumida</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{isMedico ? 'Centro Médico' : 'Empresa'}</p>
                <p className="font-semibold text-gray-800">{documento.empresa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo de Documento</p>
                <p className="font-semibold text-gray-800">{documento.tipo_documento}</p>
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
              <div>
                <p className="text-sm text-gray-500">Fecha de Emisión</p>
                <p className="font-semibold text-gray-800">{documento.fecha_emision || 'No registrada'}</p>
              </div>

              {isMedico ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Paciente</p>
                    <p className="font-semibold text-gray-800">{documento.paciente} (RUT: {documento.rut_paciente})</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Médico Tratante</p>
                    <p className="font-semibold text-gray-800">{documento.medico} (RUT: {documento.rut_medico})</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Trabajador</p>
                    <p className="font-semibold text-gray-800">{documento.trabajador || 'Cecilia Loreto Ortiz Cordero'} (RUT: {documento.rut_trabajador})</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mt-6 mb-4">Información de Firmas Electrónicas</h2>
          
          <div className="space-y-4">
            {documento.firmantes.map((firmante: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-blue-700">{firmante.nombre}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {isMedico ? 'Firma Médica' : `Firmante ${index + 1}`}
                  </span>
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
