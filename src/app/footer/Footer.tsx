import "./footer.css?=22";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import BackToTopButton from "./BackToTopButton";
import FooterNav from "./FooterNav";
import FooterPopularLocations from "./FooterPopularLocations";
import SellByLocationLink from "./SellByLocationLink";
import { SITES, site, sitePaths } from "@/config/sites";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- social links temporarily hidden
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/caravansforsale.com.au/", Icon: FaFacebookF, className: "cfs-footer__social-link--facebook" },
  { label: "Instagram", href: "https://www.instagram.com/caravansforsale.com.au/", Icon: FaInstagram, className: "cfs-footer__social-link--instagram" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/caravansforsale-au/", Icon: FaLinkedinIn, className: "cfs-footer__social-link--linkedin" },
];

const BROWSE_LINKS = [
  { label: `All ${site.plural} for Sale`, href: "/listings/" },
  { label: `New ${site.plural}`, href: "/listings/new-condition/" },
  { label: `Used ${site.plural}`, href: "/listings/used-condition/" },
];

const LOCATION_LINKS = [
  { label: "Victoria", href: "/listings/victoria-state/" },
  { label: "New South Wales", href: "/listings/new-south-wales-state/" },
  { label: "Queensland", href: "/listings/queensland-state/" },
  { label: "Western Australia", href: "/listings/western-australia-state/" },
  { label: "South Australia", href: "/listings/south-australia-state/" },
  { label: "Tasmania", href: "/listings/tasmania-state/" },
];

/** Same city set as the home page's "Find {Site} for Sale by Popular
 * Location" section (HomeLocationSection.tsx) — major + minor cities. */
const POPULAR_LOCATIONS = [
  { label: "Adelaide", href: "/listings/south-australia-state/adelaide-region/" },
  { label: "Brisbane", href: "/listings/queensland-state/brisbane-region/" },
  { label: "Gold Coast", href: "/listings/queensland-state/gold-coast-region/" },
  { label: "Melbourne", href: "/listings/victoria-state/melbourne-region/" },
  { label: "Perth", href: "/listings/western-australia-state/perth-region/" },
  { label: "Sydney", href: "/listings/new-south-wales-state/sydney-region/" },
  { label: "Cairns", href: "/listings/queensland-state/cairns-region/" },
  { label: "Canberra", href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
  { label: "Darwin", href: "/listings/northern-territory-state/darwin-region/" },
  { label: "Geelong", href: "/listings/victoria-state/geelong-region/" },
  { label: "Hobart", href: "/listings/tasmania-state/hobart-region/" },
  { label: "Newcastle", href: "/listings/new-south-wales-state/newcastle-region/" },
  { label: "Sunshine Coast", href: "/listings/queensland-state/sunshine-coast-region/" },
  { label: "Townsville", href: "/listings/queensland-state/townsville-region/" },
  { label: "Wollongong", href: "/listings/new-south-wales-state/illawarra-region/" },
  { label: "Ballarat", href: "/listings/victoria-state/ballarat-region/" },
];

const SELLER_LINKS = [
  { label: `Sell My ${site.singular}`, href: sitePaths.sell },
  { label: "Sell by Location", href: "#footer-sell-by-location" },
  // disabled: not clickable until the seller module is live
  { label: "Seller Login", href: "https://cars.marketplacenetwork.com.au/seller-login/", disabled: true },
];

const DEALER_LINKS = [
  // disabled: not clickable until the dealer module is live
  { label: "Dealer Login", href: "https://cars.marketplacenetwork.com.au/seller-login/", disabled: true },
  { label: "Dealer Advertising", href: "/dealer-advertising/" },
  { label: "Dealer Sign Up", href: "https://cars.marketplacenetwork.com.au/car-dealer-subscription/", disabled: true },
];

const GUIDE_LINKS = [
  { label: "Blog", href: "/blog/" },
  { label: "Buyer Safety Guide", href: "/buyer-safety-guide/", nofollow: true },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact/" },
];

type NetworkSite = { key: string; logo: string; href: string; label: string };

/** "Our Marketplace Network" strip: every car site (this one is shown but not
 * linked) plus the RV marketplaces. */
const NETWORK_SITES: NetworkSite[] = [
  ...Object.values(SITES).map((s) => ({ key: s.key, logo: s.logo, href: `${s.url}/`, label: s.domain })),
  { key: "caravans", logo: "/images/our_sites/cfs-logo-black.svg", href: "https://www.caravansforsale.com.au/", label: "caravansforsale.com.au" },
  { key: "motorhomes", logo: "/images/our_sites/mfs-logo.svg", href: "https://www.motorhomesforsale.com.au/", label: "motorhomesforsale.com.au" },
  { key: "campervans", logo: "/images/our_sites/camper_logo.svg", href: "https://www.campervansforsale.au/", label: "campervansforsale.au" },
  { key: "camper-trailers", logo: "/images/our_sites/cts-logo.svg", href: "https://www.campingtrailersforsale.com.au/", label: "campingtrailersforsale.com.au" },
];

/** One pass of the strip. Rendered twice so the CSS scroll loops seamlessly;
 * the copy is hidden from screen readers and keyboard focus. */
const NetworkStripItems = ({ copy = false }: { copy?: boolean }) => (
  <ul className="cfs-footer__network-list" aria-hidden={copy || undefined}>
    {NETWORK_SITES.map((s) => (
      <li key={s.key}>
        {s.key === site.key ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.logo} alt={copy ? "" : s.label} className="cfs-footer__network-logo cfs-footer__network-logo--current" loading="lazy" />
        ) : (
          <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} tabIndex={copy ? -1 : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.logo} alt={copy ? "" : s.label} className="cfs-footer__network-logo" loading="lazy" />
          </a>
        )}
      </li>
    ))}
  </ul>
);

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Privacy Collection Statement", href: "/privacy-collection-statement/" },
  { label: "Cookie Policy", href: "/cookie-policy/" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="cfs-footer">
        <div className="container">
          {/* ── Link columns ── */}
          <div className="cfs-footer__columns">
            <div className="cfs-footer__col">
              <h4 className="cfs-footer__col-title">Browse {site.plural}</h4>
              <ul>
                {BROWSE_LINKS.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="cfs-footer__col">
              <h4 className="cfs-footer__col-title">Browse by State</h4>
              <ul>
                {LOCATION_LINKS.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>

            <div className="cfs-footer__col">
              <h4 className="cfs-footer__col-title">Popular Locations</h4>
              <FooterPopularLocations locations={POPULAR_LOCATIONS} initialCount={7} />
            </div>

            <div className="cfs-footer__col">
              <h4 className="cfs-footer__col-title">Private Sellers</h4>
              <ul>
                {SELLER_LINKS.map((l) => (
                  <li key={l.label}>
                    {l.href === "#footer-sell-by-location" ? (
                      <SellByLocationLink label={l.label} />
                    ) : l.disabled ? (
                      <a className="is-disabled" aria-disabled="true">{l.label}</a>
                    ) : (
                      <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <h4 className="cfs-footer__col-title cfs-footer__col-title--sub">For Dealers</h4>
              <ul>
                {DEALER_LINKS.map((l) => (
                  <li key={l.label}>
                    {l.disabled ? (
                      <a className="is-disabled" aria-disabled="true">{l.label}</a>
                    ) : (
                      <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cfs-footer__col">
              <h4 className="cfs-footer__col-title">Guides &amp; Support</h4>
              <ul>
                {GUIDE_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} rel={l.nofollow ? "nofollow" : undefined}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="cfs-footer__hr" />

          {/* ── Marketplace network ── */}
          <div className="cfs-footer__network">
            <h4 className="cfs-footer__network-title">Our Marketplace Network</h4>
            <div className="cfs-footer__network-strip">
              <div className="cfs-footer__network-track">
                <NetworkStripItems />
                <NetworkStripItems copy />
              </div>
            </div>
          </div>

          <hr className="cfs-footer__hr" />

          {/* ── Sell my {site} by location (accordion) ── */}
          <div id="footer-sell-by-location">
            <FooterNav />
          </div>

          {/* ── Bottom bar ── */}
          <div className="cfs-footer__bottom">
            <ul className="cfs-footer__legal">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}><a href={l.href} rel="nofollow">{l.label}</a></li>
              ))}
            </ul>
            <div className="cfs-footer__bottom-right">
              <p className="cfs-footer__copyright">
                © {currentYear ?? "----"} Marketplace Network Pty Ltd&nbsp;&nbsp;·&nbsp;&nbsp;ABN 70 694 987 052
              </p>
              {/* Social links — temporarily hidden
              <div className="cfs-footer__socials">
                {SOCIAL_LINKS.map(({ label, href, Icon, className }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`cfs-footer__social-link ${className}`}>
                    <Icon />
                  </a>
                ))}
              </div>
              */}
            </div>
          </div>
        </div>
      </footer>

      {/* To Top Button */}
      <BackToTopButton />
    </>
  );
};

export default Footer;
