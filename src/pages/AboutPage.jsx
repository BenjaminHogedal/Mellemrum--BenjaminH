import { Link } from "react-router";

export default function AboutPage() {
  return (
    <>
      <header className="page-header about-header">
        <p className="eyebrow">Om platformen</p>
        <h1>Vi skaber mellemrum i kalenderen.</h1>
      </header>
      <main className="narrow-page">
        <p className="lead">
          Mellemrum samler udvalgte kulturoplevelser i Aarhus og gør det lettere at opdage noget, du ikke allerede
          kendte.
        </p>
        <h2>En enkel vej til lokale oplevelser</h2>
        <p>
          Platformen er udviklet som en første prototype for et lille kulturteam. Målet er at skabe et overskueligt
          sted, hvor arrangører kan dele events, og hvor brugere hurtigt kan finde og tilmelde sig en oplevelse.
        </p>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-intro">
            <p className="footer-brand">
              mellemrum<span>.</span>
            </p>
            <p>Udvalgte kulturoplevelser og nye perspektiver på Aarhus.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            <div className="footer-link-group">
              <p className="footer-heading">Udforsk</p>
              <Link to="/">Events</Link>
              <Link to="/om">Om Mellemrum</Link>
            </div>
            <div className="footer-link-group">
              <p className="footer-heading">For arrangører</p>
              <Link to="/tilmeldinger">Se tilmeldinger</Link>
              <a href="mailto:hej@mellemrum.dk">Kontakt os</a>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-meta">© 2026 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
