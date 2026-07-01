import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import weddingFrontPic from "../assets/weddingfrontpic.jpg";
import supabase from "../supabaseClient";


function LandingPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(event) {
    setFiles([...event.target.files]);
  }

    async function handleUpload(event) {
    event.preventDefault();

    if (files.length === 0) {
        alert("Vælg mindst ét billede eller én video først");
        return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
        for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;

        const filePath = `adam-steffani/${fileName}`;

        const { error } = await supabase.storage
            .from("wedding-uploads")
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }

        setUploadProgress(100);

        await new Promise((resolve) => setTimeout(resolve, 500));

        setFiles([]);
        setGuestName("");
        navigate("/tak");
    } catch (error) {
        console.error(error);
        alert("Noget gik galt under upload. Prøv igen.");
    } finally {
        setUploading(false);
    }
    }

  return (
    <main className="page">
      <section className="card">
      <div className="hero">

          <img
            src={weddingFrontPic}
            alt="Adam og Steffani"
            className="heroImage"
          />

          <h1>
              Adam
              <span>&</span>
              Steffani
          </h1>

          <p className="date">
              Lørdag · 22. august 2026
          </p>

          <p className="welcome">
              Tak fordi du er med til at fejre vores store dag.
              Del gerne de billeder og videoer du tager,
              så vi kan samle alle minder ét sted.
          </p>
      </div>
        <p className="intro">
          Upload dine bedste billeder og videoer fra dagen.
          Så kan brudeparret gemme alle minderne ét sted.
        </p>

        <form onSubmit={handleUpload} className="form">
          <label>
            <input
              type="text"
              placeholder="Navn (valgfrit)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </label>

          <label className="uploadBox">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </label>

        

            {uploading && (
            <div className="progressWrapper">
                <div className="progressText">
                <span>Uploader minder...</span>
                <span>{uploadProgress}%</span>
                </div>

                <div className="progressBar">
                <div
                    className="progressFill"
                    style={{ width: `${uploadProgress}%` }}
                />
                </div>
            </div>
            )}

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploader..." : "Upload minder"}
          </button>
        </form>
      </section>
    </main>
  );
}


export default LandingPage;




