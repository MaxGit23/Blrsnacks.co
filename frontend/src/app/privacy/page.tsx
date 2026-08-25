import Link from 'next/link';
import { generateSeoMetadata } from '@/lib/seo';
import { Container, PageHeader } from '@/components/layout';

export const metadata = generateSeoMetadata({
  title: 'Privacy Policy',
  description: 'How BLR Snacks collects, uses, and protects your personal information.',
  path: '/privacy',
});

const LAST_UPDATED = '24/08/2026';

interface Section {
  heading: string;
  body: (string | string[])[];
}

const sections: Section[] = [
  {
    heading: 'Personal information we collect',
    body: [
      'When you visit the Site, we do not track your browsing behaviour. We do not use analytics tools, advertising trackers, or behavioural profiling of any kind. The Site stores no tracking or marketing cookies on your device.',
      'The only data stored on your device is a small entry in your browser\'s local storage that remembers the items in your snack cart between visits. This never leaves your browser and is used purely to display your cart.',
      'When you place an order or attempt to place an order through the Site, we collect certain information from you, including your name, billing address, shipping address, email address, and phone number. We refer to this information as "Order Information". All orders are Cash on Delivery — we do not collect any payment or card information through the Site.',
      'When we talk about "Personal Information" in this Privacy Policy, we are talking about Order Information.',
    ],
  },
  {
    heading: 'How we use your personal information',
    body: [
      'We use the Order Information that we collect generally to fulfil any orders placed through the Site, including arranging for delivery and providing you with invoices and/or order confirmations. Additionally, we use this Order Information to:',
      [
        'Communicate with you about your order;',
        'Screen our orders for potential risk or fraud; and',
        'When in line with the preferences you have shared with us, provide you with information relating to our products.',
      ],
      'We do not use your Personal Information for targeted advertising, and we do not share it with advertising networks.',
    ],
  },
  {
    heading: 'Sharing your personal information',
    body: [
      'We do not sell, rent, or trade your Personal Information. We do not share it with third-party advertising, tracking, or analytics providers — because we do not use any.',
      'Your Order Information is shared only with our delivery partners to the extent necessary to deliver your snacks to you.',
      'Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a lawful request for information we receive, or to otherwise protect our rights.',
    ],
  },
  {
    heading: 'Do not track',
    body: [
      'As described above, we do not collect Device Information or engage in behavioural tracking, so there is nothing for us to alter when we see a Do Not Track signal from your browser. Your browsing on the Site is not monitored.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'If you are a resident of India, you have rights under applicable Indian laws (including the Digital Personal Data Protection Act, 2023) to access the personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.',
      'Additionally, please note that your information may be stored and processed by our service providers within India.',
    ],
  },
  {
    heading: 'Data retention',
    body: [
      'When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. If you would like us to delete your information, please contact us by email at shivagst2307@gmail.com.',
    ],
  },
  {
    heading: 'Changes',
    body: [
      'We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.',
    ],
  },
  {
    heading: 'Minors',
    body: [
      'The Site is not intended for individuals under the age of 16.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-8 animate-fade-in">
      <PageHeader
        title="Privacy Policy"
        description={`This Privacy Policy describes how your personal information is collected, used, and shared when you visit blrsnacks.co.`}
      />

      <div className="max-w-3xl">
        <p className="text-sm text-text-tertiary mb-8">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-text-primary font-display mb-3">
                {section.heading}
              </h2>
              <div className="space-y-3 text-text-secondary leading-relaxed text-[15px]">
                {section.body.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i} className="list-disc pl-6 space-y-1.5 marker:text-red-400">
                      {block.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{block}</p>
                  ),
                )}
              </div>
            </section>
          ))}

          {/* Contact */}
          <section>
            <h2 className="text-lg font-bold text-text-primary font-display mb-3">Contact us</h2>
            <div className="space-y-3 text-text-secondary leading-relaxed text-[15px]">
              <p>
                For more information about our privacy practices, if you have questions, or if
                you would like to make a complaint, please contact us:
              </p>
              <address className="not-italic bg-white border border-stone-200 rounded-[var(--radius-md)] p-4 space-y-1">
                <p className="font-semibold text-text-primary">BLR Snacks</p>
                <p>Kammanahalli, Bangalore - 560033</p>
                <p>
                  Email:{' '}
                  <a href="mailto:shivagst2307@gmail.com" className="text-brand-primary hover:text-brand-primary-hover transition-colors">
                    shivagst2307@gmail.com
                  </a>
                </p>
              </address>
            </div>
          </section>

          <p className="text-sm text-text-tertiary border-t border-stone-200 pt-6">
            Questions? Reach us anytime via{' '}
            <Link href="/#contact" className="text-brand-primary hover:text-brand-primary-hover transition-colors">
              our contact section
            </Link>{' '}
            or write to{' '}
            <a href="mailto:shivagst2307@gmail.com" className="text-brand-primary hover:text-brand-primary-hover transition-colors">
              shivagst2307@gmail.com
            </a>.
          </p>
        </div>
      </div>
    </Container>
  );
}
