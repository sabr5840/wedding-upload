import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

function QRCodePage() {
  const qrRef = useRef(null);
  const uploadUrl = window.location.origin + "/";

  function downloadQRCode() {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "adam-steffani-qr-kode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="qrOnlyPage">
      <div className="qrOnlyBox" ref={qrRef}>
        <QRCodeCanvas value={uploadUrl} size={360} />
      </div>

      <button className="downloadQrButton" onClick={downloadQRCode}>
        Download QR-kode
      </button>
    </main>
  );
}

export default QRCodePage;