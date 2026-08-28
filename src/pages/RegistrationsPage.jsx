import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getRegistrations } from "../services/supabaseService";
import Footer from "../components/Footer";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadRegistrations() {
    const data = await getRegistrations();
    setRegistrations(data);
    setLoading(false);
  }

  loadRegistrations();
  }, []);

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
          <div className="registration-list">
            <div className="registration-row registration-labels">
              <span>Navn</span>
              <span>Event</span>
              <span>Dato</span>
              <span>Status</span>
            </div>

            {registrations.map((registration) => (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{registration.name}</strong>
                  <small>{registration.email}</small>
                </div>

                <span>{registration.events?.title}</span>

                <span>
                  {registration.events?.date
                    ? new Date(registration.events.date).toLocaleDateString(
                        "da-DK",
                      )
                    : ""}
                </span>

                <span className="status">{registration.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
