import { useEffect, useState } from "react";
import "../App.css";
import supabase from "../supabaseClient";

function AdminPage() {
  const [media, setMedia] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);

  async function loadMedia() {
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("wedding-uploads")
      .list("adam-steffani", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error(error);
      alert("Kunne ikke hente billeder");
      setLoading(false);
      return;
    }

    const filesWithUrls = data.map((file) => {
      const path = `adam-steffani/${file.name}`;

      const { data: publicUrlData } = supabase.storage
        .from("wedding-uploads")
        .getPublicUrl(path);

      return {
        name: file.name,
        path,
        url: publicUrlData.publicUrl,
        type: file.metadata?.mimetype || "",
      };
    });

    setMedia(filesWithUrls);
    setLoading(false);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  function toggleSelected(path) {
    setSelected((current) =>
      current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path]
    );
  }

  function openLightbox(index) {
    setActiveIndex(index);
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? media.length - 1 : current - 1
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === media.length - 1 ? 0 : current + 1
    );
  }

  function askDeleteOne(path) {
    setConfirmDelete({
      paths: [path],
      title: "Slet billede?",
      text: "Er du sikker på, at du vil slette dette billede? Denne handling kan ikke fortrydes.",
      buttonText: "Slet billede",
    });
  }

  function askDeleteSelected() {
    if (selected.length === 0) return;

    setConfirmDelete({
      paths: selected,
      title: `Slet ${selected.length} billeder?`,
      text: "Er du sikker på, at du vil slette de valgte billeder? Denne handling kan ikke fortrydes.",
      buttonText: "Slet valgte",
    });
  }

  async function confirmDeleteFiles() {
    const { paths } = confirmDelete;

    const { error } = await supabase.storage
      .from("wedding-uploads")
      .remove(paths);

    if (error) {
      console.error(error);
      alert("Kunne ikke slette billede(r)");
      return;
    }

    setMedia((current) =>
      current.filter((item) => !paths.includes(item.path))
    );

    setSelected((current) =>
      current.filter((item) => !paths.includes(item))
    );

    setConfirmDelete(null);
    setActiveIndex(null);
  }

  async function downloadFile(item) {
    const response = await fetch(item.url);
    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  async function downloadAll() {
    for (const item of media) {
      await downloadFile(item);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  const activeItem = activeIndex !== null ? media[activeIndex] : null;

  return (
    <main className="adminPage">
      <section className="adminHeader">
        <p className="date">Adam & Steffani</p>
        <h1
        className="clickableTitle"
        onClick={() => setShowBookModal(true)}
        >
        Bryllupsgalleri
        </h1>
        <p>{media.length} minder uploadet</p>

      <div className="adminActions">
        {media.length > 0 && (
          <button className="downloadAllButton" onClick={downloadAll}>
            Download alle billeder
          </button>
        )}

        {selected.length > 0 && (
          <button className="deleteSelectedButton" onClick={askDeleteSelected}>
            Slet {selected.length} valgte
          </button>
        )}
      </div>
      </section>

      {loading && <p className="adminMessage">Henter billeder...</p>}

      {!loading && media.length === 0 && (
        <p className="adminMessage">Der er ikke uploadet noget endnu.</p>
      )}

      <section className="galleryGrid">
        {media.map((item, index) => (
          <div
            key={item.name}
            className={`galleryItem adminGalleryItem ${
              selected.includes(item.path) ? "isSelected" : ""
            }`}
          >
            <button
              className="galleryImageButton"
              onClick={() => openLightbox(index)}
            >
              {item.type.startsWith("video") ? (
                <video src={item.url} />
              ) : (
                <img src={item.url} alt="Uploadet minde" />
              )}
            </button>

            <button
              className="selectPill"
              onClick={() => toggleSelected(item.path)}
            >
              {selected.includes(item.path) ? "✓ Valgt" : "Vælg"}
            </button>
          </div>
        ))}
      </section>

      {activeItem && (
        <div className="lightboxOverlay">
          <button className="lightboxClose" onClick={closeLightbox}>
            ×
          </button>

          <button className="lightboxNav left" onClick={showPrevious}>
            ‹
          </button>

          <div className="lightboxContent">
            {activeItem.type.startsWith("video") ? (
              <video src={activeItem.url} controls autoPlay />
            ) : (
              <img src={activeItem.url} alt="Uploadet minde" />
            )}

            <div className="lightboxActions">
              <button
                className="lightboxDownload"
                onClick={() => downloadFile(activeItem)}
              >
                Download billede
              </button>

              <button
                className="lightboxDelete"
                onClick={() => askDeleteOne(activeItem.path)}
              >
                Slet dette billede
              </button>
            </div>
          </div>

          <button className="lightboxNav right" onClick={showNext}>
            ›
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="modalOverlay">
          <div className="confirmModal">
            <div className="modalHeart">🤍</div>

            <h2>{confirmDelete.title}</h2>
            <p>{confirmDelete.text}</p>

            <div className="modalActions">
              <button
                className="cancelButton"
                onClick={() => setConfirmDelete(null)}
              >
                Annuller
              </button>

              <button className="dangerButton" onClick={confirmDeleteFiles}>
                {confirmDelete.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}


        {showBookModal && (
    <div className="modalOverlay">
        <div className="confirmModal photoBookModal">
        <div className="modalHeart">📖</div>

        <h2>Digital billedbog?</h2>

        <p>
            Vil I have lavet en digital billedbog med alle billederne fra
            brylluppet? Billederne kan nemlig samles i et flot digitalt album, som I kan gemme og dele med familie og venner.
        </p>


        <div className="modalActions">
            <button
            className="cancelButton"
            onClick={() => setShowBookModal(false)}
            >
            Ikke nu
            </button>

            <button
            className="dangerButton bookButton"
            onClick={() => window.open("/billedbog", "_blank")}
            >
            Ja, lav billedbog
            </button>
        </div>
        </div>
    </div>
    )}
    </main>
  );
}

export default AdminPage;