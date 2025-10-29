export const metadata = {
  title: 'Terms of Service - MartiDeals',
  description: 'Terms and conditions for using MartiDeals services and website.',
}

export default function TermsOfService() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--spacing-4)' }}>
      <div className="terms-page">
        <header className="page-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: October 27, 2025</p>
        </header>

        <div className="content">
          <section>
            <h2>📋 Agreement to Terms</h2>
            <p>
              By accessing and using MartiDeals ("we," "our," or "us"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section>
            <h2>🎯 Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials on MartiDeals' 
              website for personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>attempt to decompile or reverse engineer any software contained on MartiDeals' website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and 
              may be terminated by MartiDeals at any time.
            </p>
          </section>

          <section>
            <h2>🚫 Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              <li>For any obscene or immoral purpose</li>
              <li>To interfere with or circumvent the security features of our service</li>
            </ul>
          </section>

          <section>
            <h2>👤 User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities that occur under your account.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately 
              upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2>💳 Payment Terms</h2>
            <p>
              If you purchase services or products from us, you agree to provide current, complete, 
              and accurate purchase and account information. You agree to promptly update your account 
              and other information so that we can complete your transactions and contact you as needed.
            </p>
            <p>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, 
              limit or cancel quantities purchased per person, per household, or per order.
            </p>
          </section>

          <section>
            <h2>🔄 Refunds and Returns</h2>
            <p>
              All sales are final unless otherwise stated. We may offer refunds or exchanges at our 
              sole discretion. If you believe you are entitled to a refund, please contact our 
              customer service team within 30 days of your purchase.
            </p>
          </section>

          <section>
            <h2>📝 Content</h2>
            <p>
              Our service allows you to post, link, store, share and otherwise make available certain 
              information, text, graphics, videos, or other material. You are responsible for the content 
              that you post to the service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting content to the service, you grant us the right and license to use, modify, 
              publicly perform, publicly display, reproduce, and distribute such content on and through the service.
            </p>
          </section>

          <section>
            <h2>🔒 Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the service, to understand our practices.
            </p>
          </section>

          <section>
            <h2>⚠️ Disclaimer</h2>
            <p>
              The information on this website is provided on an "as is" basis. To the fullest extent 
              permitted by law, this Company:
            </p>
            <ul>
              <li>excludes all representations and warranties relating to this website and its contents</li>
              <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
            </ul>
          </section>

          <section>
            <h2>🛡️ Limitations</h2>
            <p>
              In no event shall MartiDeals or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on MartiDeals' website, even if 
              MartiDeals or a MartiDeals authorized representative has been notified orally or in writing 
              of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2>⚖️ Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of 
              California and you irrevocably submit to the exclusive jurisdiction of the courts in 
              that state or location.
            </p>
          </section>

          <section>
            <h2>🔄 Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any 
              new terms taking effect.
            </p>
          </section>

          <section>
            <h2>📞 Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:legal@martideals.com">legal@martideals.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:1-800-MARTI-01">1-800-MARTI-01</a></p>
              <p><strong>Address:</strong><br />
                MartiDeals Legal Team<br />
                123 Privacy Lane<br />
                San Francisco, CA 94102
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .terms-page {
          line-height: 1.6;
        }

        .page-header {
          text-align: center;
          margin-bottom: var(--spacing-8);
          padding-bottom: var(--spacing-6);
          border-bottom: 1px solid var(--color-separator);
        }

        .page-header h1 {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-label);
          margin: 0 0 var(--spacing-3) 0;
          font-family: var(--font-family-display);
        }

        .last-updated {
          color: var(--color-secondaryLabel);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }

        section h2 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--color-label);
          margin: 0 0 var(--spacing-4) 0;
        }

        section p {
          color: var(--color-secondaryLabel);
          margin: 0 0 var(--spacing-4) 0;
        }

        section ul {
          color: var(--color-secondaryLabel);
          padding-left: var(--spacing-6);
          margin: 0 0 var(--spacing-4) 0;
        }

        section li {
          margin-bottom: var(--spacing-2);
        }

        .contact-info {
          background: var(--color-secondarySystemBackground);
          padding: var(--spacing-4);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-separator);
        }

        .contact-info p {
          margin: 0 0 var(--spacing-2) 0;
        }

        .contact-info p:last-child {
          margin: 0;
        }

        a {
          color: var(--color-primary);
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </div>
  )
}
