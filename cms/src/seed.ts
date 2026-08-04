import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

const IMAGES_DIR = path.resolve(__dirname, '..', '..', '..', 'web', 'public', 'images');
const ICONS_DIR = path.resolve(__dirname, '..', '..', '..', 'web', 'public', 'icons');

const MIME_BY_EXT: Record<string, string> = {
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

async function uploadFile(strapi: Core.Strapi, dir: string, filename: string, altText: string) {
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) {
    strapi.log.warn(`[seed] image not found, skipping: ${filename}`);
    return null;
  }
  const stats = fs.statSync(filepath);
  const ext = path.extname(filename).toLowerCase();
  const mimetype = MIME_BY_EXT[ext] || 'application/octet-stream';

  const uploaded = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      data: {
        fileInfo: {
          alternativeText: altText,
          caption: altText,
          name: altText,
        },
      },
      files: {
        filepath,
        originalFilename: filename,
        mimetype,
        size: stats.size,
      },
    });

  return Array.isArray(uploaded) ? uploaded[0] : uploaded;
}

async function buildImageCache(strapi: Core.Strapi) {
  const specs: Array<[string, string]> = [
    ['photo-1470087167738-6aa485ff65dc.avif', "Lush terraced green hills of Sri Lanka's central highlands at dawn"],
    ['photo-1499848144902-af767f6d0c7f.avif', 'A farmer harvesting fresh green leaves by hand in a Sri Lankan field'],
    ['photo-1544015759-237f87d55ef3.avif', 'Aerial view of patterned green agricultural fields in the Sri Lankan countryside'],
    ['photo-1757627550652-30788bfce978.avif', 'Fresh vegetables in wooden market crates ready for wholesale supply'],
    ['photo-1757627550652-30788bfce978-b.avif', 'Fresh vegetables and tomatoes displayed in wooden market crates'],
    ['photo-1544451822-38e32b887c08.avif', 'Close inspection of fresh green tea leaves for quality grading'],
    ['photo-1535379453347-1ffd615e2e08.avif', 'Transport trucks beside a green crop field for collection and delivery'],
    ['photo-1560493676-04071c5f467b.avif', 'Orderly rows of crops at sunset representing data-driven farming'],
    ['photo-1515150144380-bca9f1650ed9.avif', 'A person tending and watering young green plants by hand'],
    ['photo-1594771804886-a933bb2d609b.avif', 'A green tractor working in an open field under a blue sky'],
    ['photo-1668587877964-16488273b0ab.avif', 'Cups of freshly brewed Ceylon tea on a tray'],
    ['photo-1593490755898-b6f1d8e637cb.avif', 'A farm worker in a hat tending a flowering field'],
    ['photo-1491497895121-1334fc14d8c9.avif', 'Wide open green agricultural fields stretching to the horizon'],
  ];

  const cache: Record<string, any> = {};
  for (const [filename, alt] of specs) {
    strapi.log.info(`[seed] uploading ${filename}`);
    cache[filename] = await uploadFile(strapi, IMAGES_DIR, filename, alt);
  }
  return cache;
}

async function buildIconCache(strapi: Core.Strapi) {
  const specs: Array<[string, string]> = [
    ['network.svg', 'Farmer network icon'],
    ['trace.svg', 'Traceability icon'],
    ['delivery.svg', 'Delivery icon'],
    ['mission.svg', 'Mission icon'],
    ['values.svg', 'Values icon'],
    ['phone.svg', 'Phone icon'],
    ['email.svg', 'Email icon'],
    ['location.svg', 'Location icon'],
    ['clock.svg', 'Clock icon'],
  ];

  const cache: Record<string, any> = {};
  for (const [filename, alt] of specs) {
    strapi.log.info(`[seed] uploading icon ${filename}`);
    cache[filename] = await uploadFile(strapi, ICONS_DIR, filename, alt);
  }
  return cache;
}

const tick = (text: string) => ({ text });
const chip = (text: string) => ({ text });
const button = (label: string, href: string, style: 'gold' | 'pine' | 'ghost' = 'gold') => ({ label, href, style });
const stat = (value: string, label: string) => ({ value, label });
const benefitCard = (icon: number | null, title: string, text: string) => ({ icon, title, text });
const taggedCard = (tag: string, title: string, text: string) => ({ tag, title, text });
const step = (number: string, title: string, text: string) => ({ number, title, text });

export async function seed(strapi: Core.Strapi) {
  const existing = await strapi.documents('api::home-page.home-page').findFirst();
  if (existing) {
    strapi.log.info('[seed] content already present, skipping seed');
    return;
  }

  strapi.log.info('[seed] starting content seed...');
  const img = await buildImageCache(strapi);
  const imgId = (filename: string) => (img[filename] ? img[filename].id : null);
  const icons = await buildIconCache(strapi);
  const iconId = (filename: string) => (icons[filename] ? icons[filename].id : null);

  // ---------- site-setting ----------
  await strapi.documents('api::site-setting.site-setting').create({
    data: {
      siteName: "Hetti's & Sons",
      tagline: 'Agriculture × IT',
      phone: '+94 77 000 0000',
      email: 'hello@hettiandsons.lk',
      address: 'Kandy, Central Province, Sri Lanka',
      hours: 'Mon–Sat · 8:30am–5:30pm',
      footerAbout:
        "Connecting Sri Lanka's farmers with the companies that buy from them — sourcing, logistics, quality and agri-tech, from one trusted partner.",
      copyrightText: "Hetti's & Sons. All rights reserved.",
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'linkedin', url: '#' },
        { platform: 'whatsapp', url: '#' },
      ],
    } as any,
  });

  // ---------- navigation ----------
  await strapi.documents('api::navigation.navigation').create({
    data: {
      mainLinks: [
        { label: 'Home', href: '/', order: 1 },
        { label: 'About', href: '/about', order: 2 },
        { label: 'Services', href: '/services', order: 3 },
        { label: 'Listings', href: '/listings', order: 4 },
        { label: 'Blog', href: '/blog', order: 5 },
        { label: 'Team', href: '/team', order: 6 },
        { label: 'Gallery', href: '/gallery', order: 7 },
        { label: 'Contact', href: '/contact', order: 8 },
      ],
    } as any,
  });

  // ---------- service collection ----------
  const services = [
    {
      title: 'Sourcing & supply',
      slug: 'sourcing',
      tag: 'Supply',
      summary:
        'Bulk rice, tea, spices, fruit and fresh produce, sourced to your grade and volume from our farmer network and delivered on schedule.',
      heroText:
        "We source dependable agriculture products in the grades and volumes your business needs — from a farmer network we know by name.",
      ctaLabel: 'Get a quote',
      overviewEyebrow: 'Overview',
      overviewHeading: 'Bulk agriculture products, sourced to your spec.',
      overviewLead:
        "From rice and tea to spices, fruit and fresh vegetables, we aggregate supply across Sri Lanka's central regions and deliver it on a timeline you can plan around.",
      image: imgId('photo-1757627550652-30788bfce978.avif'),
      ticks: [
        tick('Rice, tea, spices, fruit and fresh produce in wholesale volumes'),
        tick('Grades, prices and delivery windows agreed up front'),
        tick('Supply pooled from 450+ farmers, so volume stays reliable'),
        tick('Every lot graded and logged before it reaches you'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'How sourcing works with us.',
      included: [
        taggedCard('01 · Plan', 'Demand planning', "We map your volume and timing needs to what our farmers can realistically grow and harvest."),
        taggedCard('02 · Pool', 'Aggregation', "Supply is pooled across multiple farms so a single buyer's order is always fully covered."),
        taggedCard('03 · Check', 'Consistent grades', 'Products arrive at the grade you agreed, verified at the point of collection.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: 'Tell us what you need to source.',
      ctaButtonLabel: 'Book a call',
      order: 1,
      featured: true,
    },
    {
      title: 'Farmer partnership',
      slug: 'farmers',
      tag: 'Farmers',
      summary:
        'Guaranteed offtake, fair pricing, inputs and agronomy guidance — a stable buyer that helps local farmers plan and grow.',
      heroText:
        'A stable, fair buyer that local farmers can build a future on — with guaranteed offtake, fair pricing and hands-on support.',
      ctaLabel: 'Partner with us',
      overviewEyebrow: 'Overview',
      overviewHeading: 'We buy what you grow — at a price agreed before you plant.',
      overviewLead:
        'For smallholders, uncertainty is the biggest risk. We remove it with committed offtake, transparent pricing and agronomy support that helps you grow more of what sells.',
      image: imgId('photo-1499848144902-af767f6d0c7f.avif'),
      ticks: [
        tick('Guaranteed offtake, so you plant knowing it will be bought'),
        tick('Fair, transparent pricing agreed in advance'),
        tick('Access to inputs, seeds and agronomy guidance'),
        tick('Faster, reliable payment after each collection'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'What partnering with us means.',
      included: [
        taggedCard('Offtake', 'Committed offtake', "We agree what we'll buy and when, so your harvest has a home before it's even grown."),
        taggedCard('Support', 'Inputs & agronomy', 'Guidance on crops, timing and quality to help you raise both yield and grade.'),
        taggedCard('Payment', 'Fair payment', 'Transparent pricing and dependable payment after each collection — no waiting games.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: 'Grow with a buyer you can count on.',
      ctaButtonLabel: 'Talk to us',
      order: 2,
      featured: true,
    },
    {
      title: 'Grading & quality control',
      slug: 'quality',
      tag: 'Quality',
      summary:
        'Standardised grading, moisture and quality checks at collection, with documented results for every lot you receive.',
      heroText:
        'Standardised grading and quality checks on every lot — with documented results buyers and auditors can trust.',
      ctaLabel: 'Request details',
      overviewEyebrow: 'Overview',
      overviewHeading: 'Quality you can measure, not just promise.',
      overviewLead:
        "We check, grade and record every batch at collection, so what's on the report matches what's in the crate. That's how buyers stop guessing and start trusting.",
      image: imgId('photo-1544451822-38e32b887c08.avif'),
      ticks: [
        tick('Moisture, size and quality checks at the point of collection'),
        tick('Standardised grading against agreed criteria'),
        tick('Documented results attached to every batch'),
        tick('Sub-standard lots flagged before they enter your supply'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'How we keep quality honest.',
      included: [
        taggedCard('Inspect', 'Inspection', 'Trained collectors assess each lot against clear, consistent standards in the field.'),
        taggedCard('Grade', 'Grading', 'Products are sorted into agreed grades so pricing and quality always line up.'),
        taggedCard('Record', 'Records', 'Results are logged per batch and available whenever you need proof of quality.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: "Get supply you don't have to second-guess.",
      ctaButtonLabel: 'Book a call',
      order: 3,
      featured: false,
    },
    {
      title: 'Logistics & delivery',
      slug: 'logistics',
      tag: 'Logistics',
      summary:
        'Collection, packing, cold-chain where needed, and delivery with the documentation buyers and exporters require.',
      heroText:
        'Collection from the farm, packing, cold-chain where needed, and delivery to your dock or port — with the paperwork done right.',
      ctaLabel: 'Arrange delivery',
      overviewEyebrow: 'Overview',
      overviewHeading: 'From the farm gate to your gate, on schedule.',
      overviewLead:
        'Good produce is only as good as how it arrives. We handle collection, packing and delivery — including cold-chain for perishables — with documentation exporters and processors expect.',
      image: imgId('photo-1535379453347-1ffd615e2e08.avif'),
      ticks: [
        tick('Scheduled collection from farms across our network'),
        tick('Packing and cold-chain handling for perishable goods'),
        tick('Delivery to buyers, processors and ports'),
        tick('Export and compliance documentation prepared'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'Moving produce, the right way.',
      included: [
        taggedCard('Collect', 'Collection', 'Routed pickups keep produce moving from harvest to handling without delay.'),
        taggedCard('Protect', 'Cold-chain', 'Temperature-controlled handling protects quality on perishable lots in transit.'),
        taggedCard('Deliver', 'Delivery & docs', 'On-time delivery with the documentation your buyers and ports require.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: "Let's move your supply, reliably.",
      ctaButtonLabel: 'Book a call',
      order: 4,
      featured: false,
    },
    {
      title: 'Agri-tech & data',
      slug: 'agritech',
      tag: 'Agri-Tech',
      summary:
        'Farm-management software, crop and weather dashboards, and seed-to-shelf traceability that turns field activity into clean data.',
      heroText:
        'Farm-management tools, crop and weather dashboards, and seed-to-shelf traceability that turn field activity into clean, usable data.',
      ctaLabel: 'See a demo',
      overviewEyebrow: 'Overview',
      overviewHeading: 'The field, turned into data you can act on.',
      overviewLead:
        'We built our own technology to run the business — and we put the same tools to work for cooperatives, processors and buyers who want visibility from soil to shelf.',
      image: imgId('photo-1560493676-04071c5f467b.avif'),
      ticks: [
        tick('Farm-management and crop-planning dashboards'),
        tick('Crop and weather data to time planting and harvest'),
        tick('Seed-to-shelf traceability and full batch history'),
        tick('Reporting that supports audits and certifications'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'Tools that earn their keep.',
      included: [
        taggedCard('Plan', 'Dashboards', 'Plan crops, track inputs and watch conditions in one clear, shared view.'),
        taggedCard('Trace', 'Traceability', 'Follow any batch from origin to delivery with complete history on demand.'),
        taggedCard('Report', 'Reporting', 'Export the records you need for audits, buyers and certification bodies.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: 'See your supply chain clearly.',
      ctaButtonLabel: 'Book a call',
      order: 5,
      featured: true,
    },
    {
      title: 'Custom IT projects',
      slug: 'it',
      tag: 'IT Projects',
      summary:
        'Websites, internal systems and integrations for agribusinesses — built by a team that understands the sector first-hand.',
      heroText:
        'Websites, internal systems and integrations for agribusinesses — built by a team that understands the sector first-hand.',
      ctaLabel: 'Scope a project',
      overviewEyebrow: 'Overview',
      overviewHeading: 'Software built by people who know agriculture.',
      overviewLead:
        "Most developers don't know a harvest window from a holiday. We do. We build practical systems for agribusinesses — and connect them to the supply data we already manage.",
      image: imgId('photo-1544015759-237f87d55ef3.avif'),
      ticks: [
        tick('Websites and product catalogues for agribusinesses'),
        tick('Internal tools for orders, inventory and collections'),
        tick('Integrations with traceability and supply systems'),
        tick('Built, supported and improved by an in-house team'),
      ],
      includedEyebrow: "What's included",
      includedHeading: 'How we run a project.',
      included: [
        taggedCard('01 · Discover', 'Discovery', 'We learn how your operation actually works before writing a single line of code.'),
        taggedCard('02 · Build', 'Build', 'Clean, practical software shaped around your real workflow — not a generic template.'),
        taggedCard('03 · Support', 'Support', 'We maintain and improve what we build. No hand-off and gone.'),
      ],
      ctaEyebrow: 'Get started',
      ctaHeading: "Have a project in mind? Let's scope it.",
      ctaButtonLabel: 'Book a call',
      order: 6,
      featured: false,
    },
  ];

  for (const s of services) {
    await strapi.documents('api::service.service').create({ data: s as any });
  }

  // ---------- home-page ----------
  await strapi.documents('api::home-page.home-page').create({
    data: {
      hero: {
        eyebrow: 'Agriculture & IT · Rooted in Kandy',
        heading: "Hetti's & Sons",
        lead:
          "Hetti's & Sons sources dependable agriculture products from a trusted farmer network — then handles grading, logistics and traceability with our own tech. One partner, from the field to your dock.",
        image: imgId('photo-1470087167738-6aa485ff65dc.avif'),
        buttons: [button('Get a quote', '/contact', 'gold'), button('Browse products & projects', '/listings', 'ghost')],
        stats: [stat('450+', 'Partner farmers'), stat('9', 'Districts served'), stat('98%', 'On-time delivery'), stat('12+', 'Product categories')],
      },
      trustLabel: 'Trusted across the supply chain',
      trustChips: [chip('Purchasing companies'), chip('Exporters'), chip('Cooperatives'), chip('Processors'), chip('Retailers')],
      benefitsEyebrow: "Why Hetti's & Sons",
      benefitsHeading: 'Reliable supply, backed by data you can verify.',
      benefitsLead:
        'We sit between the grower and the buyer so neither side carries the risk alone — fair prices for farmers, dependable quality for companies.',
      benefits: [
        benefitCard(
          iconId('network.svg'),
          'A real farmer network',
          'Direct relationships with 450+ growers mean better prices, steady volume, and supply you can plan around — not last-minute scrambling.'
        ),
        benefitCard(
          iconId('trace.svg'),
          'Tech-backed traceability',
          'Every lot is logged, graded and tracked through our own system — so you get quality data, batch history and proof of origin on request.'
        ),
        benefitCard(
          iconId('delivery.svg'),
          'Field to delivery, one partner',
          'Sourcing, grading, logistics and IT under one roof. Fewer handoffs, clearer accountability, and a single number to call.'
        ),
      ],
      servicesPreviewEyebrow: 'What we do',
      servicesPreviewHeading: 'Two sides of one business — agriculture and IT.',
      servicesPreviewLead:
        "From bulk sourcing to custom software, here's how we help companies buy with confidence and help farmers sell with stability.",
      servicesPreviewButton: button('See all services', '/services', 'pine'),
      aboutPreview: {
        eyebrow: 'Our story',
        heading: 'A family name growers and buyers both trust.',
        paragraph1:
          "Hetti's & Sons started where most good things in Sri Lankan agriculture do — in the field, with farmers. Today we pair that ground-level relationship with modern IT, so the produce moves faster and the paperwork tells the truth.",
        image: imgId('photo-1499848144902-af767f6d0c7f.avif'),
        badgeNumber: 'Field-first',
        badgeLabel: 'Every partnership starts with the farmer',
        ticks: [
          tick('Built on long-term farmer relationships, not one-off deals'),
          tick('Our own technology for grading, tracking and reporting'),
          tick('A team that knows both the soil and the system'),
        ],
        button: button('More about us', '/about', 'ghost'),
      },
      cinematicAbout: {
        label: 'Our story',
        headingPre: 'We are',
        headingItalicAccent: "Hetti's & Sons,",
        headingPost: 'an agriculture and IT company built on trust.',
        bodyText:
          "The Hetti family has bought and sold produce for two generations. We learned early that the farmer's trust is the whole business — pay fairly, show up when you say you will, and never gamble with someone's harvest.",
        button: button('More about us', '/about', 'ghost'),
      },
      featuresEyebrow: 'What we do',
      featuresHeadingLine1: 'Two sides of one business — agriculture and IT.',
      featuresHeadingLine2: 'Sourcing real produce. Building the tech behind it.',
      featuresImage: imgId('photo-1560493676-04071c5f467b.avif'),
      featuresImageCaption: 'Field to shelf, tracked every step.',
      testimonialsEyebrow: 'In their words',
      testimonialsHeading: 'What partners say about working with us.',
      ctaBand: {
        eyebrow: "Let's talk",
        heading: "Tell us what you need to source — we'll bring the farmers.",
        text: "Whether you're buying by the tonne or growing to sell, a 15-minute call is the fastest way to start.",
        buttons: [button('Book a call', '/contact', 'gold'), button('Explore services', '/services', 'ghost')],
      },
      seo: {
        metaTitle: "Hetti's & Sons — Agriculture & IT in Sri Lanka | Farmers, Products & Projects",
        metaDescription:
          "Hetti's & Sons connects Sri Lanka's local farmers with agriculture product purchasing companies — sourcing, logistics, quality and agri-tech, all from one partner.",
      },
    } as any,
  });

  // ---------- about-page ----------
  await strapi.documents('api::about-page.about-page').create({
    data: {
      hero: {
        eyebrow: 'About us',
        heading: 'We grew up between the field and the system.',
        text:
          "Hetti's & Sons is an agriculture and IT company based in Sri Lanka's central highlands, working with the people who grow the country's food and the companies that buy it.",
      },
      story: {
        eyebrow: 'Our story',
        heading: 'From a family trade to a tech-enabled supply partner.',
        paragraph1:
          "The Hetti family has bought and sold produce for two generations. We learned early that the farmer's trust is the whole business — pay fairly, show up when you say you will, and never gamble with someone's harvest.",
        paragraph2:
          'As buyers started demanding traceability, consistent grades and faster reporting, we did what most suppliers couldn\'t: we built the technology ourselves. That\'s how the "& IT" joined the name. Today we move agriculture products with the discipline of a software company and the relationships of a village trader.',
        image: imgId('photo-1544015759-237f87d55ef3.avif'),
      },
      missionValues: [
        benefitCard(
          iconId('mission.svg'),
          'Our mission',
          "To give Sri Lanka's farmers a buyer they can build a future on, and give companies a supply chain they can finally trust — connected by honest technology."
        ),
        benefitCard(
          iconId('values.svg'),
          'What we value',
          "Fair dealing first. Quality that's measured, not promised. And the belief that good agriculture and good software solve the same problem — getting the right thing to the right place, on time."
        ),
      ],
      differentiatorsEyebrow: 'What makes us different',
      differentiatorsHeading: 'Most suppliers do one thing. We close the whole loop.',
      differentiators: [
        taggedCard('Difference 01', 'We own the relationship', 'No anonymous middlemen. We know our farmers by name and our buyers by their standards.'),
        taggedCard('Difference 02', 'We own the tech', 'Grading, tracking and reporting run on systems we built — so we fix and improve them fast.'),
        taggedCard('Difference 03', 'We own the outcome', "One partner accountable from harvest to handover. When something needs solving, it's us."),
      ],
      ctaDark: {
        eyebrow: 'Work with us',
        heading: "Let's build a supply chain you don't have to worry about.",
        button: button('Get in touch', '/contact', 'gold'),
      },
      seo: { metaTitle: "About — Hetti's & Sons", metaDescription: "Learn about Hetti's & Sons, an agriculture and IT company based in Sri Lanka's central highlands." },
    } as any,
  });

  // ---------- services-page ----------
  await strapi.documents('api::services-page.services-page').create({
    data: {
      hero: {
        eyebrow: 'Services',
        heading: 'Everything between the harvest and the handover.',
        text:
          'Six services that cover both halves of what we do — sourcing real agriculture products, and building the IT that keeps them traceable.',
      },
      heroImage: imgId('photo-1544015759-237f87d55ef3.avif'),
      creamIntro: {
        paragraph:
          'We built two businesses that work as one — sourcing farmers can rely on, and technology that makes every step provable.',
        primaryButton: button('Book a call', '/contact', 'gold'),
        secondaryButton: button('See our story', '/about', 'ghost'),
        badgeLine1: 'Field-first',
        badgeLine2: 'Tech-backed',
        closingParagraph:
          'We source rice, tea, spices, fruit and fresh produce from a farmer network we know by name — then grade, track and deliver it with technology we built ourselves. One partner, accountable from harvest to handover.',
      },
      howItWorksEyebrow: 'How it works',
      howItWorksHeading: 'Four steps from "we need this" to "it\'s delivered".',
      howItWorksLead: "A simple, repeatable process — whether you're a company sourcing or a farmer supplying.",
      steps: [
        step('STEP 01', 'Tell us what you need', "Share the product, grade, volume and timeline. We confirm what's realistic and at what price."),
        step('STEP 02', 'We source & match', 'We tap our farmer network to secure supply, coordinating planting and collection where needed.'),
        step('STEP 03', 'Grade, pack & log', 'Every lot is checked, graded and recorded in our system, with results attached to the batch.'),
        step('STEP 04', 'Deliver with proof', 'We deliver on schedule with full traceability and the paperwork your buyers or auditors expect.'),
      ],
      faqEyebrow: 'FAQ',
      faqHeading: 'Questions, answered.',
      ctaDark: {
        eyebrow: 'Ready when you are',
        heading: 'Get a sourcing quote or scope an IT project today.',
        button: button('Book a call', '/contact', 'gold'),
      },
      seo: { metaTitle: "Services — Hetti's & Sons", metaDescription: 'Sourcing, farmer partnership, grading, logistics, agri-tech and custom IT projects.' },
    } as any,
  });

  // ---------- faq collection ----------
  const faqs = [
    {
      question: 'What products can you supply?',
      answer:
        "Rice and grains, Ceylon tea, spices, fresh vegetables and fruit, and seasonal produce. If it grows in Sri Lanka's central regions, we can likely source it — tell us your spec and we'll confirm.",
      order: 1,
    },
    {
      question: 'Do you work with small farmers or only big suppliers?',
      answer:
        'Both. Our model is built on a wide network of smallholder farmers who get guaranteed offtake, combined with the volume larger buyers require. Small farmers are the foundation of the business.',
      order: 2,
    },
    {
      question: 'What does the "IT" side actually include?',
      answer:
        'Our own grading and traceability systems, farm-management and crop/weather dashboards, plus custom software, websites and integrations we build for other agribusinesses.',
      order: 3,
    },
    {
      question: 'Can you provide traceability and quality documentation?',
      answer:
        'Yes. Every lot is logged with grade, origin and quality-check results. We can share batch history and proof of origin to support audits, exports and certifications.',
      order: 4,
    },
    {
      question: 'How do I get started?',
      answer:
        "Book a call or send us your requirement through the contact form. We'll come back with availability, pricing and a timeline — usually within a couple of working days.",
      order: 5,
    },
  ];
  for (const f of faqs) {
    await strapi.documents('api::faq.faq').create({ data: f as any });
  }

  // ---------- listings-page ----------
  await strapi.documents('api::listings-page.listings-page').create({
    data: {
      hero: {
        eyebrow: 'Products & projects',
        heading: "What we supply and what we've built.",
        text: "A snapshot of the agriculture products we source and the agri-tech projects we deliver. Filter to find what's relevant to you.",
      },
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Fresh produce', value: 'produce' },
        { label: 'Tea & spices', value: 'tea-spices' },
        { label: 'Grains', value: 'grains' },
        { label: 'Agri-tech', value: 'agri-tech' },
        { label: 'Logistics', value: 'logistics' },
      ],
      ctaBand: {
        eyebrow: "Don't see it?",
        heading: 'If we don\'t list it, we can probably still source it.',
        text: "Tell us the product, grade and volume — we'll check the network and come back with options.",
        buttons: [button('Send an enquiry', '/contact', 'gold')],
      },
      seo: { metaTitle: "Listings — Hetti's & Sons", metaDescription: 'Agriculture products we source and agri-tech projects we deliver.' },
    } as any,
  });

  // ---------- listing collection ----------
  const listings = [
    {
      title: 'Ceylon tea leaf',
      slug: 'ceylon-tea-leaf',
      category: 'tea-spices',
      badge: 'PRODUCT',
      description: 'Hand-picked, graded tea sourced from highland estates and smallholders, supplied loose or to processor spec.',
      image: imgId('photo-1544451822-38e32b887c08.avif'),
      ctaLabel: 'Enquire',
      order: 1,
    },
    {
      title: 'Seasonal vegetables',
      slug: 'seasonal-vegetables',
      category: 'produce',
      badge: 'PRODUCT',
      description: 'Tomatoes, leeks, beans, carrots and more — collected, graded and packed for wholesale and retail buyers.',
      image: imgId('photo-1757627550652-30788bfce978-b.avif'),
      ctaLabel: 'Enquire',
      order: 2,
    },
    {
      title: 'Paddy & rice',
      slug: 'paddy-rice',
      category: 'grains',
      badge: 'PRODUCT',
      description: 'Locally grown paddy and milled rice supplied in bulk, with moisture and grade checks on every lot.',
      image: imgId('photo-1560493676-04071c5f467b.avif'),
      ctaLabel: 'Enquire',
      order: 3,
    },
    {
      title: 'Traceability dashboard',
      slug: 'traceability-dashboard',
      category: 'agri-tech',
      badge: 'PROJECT',
      description: 'A seed-to-shelf tracking system built for a food processor — batch history, origin and quality data in one view.',
      image: imgId('photo-1515150144380-bca9f1650ed9.avif'),
      ctaLabel: 'View brief',
      order: 4,
    },
    {
      title: 'Farm-management tool',
      slug: 'farm-management-tool',
      category: 'agri-tech',
      badge: 'PROJECT',
      description: 'Crop planning, input tracking and weather dashboards that help cooperatives plan harvests with confidence.',
      image: imgId('photo-1594771804886-a933bb2d609b.avif'),
      ctaLabel: 'View brief',
      order: 5,
    },
    {
      title: 'Collection & delivery',
      slug: 'collection-delivery',
      category: 'logistics',
      badge: 'SERVICE',
      description: 'Scheduled collection from farms and delivery to buyers and ports, with cold-chain handling where required.',
      image: imgId('photo-1535379453347-1ffd615e2e08.avif'),
      ctaLabel: 'Enquire',
      order: 6,
    },
    {
      title: 'Spice consignments',
      slug: 'spice-consignments',
      category: 'tea-spices',
      badge: 'PRODUCT',
      description: 'Cinnamon, pepper and cloves sourced from highland growers and graded for export-ready consignments.',
      image: imgId('photo-1668587877964-16488273b0ab.avif'),
      ctaLabel: 'Enquire',
      order: 7,
    },
    {
      title: 'Contract growing',
      slug: 'contract-growing',
      category: 'produce',
      badge: 'PROGRAM',
      description: 'Pre-agreed contract farming for buyers who need a specific crop, volume and harvest window locked in early.',
      image: imgId('photo-1593490755898-b6f1d8e637cb.avif'),
      ctaLabel: 'Enquire',
      order: 8,
    },
    {
      title: 'Maize & pulses',
      slug: 'maize-pulses',
      category: 'grains',
      badge: 'PRODUCT',
      description: 'Maize, green gram and other pulses aggregated from smallholders for animal feed and food processors.',
      image: imgId('photo-1491497895121-1334fc14d8c9.avif'),
      ctaLabel: 'Enquire',
      order: 9,
    },
  ];
  for (const l of listings) {
    await strapi.documents('api::listing.listing').create({ data: l as any });
  }

  // ---------- testimonial collection ----------
  const testimonials = [
    {
      quote:
        "Consistent grades, consistent timing. We've stopped chasing suppliers — Hetti's just delivers, and the batch reports make our audits painless.",
      name: 'Ravindu Perera',
      role: 'Procurement, produce exporter',
      avatarInitials: 'RP',
      avatarColor: '#2D6A4F',
      stars: 5,
      order: 1,
    },
    {
      quote: 'As a small farmer, the guaranteed offtake changed everything. I plant knowing it will be bought, at a price agreed up front.',
      name: 'Kamala Senanayake',
      role: 'Smallholder farmer, Matale',
      avatarInitials: 'KS',
      avatarColor: '#E0A33A',
      stars: 5,
      order: 2,
    },
    {
      quote:
        'They built us a traceability dashboard that connects straight to their supply. Agriculture people who actually understand software — rare.',
      name: 'Nadeesha Fernando',
      role: 'Ops Lead, food processor',
      avatarInitials: 'NF',
      avatarColor: '#1B4332',
      stars: 5,
      order: 3,
    },
  ];
  for (const t of testimonials) {
    await strapi.documents('api::testimonial.testimonial').create({ data: t as any });
  }

  // ---------- contact-page ----------
  await strapi.documents('api::contact-page.contact-page').create({
    data: {
      hero: {
        eyebrow: 'Contact',
        heading: "Let's get your supply sorted.",
        text:
          "Send a few details about what you need to buy or sell. We'll reply with availability, pricing and next steps — usually within two working days.",
      },
      formNote: 'By sending, you agree to be contacted about your enquiry. We never share your details.',
      successHeading: 'Thank you — your enquiry is on its way.',
      successText:
        "We've received your message and will get back to you within two working days. For anything urgent, call us directly on the number opposite.",
      contactInfo: [
        { icon: iconId('phone.svg'), label: 'Phone', value: '+94 77 000 0000', href: 'tel:+94770000000' },
        { icon: iconId('email.svg'), label: 'Email', value: 'hello@hettiandsons.lk', href: 'mailto:hello@hettiandsons.lk' },
        { icon: iconId('location.svg'), label: 'Location', value: 'Kandy, Central Province, Sri Lanka', href: '' },
        { icon: iconId('clock.svg'), label: 'Hours', value: 'Mon–Sat · 8:30am–5:30pm', href: '' },
      ],
      mapEmbedUrl: 'https://www.google.com/maps?q=Kandy,Sri+Lanka&output=embed',
      seo: { metaTitle: "Contact — Hetti's & Sons", metaDescription: "Get in touch with Hetti's & Sons to source products or scope an IT project." },
    } as any,
  });

  // ---------- blog-page + blog-post ----------
  await strapi.documents('api::blog-page.blog-page').create({
    data: {
      hero: {
        eyebrow: 'Blog',
        heading: 'Notes from the field and the server room.',
        text: "Stories, guides and updates on Sri Lankan agriculture, sourcing and the agri-tech we're building.",
      },
      seo: { metaTitle: "Blog — Hetti's & Sons", metaDescription: 'Stories and updates on agriculture, sourcing and agri-tech from Hetti & Sons.' },
    } as any,
  });

  const blogPosts = [
    {
      title: 'How we grade tea before it ever reaches a buyer',
      slug: 'how-we-grade-tea',
      excerpt: 'A look inside our collection-point quality checks — and why every lot gets a paper trail.',
      content:
        "Every lot of Ceylon tea that passes through our network is checked at the point of collection, not after the fact. Trained collectors assess leaf size, moisture and colour against a standard we agreed with our buyers long before harvest season starts.\n\nThe results are logged against the batch, not the farm — so if a buyer ever needs to trace a shipment back to its origin, the record is already there. It's a small amount of extra work at collection time that saves everyone a much bigger headache later.",
      author: "Hetti's & Sons Team",
      publishDate: '2026-05-04',
      category: 'Quality',
      featured: true,
    },
    {
      title: 'Why guaranteed offtake changes how smallholders plant',
      slug: 'guaranteed-offtake-smallholders',
      excerpt: 'Fair pricing agreed before planting season removes the biggest risk a small farmer carries.',
      content:
        "Ask any smallholder what keeps them up at night and it's rarely the growing — it's the selling. Will there be a buyer? At what price? Guaranteed offtake removes that question entirely: the price and the buyer are agreed before a seed goes in the ground.\n\nWe've seen farmers plant more of a higher-value crop simply because the risk of it not selling was taken off their plate. That's the whole point of the partnership model.",
      author: "Hetti's & Sons Team",
      publishDate: '2026-04-18',
      category: 'Farmers',
      featured: false,
    },
    {
      title: 'Building our own traceability system, from field to shelf',
      slug: 'building-traceability-system',
      excerpt: "Why we chose to build agri-tech in-house instead of buying off the shelf — and what it tracks today.",
      content:
        "When we went looking for traceability software that matched how produce actually moves through Sri Lanka's central highlands, nothing fit. So we built our own.\n\nToday it logs every lot from collection through grading, storage and delivery, and generates the batch reports our buyers use for their own audits. It's still the same system, just grown up — and it's the reason the '& IT' is in our name.",
      author: "Hetti's & Sons Team",
      publishDate: '2026-03-02',
      category: 'Agri-Tech',
      featured: false,
    },
  ];
  for (const p of blogPosts) {
    const created = await strapi.documents('api::blog-post.blog-post').create({ data: p as any });
    await strapi.documents('api::blog-post.blog-post').publish({ documentId: created.documentId });
  }

  // ---------- team-page + team-member ----------
  await strapi.documents('api::team-page.team-page').create({
    data: {
      hero: {
        eyebrow: 'Team',
        heading: 'The people between the field and the system.',
        text: 'A small team covering agronomy, sourcing, logistics and the software that ties it together.',
      },
      intro: "Hetti's & Sons is run by a close team that splits time between farms, collection points and code.",
      seo: { metaTitle: "Team — Hetti's & Sons", metaDescription: "Meet the team behind Hetti's & Sons." },
    } as any,
  });

  const teamMembers = [
    { name: 'Suresh Hettiarachchi', role: 'Founder & Sourcing Lead', bio: 'Two decades buying and selling produce across the central highlands.', order: 1 },
    { name: 'Dilani Wickramasinghe', role: 'Head of Quality & Grading', bio: 'Runs the standards every lot is checked against before it leaves a collection point.', order: 2 },
    { name: 'Chamara Rathnayake', role: 'Logistics Manager', bio: 'Keeps collection, cold-chain and delivery schedules running on time.', order: 3 },
    { name: 'Ishara Gunawardena', role: 'Agri-Tech Lead', bio: 'Builds and maintains the traceability, dashboard and farm-management systems.', order: 4 },
  ];
  for (const m of teamMembers) {
    await strapi.documents('api::team-member.team-member').create({ data: m as any });
  }

  // ---------- gallery-page ----------
  const galleryItems = [
    { image: imgId('photo-1470087167738-6aa485ff65dc.avif'), caption: 'Terraced highland hills at dawn', category: 'Landscape' },
    { image: imgId('photo-1499848144902-af767f6d0c7f.avif'), caption: 'Hand-harvesting fresh greens', category: 'Farmers' },
    { image: imgId('photo-1544015759-237f87d55ef3.avif'), caption: 'Aerial view of patterned fields', category: 'Landscape' },
    { image: imgId('photo-1544451822-38e32b887c08.avif'), caption: 'Grading fresh tea leaves', category: 'Quality' },
    { image: imgId('photo-1535379453347-1ffd615e2e08.avif'), caption: 'Collection trucks at the field edge', category: 'Logistics' },
    { image: imgId('photo-1757627550652-30788bfce978.avif'), caption: 'Fresh vegetables ready for market', category: 'Produce' },
    { image: imgId('photo-1560493676-04071c5f467b.avif'), caption: 'Crop rows at sunset', category: 'Agri-Tech' },
    { image: imgId('photo-1515150144380-bca9f1650ed9.avif'), caption: 'Tending young plants by hand', category: 'Farmers' },
    { image: imgId('photo-1594771804886-a933bb2d609b.avif'), caption: 'Tractor at work in the field', category: 'Agri-Tech' },
    { image: imgId('photo-1593490755898-b6f1d8e637cb.avif'), caption: 'Tending a flowering field', category: 'Farmers' },
    { image: imgId('photo-1668587877964-16488273b0ab.avif'), caption: 'Freshly brewed Ceylon tea', category: 'Produce' },
    { image: imgId('photo-1491497895121-1334fc14d8c9.avif'), caption: 'Open fields to the horizon', category: 'Landscape' },
    { image: imgId('photo-1757627550652-30788bfce978-b.avif'), caption: 'Wholesale vegetable crates', category: 'Produce' },
  ];
  await strapi.documents('api::gallery-page.gallery-page').create({
    data: {
      hero: {
        eyebrow: 'Gallery',
        heading: 'Fields, farmers and the produce in between.',
        text: 'A visual look at where our supply comes from and how it moves.',
      },
      intro: 'A snapshot from farms, collection points and delivery across the central highlands.',
      items: galleryItems,
      seo: { metaTitle: "Gallery — Hetti's & Sons", metaDescription: 'Photos from farms, collection points and delivery.' },
    } as any,
  });

  strapi.log.info('[seed] content seed complete');
}

const READ_TYPES = [
  'site-setting',
  'navigation',
  'home-page',
  'about-page',
  'services-page',
  'listings-page',
  'contact-page',
  'blog-page',
  'team-page',
  'gallery-page',
  'test-page',
];

const READ_FIND_ONLY_TYPES = ['service', 'listing', 'testimonial', 'faq', 'blog-post', 'team-member'];

export async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!publicRole) {
    strapi.log.warn('[seed] public role not found, skipping permission setup');
    return;
  }

  const actions: string[] = [];
  for (const uid of READ_TYPES) {
    actions.push(`api::${uid}.${uid}.find`);
  }
  for (const uid of READ_FIND_ONLY_TYPES) {
    actions.push(`api::${uid}.${uid}.find`);
    actions.push(`api::${uid}.${uid}.findOne`);
  }
  actions.push('api::lead.lead.create');

  for (const action of actions) {
    const found = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!found) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }

  strapi.log.info(`[seed] public permissions set for ${actions.length} actions`);
}
