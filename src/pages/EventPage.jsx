import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { sampleEvents } from "../data/sampleData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(sampleEvents.find((item) => String(item.id) === eventId));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getEvent() {
      if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) return;

      const response = await fetch(`${SUPABASE_URL}/rest/v1/events?id=eq.${eventId}&select=*`, { headers });
      const data = await response.json();
      setEvent(data[0]);
    }

    getEvent();
  }, [eventId]);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    console.log({ name, email, event: event.title });
  }

  if (!event) {
    return (
      <main className="narrow-page">
        <h1>Eventet blev ikke fundet</h1>
        <Link to="/">Tilbage til events</Link>
      </main>
    );
  }

  const date = new Date(event.date);

  return (
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
              {date.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })} kl. {date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p>
              <strong>Sted</strong>
              {event.venue_name}, {event.venue_address}
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
          <p>Udfyld formularen, så sender vi din tilmelding til arrangøren.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Navn
            <input value={name} onChange={(inputEvent) => setName(inputEvent.target.value)} />
          </label>
          <span>E-mail</span>
          <input
            value={email}
            onChange={(inputEvent) => setEmail(inputEvent.target.value)}
            placeholder="dig@example.com"
          />
          <button type="submit">Tilmeld mig</button>
        </form>
      </section>
    </main>
  );
}
