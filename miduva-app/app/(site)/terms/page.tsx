import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal-page"
import { CONTACT_EMAIL } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms of Use — Miduva",
  description: "The terms that apply when you use miduva.com.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="29 September 2026">
      <p>
        These terms apply to your use of miduva.com (the &ldquo;site&rdquo;). By using the site you agree to them.
        Work we do for clients is governed by a separate written agreement, not by these terms.
      </p>

      <h2>Using the site</h2>
      <p>You may browse the site and contact us for legitimate business purposes. You agree not to:</p>
      <ul>
        <li>submit false, misleading or unlawful information through our forms;</li>
        <li>attempt to break, overload, scrape at scale or gain unauthorised access to the site or its systems;</li>
        <li>use the site to send spam or malicious code.</li>
      </ul>

      <h2>Content and intellectual property</h2>
      <p>
        The site&rsquo;s text, design, graphics and code belong to Miduva or its licensors. Client names and logos
        are the property of their owners and are shown to illustrate our work. You may not copy or reuse site
        content for commercial purposes without our written permission.
      </p>

      <h2>Results and figures</h2>
      <p>
        Figures, dashboards and results shown on the site are illustrative or based on past client work. Every
        business is different, and they are not a promise or guarantee of the results you will get. Any specific
        commitments are set out only in a signed client agreement.
      </p>

      <h2>No professional advice</h2>
      <p>
        Content on the site is general information. It is not tailored advice for your business until we have
        agreed an engagement with you.
      </p>

      <h2>Third-party links</h2>
      <p>The site may link to other websites. We are not responsible for their content or privacy practices.</p>

      <h2>Disclaimer and liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. We try to keep it accurate and available, but we don&rsquo;t
        guarantee that it will be error-free or uninterrupted. To the extent permitted by law, Miduva is not liable
        for any indirect or consequential loss arising from your use of the site. Nothing in these terms limits
        liability that cannot be limited by law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal data is explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows the latest version.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
