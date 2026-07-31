Prompt

I have a project located at:

C:\Users\Mithun Hettige\Desktop\Hackathon Project - first

Before writing any code, go through every file and folder in the project to fully understand the existing structure, assets, and functionality. Analyze the project carefully so you can preserve the current design and behavior while rebuilding it.

Objective

I want you to rebuild my existing HTML website into a production-quality Astro project using:

Astro (latest stable version)
Vanilla HTML/CSS/JavaScript
jQuery (only where necessary)
Component-based architecture
Clean, maintainable, scalable code

The final project should be responsive, optimized, and easy to maintain.

Frontend Requirements

Inside the web folder, create the Astro project.

I already have a complete HTML version of the website:

hettis-and-sons_7.html

Use this file as the primary reference.

Your task is to break this single HTML file into a properly structured Astro website.

Pages

Separate the website into individual pages where appropriate (for example):

Home
About
Services
Products
Blog
Contact
Any additional pages that exist in the original HTML

Do not keep everything in one HTML file.

Components

Create reusable Astro components.

Examples:

Header
Footer
Navigation
Hero Slider
CTA Sections
Cards
Testimonials
Contact Form
Gallery
Product Cards
Blog Cards
Reusable Buttons

Avoid duplicated code.

Layout

Create a global layout similar to WordPress templates.

For example:
src/
    layouts/
        MainLayout.astro

    components/
        Header.astro
        Footer.astro
        Navigation.astro

Every page should automatically use the same Header and Footer rather than duplicating HTML.

CSS

Separate all CSS into dedicated files.

Do not place large CSS blocks inside Astro pages.

Organize CSS logically.

Example:

styles/
    global.css
    header.css
    footer.css
    home.css
    about.css
    responsive.css

Keep CSS clean and modular.

JavaScript

Separate JavaScript into its own files.

Example:

scripts/
    global.js
    slider.js
    menu.js
    contact.js

Use jQuery only when necessary.

Otherwise prefer vanilla JavaScript.

Images

I have already downloaded all online images.

They are located inside the project's image folder.

Replace every external image URL with the corresponding local image.

There should be no external image URLs remaining.

Responsive Design

The rebuilt site must be fully responsive.

Support:

Desktop
Laptop
Tablet
Mobile

Ensure:

No layout breaking
Proper spacing
Responsive typography
Responsive navigation
Responsive images
Responsive sliders


Code Quality

The project should be production-ready.

Requirements:

Clean folder structure
Reusable components
Semantic HTML
SEO-friendly markup
Accessible HTML where possible
Optimized images
Organized CSS
Organized JavaScript
No duplicated code
Easy to maintain

CMS Requirements

Inside the project there is a folder named:

cms

This is my local Strapi CMS.

I want you to fully configure it as the backend for the Astro frontend.

Strapi Requirements

Every editable piece of content should come from Strapi.

Examples include:

Site settings
Logo
Navigation menu
Footer
Contact information
Social links
Hero slider
Hero images
Hero buttons
Homepage sections
Services
Products
Categories
Testimonials
FAQs
Team members
Blog posts
Images
Buttons
Links
SEO fields
Meta titles
Meta descriptions
Page banners
Gallery
Any text shown on the website

Nothing should be hardcoded unless absolutely necessary.

Dynamic Content

The CMS should not only edit existing content—it should also allow adding or removing content dynamically.

For example:

Blurbs

If the homepage currently displays 4 blurbs, I should be able to:

Add a 5th blurb
Add a 6th blurb
Remove blurbs
Reorder blurbs

The frontend should update automatically without requiring code changes.

The same behavior should apply to:

Hero slides
Testimonials
Services
Team members
Products
Blog posts
FAQs
Galleries
Menu items
Footer links
Social icons
Contact details
Any repeatable content

All repeatable sections should use Strapi Dynamic Zones or Repeatable Components where appropriate.


Astro + Strapi Integration

Connect Astro with the local Strapi API.

The frontend should:

Fetch content from Strapi
Display dynamic content
Handle loading states gracefully
Continue working as content changes

Adding content in Strapi should automatically appear on the frontend without modifying any Astro code.

Project Structure

Create a clean project architecture.

Example:

project/
│
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── scripts/
│   │   ├── lib/
│   │   └── assets/
│   │
│   └── public/
│       └── images/
│
└── cms/
    └── Strapi


Final Goal

The final result should be a fully dynamic, production-ready website where:

Astro serves as the frontend.
Strapi serves as the CMS/backend.
Every page is component-based.
Header and footer are shared across the site using layouts/components.
CSS and JavaScript are properly separated.
All local images are used instead of external URLs.
Every editable element (text, images, menus, links, buttons, testimonials, slides, services, products, blog posts, contact information, etc.) is managed through Strapi.
Repeatable content can be added, removed, or reordered entirely from the Strapi admin panel without any frontend code changes.
The website is fully responsive, optimized, bug-free, maintainable, and follows modern Astro best practices.
