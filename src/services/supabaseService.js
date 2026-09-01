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
