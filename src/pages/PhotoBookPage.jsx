import { useEffect, useState } from "react";
import "../App.css";
import supabase from "../supabaseClient";

function PhotoBookPage() {
  const [photos, setPhotos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

  async function loadPhotos() {
    const { data, error } = await supabase.storage
      .from("wedding-uploads")
      .list("adam-steffani", {
        limit: 100,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (error) {
      console.error(error);
      return;
    }

    const urls = data.map((file) => {
      const { data: publicUrlData } = supabase.storage
        .from("wedding-uploads")
        .getPublicUrl(`adam-steffani/${file.name}`);

      return publicUrlData.publicUrl;
    });

    setPhotos(urls);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  const pages = [];
  for (let i = 0; i < photos.length; i += 2) {
    pages.push(photos.slice(i, i + 2));
  }

  const currentPhotos = pages[pageIndex] || [];

  function nextPage() {
    if (pageIndex >= pages.length - 1 || flipping) return;

    setFlipping(true);
    setTimeout(() => {
      setPageIndex((current) => current + 1);
      setFlipping(false);
    }, 650);
  }

  function previousPage() {
    if (pageIndex <= 0 || flipping) return;

    setFlipping(true);
    setTimeout(() => {
      setPageIndex((current) => current - 1);
      setFlipping(false);
    }, 650);
  }

  return (
    <main className="bookDesk">
      {!isOpen ? (
        <section className="closed3DBook" onClick={() => setIsOpen(true)}>
          <div className="bookSpine" />

          <div className="bookCoverFront">
            <p>Wedding Album</p>
            <h1>Adam & Steffanis bryllup</h1>
            <span>22. august 2026</span>
            <small>Klik for at åbne</small>
          </div>
        </section>
      ) : (
        <section className="bookStage">
          <button className="bookNav left" onClick={previousPage}>
            ❮
          </button>

          <div className="open3DBook">
            <div className="bookPage3D leftPage3D">
              {currentPhotos[0] && (
                <div className="photoFrame tiltedLeft">
                  <img src={currentPhotos[0]} alt="Bryllupsminde" />
                </div>
              )}
            </div>

            <div className="bookCenterFold" />

            <div className="bookPage3D rightPage3D">
              {currentPhotos[1] && (
                <div className="photoFrame tiltedRight">
                  <img src={currentPhotos[1]} alt="Bryllupsminde" />
                </div>
              )}

              {flipping && <div className="turningPage" />}
            </div>
          </div>

          <button className="bookNav right" onClick={nextPage}>
            ❯
          </button>

          <p className="bookPageCounter">
            Side {pageIndex + 1} af {pages.length || 1}
          </p>
        </section>
      )}
    </main>
  );
}

export default PhotoBookPage;