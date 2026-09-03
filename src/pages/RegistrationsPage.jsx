import { useEffect, useState } from "react";
import {
  getRegistrations,
  deleteRegistration,
} from "../services/supabaseService";
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

  async function handleDelete(registrationId) {
    const shouldDelete = window.confirm(
      "Er du sikker på, at du vil slette denne tilmelding?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteRegistration(registrationId);

      const updatedRegistrations = await getRegistrations();
      setRegistrations(updatedRegistrations);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredRegistrations = registrations.filter((registration) => {
    const searchText = search.toLowerCase();

    const name = registration.users?.name.toLowerCase() || "";
    const event = registration.events?.title.toLowerCase() || "";

    return name.startsWith(searchText) || event.startsWith(searchText);
  });

  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    let aValue;
    let bValue;

    if (sortBy === "name") {
      aValue = a.users?.name.toLowerCase() || "";
      bValue = b.users?.name.toLowerCase() || "";
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

  const registrationsByEvent = sortedRegistrations.reduce(
    (groups, registration) => {
      const eventId = registration.eventId;

      if (!groups[eventId]) {
        groups[eventId] = {
          id: eventId,
          title: registration.events?.title || "Ukendt event",
          date: registration.events?.date,
          registrations: [],
        };
      }

      groups[eventId].registrations.push(registration);

      return groups;
    },
    {},
  );

  const eventGroups = Object.values(registrationsByEvent);

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

            <div className="registration-groups">
              {eventGroups.map((group) => (
                <section className="registration-group" key={group.id}>
                  <div className="registration-group-header">
                    <p className="eyebrow dark">Event</p>

                    <h2>{group.title}</h2>

                    <div className="registration-group-meta">
                      <p>
                        <strong>Eventdato:</strong>{" "}
                        {group.date ? formatShortDate(group.date) : ""}
                      </p>

                      <p>
                        <strong>
                          {group.registrations.length}{" "}
                          {group.registrations.length === 1
                            ? "tilmelding"
                            : "tilmeldinger"}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="registration-list">
                    <div className="registration-row registration-labels">
                      <button onClick={() => handleSort("name")}>
                        Navn{" "}
                        {sortBy === "name" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>

                      <button onClick={() => handleSort("createdAt")}>
                        Tilmeldingsdato{" "}
                        {sortBy === "createdAt" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </button>

                      <span>Status</span>

                      <span>Handling</span>
                    </div>

                    {group.registrations.map((registration) => (
                      <div className="registration-row" key={registration.id}>
                        <div>
                          <strong>{registration.users?.name}</strong>
                          <small>{registration.users?.email}</small>
                        </div>

                        <span>
                          {registration.createdAt
                            ? formatShortDate(registration.createdAt)
                            : ""}
                        </span>

                        <span className="status">{registration.status}</span>

                        <button
                          className="registration-delete-button"
                          type="button"
                          onClick={() => handleDelete(registration.id)}
                        >
                          Slet
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
