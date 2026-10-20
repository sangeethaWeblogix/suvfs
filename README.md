# Car sites (multi-site)

Next.js app that serves all 12 car marketplace sites (SuvForSale, UtesForSale,
4x4ForSale, …). Each site is its own Vercel project building from the
`multi-site` branch; the site is chosen by `NEXT_PUBLIC_SITE_KEY`
(see [src/config/sites.ts](src/config/sites.ts)).

Run one site locally: `npm run site -- <key>` (e.g. `npm run site -- utes`).

## Deploying: choose which sites rebuild

Every push to `multi-site` would otherwise rebuild **all 12 sites**. To build
only the sites your change is for, put a `[sites: …]` tag in the commit message:

| Commit message                          | Sites that rebuild |
|-----------------------------------------|--------------------|
| `Fix banner text [sites: suv]`          | SUV only           |
| `Update filters [sites: utes, 4x4]`     | Utes and 4x4       |
| `Footer fix [sites: all]` *or no tag*   | All 12             |

Site keys: `suv` `utes` `peoplemovers` `sedans` `hatchbacks` `wagons` `coupes`
`convertibles` `vans` `4x4` `electric` `hybrid`

- Put the tag on the **last commit** of the push. Only that message is checked.
- With no tag, all sites build. The only exception is a push that changes only
  `public/sites/<key>/` files: then only that site builds.
- Skipped sites show as **Canceled** in Vercel. That's expected.
- If you tag a change to shared code (components, pages, `sites.ts`), the other
  sites only get it at their next build. For changes meant for every site, use
  `[sites: all]` or no tag.

How it works: each Vercel project runs
[scripts/vercel-ignore.sh](scripts/vercel-ignore.sh) as its *Ignored Build Step*
(Settings → Git) before building.

### Commit hint

`npm install` turns on a commit hook ([.githooks/commit-msg](.githooks/commit-msg)):
- If a commit has no `[sites: …]` tag, it prints a reminder.
- If the tag has an unknown site key (such as `[sites: suvs]`), it stops the
  commit, because that typo would skip every site.

If you cloned before this was added, run `npm install` once to turn it on.
