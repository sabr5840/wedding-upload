import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

function QRCodePage() {
  const uploadUrl = "https://wedding-upload-zeta.vercel.app/";

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "Bryllup-QR.png";
    link.click();
  };

  return (
    <main className="qrPage">
      <div className="qrOnly">
        <div ref={qrRef} className="qrCanvas">
          <QRCodeCanvas
            value={uploadUrl}
            size={1000}
            includeMargin
          />
        </div>

        <button
          className="downloadButton"
          onClick={downloadQR}
        >
          Download QR
        </button>
      </div>
    </main>
  );
}

export default QRCodePage;