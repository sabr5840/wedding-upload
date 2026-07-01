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
    <main className="qrOnlyPage">
      <QRCodeCanvas
        value={uploadUrl}
        size={1200}
        includeMargin={true}
      />

      <button onClick={downloadQR}>
        Download QR
      </button>
    </main>
  );
}

export default QRCodePage;