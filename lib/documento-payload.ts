export const TIPO_CONTRATO = 'c';
export const TIPO_MEDICO = 'm';

export type TipoDocumento = typeof TIPO_CONTRATO | typeof TIPO_MEDICO;

export const CONTRATO_FIELDS = [
  'id',
  'fecha_emision',
  'empresa',
  'rut_empresa',
  'trabajador',
  'rut_trabajador',
  'cargo',
  'sueldo',
] as const;

export const MEDICO_FIELDS = [
  'id',
  'fecha_emision',
  'paciente',
  'rut_paciente',
  'fecha_nacimiento',
  'edad',
  'direccion',
  'institucion',
  'diagnostico',
  'reposo',
  'fecha_inicio',
  'fecha_fin',
  'tratamiento',
  'medico',
  'especialidad',
  'rut_medico',
  'registro_medico',
] as const;

export type ContratoDoc = { [K in typeof CONTRATO_FIELDS[number]]: string };
export type MedicoDoc = { [K in typeof MEDICO_FIELDS[number]]: string };

const fieldsFor = (tipo: TipoDocumento) =>
  tipo === TIPO_CONTRATO ? CONTRATO_FIELDS : MEDICO_FIELDS;

export function encodeDocumento(
  tipo: TipoDocumento,
  doc: ContratoDoc | MedicoDoc,
): string[] {
  const source = doc as Record<string, string>;
  return [tipo, ...fieldsFor(tipo).map((campo) => source[campo] ?? '')];
}

export interface DocumentoDecodificado {
  tipo: TipoDocumento;
  campos: Record<string, string>;
}

export function decodeDocumento(parsed: unknown): DocumentoDecodificado | null {
  if (!Array.isArray(parsed)) return null;

  const tipo = parsed[0];
  if (tipo !== TIPO_CONTRATO && tipo !== TIPO_MEDICO) return null;

  const campos: Record<string, string> = {};
  fieldsFor(tipo).forEach((campo, index) => {
    campos[campo] = parsed[index + 1] ?? '';
  });

  return { tipo, campos };
}
