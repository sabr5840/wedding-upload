import { Link } from "react-router-dom";
import "../App.css";

function ThankYouPage() {
  return (
    <main className="page">
      <section className="card thankYouCard">
        <div className="thankYouHeart">🤍</div>

        <h1 className="thankYouTitle">Tusind tak</h1>

        <p className="thankYouText">
          Vi glæder os allerede til at se alle de fantastiske minder fra dagen.
        </p>

        <p className="thankYouText">
          Tak fordi du er med til at gøre vores bryllup helt særligt.
        </p>

        <div className="signature">
          Adam & Steffani
          <span>22. august 2026</span>
        </div>

        <Link to="/" className="buttonLink">
          Del flere minder
        </Link>
      </section>
    </main>
  );
}

export default ThankYouPage;