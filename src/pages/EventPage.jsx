import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {getEventById,createRegistration,getUserByEmail,createUser,} from "../services/supabaseService";
import Footer from "../components/Footer";
import { formatEventDate, formatEventTime } from "../utils/dateUtils";

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

async function handleSubmit(formEvent) {
  formEvent.preventDefault();

  setSubmitStatus("loading");

  try {
    let user = await getUserByEmail(email);

    if (!user) {
      user = await createUser({
        name,
        email,
      });
    }

   await createRegistration({
     userId: user.id,
     eventId: event.id,
   });

    setName("");
    setEmail("");
    setSubmitStatus("success");
  } catch (error) {
    console.error(error);
    setSubmitStatus("error");
  }
}

 if (!event) {
   return <p>Indlæser event...</p>;
 }

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
                {formatEventDate(event.date)} kl. {formatEventTime(event.date)}
              </p>

              <p>
                <strong>Sted</strong>

                <span>
                  {event.venues?.name}
                  <br />
                  {event.venues?.address}, {event.venues?.postalCode}{" "}
                  {event.venues?.city}
                  {event.venues?.website && (
                    <>
                      <br />
                      <a href={event.venues.website}>Besøg venue</a>
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
                type="text"
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                required
              />
            </label>

            <span>E-mail</span>

            <input
              type="email"
              value={email}
              onChange={(inputEvent) => setEmail(inputEvent.target.value)}
              placeholder="dig@example.com"
              required
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
      <Footer />
    </>
  );
}
