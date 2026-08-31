import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getEvents } from "../services/supabaseService";
import Footer from "../components/Footer";
import { formatEventDate } from "../utils/dateUtils";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   async function loadEvents() {
     const data = await getEvents();
     setEvents(data);
     setLoading(false);
   }

   loadEvents();
 }, []);
 
  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.category} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;
     const isUpcoming = new Date(event.date) >= new Date();

    return matchesSearch && matchesCategory && isUpcoming;
  });

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel, kategori eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="event-grid">
          {loading ? (
            <p>Indlæser events...</p>
          ) : (
            filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <img src={event.image} alt="" />
                <div className="event-card-content">
                  <p className="event-category">{event.category}</p>
                  <h3>{event.title}</h3>
                  <p>{event.summary}</p>
                  <div className="event-meta">
                    <span>{formatEventDate(event.date)}</span>
                    <span>{event.venueName}</span>
                  </div>
                  <Link className="card-link" to={`/events/${event.id}`}>
                    Læs mere
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
