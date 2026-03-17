"use client";

import GeneradorQR from "@/components/GeneradorQR";

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
    </div>
  );
}
