import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const data = {
  facebookLink: 'https://facebook.com/blrsnacks',
  instaLink: 'https://instagram.com/blrsnacks',
  twitterLink: 'https://twitter.com/blrsnacks',
  githubLink: 'https://github.com/blrsnacks',
  services: {
    webdev: '/products',
    webdesign: '/categories',
    marketing: '/products',
    googleads: '/products',
  },
  about: {
    history: '/about',
    team: '/about',
    handbook: '/about',
    careers: '/about',
  },
  help: {
    faqs: '/faq',
    support: '/support',
    livechat: '/support',
  },
  contact: {
    email: 'hello@blrsnacks.co',
    phone: '+91 9876543210',
    address: 'Bangalore, Karnataka, India',
  },
  company: {
    name: 'BLR Snacks',
    description:
      'Authentic Bangalore snacks delivered fresh to your door. Quality flavours, always.',
    logo: '/logo.svg',
  },
};

const SocialIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
      </svg>
    ),
    instagram: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2.16c3.2,0,3.58,0,4.85.07,1.17.07,2.26.28,3.14.55.95.29,1.87.77,2.69,1.59s1.3,1.74,1.59,2.69c.27.88.48,1.97.55,3.14.07,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.07,1.17-.28,2.26-.55,3.14-.29.95-.77,1.87-1.59,2.69s-1.74,1.3-2.69,1.59c-.88.27-1.97.48-3.14.55-1.27.07-1.65.07-4.85.07s-3.58,0-4.85-.07c-1.17-.07-2.26-.28-3.14-.55-.95-.29-1.87-.77-2.69-1.59s-1.3-1.74-1.59-2.69c-.27-.88-.48-1.97-.55-3.14C2.23,16.74,2.23,16.36,2.23,13.16s0-3.58.07-4.85c.07-1.17.28-2.26.55-3.14.29-.95.77-1.87,1.59-2.69s1.74-1.3,2.69-1.59c.88-.27,1.97-.48,3.14-.55C8.42,2.23,8.8,2.23,12,2.16M12,0C8.74,0,8.33,0,7.05.07c-1.24.07-2.38.3-3.47.6C2.75,1,1.89,1.47,1.16,2.2S.24,3.42.64,4.37c.3,1.09.53,2.23.6,3.47.07,1.28.07,1.69.07,4.86s0,3.58-.07,4.86c-.07,1.24-.3,2.38-.6,3.47-.4,1.12-.04,2.31.72,3.06s1.94.71,3.06.27c1.09-.3,2.23-.53,3.47-.6,1.28-.07,1.69-.07,4.86-.07s3.58,0,4.86.07c1.24.07,2.38.3,3.47.6,1.12.4,2.31.04,3.06-.72s.71-1.94.27-3.06c-.3-1.09-.53-2.23-.6-3.47-.07-1.28-.07-1.69-.07-4.86s0-3.58.07-4.86c.07-1.24.3-2.38.6-3.47.4-1.12.04-2.31-.72-3.06s-1.94-.71-3.06-.27c-1.09.3-2.23.53-3.47.6-1.28.07-1.69.07-4.86.07Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16.32A4.16,4.16,0,1,1,16.16,12,4.17,4.17,0,0,1,12,16.32Zm6.4-10.79a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.4,5.53Z"/>
      </svg>
    ),
    twitter: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525,2.53c-.18-.64-.79-1.14-1.54-1.14a1.14,1.14,0,0,0-1.08.88L10.13,12H7.5a.88.88,0,0,0-.88.88V20a.88.88,0,0,0,.88.88H5.13a.88.88,0,0,0,.63-.26l8.74-8.74A.88.88,0,0,0,14.25,11.5h1.12a2.25,2.25,0,0,1-2.27-2.25V2.53M17.63,3a2.25,2.25,0,0,1,2.25,2.25V10a.88.88,0,0,1-.88.88H19.5a.88.88,0,0,1-.63-.26L13.13,4.87a.88.88,0,0,0-.63-.26H10.13a.88.88,0,0,0-.88.88V7.5a.88.88,0,0,1-.63.26L3.87,13.5a.88.88,0,0,0-.26.63V20a.88.88,0,0,0 .88.88H9.5a.88.88,0,0,0 .63-.26l4.75-4.75a2.25,2.25,0,0,1,2.27-2.25h.48A2.25,2.25,0,0,1,17.13,16.5,2.25,2.25,0,0,1,17.63,14.25V14.5a.88.88,0,0,1,.63.26l2.63,2.63a.88.88,0,0,0,.26.63V20a.88.88,0,0,1-.88.88H20a.88.88,0,0,1-.63-2.13V3Z"/>
      </svg>
    ),
    github: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10,0,0,0,2,12c0,4.42,2.87,8.17,6.84,9.5.5.08.66-.24.64-.5,0-.25-.08-.83-.14-1.33-2.76-.63-3.37-2.75-3.37-2.75-.53-.92-.41-1.59.12-2.11,0,0,.91-.62,2.73.92A8.93,8.93,0,0,1,12,11.25a8.93,8.93,0,0,1,2.17-1.52c1.82-.53,2.73.92,2.73.92.53.52.65,1.19.12,2.11,0,0-.6,2.12-3.37,2.75-.36.33-.42.83-.13,1.33A10,10,0,0,0,12,22,2Z"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

const socialLinks = [
  { name: 'facebook', label: 'Facebook', href: data.facebookLink },
  { name: 'instagram', label: 'Instagram', href: data.instaLink },
  { name: 'twitter', label: 'Twitter', href: data.twitterLink },
  { name: 'github', label: 'GitHub', href: data.githubLink },
];

const aboutLinks = [
  { text: 'Company History', href: data.about.history },
  { text: 'Meet the Team', href: data.about.team },
  { text: 'Employee Handbook', href: data.about.handbook },
  { text: 'Careers', href: data.about.careers },
];

const serviceLinks = [
  { text: 'Shop All', href: data.services.webdev },
  { text: 'Categories', href: data.services.webdesign },
  { text: 'Deals', href: data.services.marketing },
  { text: 'Gift Cards', href: data.services.googleads },
];

const helpfulLinks = [
  { text: 'FAQs', href: data.help.faqs },
  { text: 'Support', href: data.help.support },
  { text: 'Live Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-bg-inverse text-text-inverse mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center gap-2 sm:justify-start">
              <span className="text-2xl">🍌</span>
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-text-inverse/60">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ name, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-inverse hover:text-brand-primary transition"
                  >
                    <span className="sr-only">{label}</span>
                    {name && <SocialIcon name={name} className="size-6" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-text-inverse/70 transition hover:text-brand-primary"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Shop</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-text-inverse/70 transition hover:text-brand-primary"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className={
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start text-text-inverse/70 hover:text-brand-primary transition'
                          : 'text-text-inverse/70 transition hover:text-brand-primary'
                      }
                    >
                      <span>{text}</span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-brand-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-brand-primary relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                      <Icon className="text-brand-primary size-5 shrink-0" />
                      {isAddress ? (
                        <address className="text-text-inverse/70 -mt-0.5 flex-1 not-italic">
                          {text}
                        </address>
                      ) : (
                        <span className="text-text-inverse/70 flex-1">
                          {text}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="mt-4 text-sm text-text-inverse/70 sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}