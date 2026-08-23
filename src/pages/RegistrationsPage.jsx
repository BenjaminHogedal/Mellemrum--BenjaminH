import { useEffect, useState } from "react";
import { sampleRegistrations } from "../data/sampleData";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState(sampleRegistrations);

  useEffect(() => {
    async function getRegistrations() {
      if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) return;

      const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?select=*&order=created_at.desc`, { headers });
      const data = await response.json();
      setRegistrations(data);
    }

    getRegistrations();
  }, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrations.length} tilmeldinger i alt</p>
      </header>
      <main>
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
              <span>{registration.event_title}</span>
              <span>{new Date(registration.event_date).toLocaleDateString("da-DK")}</span>
              <span className="status">{registration.status}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
