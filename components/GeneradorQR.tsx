'use client';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

type TemplateType = 'contrato' | 'medico';

export default function GeneradorQR() {
  const [template, setTemplate] = useState<TemplateType>('contrato');
  const [contratoGenerado, setContratoGenerado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form states - Contrato
  const [empresa, setEmpresa] = useState('');
  const [rutEmpresa, setRutEmpresa] = useState('');
  const [trabajador, setTrabajador] = useState('');
  const [rutTrabajador, setRutTrabajador] = useState('');
  const [cargo, setCargo] = useState('');
  const [sueldo, setSueldo] = useState('');
  
  // Form states - Medico
  const [paciente, setPaciente] = useState('');
  const [rutPaciente, setRutPaciente] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [reposo, setReposo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [medico, setMedico] = useState('Pablo Z Millaleo Cea');
  const [especialidad, setEspecialidad] = useState('Medico General');
  const [rutMedico, setRutMedico] = useState('12796257-8');
  const [registroMedico, setRegistroMedico] = useState('259049');

  const calcularEdad = (fecha: string) => {
    setFechaNacimiento(fecha);
    const parts = fecha.includes('-') ? fecha.split('-') : fecha.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const y = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2]);

      if (!isNaN(y) && !isNaN(m) && !isNaN(d) && y > 1900) {
        const today = new Date();
        const birthDate = new Date(y, m - 1, d);
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
          months--;
          days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }

        if (years >= 0) {
          setEdad(`A:${years} M:${months} D:${days}`);
        }
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const idUnico = template === 'contrato' ? `CT-${Date.now()}` : `LM-${Date.now()}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    let urlValidacion = `${baseUrl}/validar/${idUnico}`;

    // Payload optimizado minimalista para el QR
    let compactPayload: any[];
    if (template === 'contrato') {
      compactPayload = [
        'c',
        idUnico,
        new Date().toLocaleDateString('es-CL'),
        empresa,
        rutEmpresa,
        trabajador,
        rutTrabajador,
        cargo,
        sueldo
      ];
    } else {
      compactPayload = [
        'm',
        idUnico,
        new Date().toLocaleDateString('es-CL'),
        paciente,
        rutPaciente,
        fechaNacimiento,
        edad,
        direccion,
        institucion,
        diagnostico,
        reposo,
        fechaInicio,
        fechaFin,
        tratamiento,
        medico,
        especialidad,
        rutMedico,
        registroMedico
      ];
    }

    // Codificar los datos arr en la URL para que la página de validación pueda leerlos
    if (typeof window !== 'undefined') {
      try {
        const jsonStr = JSON.stringify(compactPayload);
        const utf8Bytes = new TextEncoder().encode(jsonStr);
        const binaryStr = Array.from(utf8Bytes).map(b => String.fromCharCode(b)).join('');
        const base64Data = btoa(binaryStr)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        urlValidacion = `${urlValidacion}?d=${base64Data}`;
      } catch (e) {
        console.error("Error codificando datos", e);
      }
    }

    let payload: any = {
      id: idUnico,
      tipo_plantilla: template,
      url: urlValidacion,
      fecha_emision: new Date().toLocaleDateString('es-CL'),
    };

    if (template === 'contrato') {
      payload = {
        ...payload,
        tipo_documento: "Contrato Laboral",
        empresa,
        rut_empresa: rutEmpresa,
        trabajador,
        rut_trabajador: rutTrabajador,
        cargo,
        sueldo
      };
    } else {
      payload = {
        ...payload,
        tipo_documento: "Certificado Médico",
        paciente,
        rut_paciente: rutPaciente,
        fecha_nacimiento: fechaNacimiento,
        edad,
        direccion,
        institucion,
        diagnostico,
        reposo,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        tratamiento,
        medico,
        especialidad,
        rut_medico: rutMedico,
        registro_medico: registroMedico
      };
    }

    setContratoGenerado(payload);
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
        a.download = `${contratoGenerado.tipo_plantilla}_${contratoGenerado.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (contratoGenerado) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-md w-full mx-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Documento Listo</h2>
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-inner mb-4">
             <QRCodeCanvas value={contratoGenerado.url} size={180} level={"H"} includeMargin={true} />
          </div>
          <p className="text-sm text-gray-500 mb-4">{contratoGenerado.tipo_documento}</p>
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={() => setContratoGenerado(null)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Nuevo</button>
            <button onClick={descargarPDF} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">Descargar PDF</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-2xl w-full mx-auto">
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          <button 
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${template === 'contrato' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTemplate('contrato')}
          >
            Contrato Laboral
          </button>
          <button 
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${template === 'medico' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setTemplate('medico')}
          >
            Certificado Médico
          </button>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        {template === 'contrato' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-700">Nombre Empresa</label><input required value={empresa} onChange={e=>setEmpresa(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700">RUT Empresa</label><input required value={rutEmpresa} onChange={e=>setRutEmpresa(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Nombre Trabajador</label><input required value={trabajador} onChange={e=>setTrabajador(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700">RUT Trabajador</label><input required value={rutTrabajador} onChange={e=>setRutTrabajador(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Cargo</label><input required value={cargo} onChange={e=>setCargo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Sueldo Base</label><input required type="number" value={sueldo} onChange={e=>setSueldo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
          </div>
        )}

        {template === 'medico' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 text-md font-bold text-blue-800 border-b pb-1">Datos del Paciente</div>
            <div><label className="block text-xs font-medium text-gray-700">Paciente</label><input required value={paciente} onChange={e=>setPaciente(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">RUN</label><input required value={rutPaciente} onChange={e=>setRutPaciente(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Fecha Nacimiento</label><input required value={fechaNacimiento} onChange={e=>calcularEdad(e.target.value)} placeholder="DD-MM-YYYY" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Edad Formato (A:9 M:2 D:0)</label><input required value={edad} onChange={e=>setEdad(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700">Dirección</label><input required value={direccion} onChange={e=>setDireccion(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            
            <div className="sm:col-span-2 text-md font-bold text-blue-800 border-b pb-1 mt-4">Detalles Médicos</div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700">Institución destino (Para:)</label><input required value={institucion} onChange={e=>setInstitucion(e.target.value)} placeholder="Colegio Arauco Ts. Blancas" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-gray-700">Diagnóstico / Motivo</label><input required value={diagnostico} onChange={e=>setDiagnostico(e.target.value)} placeholder="Exacerbación Leve de Cuadro Asmático" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Días Reposo</label><input required type="number" value={reposo} onChange={e=>setReposo(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Tratamiento Sugerido</label><input required value={tratamiento} onChange={e=>setTratamiento(e.target.value)} placeholder="SOS" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Desde (DD/MM/YYYY)</label><input required value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Hasta (DD/MM/YYYY)</label><input required value={fechaFin} onChange={e=>setFechaFin(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>

            <div className="sm:col-span-2 text-md font-bold text-blue-800 border-b pb-1 mt-4">Datos del Médico</div>
            <div><label className="block text-xs font-medium text-gray-700">Nombre del Médico</label><input required value={medico} onChange={e=>setMedico(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">Especialidad</label><input required value={especialidad} onChange={e=>setEspecialidad(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">RUN Médico</label><input required value={rutMedico} onChange={e=>setRutMedico(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
            <div><label className="block text-xs font-medium text-gray-700">N° REG-SIS</label><input required value={registroMedico} onChange={e=>setRegistroMedico(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" /></div>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center mt-6">
          {loading ? 'Procesando...' : 'Generar Documento'}
        </button>
      </form>
    </div>
  );
}
