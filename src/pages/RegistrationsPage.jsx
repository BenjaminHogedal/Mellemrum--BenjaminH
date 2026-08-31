import { useEffect, useState } from "react";
import { getRegistrations } from "../services/supabaseService";
import Footer from "../components/Footer";
import { formatShortDate } from "../utils/dateUtils";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [search, setSearch] = useState("");

  useEffect(() => {
  async function loadRegistrations() {
    const data = await getRegistrations();
    setRegistrations(data);
    setLoading(false);
  }

  loadRegistrations();
  }, []);

  function handleSort(column) {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

const filteredRegistrations = registrations.filter((registration) => {
  const searchText = search.toLowerCase();

  const name = registration.name.toLowerCase();
  const event = registration.events?.title.toLowerCase() || "";

  return name.startsWith(searchText) || event.startsWith(searchText);
});

  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    let aValue;
    let bValue;

    if (sortBy === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    }

    if (sortBy === "event") {
      aValue = a.events?.title.toLowerCase() || "";
      bValue = b.events?.title.toLowerCase() || "";
    }

    if (sortBy === "eventDate") {
      aValue = new Date(a.events?.date);
      bValue = new Date(b.events?.date);
    }

    if (sortBy === "createdAt") {
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }

    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }

    return 0;
  });

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>
          {loading
            ? "Indlæser tilmeldinger..."
            : `${registrations.length} tilmeldinger i alt`}
        </p>
      </header>

      <main>
        {loading ? (
          <p>Indlæser tilmeldinger...</p>
        ) : (
          <>
            <div className="registration-search">
              <label>
                Søg
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Søg efter navn eller event"
                />
              </label>
            </div>

            <div className="registration-list">
              <div className="registration-row registration-labels">
                <button onClick={() => handleSort("name")}>
                  Navn{" "}
                  {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>

                <button onClick={() => handleSort("event")}>
                  Event{" "}
                  {sortBy === "event" && (sortDirection === "asc" ? "↑" : "↓")}
                </button>

                <button onClick={() => handleSort("eventDate")}>
                  Eventdato{" "}
                  {sortBy === "eventDate" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>

                <button onClick={() => handleSort("createdAt")}>
                  Tilmeldt{" "}
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </button>
                <span>Status</span>
              </div>

              {sortedRegistrations.map((registration) => (
                <div className="registration-row" key={registration.id}>
                  <div>
                    <strong>{registration.name}</strong>
                    <small>{registration.email}</small>
                  </div>

                  <span>{registration.events?.title}</span>

                  <span>
                    {registration.events?.date
                      ? formatShortDate(registration.events.date)
                      : ""}
                  </span>

                  <span>
                    {registration.createdAt
                      ? formatShortDate(registration.createdAt)
                      : ""}
                  </span>

                  <span className="status">{registration.status}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
