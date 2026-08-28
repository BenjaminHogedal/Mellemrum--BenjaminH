import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEventById, createRegistration } from "../services/supabaseService";

export default function EventPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");

  useEffect(() => {
  async function loadEvent() {
    const data = await getEventById(eventId);
    setEvent(data);
  }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    setSubmitStatus("loading");

 try {
   await createRegistration({
     name,
     email,
     eventId: event.id,
   });

   setName("");
   setEmail("");
   setSubmitStatus("success");
 } 
 
 catch (error) {
   console.error(error);
   setSubmitStatus("error");
 }
  }

 if (!event) {
   return <p>Indlæser event...</p>;
 }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />

          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>

            <h1>{event.title}</h1>

            <p className="lead">{event.summary}</p>

            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <strong>Sted</strong>

                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>

              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>

            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>

            <h2>Reserver din plads</h2>

            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
              />
            </label>

            <span>E-mail</span>

            <input
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
            />

            <button type="submit" disabled={submitStatus === "loading"}>
              {submitStatus === "loading" ? "Sender..." : "Tilmeld mig"}
            </button>

            {submitStatus === "success" && (
              <p role="status">Din tilmelding er sendt.</p>
            )}

            {submitStatus === "error" && (
              <p role="alert">
                Tilmeldingen kunne ikke gennemføres. Prøv igen.
              </p>
            )}
          </form>
        </section>
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
          <p className="footer-meta">© 2025 Mellemrum</p>
          <p>Aarhus, Danmark</p>
        </div>
      </footer>
    </>
  );
}
