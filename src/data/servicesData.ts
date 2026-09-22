import { DentalService } from '../types';

export const DENTAL_SERVICES: DentalService[] = [
  {
    id: 'srv-1',
    name: 'All-on-4® Full Arch Dental Implants',
    category: 'Implantology',
    tagline: 'Permanent, fixed full-mouth teeth in a single surgical day',
    description: 'Replace an entire arch of failing or missing teeth with four to six strategically placed titanium implants supporting a permanent, natural-looking Zirconia bridge.',
    duration: '2 - 3 Hours',
    priceEstimate: 'Free 3D Scan + Custom Plan',
    isPopular: true,
    iconName: 'Crown',
    features: [
      'Immediate load: teeth on the same day',
      'No bone grafting required for most patients',
      'Rock-solid titanium and monolithic zirconia',
      'Eat steak, apples, and smile with zero slippage',
      'Lifetime warranty on surgical implant fixtures'
    ]
  },
  {
    id: 'srv-2',
    name: 'Single & Multiple Dental Implants',
    category: 'Implantology',
    tagline: 'The gold standard for single tooth replacement',
    description: 'Precision-guided surgical placement of medical-grade titanium or ceramic posts that integrate permanently into your jawbone, topped with custom shade-matched crowns.',
    duration: '45 - 60 Mins',
    priceEstimate: 'From $1,450 / implant',
    isPopular: true,
    iconName: 'Sparkles',
    features: [
      'Preserves adjacent healthy teeth (unlike bridges)',
      'Prevents facial bone loss and hollow cheeks',
      'Custom CAD/CAM zirconia crown fabrication',
      'Computer-guided flapless 3D template surgery'
    ]
  },
  {
    id: 'srv-3',
    name: 'Digital Smile Makeover & Veneers',
    category: 'Cosmetic',
    tagline: 'Ultra-thin handcrafted porcelain for red-carpet smiles',
    description: 'Custom-designed ultra-thin porcelain veneers that correct tooth spacing, discoloration, chips, and asymmetry while maintaining natural optical translucency.',
    duration: '2 Visits',
    priceEstimate: 'From $950 / tooth',
    isPopular: true,
    iconName: 'Smile',
    features: [
      'Digital Smile Design (DSD) 3D trial before preparation',
      'Minimal-prep tooth preservation technique',
      'Stain-resistant high-translucency feldspathic ceramic',
      'Customized shade matching under natural daylight spectrum'
    ]
  },
  {
    id: 'srv-4',
    name: 'Same-Day Emergency Pain Relief',
    category: 'Emergency',
    tagline: 'Immediate relief for severe toothaches, infections & trauma',
    description: 'Rapid-response surgical and endodontic care for acute pulpitis, broken crowns, dental abscesses, and sports trauma. Walk-ins and urgent appointments prioritized.',
    duration: '30 - 60 Mins',
    priceEstimate: 'Insurance & Emergency Coverage',
    isPopular: false,
    iconName: 'AlertCircle',
    features: [
      'Priority emergency chair reservations',
      'Digital 3D CT diagnostic imaging within 5 minutes',
      'Microscope-assisted gentle root canal therapy',
      'Immediate local anesthesia & oral sedation relief'
    ]
  },
  {
    id: 'srv-5',
    name: '3D Bone Grafting & Sinus Lift',
    category: 'Surgical',
    tagline: 'Regenerating structural bone for permanent implants',
    description: 'Advanced regenerative tissue techniques including PRF (Platelet-Rich Fibrin) and osteoconductive bio-minerals to rebuild lost jawbone height and width.',
    duration: '60 - 90 Mins',
    priceEstimate: 'Based on 3D CBCT volume',
    iconName: 'Layers',
    features: [
      'Autologous growth factor stimulation (PRF)',
      'Minimally invasive lateral and crestal sinus lifts',
      'Prepares even severe atrophy cases for implants',
      'Fast healing with biological membrane shields'
    ]
  },
  {
    id: 'srv-6',
    name: 'IV Twilight Sedation Dentistry',
    category: 'Comfort',
    tagline: 'Completely relaxed, anxiety-free dental procedures',
    description: 'Administered and monitored by licensed sedation specialists. Sleep comfortably through complex surgical procedures or multiple treatments with zero memory of discomfort.',
    duration: 'Procedure Duration',
    priceEstimate: 'Covered with select surgical packages',
    iconName: 'HeartHandshake',
    features: [
      'Ideal for severe dental phobia or sensitive gag reflex',
      'Continuous vital sign and pulse oximetry monitoring',
      'Wake up feeling rested with your treatment complete',
      'Multiple options: Nitrous Oxide, Oral, and Deep IV Sedation'
    ]
  }
];

export const BEFORE_AFTER_CASES = [
  {
    id: 'case-1',
    title: 'Full Arch All-on-4® Transformation',
    patient: 'Robert, Age 58',
    issue: 'Severe periodontal disease, generalized bone loss, failing bridge',
    solution: 'Computer-guided extraction, 5 Straumann Roxolid implants with immediate fixed Prettau Zirconia bridge',
    timeframe: 'Same-Day Provisional, 12 Weeks Final',
    beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
    quote: '"I can eat crisp apples and steaks again without fear. My confidence was restored in a single morning."'
  },
  {
    id: 'case-2',
    title: 'Custom Porcelain Veneers Makeover',
    patient: 'Elena, Age 34',
    issue: 'Incisal wear, deep tetracycline staining, midline diastema',
    solution: '8 Master-Ceramist Feldspathic Veneers with micro-enamel recontouring',
    timeframe: '2 Appointments across 10 Days',
    beforeImg: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    quote: '"Dr. Vance gave me the natural, glowing smile I always dreamed of. No one can tell they are veneers!"'
  },
  {
    id: 'case-3',
    title: 'Single Central Incisor Replacement',
    patient: 'Michael, Age 29',
    issue: 'Fractured tooth #9 from sports collision, unrepairable root fracture',
    solution: 'Immediate flapless implant placement with PRF bone preservation and screw-retained ceramic crown',
    timeframe: 'Same-day temporary crown, 10 weeks final integration',
    beforeImg: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
    quote: '"The color and gum line blend 100% seamlessly with my natural teeth. Truly impressive artistry."'
  }
];

export const CLINIC_TECHNOLOGY = [
  {
    id: 'tech-1',
    name: 'Ultra-HD Cone Beam 3D CT (CBCT)',
    tag: 'Diagnostic Imaging',
    description: 'Emits up to 80% less radiation than standard medical CTs while rendering sub-millimeter 3D cross-sections of bone ridge height, density, and nerve channels.',
    benefit: 'Pinpoint precision and elimination of surgical guesswork'
  },
  {
    id: 'tech-2',
    name: 'iTero® 5D Intraoral 3D Digital Scanner',
    tag: 'Goop-Free Impressions',
    description: 'Scans 6,000 frames per second to render an ultra-accurate 3D color model of your teeth and bite in under 3 minutes—no messy putty or gagging.',
    benefit: '100% accurate restorations with perfect margin fits'
  },
  {
    id: 'tech-3',
    name: '3D Computer-Guided Surgical Templates',
    tag: 'Robotic Precision',
    description: 'We digitally design your implant surgery in 3D CAD software prior to your appointment, printing custom surgical guides for millimeter-accurate angle and depth.',
    benefit: 'Minimally invasive, faster surgery, and minimal post-op swelling'
  },
  {
    id: 'tech-4',
    name: 'WaterLase® iPlus Er,Cr:YSGG Laser',
    tag: 'Gentle Laser Care',
    description: 'Uses energized water droplets and laser energy to contour gums, treat peri-implantitis, and disinfect deep tissue without scalpel cuts or sutures.',
    benefit: 'Virtually pain-free treatment with rapid tissue healing'
  }
];
