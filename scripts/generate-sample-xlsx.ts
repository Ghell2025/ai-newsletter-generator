import * as XLSX from 'xlsx';
import * as path from 'path';

const prospects = [
  ['Name', 'Email', 'Company', 'Industry', 'Interests'],
  ['Frank de Vries', 'frank@kozijnpro.nl', 'KozijnPro B.V.', 'Window & Door Manufacturing', 'Double Mitre Saw, CNC Profile Machining, Production Optimization'],
  ['Stefan Vermeer', 'stefan@alumax-group.nl', 'Alumax Group', 'Aluminium Fabrication', 'CNC Profile Machining, 4-Axis Machining, Technical Service'],
  ['Marc Dubois', 'marc@belux-fenêtres.be', 'Belux Fenêtres SA', 'PVC Window Production', 'Single Mitre Saw, Cutting Center, Automation Upgrades'],
  ['Klaus Breitner', 'klaus@rheinprofil.de', 'RheinProfil GmbH', 'Aluminium Profile Processing', '4-Axis Machining, CNC Profile Machining, Retrofitting'],
  ['Jan Bakker', 'jan@hollandkozijnen.nl', 'Holland Kozijnen', 'Window Manufacturing', 'Double Mitre Saw, Production Optimization, Tool Longevity'],
  ['Pierre Lambert', 'pierre@eurofenster.be', 'Euro Fenster BVBA', 'Door & Window Systems', 'CNC Profile Machining, Automation Upgrades, 3D Simulations'],
  ['Thomas Weber', 'thomas@profiletech.de', 'ProfileTech AG', 'Industrial Profile Machining', '3-Axis Machining, 4-Axis Machining, Technical Service'],
  ['Erik van den Berg', 'erik@deltaprofielen.nl', 'Delta Profielen', 'PVC Profile Processing', 'Single Mitre Saw, Cutting Center, Production Optimization'],
];

const products = [
  ['Name', 'Description', 'Category', 'Image', 'Features'],
  [
    'Tesla — Double Mitre Saw',
    'High-performance double mitre saw engineered for precision cutting of aluminium and PVC profiles. Designed for window and door manufacturers who demand speed and accuracy on every cut.',
    'Double Mitre Saw',
    'https://3doptitech.com/wp-content/uploads/2026/01/be0cdc9d33e9d12abeb6613a82ea3fa81da5c548.webp',
    'Precision double mitre cutting, Aluminium & PVC compatible, High-speed operation, Low maintenance design',
  ],
  [
    'AS 426 — Single Mitre Saw',
    'Reliable single-head mitre saw built for consistent, clean cuts on aluminium and PVC profiles. Ideal for production environments where dependability and ease of use are key.',
    'Single Mitre Saw',
    'https://3doptitech.com/wp-content/uploads/2026/01/c64efae3c282af78dacf0574c82cae06660814d7.webp',
    'Single-head precision cutting, Compact footprint, Easy blade changeover, Suitable for aluminium & PVC',
  ],
  [
    'Carrera — 4-Axis CNC Machining & Cutting Center',
    'Advanced 4-axis CNC machining and cutting center that handles complex profile operations in a single setup. Built for manufacturers who need maximum flexibility and throughput.',
    '4-Axis Machining',
    'https://3doptitech.com/wp-content/uploads/2026/01/1b0990e29645dd5b8d8ed75a5d13d0a60c120d77.webp',
    '4-axis simultaneous machining, Integrated cutting center, Complex profile capability, High throughput',
  ],
  [
    'Boxter — 3-Axis CNC Profile Machining Center',
    'Versatile 3-axis CNC machining center optimized for aluminium and PVC profile processing. Delivers precision machining with a user-friendly interface for operators of all skill levels.',
    '3-Axis Machining',
    'https://3doptitech.com/wp-content/uploads/2026/01/d30c112446b420371750f90043d0a790a88801eb.webp',
    '3-axis CNC precision, User-friendly interface, Optimized for profiles, Fast setup times',
  ],
  [
    'California — 4-Axis CNC Profile Machining Center',
    'Premium 4-axis CNC profile machining center designed for high-volume production. Combines power, precision, and smart automation for modern manufacturing facilities.',
    '4-Axis Machining',
    'https://3doptitech.com/wp-content/uploads/2026/01/0a877a333af74bfb3543c3d11ea178f130cb7ff1.webp',
    '4-axis machining, High-volume capability, Smart automation features, Premium build quality',
  ],
  [
    'Production Optimization Service',
    'Our experts analyze your production floor and workflow to identify bottlenecks and implement improvements. Proven results: clients have increased output from 7 to 12 pieces/minute.',
    'Production Optimization',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
    'Workflow analysis, Bottleneck elimination, Up to 70% output increase, ROI within months',
  ],
  [
    'Automation & Retrofitting Upgrades',
    'Upgrade your existing machinery with modern sensors, Siemens PLC systems, and safety features. Enable overnight unmanned operations and extend the life of your current equipment.',
    'Automation Upgrades',
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop',
    'Siemens PLC integration, Safety sensor installation, Unmanned operation capability, Existing machine compatible',
  ],
  [
    'Technical Service & Support',
    'Fast troubleshooting and expert support for your CNC machinery. On-site and remote assistance via smart glasses technology. We service Urban Machinery, HVL, Pertici, and more.',
    'Technical Service',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
    'Remote smart glasses support, On-site service NL/BE/DE, Multi-brand expertise, Fast response times',
  ],
];

const workbook = XLSX.utils.book_new();

const prospectsSheet = XLSX.utils.aoa_to_sheet(prospects);
XLSX.utils.book_append_sheet(workbook, prospectsSheet, 'Prospects');

const productsSheet = XLSX.utils.aoa_to_sheet(products);
XLSX.utils.book_append_sheet(workbook, productsSheet, 'Products');

prospectsSheet['!cols'] = [{ wch: 20 }, { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 60 }];
productsSheet['!cols'] = [{ wch: 45 }, { wch: 80 }, { wch: 25 }, { wch: 70 }, { wch: 70 }];

const outputPath = path.join(__dirname, '..', 'public', 'sample-data.xlsx');
XLSX.writeFile(workbook, outputPath);
console.log(`Sample Excel file created at: ${outputPath}`);
