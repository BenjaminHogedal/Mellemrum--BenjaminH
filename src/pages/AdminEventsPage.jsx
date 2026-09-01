import { useEffect, useState } from "react";
import {
  getEvents,
  getVenues,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/supabaseService";
import Footer from "../components/Footer";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [venueId, setVenueId] = useState("");

  const [submitStatus, setSubmitStatus] = useState("idle");
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    async function loadData() {
      const eventsData = await getEvents();
      const venuesData = await getVenues();

      setEvents(eventsData);
      setVenues(venuesData);
    }

    loadData();
  }, []);

  async function handleSubmit(formEvent) {
    formEvent.preventDefault();
    setSubmitStatus("loading");

    const eventData = {
      title,
      summary,
      description,
      date,
      category,
      image,
      price: Number(price),
      venueId: Number(venueId),
    };

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, eventData);
      } else {
        await createEvent(eventData);
      }

      const updatedEvents = await getEvents();
      setEvents(updatedEvents);

      resetForm();
      setSubmitStatus("success");
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    }
  }

  function handleEdit(event) {
    setEditingEventId(event.id);

    setTitle(event.title);
    setSummary(event.summary);
    setDescription(event.description);
    setDate(event.date.slice(0, 16));
    setCategory(event.category);
    setImage(event.image);
    setPrice(event.price);
    setVenueId(event.venueId);

    setSubmitStatus("idle");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(eventId) {
    const shouldDelete = window.confirm(
      "Er du sikker på, at du vil slette eventet?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteEvent(eventId);

      const updatedEvents = await getEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error(error);
    }
  }

  function resetForm() {
    setTitle("");
    setSummary("");
    setDescription("");
    setDate("");
    setCategory("");
    setImage("");
    setPrice("");
    setVenueId("");
    setEditingEventId(null);
  }

  function handleCancelEdit() {
    resetForm();
    setSubmitStatus("idle");
  }

  return (
    <>
      <main className="admin-events-page">
        <section className="admin-events-header">
          <p className="eyebrow dark">For arrangører</p>

          <h1>Administration af events</h1>

          <p>
            Opret nye events, redigér eksisterende events og hold styr på
            arrangementerne i Mellemrum.
          </p>
        </section>

        <section className="admin-event-form-section">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow dark">
                {editingEventId ? "Redigering" : "Nyt event"}
              </p>

              <h2>{editingEventId ? "Redigér event" : "Opret event"}</h2>
            </div>

            {editingEventId && (
              <button
                className="admin-cancel-button"
                type="button"
                onClick={handleCancelEdit}
              >
                Annuller redigering
              </button>
            )}
          </div>

          <form className="admin-event-form" onSubmit={handleSubmit}>
            <label className="admin-field admin-field-wide">
              Titel
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label className="admin-field admin-field-wide">
              Kort beskrivelse
              <input
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>

            <label className="admin-field admin-field-full">
              Beskrivelse
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <label className="admin-field">
              Dato
              <input
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label className="admin-field">
              Kategori
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            </label>

            <label className="admin-field">
              Pris
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>

            <label className="admin-field">
              Venue
              <select
                value={venueId}
                onChange={(event) => setVenueId(event.target.value)}
              >
                <option value="">Vælg venue</option>

                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field admin-field-full">
              Billede
              <input
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
            </label>

            <div className="admin-form-actions">
              <button
                className="admin-primary-button"
                type="submit"
                disabled={submitStatus === "loading"}
              >
                {submitStatus === "loading"
                  ? "Gemmer..."
                  : editingEventId
                    ? "Gem ændringer"
                    : "Opret event"}
              </button>

              {submitStatus === "success" && (
                <p className="admin-success-message" role="status">
                  Eventet er gemt.
                </p>
              )}

              {submitStatus === "error" && (
                <p className="admin-error-message" role="alert">
                  Eventet kunne ikke gemmes. Prøv igen.
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="admin-event-list-section">
          <div className="admin-section-heading">
            <div>
              <p className="eyebrow dark">Eksisterende events</p>
              <h2>Alle events</h2>
            </div>

            <span className="admin-event-count">{events.length} events</span>
          </div>

          <div className="admin-event-list">
            {events.map((event) => (
              <article className="admin-event-row" key={event.id}>
                <div className="admin-event-info">
                  <p className="event-category">{event.category}</p>

                  <h3>{event.title}</h3>

                  <p>{event.venues?.name}</p>
                </div>

                <div className="admin-event-actions">
                  <button
                    className="admin-edit-button"
                    type="button"
                    onClick={() => handleEdit(event)}
                  >
                    Redigér
                  </button>

                  <button
                    className="admin-delete-button"
                    type="button"
                    onClick={() => handleDelete(event.id)}
                  >
                    Slet
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
