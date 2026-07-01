import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ThankYouPage from "./pages/ThankYouPage";
import AdminPage from "./pages/AdminPage";
import QRCodePage from "./pages/QRCodePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tak" element={<ThankYouPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/qr" element={<QRCodePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;