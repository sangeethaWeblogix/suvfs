# Per-site branding

Each car site reads its logo, favicon and brand colours from
`src/config/sites.ts`. Files live in `public/sites/<key>/` for every site
(suv, utes, peoplemovers, sedans, hatchbacks, wagons, coupes, convertibles,
vans, 4x4, electric, hybrid):

- `logo.svg`: header logo.
- `favicon.ico`: browser tab icon (32×32).

The network colours are the defaults for every site:

| Colour | Value | Used for |
|---|---|---|
| Primary (`color`) | `#4736FE` | buttons, links, filter highlights (`--brand`) |
| Secondary (`secondaryColor`) | `#252525` | footer background (`--brand-secondary`) |

## Changing a site's branding

1. Replace `logo.svg` / `favicon.ico` in the site's folder. Same file names
   need no code change.
2. To give one site different colours or file names, add to its line in
   `SEEDS` in `src/config/sites.ts`:
   ```ts
   color: "#E85D04", secondaryColor: "#1B1B1B", logo: "/sites/utes/logo.png",
   ```
   The RGB version of `color` is worked out automatically.
3. Commit and push to `multi-site`. Every site rebuilds.

## Listings promo cards

The "Sell my …" and "Dealer sign up" cards on the listings page are per site:
`public/sites/<key>/sell-my-<slug>.jpg` and `<slug>-dealer-advertising.jpg`.
They are rendered from the vehicle names and `color` in `src/config/sites.ts`.
After changing a site's name or colour, regenerate them:

```
node scripts/generate-site-promos.mjs            # every site except suv
node scripts/generate-site-promos.mjs utes vans  # only these sites
```

SUV keeps its original hand-made cards unless you pass `suv` explicitly.
