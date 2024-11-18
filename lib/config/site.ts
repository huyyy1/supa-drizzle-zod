export const siteConfig = {
  name: 'SimplyMaid',
  description: 'Professional house cleaning services across Australia',
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: 'https://simplymaid.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/simplymaid',
    github: 'https://github.com/simplymaid',
  },
  keywords: [
    'house cleaning',
    'cleaning services',
    'home cleaners',
    'australia',
  ],
  authors: [
    {
      name: 'SimplyMaid',
      url: 'https://simplymaid.com',
    },
  ],
} as const