// Cloudflare's Email Address Obfuscation (on in the car-site zones) rewrites
// every e-mail address in the HTML into a /cdn-cgi/l/email-protection link.
// That URL answers 404 to crawlers, so Ahrefs reported a broken internal link
// on each page showing an address. Cloudflare leaves anything between
// <!--email_off--> and <!--email_on--> alone, and React can only output HTML
// comments through dangerouslySetInnerHTML.
export const CONTACT_EMAIL = "admin@marketplacenetwork.com.au";

/** mailto: link to `email` that Cloudflare doesn't obfuscate. */
export default function ContactEmail({ email = CONTACT_EMAIL }: { email?: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a href="mailto:${email}">${email}</a><!--email_on-->`,
      }}
    />
  );
}
