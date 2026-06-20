"use client";

import GeneradorQR from "@/components/GeneradorQR";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Gestión de Contratos
        </h1>
        <p className="text-gray-500">
          Genera contratos, firma electrónicamente y descarga el documento oficial con su código QR integrado.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <GeneradorQR />
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-gray-900">Documento OCR editable</h2>
        <p className="mt-2 text-gray-600">
          Genera el PDF editable para validación interna con marca de agua y texto seleccionable.
        </p>
        <Link
          href="/admin/documentos"
          className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Abrir módulo de documentos
        </Link>
      </div>
    </div>
  );
}
