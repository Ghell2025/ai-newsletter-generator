import type { Prospect, Product, NewsletterResult } from '@/types';
import type { AIProvider } from './types';
import { buildNewsletterHTML } from '../newsletter/template';

const GREETINGS = [
  'Dear',
  'Hello',
  'Good morning',
  'Greetings',
];

const INTROS: Record<string, string[]> = {
  'Window & Door Manufacturing': [
    "In window and door manufacturing, every cut matters. This week we've selected CNC solutions designed to boost your production speed while maintaining the precision your customers expect.",
    "Modern window production demands machines that keep up with growing order volumes. Here are solutions we've matched to your specific production needs at your facility.",
    "Whether you're processing aluminium or PVC profiles, the right machinery makes all the difference. We've identified these solutions based on what we know about your operations.",
  ],
  'Aluminium Fabrication': [
    "Aluminium fabrication is all about precision and throughput. This week's selection focuses on CNC machinery that delivers both — with the reliability your production floor depends on.",
    "For aluminium profile processors like yourself, the difference between a good machine and a great one is measured in uptime and accuracy. Here's what we recommend.",
    "Your aluminium fabrication operations deserve machines that match your ambition. We've curated these solutions specifically for your production requirements.",
  ],
  'PVC Window Production': [
    "PVC profile processing has its own unique demands — from clean cuts to consistent tolerances. Here are machines built specifically for your material and production volume.",
    "Efficiency in PVC window production starts with the right equipment. We've matched these solutions to your facility's needs and current production challenges.",
    "Your PVC production line can only be as good as the machines powering it. This week, we're highlighting solutions that could significantly improve your output.",
  ],
  'Aluminium Profile Processing': [
    "Profile processing at scale requires machines that don't compromise on precision or speed. Here are our top picks for your aluminium profile operations.",
    "From machining to cutting, every step in aluminium profile processing impacts your final product quality. These solutions address the challenges we see most often in your industry.",
    "High-volume aluminium profile processing demands robust, precise machinery. We've selected these solutions with your specific operational needs in mind.",
  ],
  'Window Manufacturing': [
    "Window manufacturers across the Netherlands are upgrading their production capacity this year. Here are the CNC solutions that can help you stay ahead of the competition.",
    "In the window manufacturing sector, the right machines translate directly to faster delivery times and happier customers. These are our recommendations for your facility.",
    "Every window starts with a precise cut and a perfect profile. We've matched these machines to your production needs to help you deliver quality at speed.",
  ],
  'Door & Window Systems': [
    "Door and window system manufacturers need versatile machinery that handles diverse profiles and production runs. Here are solutions designed for exactly that flexibility.",
    "Your door and window production relies on machines that can switch between jobs quickly without sacrificing quality. We've selected these solutions with your workflow in mind.",
    "Combining door and window production on the same floor requires smart machinery choices. Here's what we recommend based on your requirements.",
  ],
  'Industrial Profile Machining': [
    "Industrial profile machining demands heavy-duty CNC capability with precision that holds up across long production runs. These machines deliver exactly that.",
    "For high-precision industrial profile machining, the right multi-axis CNC center makes all the difference. Here are our recommendations for your operations.",
    "Your industrial profile machining operations need machines built for demanding tolerances and sustained throughput. We've matched these to your needs.",
  ],
  'PVC Profile Processing': [
    "PVC profile processing requires machines specifically optimized for the material — clean cuts, no burrs, consistent quality. Here's what we recommend for your production.",
    "Getting the best results from PVC profiles starts with the right cutting and machining equipment. We've selected these solutions for your specific setup.",
    "For PVC profile processors, machine reliability and cut quality are everything. These solutions are designed to deliver both, day after day.",
  ],
};

const DEFAULT_INTROS = [
  "Based on your production requirements, we've selected the following CNC solutions that we believe can make a real difference in your operations.",
  "Here are this week's recommended solutions, carefully matched to your manufacturing needs and production goals.",
  "We've identified these machines and services based on your industry and specific operational requirements.",
];

const BLURB_TEMPLATES = [
  (product: Product, prospect: Prospect) =>
    `${product.description} For ${prospect.industry.toLowerCase()} operations like ${prospect.company}, this solution can significantly improve your daily throughput and cut quality.`,
  (product: Product, prospect: Prospect) =>
    `${product.description} Manufacturers in the ${prospect.industry.toLowerCase()} sector across the Benelux have seen measurable productivity gains after implementing this in their production.`,
  (product: Product) =>
    `${product.description} With proven reliability and industry-leading specifications, this is one of the most popular solutions in our ${product.category.toLowerCase()} lineup.`,
  (product: Product, prospect: Prospect) =>
    `${product.description} Given ${prospect.company}'s focus on ${prospect.interests[0] || prospect.industry}, this solution is a natural fit for your current and future production needs.`,
];

const COMPANY_BLURBS = [
  "With over 20 years of experience in CNC machinery and production optimization, 3D OptiTech has helped manufacturers across the Netherlands, Belgium, and Germany transform their production floors. Led by founder Tommaso Scotti, our team provides end-to-end support — from machine selection and installation to ongoing technical service and production optimization. We don't just sell machines; we optimize every second of your production.",
  "3D OptiTech is your partner for high-end CNC solutions for aluminium and PVC profile processing. We combine deep technical expertise with hands-on service — including remote support via smart glasses technology. Our clients trust us because we deliver results: faster production rates, longer tool life, and smoother operations. Serving manufacturers in NL, BE, and DE.",
  "Founded by Tommaso Scotti with 20+ years of industry expertise, 3D OptiTech specializes in CNC machinery for the window, door, and profile processing industries. We offer everything from machine sales to production optimization, retrofitting, and 24/7 technical support. Our mission is simple: optimize every second of your production.",
];

const SIGNOFFS = [
  "Interested in any of these solutions? Reply to this email or call us at +31 (0)6 29 82 24 18 — we'd be happy to arrange a demo at your facility.",
  "We'd love to show you these machines in action. Book a free consultation and we'll visit your production floor to discuss which solutions fit best.",
  "Ready to take your production to the next level? Let's schedule a call — or we can arrange an on-site demo at your facility in the Netherlands, Belgium, or Germany.",
  "Want to see the full specifications? Reply to this email and we'll send you the complete technical documentation, along with a production analysis for your setup.",
  "Questions about any of these solutions? Tommaso and the team are ready to help. Call us at +31 (0)6 29 82 24 18 or reply to this email.",
];

function scoreProduct(product: Product, prospect: Prospect): number {
  let score = 0;
  const categoryLower = product.category.toLowerCase();
  const industryLower = prospect.industry.toLowerCase();

  for (const interest of prospect.interests) {
    const interestLower = interest.toLowerCase();
    if (categoryLower === interestLower) {
      score += 10;
    } else if (
      categoryLower.includes(interestLower) ||
      interestLower.includes(categoryLower)
    ) {
      score += 5;
    }
  }

  if (categoryLower.includes(industryLower) || industryLower.includes(categoryLower)) {
    score += 3;
  }

  return score;
}

function matchProducts(prospect: Prospect, allProducts: Product[]): Product[] {
  const scored = allProducts.map((product) => ({
    product,
    score: scoreProduct(product, prospect),
  }));

  scored.sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0).slice(0, 3);

  if (matched.length < 2) {
    const remaining = scored.filter((s) => s.score === 0);
    while (matched.length < 2 && remaining.length > 0) {
      matched.push(remaining.shift()!);
    }
  }

  return matched.map((s) => s.product);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hashStr(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const mockProvider: AIProvider = {
  async generateNewsletter(
    prospect: Prospect,
    allProducts: Product[]
  ): Promise<NewsletterResult> {
    const matched = matchProducts(prospect, allProducts);
    const seed = hashStr(prospect.id + prospect.name);

    const industryIntros = INTROS[prospect.industry] || DEFAULT_INTROS;

    const greeting = pick(GREETINGS, seed);
    const intro = pick(industryIntros, seed + 1);
    const signoff = pick(SIGNOFFS, seed + 2);
    const companyBlurb = pick(COMPANY_BLURBS, seed + 3);

    const productBlurbs = matched.map((product, i) => {
      const template = pick(BLURB_TEMPLATES, seed + i + 4);
      return template(product, prospect);
    });

    const htmlContent = buildNewsletterHTML({
      prospect,
      matchedProducts: matched,
      greeting,
      intro,
      productBlurbs,
      companyBlurb,
      signoff,
    });

    const subject = `${prospect.name}, ${matched.length} CNC solutions selected for ${prospect.company}`;

    return {
      prospectId: prospect.id,
      prospectName: prospect.name,
      prospectEmail: prospect.email,
      prospectCompany: prospect.company,
      subject,
      htmlContent,
      matchedProducts: matched,
    };
  },
};
