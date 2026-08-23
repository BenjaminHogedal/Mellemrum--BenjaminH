# Mellemrum

Mellemrum er en React-prototype for en lokal kultur- og eventplatform. Projektet er startpunktet for Case 1 i Product Optimization.

## Funktioner

- Eventoversigt med søgning og kategorier
- Detaljeside for det enkelte event
- Tilmeldingsformular med foreløbig håndtering i konsollen
- Intern oversigt over registrerede tilmeldinger
- React Router og deployment til GitHub Pages

## Kom i gang

```bash
npm install
npm run dev
```

Appen starter normalt på `http://localhost:5173`.

## Supabase

1. Opret eller åbn det udleverede Supabase-projekt.
2. Kør [supabase/starter.sql](supabase/starter.sql) i Supabase SQL Editor, hvis tabeller og data ikke allerede er oprettet.
3. Kopiér `.env.example` til `.env`.
4. Tilføj projektets URL og publishable key:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co/rest/v1
VITE_SUPABASE_APIKEY=your-supabase-publishable-api-key
```

5. Genstart udviklingsserveren.

Appen forventer, at events og eksisterende tilmeldinger findes i Supabase. Tilmeldingsformularen logger foreløbig de indtastede værdier i konsollen og gemmer ikke en tilmelding.

## Ruter

- `/` – eventoversigt
- `/events/:eventId` – eventdetalje og tilmelding
- `/om` – om Mellemrum
- `/tilmeldinger` – internt overblik

## Arbejdsform

Arbejd med én sammenhængende forbedring ad gangen i en tydeligt navngivet feature branch. Lav forståelige commits, verificér ændringen, og merge derefter branchen til `main`.

Arbejd ikke direkte på `main`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Deployment

Projektet deployes til GitHub Pages ved push til `main`. Tilføj `VITE_SUPABASE_URL` og `VITE_SUPABASE_APIKEY` som variables i GitHub Environment `github-pages-deployment`, før den deployede app skal hente data fra Supabase.
