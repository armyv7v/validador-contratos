# Módulo de Documentos de Transferencia

Este módulo permite crear, editar y generar PDFs editables de comprobantes de transferencia bancaria.

## 📍 Ubicación

- **Componente**: `components/TransferDocumentEditor.tsx`
- **API**: `app/api/transfer-document/route.ts`
- **Página**: `app/admin/documentos`

## 🚀 Cómo Usar

### Acceso
1. Navega a `/admin/documentos` en tu aplicación
2. Verás el formulario de edición a la izquierda y la vista previa a la derecha

### Flujo
1. **Completa los campos** del formulario con los datos de la transferencia
2. **Visualiza** los cambios en tiempo real en la vista previa
3. **Descarga** el PDF editando haciendo clic en "Descargar PDF"

## 📝 Campos

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| **Número de Comprobante** | ✅ | Identificador único de la transferencia (ej: IVXOB2VGYU) |
| **Fecha y Hora** | ✅ | Timestamp de la transferencia (ej: 14 Jun 2026 - 01:36 p m.) |
| **Valor de la Transferencia** | ✅ | Monto transferido (ej: 72.000) |
| **Banco/Producto** | ✅ | Institución financiera (ej: Nequi) |
| **Número de Cuenta** | ⭕ | Cuenta destino (ej: 3183095726) |
| **Tipo de Transacción** | ⭕ | Clasificación (ej: Transferencia bancaria) |
| **Concepto** | ⭕ | Descripción del propósito |

## 🛠️ Integración Técnica

### Componente Principal
```tsx
import TransferDocumentEditor from '@/components/TransferDocumentEditor';

export default function DocumentsPage() {
  return <TransferDocumentEditor />;
}
```

### API Endpoint
```bash
POST /api/transfer-document
```

**Payload:**
```json
{
  "comprobante": "IVXOB2VGYU",
  "fecha": "14 Jun 2026 - 01:36 p m.",
  "valor": "72.000",
  "banco": "Nequi",
  "numeroCuenta": "3183095726",
  "tipo": "Transferencia bancaria",
  "concepto": "Pago de servicios"
}
```

**Response:**
- Tipo: `application/pdf`
- Nombre: `transferencia-{comprobante}.pdf`
- Contenido: PDF editable con toda la información

## 🎨 Características

✅ **Validación de campos**: Los campos requeridos se validan antes de generar  
✅ **Vista previa en vivo**: Los cambios se reflejan inmediatamente  
✅ **Mensajes de error**: Alertas claras si falta información  
✅ **Descarga automática**: El PDF se descarga sin abrir nueva pestaña  
✅ **Diseño responsivo**: Funciona en dispositivos móviles  
✅ **Formato profesional**: PDF con estructura clara y colores corporativos  

## 📦 Dependencias

El módulo usa las librerías ya instaladas en el proyecto:
- `pdf-lib`: Para generar PDFs editables
- `tailwindcss`: Para estilos (ya configurado)
- `react`: Para componentes (ya instalado)

**NO requiere instalaciones adicionales.**

## 🔧 Personalización

### Cambiar colores
Edita en `app/api/transfer-document/route.ts`:
```typescript
const primaryColor = rgb(0, 128, 128);  // Teal
const accentColor = rgb(76, 175, 80);   // Green
```

### Cambiar estructura del PDF
Modifica las funciones `drawLabel`, `drawValue` y `drawSeparator` en `route.ts`

### Agregar más campos
1. Agrega el campo a la interfaz `TransferData`
2. Agrega el input en el formulario
3. Dibuja el campo en el PDF

## 📋 Ejemplo de uso completo

```tsx
// app/admin/documentos/page.tsx
'use client';
import TransferDocumentEditor from '@/components/TransferDocumentEditor';

export default function DocumentosPage() {
  return <TransferDocumentEditor />;
}
```

Luego accede a: `http://localhost:3000/admin/documentos`

## ✅ Testing

Para probar el módulo:

1. **Valores por defecto**: El formulario viene precargado con datos de ejemplo
2. **Validación**: Intenta descargar sin llenar campos requeridos
3. **Edición**: Cambia los valores y visualiza los cambios
4. **Descarga**: Descarga el PDF y verifica que sea editable

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| PDF no se descarga | Verifica que el navegador permita descargas |
| Campos vacíos | Completa los campos requeridos (marcados con *) |
| Error 500 | Revisa la consola del navegador para más detalles |
| Estilos no aplican | Asegúrate que Tailwind está compilado correctamente |

## 🔄 Próximos Pasos

Posibles mejoras futuras:
- [ ] Agregar firma digital
- [ ] Generar PDF con código QR
- [ ] Exportar a otros formatos (Word, Excel)
- [ ] Agregar plantillas personalizables
- [ ] Historial de documentos generados
- [ ] Enviar por correo directamente

---

**Creado con ❤️ para validador-contratos**
