# Mapa de Zonas Afectadas Venezuela

App web para ayudar a la diáspora venezolana a buscar información por zona tras el
terremoto del **24 de junio de 2026**: nivel de daño, estado de servicios
(luz/agua/señal/vías), refugios cercanos y reportes recientes con su fuente.

Una sola app **Next.js** (frontend + API + base de datos), pensada para desplegar
**gratis en Vercel** con **Postgres de Neon**.

> ⚠️ **Datos sembrados de demostración.** Los valores incluidos son ilustrativos para
> probar la app. No son información verificada — reemplázalos con reportes de fuentes
> oficiales antes de usar en producción.

## Arquitectura

```
mapa-zonas-venezuela/
├── app/
│   ├── page.tsx            ← home: mapa + buscador + ficha + feed
│   ├── reportar/page.tsx   ← formulario de reporte ciudadano
│   └── api/                ← API (route handlers de Next.js)
│       ├── zones/          ← GET lista, GET [slug] ficha
│       ├── reports/        ← GET feed, POST reporte ciudadano (→ moderación)
│       ├── shelters/       ← GET refugios
│       └── admin/reports/  ← moderación (protegida por token)
├── components/             ← Map, ZoneSearch, ZoneDetail, ReportsFeed, ReportForm
├── lib/                    ← db (Prisma), validación (zod), tipos, cliente del API
├── prisma/
│   ├── schema.prisma       ← esquema de datos (Zone, Report, Shelter)
│   └── seed.ts             ← datos sembrados (6 estados)
└── public/                 ← venezuela-estados.geojson (placeholder)
```

## Modelo de datos

- **Zone** — estado/municipio/ciudad. Resumen agregado: `damageLevel`, servicios
  (`powerStatus`, `waterStatus`, `signalStatus`, `roadsStatus`), centroide
  (`latitude`/`longitude`), `isoCode` (para casar con el GeoJSON) y marca del último reporte.
- **Report** — entrada fechada (el feed). Los reportes ciudadanos entran con
  `status="pending"` (cola de moderación) y **no se publican automáticamente**.
- **Shelter** — refugio físico dentro de una zona (capacidad, ocupación, estado, contacto).

## Desarrollo local

Requisitos: Node.js 18+. Necesitas una base de datos Postgres (puedes usar la misma de
Neon para desarrollo, o un Postgres local).

```bash
cp .env.example .env        # completa DATABASE_URL, DIRECT_URL, ADMIN_TOKEN
npm install
npm run db:setup            # prisma db push + seed (crea tablas y siembra datos)
npm run dev                 # http://localhost:3000
```

## Desplegar en producción (gratis)

### 1. Crear la base de datos en Neon

1. Crea una cuenta en <https://neon.tech> y un proyecto (elige una región cercana).
2. En **Connection Details** copia **dos** cadenas:
   - La **pooled** (el host incluye `-pooler`) → será `DATABASE_URL`.
   - La **direct** (sin `-pooler`) → será `DIRECT_URL`.
3. Crea las tablas y siembra los datos desde tu máquina, apuntando a Neon:
   ```bash
   # con DATABASE_URL y DIRECT_URL de Neon en tu .env
   npm run db:setup
   ```

### 2. Subir el código a GitHub

```bash
git init && git add -A && git commit -m "MVP Mapa de Zonas Afectadas Venezuela"
# crea un repo en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/mapa-zonas-venezuela.git
git branch -M main && git push -u origin main
```

### 3. Desplegar en Vercel

1. Entra a <https://vercel.com>, **Add New → Project**, e importa el repo de GitHub.
2. Framework: **Next.js** (se detecta solo). No cambies el directorio raíz.
3. En **Environment Variables** agrega:
   - `DATABASE_URL` → la cadena **pooled** de Neon
   - `DIRECT_URL` → la cadena **direct** de Neon
   - `ADMIN_TOKEN` → un token largo y secreto
4. **Deploy**. Al terminar tendrás una URL pública (ej. `tu-proyecto.vercel.app`)
   que cualquiera puede abrir.

> Para un dominio propio (ej. `zonasvenezuela.org`): en Vercel → Project → **Domains**,
> agrega el dominio y sigue las instrucciones de DNS.

## API

| Método | Ruta                          | Descripción                                      |
|--------|-------------------------------|--------------------------------------------------|
| GET    | `/api/health`                 | Healthcheck                                       |
| GET    | `/api/zones`                  | Lista de zonas (mapa y buscador)                  |
| GET    | `/api/zones/:slug`            | Ficha de zona con refugios y reportes publicados  |
| GET    | `/api/reports?zone=&limit=`   | Feed de reportes publicados                       |
| POST   | `/api/reports`                | Crea reporte ciudadano → cola de moderación       |
| GET    | `/api/shelters?zone=`         | Refugios (opcional por zona)                      |

**Moderación** (header `x-admin-token: <ADMIN_TOKEN>`):

| Método | Ruta                                 | Descripción                                |
|--------|--------------------------------------|--------------------------------------------|
| GET    | `/api/admin/reports?status=pending`  | Cola de reportes pendientes                 |
| PATCH  | `/api/admin/reports/:id`             | `{ "status": "published" \| "rejected" }`   |

Ejemplo para aprobar un reporte:

```bash
curl -X PATCH https://TU-APP.vercel.app/api/admin/reports/1 \
  -H "Content-Type: application/json" \
  -H "x-admin-token: TU_TOKEN" \
  -d '{"status":"published"}'
```

## Mapa coloreado por estado (choropleth)

El mapa ya incluye `public/venezuela-estados.geojson` con los **25 estados** de Venezuela
(Natural Earth, dominio público), así que muestra los **polígonos** coloreados por nivel de
daño desde el inicio, además de marcadores en los estados con datos. El casado se hace por
código `iso_3166_2` (ej. `"VE-U"`) y, como respaldo, por `name`; ver `components/Map.tsx`.
Los estados sin datos se pintan en gris.

## Próximos pasos sugeridos

- Panel web de moderación (hoy es vía API con token).
- GeoJSON real de estados + zoom a municipios.
- Rate limiting y captcha en el formulario de reporte.
- Suscripción/alertas por zona.
