# Session Context: Validador de Contratos

## Proyecto
Sistema de validación de documentos y contratos mediante códigos QR, permitiendo la verificación de firmas electrónicas en tiempo real y la generación de nuevos documentos con QRs únicos integrados en PDFs.

## Estado Actual
- **Repositorio Git:** Inicializado y con el primer commit realizado (`feat: initial commit with contract validation system`).
- **Framework:** Next.js 15+ (App Router) con Tailwind CSS y TypeScript.
- **Base de Datos:** Mock local en `db.json` con datos reales de prueba (ID: `doc-anexo-001`).

## Funcionalidades Implementadas
1. **Validación Dinámica (`/validar/[id]`):** Página que recibe un ID por URL, consulta la "base de datos" y muestra el estado del documento junto con los tokens de firma electrónica.
2. **Lector QR (`Scanner.tsx`):** Componente que utiliza la cámara para escanear QRs y redirigir automáticamente a la página de validación si detecta una URL del sistema.
3. **Generador de Contratos (`GeneradorQR.tsx`):** Interfaz para crear registros de prueba, generar una URL de validación única y mostrar el código QR en pantalla.
4. **Generación de PDF con QR (`/api/generar-contrato`):** API que crea un PDF profesional (estilo carta) y "estampa" el código QR en la esquina superior derecha usando `pdf-lib`.

## Librerías Clave
- `html5-qrcode`: Para el escaneo desde el navegador.
- `pdf-lib`: Para la manipulación y creación de PDFs en el servidor.
- `qrcode` & `qrcode.react`: Para la generación de códigos QR tanto en cliente como en servidor.

## Próximos Pasos (Pendientes)
- [ ] **Despliegue en Vercel:** El proceso se inició pero requiere interacción manual para vincular el proyecto (actualmente linkeado erróneamente a otro proyecto o pendiente de confirmación).
- [ ] **Conexión a BD Real:** Migrar de `db.json` a Vercel KV, Postgres o Supabase para persistencia real.
- [ ] **Seguridad:** Implementar un sistema de autenticación simple (NextAuth o similar) para proteger la pestaña de "Generar QR".
- [ ] **Mejoras UI:** Añadir feedback sonoro al escanear y animaciones de carga en la generación del PDF.

## Instrucciones para Reiniciar
Para continuar con el despliegue, ejecutar:
```bash
npx vercel
```
*Nota: Asegurarse de crear un nuevo proyecto en Vercel en lugar de linkearlo a uno existente si no se desea sobrescribir.*
