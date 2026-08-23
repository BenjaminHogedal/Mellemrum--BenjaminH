# Supabase setup til Posts

Denne guide viser, hvordan `/posts` siden henter data fra en Supabase `posts` tabel.

Projektet bruger almindelig `fetch` i `src/pages/PostsPage.jsx`.

## Overblik

For at `/posts` virker, skal fire ting være på plads:

1. Supabase har en tabel, der hedder `posts`.
2. Tabellen har kolonnerne `id`, `created_at`, `caption` og `image`.
3. Tabellen må læses offentligt via Supabase policies.
4. Projektet har Supabase URL og publishable key i `.env`.

## 1. Tjek eller opret `posts` tabellen

Åbn Supabase og gå til **Table Editor**.

Hvis tabellen allerede findes, så åbn `posts` og tjek, at kolonnerne passer:

| Kolonne      | Type        | Bruges til                       |
| ------------ | ----------- | -------------------------------- |
| `id`         | int8/bigint | Unikt id til React `key`         |
| `created_at` | timestamptz | Tidspunkt for posten             |
| `caption`    | text        | Teksten der vises under billedet |
| `image`      | text        | URL til billedet                 |

Hvis tabellen ikke findes:

1. Klik **Create a new table**.
2. Kald tabellen `posts`.
3. Opret kolonnerne fra tabellen ovenfor.

Det vigtigste er kolonnenavnene. React-koden forventer præcis `id`, `created_at`, `caption` og `image`.

## 2. Indsæt et par test-data

Det er en god ide at indsætte 2-3 rækker med det samme, så du har noget at vise på `/posts`.

Tilføj data i Supabase med **Insert row**, eller importér data hvis I har en CSV-fil.

Du må gerne tage udgangspunkt i disse eksempler og kun indsætte `image` og `caption` i Supabase:

```json
[
  {
    "caption": "Beautiful sunset at the beach",
    "image": "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?auto=format&fit=crop&w=500&q=80"
  },
  {
    "caption": "Exploring the city streets of Aarhus",
    "image": "https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&w=500&q=80"
  },
  {
    "caption": "Delicious food at the restaurant",
    "image": "https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=500&q=80"
  }
]
```

`image` skal være en fuld URL til et billede.

## 3. Tjek læseadgang

For at React-appen kan hente posts uden login, skal tabellen tillade offentlig læsning.

1. Gå til `posts` tabellen i Supabase.
2. Find **RLS** / **Policies**.
3. Sørg for, at Row Level Security er slået til.
4. Opret en policy, der tillader `SELECT` / read access for public eller anon users.

RLS betyder Row Level Security. I denne starter må posts gerne læses offentligt, men kun fordi der er en policy, som giver lov til det.

Test gerne `/posts` før I ændrer policies. Hvis siden viser posts, er læseadgangen allerede sat rigtigt op.

## 4. Find URL og publishable key

Find disse to værdier i Supabase:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co/rest/v1/posts
VITE_SUPABASE_APIKEY=sb_publishable_your_key_here
```

`VITE_SUPABASE_URL` er URL'en til `posts` tabellen. Den skal ende på `/rest/v1/posts`.

`VITE_SUPABASE_APIKEY` er projektets publishable key.

Brug kun publishable key i frontend. Brug ikke andre Supabase keys i React-kode, Vite `.env` filer eller GitHub Pages builds.

## 5. Opsæt lokal `.env`

Projektet har en fil, der hedder `.env.example`. Den er en skabelon.

Lav en kopi af `.env.example`, og kald kopien `.env`.

Manuel måde:

1. Find `.env.example` i VS Code.
2. Kopiér filen.
3. Omdøb kopien til `.env`.
4. Udfyld værdierne i `.env`.

Terminal-måde:

```bash
cp .env.example .env
```

Kommandoen betyder: kopiér `.env.example` og lav en ny fil, der hedder `.env`. Det er det samme som at kopiere filen manuelt i VS Code.

Udfyld `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co/rest/v1/posts
VITE_SUPABASE_APIKEY=sb_publishable_your_key_here
```

Genstart Vite, hver gang `.env` ændres:

```bash
npm run dev
```

Åbn derefter:

```text
http://localhost:5173/posts
```

## 6. Opsæt GitHub Pages variabler

`.env` bliver ikke pushet til GitHub. Derfor skal GitHub Actions også kende Supabase værdierne, ellers virker `/posts` kun lokalt.

1. Gå til repository på GitHub.
2. Gå til **Settings** -> **Secrets and variables** -> **Actions**.
3. Vælg fanen **Variables**.
4. Opret disse repository variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_APIKEY
```

Workflowet i `.github/workflows/deploy.yml` sender variablerne videre til `npm run build`.

## Fejlfinding

Hvis `/posts` er tom:

1. Tjek at tabellen hedder `posts`.
2. Tjek at tabellen har rækker med `caption` og `image`.
3. Tjek at `.env` findes lokalt og starter med `VITE_`.
4. Genstart Vite dev-serveren.
5. Tjek at Supabase RLS policy tillader `select` for public/anon users.

Hvis GitHub Pages virker, men `/posts` ikke viser data:

1. Tjek repository variables i GitHub Actions.
2. Kør et nyt workflow ved at pushe en lille ændring.
3. Åbn browserens DevTools -> Network og se om kaldet til Supabase får `200`.
