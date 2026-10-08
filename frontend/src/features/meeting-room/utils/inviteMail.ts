/** Mail-compose links of the Invite window's Email tab (PRD §8.11). */
const SUBJECT = "Please join Zoom meeting in progress";

export interface MailService {
  label: string;
  image: string;
  width: number;
  height: number;
  href: (body: string) => string;
}

const encode = (value: string) => encodeURIComponent(value);

export const MAIL_SERVICES: MailService[] = [
  {
    label: "Default Email",
    image: "/zoom/room-invite-default_email.png",
    width: 83,
    height: 61,
    href: (body) => `mailto:?subject=${encode(SUBJECT)}&body=${encode(body)}`,
  },
  {
    label: "Gmail",
    image: "/zoom/room-invite-gmail.png",
    width: 82,
    height: 60,
    href: (body) => `https://mail.google.com/mail/?view=cm&su=${encode(SUBJECT)}&body=${encode(body)}`,
  },
  {
    label: "Yahoo Mail",
    image: "/zoom/room-invite-yahoo_mail.png",
    width: 84,
    height: 61,
    href: (body) => `https://compose.mail.yahoo.com/?subject=${encode(SUBJECT)}&body=${encode(body)}`,
  },
];
