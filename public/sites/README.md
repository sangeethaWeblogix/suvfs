# Per-site branding

Each car site reads its logo, favicon and brand colour from
`src/config/sites.ts`. Files live in `public/sites/<key>/`.

| Site key | Folder |
|---|---|
| suv | logo at `public/images/sfs_logo.svg` |
| utes, peoplemovers, sedans, hatchbacks, wagons, coupes, convertibles, vans, 4x4, electric, hybrid | `public/sites/<key>/` |

## Adding a site's branding

1. Put the files in the site's folder:
   - `logo.svg`: header logo (SVG preferred, around 215×32; PNG works too).
   - `favicon.ico`: browser tab icon (32×32). A `favicon.png` or `.svg` also works.
2. In `src/config/sites.ts`, add to that site's line in `SEEDS`:
   ```ts
   color: "#E85D04", favicon: "/sites/utes/favicon.ico",
   ```
   - `color` is the brand colour: buttons, links, filter highlights. The RGB
     version is worked out automatically.
   - `logo` defaults to `/sites/<key>/logo.svg`, so a file with that name needs
     no setting. Set `logo: "/sites/<key>/logo.png"` for another file name.
   - Without `favicon`, the site uses the shared `/favicon.ico`.
3. Commit and push to `multi-site`. Every site rebuilds.
