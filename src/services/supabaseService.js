const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function getEvents() {
  const response = await fetch(
    `${SUPABASE_URL}/events?select=*,venues(*)&order=date.asc`,
    {
      headers,
    },
  );

  return await response.json();
}

export async function getVenues() {
  const response = await fetch(`${SUPABASE_URL}/venues?order=name.asc`, {
    headers,
  });

  return await response.json();
}

export async function getEventById(eventId) {
  const response = await fetch(
    `${SUPABASE_URL}/events?select=*,venues(*)&id=eq.${eventId}`,
    {
      headers,
    },
  );

  const data = await response.json();
  return data[0];
}

export async function getRegistrations() {
  const response = await fetch(
    `${SUPABASE_URL}/registrations?select=id,createdAt,name,email,status,eventId,events(title,date)&order=createdAt.desc`,
    { headers },
  );

  return await response.json();
}

export async function createRegistration(registration) {
  const response = await fetch(`${SUPABASE_URL}/registrations`, {
    method: "POST",
    headers,
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    throw new Error("Tilmeldingen kunne ikke gemmes");
  }
}

export async function createEvent(event) {
  const response = await fetch(`${SUPABASE_URL}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Eventet kunne ikke oprettes");
  }
}

export async function updateEvent(eventId, event) {
  const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Eventet kunne ikke opdateres");
  }
}

export async function deleteEvent(eventId) {
  const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Eventet kunne ikke slettes");
  }
}
