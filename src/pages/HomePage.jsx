import { useEffect, useState } from "react";
import { Link } from "react-router";
import { sampleEvents } from "../data/sampleData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

function filterEvents(events, search, category) {
  return events.filter((event) => {
    const matchesSearch = `${event.title} ${event.summary} ${event.venue_name}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;
    return matchesSearch && matchesCategory;
  });
}

export default function HomePage() {
  const [events, setEvents] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvents() {
      if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/events?select=*&order=date.asc`, { headers });
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    }

    getEvents();
  }, []);

  const categories = ["Alle", ...new Set(events.map((event) => event.category))];

  function handleSearch(value) {
    setSearch(value);
    setFilteredEvents(filterEvents(events, value, category));
  }

  function handleCategory(value) {
    setCategory(value);
    setFilteredEvents(filterEvents(events, search, value));
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select value={category} onChange={(event) => handleCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {loading && <p className="message">Henter events...</p>}

        <section className="event-grid">
          {filteredEvents.map((event) => {
            const date = new Date(event.date);
            return (
              <article className="event-card" key={event.id}>
                <img src={event.image} alt="" />
                <div className="event-card-content">
                  <p className="event-category">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <div className="event-meta">
                    <span>{date.toLocaleDateString("da-DK", { day: "numeric", month: "short" })}</span>
                    <span>{event.venue_name}</span>
                  </div>
                  <Link className="card-link" to={`/events/${event.id}`}>
                    Læs mere
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="internal-link">
          <span>For arrangører</span>
          <Link to="/tilmeldinger">Se tilmeldinger</Link>
        </aside>
      </main>
    </>
  );
}
