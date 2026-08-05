export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}

export interface SeoBlock {
  metaTitle?: string;
  metaDescription?: string;
}

export interface ButtonBlock {
  label: string;
  href: string;
  style: 'gold' | 'pine' | 'ghost';
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'twitter' | 'youtube';
  url: string;
}

export interface StatBlock {
  value: string;
  label: string;
}

export interface ChipBlock {
  text: string;
}

export interface TickBlock {
  text: string;
}

export interface NavLink {
  label: string;
  href: string;
  order: number;
}

export interface FilterChip {
  label: string;
  value: string;
}

export interface PageHeroBlock {
  eyebrow?: string;
  heading: string;
  text?: string;
  backLinkLabel?: string;
  backLinkHref?: string;
}

export interface HeroBlock {
  eyebrow?: string;
  heading: string;
  highlightWord?: string;
  lead?: string;
  image?: StrapiMedia;
  stats: StatBlock[];
  buttons: ButtonBlock[];
}

export interface BenefitCard {
  icon?: StrapiMedia;
  title: string;
  text?: string;
}

export interface TaggedCard {
  tag?: string;
  title: string;
  text?: string;
}

export interface StepBlock {
  number: string;
  title: string;
  text?: string;
}

export interface InfoItem {
  icon?: StrapiMedia;
  label: string;
  value: string;
  href?: string;
}

export interface CtaBandBlock {
  eyebrow?: string;
  heading: string;
  text?: string;
  buttons: ButtonBlock[];
}

export interface CtaDarkBlock {
  eyebrow?: string;
  heading: string;
  button?: ButtonBlock;
}

export interface SplitBlock {
  eyebrow?: string;
  heading: string;
  paragraph1?: string;
  paragraph2?: string;
  image?: StrapiMedia;
  badgeNumber?: string;
  badgeLabel?: string;
  ticks?: TickBlock[];
  button?: ButtonBlock;
}

export interface GalleryItem {
  image: StrapiMedia;
  caption?: string;
  category?: string;
}

export interface SiteSetting {
  siteName: string;
  tagline?: string;
  logo?: StrapiMedia;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  footerAbout?: string;
  copyrightText?: string;
  socialLinks: SocialLink[];
}

export interface Navigation {
  mainLinks: NavLink[];
}

export interface HomePage {
  hero: HeroBlock;
  trustLabel?: string;
  trustChips: ChipBlock[];
  benefitsEyebrow?: string;
  benefitsHeading?: string;
  benefitsLead?: string;
  benefits: BenefitCard[];
  servicesPreviewEyebrow?: string;
  servicesPreviewHeading?: string;
  servicesPreviewLead?: string;
  servicesPreviewButton?: ButtonBlock;
  aboutPreview: SplitBlock;
  cinematicAbout: CinematicAboutBlock;
  featuresEyebrow?: string;
  featuresHeadingLine1?: string;
  featuresHeadingLine2?: string;
  featuresImage?: StrapiMedia;
  featuresImageCaption?: string;
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  ctaBand: CtaBandBlock;
  seo?: SeoBlock;
}

export interface CinematicAboutBlock {
  label?: string;
  headingPre?: string;
  headingItalicAccent?: string;
  headingPost?: string;
  bodyText: string;
  button?: ButtonBlock;
}

export interface AboutPage {
  hero: PageHeroBlock;
  story: SplitBlock;
  missionValues: BenefitCard[];
  differentiatorsEyebrow?: string;
  differentiatorsHeading?: string;
  differentiators: TaggedCard[];
  ctaDark: CtaDarkBlock;
  seo?: SeoBlock;
}

export interface ServicesPage {
  hero: PageHeroBlock;
  heroImage?: StrapiMedia;
  creamIntro: CreamBlock;
  howItWorksEyebrow?: string;
  howItWorksHeading?: string;
  howItWorksLead?: string;
  steps: StepBlock[];
  faqEyebrow?: string;
  faqHeading?: string;
  ctaDark: CtaDarkBlock;
  seo?: SeoBlock;
}

export interface CreamBlock {
  paragraph?: string;
  primaryButton?: ButtonBlock;
  secondaryButton?: ButtonBlock;
  badgeLine1?: string;
  badgeLine2?: string;
  closingParagraph?: string;
}

export interface ListingsPage {
  hero: PageHeroBlock;
  filters: FilterChip[];
  ctaBand: CtaBandBlock;
  seo?: SeoBlock;
}

export interface ContactPage {
  hero: PageHeroBlock;
  formNote?: string;
  successHeading?: string;
  successText?: string;
  contactInfo: InfoItem[];
  mapEmbedUrl?: string;
  seo?: SeoBlock;
}

export interface BlogPage {
  hero: PageHeroBlock;
  seo?: SeoBlock;
}

export interface TeamPage {
  hero: PageHeroBlock;
  intro?: string;
  seo?: SeoBlock;
}

export interface TestPage {
  heading: string;
  paragraph?: string;
  image?: StrapiMedia;
  button?: ButtonBlock;
}

export interface GalleryPage {
  hero: PageHeroBlock;
  intro?: string;
  items: GalleryItem[];
  seo?: SeoBlock;
}

export interface Service {
  documentId: string;
  title: string;
  slug: string;
  tag?: string;
  summary?: string;
  heroText?: string;
  ctaLabel?: string;
  overviewEyebrow?: string;
  overviewHeading?: string;
  overviewLead?: string;
  image?: StrapiMedia;
  ticks: TickBlock[];
  includedEyebrow?: string;
  includedHeading?: string;
  included: TaggedCard[];
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaButtonLabel?: string;
  order: number;
  featured: boolean;
  seo?: SeoBlock;
}

export interface Listing {
  documentId: string;
  title: string;
  slug: string;
  category: 'produce' | 'tea-spices' | 'grains' | 'agri-tech' | 'logistics';
  badge: 'PRODUCT' | 'PROJECT' | 'SERVICE' | 'PROGRAM';
  description?: string;
  image?: StrapiMedia;
  ctaLabel?: string;
  order: number;
}

export interface Testimonial {
  documentId: string;
  quote: string;
  name: string;
  role?: string;
  avatarInitials?: string;
  avatarColor?: string;
  stars: number;
  order: number;
}

export interface Faq {
  documentId: string;
  question: string;
  answer: string;
  order: number;
}

export interface BlogPost {
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: StrapiMedia;
  author?: string;
  publishDate?: string;
  category?: string;
  featured: boolean;
  seo?: SeoBlock;
}

export interface TeamMember {
  documentId: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: StrapiMedia;
  order: number;
  socialLinks: SocialLink[];
}
