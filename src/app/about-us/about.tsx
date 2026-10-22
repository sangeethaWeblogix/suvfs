'use client'

import { site } from "@/config/sites";
import { siteRange } from "@/config/siteRange";


import Link from 'next/link'

export default function AboutUs() {
  return (
    <section className="services static_page section-padding pt-30 pb-30 style-1">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-12">
            <div className="section-head mb-40">
              <h1 className="divide-orange pb-20">About Us</h1>

              <h2 className="wp-block-heading">Welcome to Marketplace Network</h2>
              <p>
                At Marketplace Network, we’re dedicated to making your {site.noun} research
                experience seamless, convenient, and importantly valuable. We have put
                together a wide range of {site.noun} models from a range
                of {site.noun} manufacturers.
              </p>

              <h4 className="wp-block-heading">Discover Your Perfect {site.singular}</h4>
              <p>
                <strong>Extensive Data :</strong> Explore thousands of new and
                used {site.nounPlural} available on Marketplace Network. With a diverse range
                of {siteRange} to choose from, we are confident that you’ll find the
                perfect {site.noun} to suit your needs and preferences.
              </p>

              <h4 className="wp-block-heading">
                Buy From Trusted Dealers and Private Sellers <strong>:</strong>
              </h4>
              <p>
                We bring together {site.nounPlural} for sale from licensed dealers and
                private sellers right across Australia, so you can compare the whole
                market in one place. Every listing shows the details that matter, such as
                make, model, year, odometer, fuel type, transmission and location, and you
                can contact the seller directly with no middleman and no commission.
              </p>

              <p>
                <strong>Advanced Search Tools:</strong> Use our advanced search filters
                to narrow down your options based on criteria such as make, model,
                location, price range, year, odometer, fuel type and more. This helps you find
                exactly what you’re looking for without hassle. In your search results,
                along with the regular {site.nounPlural} listed for sale, we will also display
                and suggest the best {site.nounPlural} in that market. We show them in the form
                of banner ads across the search results.
              </p>

              <p>
                <strong>Comparative Analysis:</strong> Make informed decisions with our
                comparative analysis tools. Easily compare multiple {site.nounPlural} side by
                side to evaluate their specifications, features, and pricing, ensuring
                you get the best value for your investment.
              </p>

              <h4 className="wp-block-heading">Comprehensive Support Services</h4>
              <p>
                <strong>Expert News and Reviews:</strong> Stay updated with the latest
                industry news, expert reviews, and insights to stay informed about
                market trends and developments.
              </p>
              <p>
                <strong>Customer Support:</strong> Our customer support team is
                available to assist you with any questions, concerns, or inquiries.
                We’re here to ensure your experience with Marketplace Network is smooth
                and satisfactory. Please email your queries to{' '}
                <Link
                  href="mailto:admin@marketplacenetwork.com.au"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  admin@marketplacenetwork.com.au
                </Link>
              </p>

              <h4 className="wp-block-heading">Browse Marketplace Network Today</h4>
              <p>
                Experience the convenience, reliability, and efficiency of Marketplace Network. If you are looking to buy a quality {site.noun} at the right
                price, we’re your trusted partner in the {site.noun} market. Join us today
                and embark on your next {site.noun} adventure with confidence!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

