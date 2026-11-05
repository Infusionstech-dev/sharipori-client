// Env values for now: the API has no public settings endpoint yet. Empty values hide their links.
export const siteConfig = {
  announcement: process.env.NEXT_PUBLIC_ANNOUNCEMENT,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL,
};

export const categoryHref = (slug) => `/category/${slug}`;
export const fabricHref = (slug) => `/fabric/${slug}`;
