import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksBenefitCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_benefit_cards';
  info: {
    displayName: 'Benefit Card';
    icon: 'star';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCinematicAbout extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cinematic_abouts';
  info: {
    displayName: 'Cinematic About';
    icon: 'italic';
  };
  attributes: {
    bodyText: Schema.Attribute.Text & Schema.Attribute.Required;
    button: Schema.Attribute.Component<'shared.button', false>;
    headingItalicAccent: Schema.Attribute.String;
    headingPost: Schema.Attribute.String;
    headingPre: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface BlocksCreamBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cream_blocks';
  info: {
    displayName: 'Cream Intro Block';
    icon: 'layout';
  };
  attributes: {
    badgeLine1: Schema.Attribute.String;
    badgeLine2: Schema.Attribute.String;
    closingParagraph: Schema.Attribute.Text;
    paragraph: Schema.Attribute.Text;
    primaryButton: Schema.Attribute.Component<'shared.button', false>;
    secondaryButton: Schema.Attribute.Component<'shared.button', false>;
  };
}

export interface BlocksCtaBand extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_bands';
  info: {
    displayName: 'CTA Band (light rounded card)';
    icon: 'bell';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'shared.button', true>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksCtaDark extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_darks';
  info: {
    displayName: 'CTA Dark (centered banner)';
    icon: 'bell';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_gallery_items';
  info: {
    displayName: 'Gallery Item';
    icon: 'images';
  };
  attributes: {
    caption: Schema.Attribute.String;
    category: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'shared.button', true>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    highlightWord: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    lead: Schema.Attribute.Text;
    stats: Schema.Attribute.Component<'shared.stat', true>;
  };
}

export interface BlocksInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_info_items';
  info: {
    displayName: 'Info Item';
    icon: 'information';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksPageHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_page_heroes';
  info: {
    displayName: 'Page Hero';
    icon: 'landscape';
  };
  attributes: {
    backLinkHref: Schema.Attribute.String;
    backLinkLabel: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksSplitBlock extends Struct.ComponentSchema {
  collectionName: 'components_blocks_split_blocks';
  info: {
    displayName: 'Split Block';
    icon: 'layout';
  };
  attributes: {
    badgeLabel: Schema.Attribute.String;
    badgeNumber: Schema.Attribute.String;
    button: Schema.Attribute.Component<'shared.button', false>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    paragraph1: Schema.Attribute.Text;
    paragraph2: Schema.Attribute.Text;
    ticks: Schema.Attribute.Component<'shared.tick', true>;
  };
}

export interface BlocksStep extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    displayName: 'Step';
    icon: 'arrowRight';
  };
  attributes: {
    number: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTaggedCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tagged_cards';
  info: {
    displayName: 'Tagged Card';
    icon: 'layer';
  };
  attributes: {
    tag: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<['gold', 'pine', 'ghost']> &
      Schema.Attribute.DefaultTo<'gold'>;
  };
}

export interface SharedChip extends Struct.ComponentSchema {
  collectionName: 'components_shared_chips';
  info: {
    displayName: 'Chip';
    icon: 'price-tag';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFilterChip extends Struct.ComponentSchema {
  collectionName: 'components_shared_filter_chips';
  info: {
    displayName: 'Filter Chip';
    icon: 'filter';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    displayName: 'Nav Link';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'earth';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'linkedin', 'whatsapp', 'twitter', 'youtube']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTick extends Struct.ComponentSchema {
  collectionName: 'components_shared_ticks';
  info: {
    displayName: 'Tick';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.benefit-card': BlocksBenefitCard;
      'blocks.cinematic-about': BlocksCinematicAbout;
      'blocks.cream-block': BlocksCreamBlock;
      'blocks.cta-band': BlocksCtaBand;
      'blocks.cta-dark': BlocksCtaDark;
      'blocks.gallery-item': BlocksGalleryItem;
      'blocks.hero': BlocksHero;
      'blocks.info-item': BlocksInfoItem;
      'blocks.page-hero': BlocksPageHero;
      'blocks.split-block': BlocksSplitBlock;
      'blocks.step': BlocksStep;
      'blocks.tagged-card': BlocksTaggedCard;
      'shared.button': SharedButton;
      'shared.chip': SharedChip;
      'shared.filter-chip': SharedFilterChip;
      'shared.nav-link': SharedNavLink;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stat': SharedStat;
      'shared.tick': SharedTick;
    }
  }
}
