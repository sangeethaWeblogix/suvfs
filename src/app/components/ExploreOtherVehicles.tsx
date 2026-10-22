import { getRelatedSites, RELATED_SITE_BENEFITS } from "@/config/relatedSites";

/**
 * "Explore Other Vehicle Options" heading + paragraph linking to this site's
 * three related car sites. `path` keeps the visitor's location on the sister
 * site (e.g. /listings/victoria-state/melbourne-region/); `label` is that
 * location's name for the heading. Callers keep their own section wrapper, so
 * pass the page's class names for the title, body and links.
 */
export default function ExploreOtherVehicles({
  path = "/",
  label,
  classes,
}: {
  path?: string;
  label?: string;
  classes: { title: string; body: string; link: string };
}) {
  const [a, b, c] = getRelatedSites();
  const link = (s: typeof a) => (
    <a href={`${s.url}${path}`} className={classes.link} target="_blank" rel="noopener noreferrer">
      {s.nounPlural} for sale{label ? ` in ${label}` : ""}
    </a>
  );

  return (
    <>
      <h2 className={classes.title}>Explore Other Vehicle Options{label ? ` in ${label}` : ""}</h2>
      <p className={classes.body}>
        Still deciding which vehicle best suits your needs? Browse {link(a)}{" "}
        for {RELATED_SITE_BENEFITS[a.key]}, explore {link(b)}{" "}
        for {RELATED_SITE_BENEFITS[b.key]}, or compare {link(c)}{" "}
        for {RELATED_SITE_BENEFITS[c.key]} across our other Australian car marketplaces.
      </p>
    </>
  );
}
