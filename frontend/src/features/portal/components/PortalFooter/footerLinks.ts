/** zoom.us footer copy, verbatim (03-schedule.md §3.5, 04-join.md §5). All links are static. */
export interface FooterColumn {
  title: string;
  links: string[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "About",
    links: [
      "Zoom Blog",
      "Customers",
      "Our Team",
      "Careers",
      "Integrations",
      "Partners",
      "Investors",
      "Press",
      "Sustainability & ESG",
      "Zoom Cares",
      "Media Kit",
      "How to Videos",
      "Developer Platform",
      "Zoom Ventures",
      "Zoom Merchandise Store",
    ],
  },
  {
    title: "Download",
    links: [
      "Zoom Workplace App",
      "Zoom Room Apps",
      "Zoom Rooms Controller",
      "Browser Extension",
      "Outlook Plug-in",
      "Android App",
      "Zoom Virtual Backgrounds",
    ],
  },
  {
    title: "Sales",
    links: ["1.888.799.9666", "Contact Sales", "Plans & Pricing", "Request a Demo", "Webinars and Events", "Zoom Experience Center"],
  },
  {
    title: "Support",
    links: [
      "Test Zoom",
      "Account",
      "Support Center",
      "Learning Center",
      "Zoom Community",
      "Feedback",
      "Contact Us",
      "Accessibility",
      "Developer support",
      "Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement",
    ],
  },
];

export const FOOTER_SELECTS = [
  { title: "Language", value: "English" },
  { title: "Currency", value: "Indian Rupee ₹" },
];

/** the legal link that carries the CCPA toggle icon */
export const PRIVACY_CHOICES_LINK = "Your Privacy Choices";

export const FOOTER_LEGAL_LINKS = [
  "Terms",
  "Privacy",
  "Trust Center",
  "Acceptable Use Guidelines",
  "Legal & Compliance",
  PRIVACY_CHOICES_LINK,
  "Cookie Preferences",
];
