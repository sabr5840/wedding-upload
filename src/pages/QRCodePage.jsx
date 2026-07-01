import { QRCodeCanvas } from "qrcode.react";
import "../App.css";

function QRCodePage() {
  const uploadUrl = "https://wedding-upload-zeta.vercel.app/";

  function downloadQR() {
    const canvas = document.getElementById("qr-code-canvas");
    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "Bryllup-QR.png";
    link.click();
  }

  return (
    <main className="qrOnlyPage">
      <div className="qrOnlyBox">
        <QRCodeCanvas
          id="qr-code-canvas"
          value={uploadUrl}
          size={1000}
          includeMargin={true}
        />
      </div>

      <button className="downloadQrButton" onClick={downloadQR}>
        Download QR
      </button>
    </main>
  );
}

export default QRCodePage;