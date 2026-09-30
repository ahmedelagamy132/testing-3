import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal-page"
import { CookieSettingsButton } from "@/components/cookie-settings-button"
import { CONTACT_EMAIL } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Privacy Policy — Miduva",
  description: "How Miduva collects, uses and protects personal data submitted through miduva.com.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="29 September 2026">
      <p>
        This policy explains what personal data Miduva (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you visit
        miduva.com or contact us, why we collect it, and the choices you have. If anything is unclear, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>What we collect</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Data</th><th>When</th><th>Why</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name, email, company (optional) and your message</td>
              <td>You submit the contact form</td>
              <td>To reply to your enquiry and prepare a proposal</td>
            </tr>
            <tr>
              <td>Email address</td>
              <td>You subscribe to updates</td>
              <td>To send the updates you asked for</td>
            </tr>
            <tr>
              <td>Browser type (user agent) sent with a form</td>
              <td>Any form submission</td>
              <td>To spot spam and abuse</td>
            </tr>
            <tr>
              <td>IP address, pages requested, timestamps</td>
              <td>Every visit (server logs)</td>
              <td>To keep the site secure and running</td>
            </tr>
            <tr>
              <td>Usage and ad-attribution data via cookies</td>
              <td>Only if you accept analytics cookies</td>
              <td>To understand traffic and measure our own marketing</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>We do not ask for payment details, and we don&rsquo;t knowingly collect data from children.</p>

      <h2>Legal basis</h2>
      <ul>
        <li><strong>Steps before a contract / legitimate interest</strong> — replying to your enquiry and keeping the site secure.</li>
        <li><strong>Consent</strong> — analytics and advertising cookies, and marketing emails. You can withdraw consent at any time.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We don&rsquo;t sell personal data. We share it only with service providers that help us run the business:</p>
      <ul>
        <li><strong>Our hosting provider</strong> — stores the website, form submissions and server logs.</li>
        <li><strong>Resend</strong> — delivers the notification email when you submit the contact form.</li>
        <li><strong>Our CRM</strong> — where we track enquiries and follow-ups.</li>
        <li><strong>Google (Analytics) and Meta (Pixel)</strong> — only if you accept analytics cookies.</li>
      </ul>
      <p>
        Some of these providers may process data outside your country. Where that happens, we rely on the
        safeguards they offer, such as standard contractual clauses.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>We use two kinds of cookies:</p>
      <ul>
        <li>
          <strong>Essential</strong> — <code>miduva_consent</code> remembers your cookie choice for 180 days. It
          contains no personal data and is always set once you make a choice.
        </li>
        <li>
          <strong>Analytics &amp; advertising (optional)</strong> — Google Analytics (<code>_ga</code>,{" "}
          <code>_ga_*</code>) and the Meta Pixel (<code>_fbp</code>, <code>_fbc</code>). These load only after you
          click &ldquo;Accept&rdquo; and are removed if you later decline.
        </li>
      </ul>
      <p>
        <CookieSettingsButton className="font-semibold underline underline-offset-2" style={{ color: "var(--teal-500)" }} />
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Enquiries: up to 24 months after our last contact, or longer if you become a client.</li>
        <li>Subscriptions: until you unsubscribe.</li>
        <li>Server logs: up to 90 days.</li>
        <li>Analytics data: up to 14 months, the maximum Google Analytics retention setting.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the EU/UK GDPR or Saudi Arabia&rsquo;s PDPL), you can ask
        us to access, correct, delete or export your data, object to or restrict its use, or withdraw consent.
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will respond within 30 days. You also
        have the right to complain to your local data protection authority.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS, form data is stored on access-restricted servers, and only the people who
        need it to answer your enquiry can see it. No system is perfectly secure, but we take reasonable measures
        to protect your data.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy we&rsquo;ll update the date at the top. Significant changes will be highlighted
        on this page. See also our <Link href="/terms">Terms of Use</Link>.
      </p>
    </LegalPage>
  )
}
