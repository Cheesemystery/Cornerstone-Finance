// TODO: replace this placeholder with the public Cornerstone contact address.
export const CONTACT_EMAIL = "hello@example.com";

export const PRIVACY_COPY = {
  title: "Your data stays yours.",
  paragraphs: [
    "Holdings, weekly completion, learning progress, your nickname, saved research, and fictional practice are stored in this browser. They do not sync across devices.",
    "Holdings imported from CSV or JSON persist in this browser. Files and share counts are not uploaded; tickers and requested dates go to the server for historical closes. Guide conversations clear on reload.",
    "Fictional practice. No real money moved. Account access, email, and billing are deferred.",
  ],
} as const;

type SectionCopy = { title: string; paragraphs: readonly string[] };
export type AboutContent = {
  title: string;
  subtitle: string;
  navigationLabel: string;
  settings: { title: string; description: string; linkLabel: string };
  mission: SectionCopy;
  story: SectionCopy;
  today: SectionCopy;
  privacy: SectionCopy;
  supporters: { title: string; text: string };
  contact: { title: string; email: string };
  waitlist: { title: string; buttonLabel: string };
};

export const aboutContent: AboutContent = {
  title: "About Cornerstone",
  subtitle: "Investing made understandable for people nobody taught.",
  navigationLabel: "About",
  settings: {
    title: "About Cornerstone",
    description: "Our mission, where we are today, and how to reach us.",
    linkLabel: "Read about Cornerstone →",
  },
  mission: {
    title: "Our mission",
    paragraphs: ["We want investing to feel understandable. Cornerstone helps people build a foundation, one idea at a time."],
  },
  story: {
    title: "Why we built it",
    paragraphs: ["[TODO: founder story, Tuskegee Investment Club]"],
  },
  today: {
    title: "Where we are today",
    paragraphs: ["Cornerstone is early-stage. Market data shown is sample data. Lessons are live; account sync, live AI answers, and real-time prices are coming."],
  },
  privacy: PRIVACY_COPY,
  supporters: {
    title: "Supporters",
    // TODO: confirm wording with PNC and Howard before naming them.
    text: "",
  },
  contact: { title: "Contact", email: CONTACT_EMAIL },
  waitlist: { title: "Join the waitlist", buttonLabel: "Coming soon" },
};
