/**
 * Social links — later: site settings / CMS.
 * Footer uses a short list; Contact uses the full set.
 */

export const SOCIALS = [
  {
    id: "email",
    label: "Email",
    href: "mailto:manognasamayam@gmail.com",
    handle: "manognasamayam@gmail.com",
    showInFooter: true,
    showInContact: true,
  },
  {
    id: "vsco",
    label: "VSCO",
    href: "https://twibsa.vsco.site/",
    handle: "twibsa",
    showInFooter: true,
    showInContact: true,
  },
  {
    id: "goodreads",
    label: "Goodreads",
    href: "https://www.goodreads.com/user/show/182443183",
    handle: "Manogna",
    showInFooter: true,
    showInContact: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    handle: "@manogna",
    showInFooter: false,
    showInContact: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com",
    handle: "Manogna",
    showInFooter: false,
    showInContact: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    handle: "@manogna",
    showInFooter: false,
    showInContact: true,
  },
];

export const FOOTER_SOCIALS = SOCIALS.filter((s) => s.showInFooter);
export const CONTACT_SOCIALS = SOCIALS.filter((s) => s.showInContact);

/** @deprecated Prefer FOOTER_SOCIALS */
export const SOCIAL_LINKS = FOOTER_SOCIALS;
