# Tjekliste: GitHub Pages, React Router og Supabase

Brug denne tjekliste, hvis projektet ikke er lavet ud fra starter-templaten, eller hvis noget ikke virker efter deployment.

Arbejd oppefra og ned. Først skal appen virke lokalt. Derefter skal GitHub Pages virke. Til sidst skal Supabase virke både lokalt og online.

## 1. Appen virker lokalt

- Projektet er et Vite React projekt.
- Dependencies er installeret med `npm install`.
- `npm run dev` starter appen lokalt.
- Appen kan åbnes i browseren.
- `npm run build` bygger projektet uden fejl.
- React Router er installeret:

```bash
npm install react-router
```

## 2. React Router er sat rigtigt op

- `src/main.jsx` bruger `BrowserRouter`.
- `BrowserRouter` har `basename={import.meta.env.BASE_URL}`.

Eksempel:

```jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  <App />
</BrowserRouter>
```

- Routes ligger i fx `src/App.jsx`.
- Interne links bruger `Link` eller `NavLink` fra `react-router`.
- Interne links bruger ikke almindelige `<a href="">`.

## 3. Vite kender GitHub Pages base path

GitHub Pages viser typisk projektet på en URL som:

```text
https://brugernavn.github.io/repository-navn/
```

Derfor skal projektet kende repository-navnet.

- `package.json` har en `base`, der matcher repository-navnet:

```json
"base": "/repository-navn/"
```

- `vite.config.js` bruger denne `base`, når projektet bygges.

Din `vite.config.js` skal se sådan ud:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pkg from "./package.json";

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === "serve" ? "/" : pkg.base,
  };
});
```

## 4. Filer og billeder bruger rigtige stier

- `index.html` loader React med absolut sti:

```html
<script type="module" src="/src/main.jsx"></script>
```

- Billeder fra `src/assets` importeres i komponenten.
- Filer fra `public/` bruger `import.meta.env.BASE_URL`, hvis de bruges i React:

```jsx
const imageUrl = `${import.meta.env.BASE_URL}logo.webp`;
```

## 5. GitHub Pages workflow findes

- Projektet er pushet til GitHub.
- GitHub Pages er sat til **GitHub Actions** under **Settings** -> **Pages**.
- Workflow-filen ligger i projektroden her: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
- Stien betyder: mappen `.github`, undermappen `workflows`, filen `deploy.yml`.
- Workflowet installerer pakker.
- Workflowet bygger projektet.
- Workflowet uploader `dist`.
- Workflowet kopierer `dist/index.html` til `dist/404.html`.

`404.html` er vigtigt for React Router. Det gør, at refresh på fx `/about` eller `/posts` stadig åbner React-appen.

## 6. GitHub Pages er testet

- GitHub Actions workflowet er grønt.
- Forsiden virker på GitHub Pages.
- En underside virker, fx `/about`.
- Refresh på en underside virker.
- Direkte åbning af en underside virker.

## 7. Supabase-tabellen er klar

- Supabase projektet findes.
- Der findes en tabel, der hedder `posts`.
- Tabellen har disse kolonner:

| Kolonne      | Type        | Note                         |
| ------------ | ----------- | ---------------------------- |
| `id`         | int8/bigint | Kan laves automatisk         |
| `created_at` | timestamptz | Kan laves automatisk         |
| `caption`    | text        | Skal udfyldes for hver post  |
| `image`      | text        | Skal udfyldes med en fuld URL |

- Tabellen har mindst 2-3 test-rækker.
- De studerende skal som minimum indsætte `caption` og `image`.
- `image` indeholder en fuld URL til et billede.
- Tabellen må læses offentligt via Supabase RLS/policies.

## 8. Lokale env-filer er klar

- Projektet har en `.env.example`, der viser hvilke variabler der skal bruges.
- Projektet har en lokal `.env` med de rigtige Supabase værdier.
- `.env` bliver ikke committet til GitHub.
- `.gitignore` ignorerer `.env`.
- Vite dev-serveren er genstartet efter ændringer i `.env`.

`.env.example` skal vise strukturen med eksempelværdier:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co/rest/v1/posts
VITE_SUPABASE_APIKEY=sb_publishable_your_key_here
```

`.env` skal have de rigtige værdier fra jeres Supabase projekt.

## 9. React henter posts fra Supabase

- Der findes en side til posts, fx `src/pages/PostsPage.jsx`.
- Siden er koblet på React Router, fx med route `/posts` i `src/App.jsx`.
- Navigationen linker til `/posts`, hvis siden skal kunne åbnes fra menuen.
- React-koden læser env-variabler med `import.meta.env`.
- Fetch-kaldet sender Supabase API key i headers.
- Data gemmes i state.
- Siden mapper over data og viser posts.

Kort eksempel på en `PostsPage` med `useEffect`:

```jsx
import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch(URL, { headers });
      const data = await response.json();
      setPosts(data);
    }

    getPosts();
  }, []);

  return (
    <main>
      {posts.map((post) => (
        <article key={post.id}>
          <img src={post.image} alt="" />
          <h2>{post.caption}</h2>
        </article>
      ))}
    </main>
  );
}
```

## 10. Supabase virker på GitHub Pages

`.env` findes kun lokalt. Derfor skal GitHub Actions også kende Supabase værdierne.

- GitHub repository har disse repository variables under **Settings** -> **Secrets and variables** -> **Actions** -> **Variables**:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_APIKEY
```

- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) sender variablerne videre til `npm run build`.
- GitHub Actions workflowet er kørt igen efter variablerne blev oprettet.

## 11. Supabase er testet

- `/posts` virker lokalt.
- `/posts` virker på GitHub Pages.
- Browserens DevTools -> Network viser et kald til Supabase.
- Supabase-kaldet får status `200`.

## Hurtig fejlfinding

Hvis GitHub Pages viser 404 på undersider:

- Tjek `basename={import.meta.env.BASE_URL}`.
- Tjek `base` i `package.json`.
- Tjek `base` i `vite.config.js`.
- Tjek at `dist/index.html` kopieres til `dist/404.html`.

Hvis CSS eller billeder mangler:

- Tjek `base`.
- Tjek stier til filer i `public/`.
- Brug `import.meta.env.BASE_URL` til public assets i React.

Hvis `/posts` virker lokalt, men ikke på GitHub Pages:

- Tjek GitHub repository variables.
- Tjek at variablerne sendes med i [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
- Kør deployment igen.

Hvis `/posts` er tom:

- Tjek at Supabase-tabellen hedder `posts`.
- Tjek at kolonnerne hedder `caption` og `image`.
- Tjek at tabellen har data.
- Tjek RLS/policies i Supabase.
