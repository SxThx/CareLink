// QRCodeReader.js
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeReader = () => {
  const [scanResult, setScanResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const qrCodeRegionId = 'reader';

  const onScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setErrorMessage('');
  };

  const onScanFailure = (error) => {
    setErrorMessage(`Error scanning: ${error}`);
  };

  useEffect(() => {
    const html5QrCodeScanner = new Html5QrcodeScanner(
      qrCodeRegionId,
      {
        fps: 10,    // frames per second
        qrbox: 250  // QR code scanning box size
      },
      /* verbose= */ false
    );
    
    html5QrCodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrCodeScanner.clear();
    };
  }, []);

  return (
    <div>
      <h1>QR Code Reader</h1>
      <div id={qrCodeRegionId} style={{ width: '500px', margin: 'auto' }}></div>
      {scanResult && <p className="result">Scanned QR Code: {scanResult}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default QRCodeReader;
