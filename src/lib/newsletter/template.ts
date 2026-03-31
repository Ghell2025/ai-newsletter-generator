import type { Prospect, Product } from '@/types';
import { styles, getCategoryColor } from './inline-styles';

interface NewsletterParams {
  prospect: Prospect;
  matchedProducts: Product[];
  greeting: string;
  intro: string;
  productBlurbs: string[];
  companyBlurb: string;
  signoff: string;
}

export function buildNewsletterHTML(params: NewsletterParams): string {
  const { prospect, matchedProducts, greeting, intro, productBlurbs, companyBlurb, signoff } = params;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const productCards = matchedProducts
    .map((product, i) => {
      const color = getCategoryColor(product.category);
      const blurb = productBlurbs[i] || product.description;
      const featureItems = product.features
        .slice(0, 4)
        .map(
          (f) =>
            `<li style="${styles.featureItem}"><span style="${styles.featureBullet}">&bull;</span> ${f}</li>`
        )
        .join('');

      return `
      <div style="${styles.productCard}">
        ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="${styles.productImage}">` : ''}
        <div style="${styles.productBody}">
          <span style="${styles.productCategory}background:${color}15;color:${color};">${product.category}</span>
          <h3 style="${styles.productName}">${product.name}</h3>
          <p style="${styles.productDesc}">${blurb}</p>
          ${featureItems ? `<ul style="${styles.featureList}">${featureItems}</ul>` : ''}
          <a href="#" style="${styles.ctaButton}background:${color};">Request a Quote &rarr;</a>
        </div>
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>3D OptiTech — Solutions for ${prospect.company}</title>
</head>
<body style="${styles.body}">
  <div style="padding:20px 0;">
    <div style="${styles.container}">
      <!-- Header -->
      <div style="${styles.header}">
        <img src="https://3doptitech.com/wp-content/uploads/2026/01/logo-default.png" alt="3D OptiTech" style="${styles.logo}">
        <h1 style="${styles.headerTitle}">CNC Solutions Weekly</h1>
        <p style="${styles.headerSubtitle}">${dateStr}</p>
        <p style="${styles.headerTagline}">High-end CNC Machines for Aluminium &amp; PVC</p>
      </div>

      <!-- Greeting -->
      <p style="${styles.greeting}">
        ${greeting} <span style="${styles.greetingName}">${prospect.name}</span>,
      </p>

      <!-- Intro -->
      <p style="${styles.intro}">${intro}</p>

      <hr style="${styles.divider}">

      <!-- Products Section -->
      <div style="${styles.productSection}">
        <p style="${styles.sectionTitle}">Selected for ${prospect.company}</p>
        ${productCards}
      </div>

      <!-- Company Section -->
      <div style="${styles.companySection}">
        <h3 style="${styles.companyTitle}">Why 3D OptiTech?</h3>
        <p style="${styles.companyText}">${companyBlurb}</p>
      </div>

      <!-- Signoff -->
      <p style="${styles.intro}">${signoff}</p>

      <!-- Footer -->
      <div style="${styles.footer}">
        <p style="${styles.footerText}">
          Solutions selected based on your ${prospect.industry} needs: ${prospect.interests.join(', ')}.<br><br>
          <a href="https://3doptitech.com" style="${styles.footerLink}">Visit our website</a> &middot;
          <a href="mailto:info@3doptitech.com" style="${styles.footerLink}">Request a quote</a> &middot;
          <a href="#" style="${styles.footerLink}">Unsubscribe</a>
        </p>
        <p style="${styles.footerContact}">
          3D OptiTech &middot; Netherlands, Belgium &amp; Germany<br>
          +31 (0)6 29 82 24 18 &middot; info@3doptitech.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
