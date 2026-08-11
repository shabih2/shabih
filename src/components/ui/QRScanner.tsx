'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './QRScanner.module.css';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize only once
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scannerRef.current.render(
        (decodedText) => {
          // Temporarily pause scanning after success to prevent multiple triggers
          if (scannerRef.current) {
            scannerRef.current.pause(true);
            onScanSuccess(decodedText);
            // We can optionally resume later if needed
          }
        },
        (errorMessage) => {
          // html5-qrcode continuously fires error when no QR is found in the frame.
          // We can ignore these routine errors.
        }
      );
    }

    return () => {
      // Cleanup when component unmounts
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className={styles.scannerWrapper}>
      <div id="qr-reader" className={styles.qrReader}></div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}
