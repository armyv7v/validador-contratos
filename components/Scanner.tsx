'use client';
import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';

export default function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 10,
    }, /* verbose= */ false);

    scanner.render(
      (result) => {
        setScanResult(result);
        // If it's a URL from our domain, redirect
        if (result.includes('/validar/')) {
          const id = result.split('/validar/')[1];
          scanner.clear();
          router.push(`/validar/${id}`);
        }
      },
      (err) => {
        // Silent error for scanning frames
      }
    );

    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner", error));
    };
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="reader" className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm"></div>
      {scanResult && !scanResult.includes('/validar/') && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <p className="font-bold">QR detectado pero no es un contrato:</p>
          <p className="break-all">{scanResult}</p>
        </div>
      )}
    </div>
  );
}
