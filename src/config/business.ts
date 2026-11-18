import { MEDIA_ASSETS, publicAsset } from '../data/media';

export interface WhatsAppNumber {
  id: 'primary' | 'secondary';
  display: string;
  e164: string;
  url: string;
}

export interface OfficeLocation {
  id: 'pampierstad' | 'kimberley';
  name: string;
  badge: string;
  street: string;
  suburb: string;
  postalCode: string;
  fullAddress: string;
  mapsQuery: string;
  mapsEmbedUrl: string;
  mapsDirectUrl: string;
}

export interface CleaningServiceCategory {
  id: string;
  code: string;
  title: string;
  bookingOption: string;
  description: string;
  items: string[];
  image: string;
  imageAlt: string;
  whatsappMessage: string;
}

export interface CarwashServiceItem {
  id: string;
  title: string;
  bookingOption: string;
  summary: string;
}

export const BUSINESS_CONFIG = {
  name: 'Dice Empire (Pty) Ltd',
  shortName: 'Dice Empire',
  category: 'Cleaning and Carwash Solutions',
  ownership: 'Youth-owned business',
  representatives: 'CharLotte & Kitso',
  slogan: 'We Bring the Shine Back to Your Space!',
  tagline: 'Reliable. Professional. Spotless.',
  jobsCreated: '3 JOBS CREATED',
  jobsMessage:
    'We believe in creating opportunities, serving our community and delivering quality cleaning services that make a difference.',
  officePhone: {
    display: '053 831 2561',
    telHref: 'tel:+27538312561',
  },
  businessEmail: 'tshiamotee720@gmail.com',
  whatsappNumbers: [
    {
      id: 'primary',
      display: '083 739 9542',
      e164: '27837399542',
      url: 'https://wa.me/27837399542',
    },
    {
      id: 'secondary',
      display: '068 020 9959',
      e164: '27680209959',
      url: 'https://wa.me/27680209959',
    },
  ] as WhatsAppNumber[],
  social: {
    facebookUrl: 'https://www.facebook.com/profile.php?id=61596554968171',
    tiktokUrl: 'https://www.tiktok.com/@dice_empire22',
    message:
      'Stay connected with Dice Empire! Follow us on Facebook and TikTok to see our latest work, special offers, cleaning transformations and business updates.',
  },
  locations: [
    {
      id: 'pampierstad',
      name: 'Pampierstad Branch',
      badge: 'Phokwane Municipality',
      street: '32B Pampierstad, Ward 3, Mangope Avenue',
      suburb: 'Pampierstad',
      postalCode: '8566',
      fullAddress: '32B Pampierstad, Ward 3, Mangope Avenue, 8566',
      mapsQuery: '32B Pampierstad Ward 3 Mangope Avenue 8566 South Africa',
      mapsEmbedUrl:
        'https://maps.google.com/maps?q=Mangope+Avenue+Pampierstad+8566+South+Africa&t=&z=14&ie=UTF8&iwloc=&output=embed',
      mapsDirectUrl:
        'https://www.google.com/maps/search/?api=1&query=32B+Pampierstad+Ward+3+Mangope+Avenue+8566+South+Africa',
    },
    {
      id: 'kimberley',
      name: 'Kimberley Office',
      badge: 'Northern Cape',
      street: 'Twin Palm Complex, No. 1 Harley Street',
      suburb: 'Belgravia, Kimberley',
      postalCode: '8301',
      fullAddress: 'Twin Palm Complex, No. 1 Harley Street, Belgravia, Kimberley, 8301',
      mapsQuery: 'Twin Palm Complex 1 Harley Street Belgravia Kimberley 8301 South Africa',
      mapsEmbedUrl:
        'https://maps.google.com/maps?q=1+Harley+Street+Belgravia+Kimberley+8301+South+Africa&t=&z=15&ie=UTF8&iwloc=&output=embed',
      mapsDirectUrl:
        'https://www.google.com/maps/search/?api=1&query=Twin+Palm+Complex+No+1+Harley+Street+Belgravia+Kimberley+8301',
    },
  ] as OfficeLocation[],
};

export const CLEANING_SERVICES: CleaningServiceCategory[] = [
  {
    id: 'residential',
    code: '01',
    title: 'Residential Deep Cleaning',
    bookingOption: 'House Deep Cleaning',
    description:
      'Enjoy a fresh, clean and welcoming home with our reliable residential cleaning solutions.',
    items: [
      'Full house deep cleaning',
      'Kitchen cleaning',
      'Bathroom cleaning',
      'General household cleaning',
      'Move-in and move-out cleaning',
      'Residential property cleaning',
    ],
    image: MEDIA_ASSETS.hero,
    imageAlt: 'Spotless sunlit South African home interior and clean living area',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about Residential Deep Cleaning services. Please provide more information and a quotation.',
  },
  {
    id: 'couch',
    code: '02',
    title: 'Couch and Upholstery Cleaning',
    bookingOption: 'Couch Cleaning',
    description:
      'Give your couches and upholstered furniture a fresh new look with professional deep cleaning.',
    items: [
      'Couch deep cleaning',
      'Upholstery washing',
      'Stain removal',
      'Fabric refreshing',
      'Dirt and unpleasant odour removal',
    ],
    image: MEDIA_ASSETS.residentialCouch,
    imageAlt: 'Specialist deep-cleaning a modern fabric sofa using professional upholstery extraction equipment',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about Couch and Upholstery Cleaning. Please provide more information and a quotation.',
  },
  {
    id: 'carpet',
    code: '03',
    title: 'Carpet Cleaning',
    bookingOption: 'Carpet Cleaning',
    description:
      'Deep fibre extraction for homes and workplaces to lift embedded dust, spills and stains.',
    items: [
      'Home carpet cleaning',
      'Office carpet cleaning',
      'Carpet deep washing',
      'Stain treatment',
      'General carpet refreshing',
    ],
    image: MEDIA_ASSETS.carpetMattress,
    imageAlt: 'Deep carpet extraction cleaning in a bright sunlit residential room',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about Carpet Cleaning services. Please provide more information and a quotation.',
  },
  {
    id: 'mattress',
    code: '04',
    title: 'Mattress Cleaning',
    bookingOption: 'Mattress Cleaning',
    description:
      'Hygienic deep cleaning and treatment to remove trapped dust, dirt and stubborn marks.',
    items: [
      'Mattress deep cleaning',
      'Mattress stain treatment',
      'Dust and dirt removal',
      'Mattress refreshing',
    ],
    image: publicAsset('assets/aistudio/How-to-Clean-a-Mattress-image_7ff353db.jpg'),
    imageAlt: 'Cleaning specialist vacuuming and treating a mattress in a bright bedroom',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about Mattress Cleaning services. Please provide more information and a quotation.',
  },
  {
    id: 'office',
    code: '05',
    title: 'Office and Commercial Cleaning',
    bookingOption: 'Office Cleaning',
    description:
      'Dependable workplace and hospitality cleaning for offices, guesthouses and local businesses.',
    items: [
      'Office deep cleaning',
      'Workplace cleaning',
      'Commercial premises cleaning',
      'Guesthouse cleaning',
      'General business cleaning',
    ],
    image: MEDIA_ASSETS.officeSchool,
    imageAlt: 'Gleaming modern office and commercial corridor with polished floors',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about Office, Guesthouse and Commercial Cleaning. Please provide more information and a quotation.',
  },
  {
    id: 'school',
    code: '06',
    title: 'School Cleaning',
    bookingOption: 'School Cleaning',
    description:
      'Thorough classroom, administration and facility cleaning that keeps learning spaces hygienic.',
    items: [
      'Classroom cleaning',
      'School office cleaning',
      'School facility cleaning',
      'General school premises cleaning',
    ],
    image: publicAsset('assets/aistudio/pexels-rdne-8500417_f9d2f989.jpg'),
    imageAlt: 'Clean sunlit classroom with student desks, chalkboard and polished floor',
    whatsappMessage:
      'Hello Dice Empire, I would like to enquire about School Cleaning services. Please provide more information and a quotation.',
  },
];

export const CARWASH_SERVICES: CarwashServiceItem[] = [
  {
    id: 'taxi-wash',
    title: 'Taxi Washing',
    bookingOption: 'Taxi Washing',
    summary: 'Complete exterior wash and interior cabin cleaning built for hardworking commuter taxis.',
  },
  {
    id: 'private-car',
    title: 'Private Car Washing',
    bookingOption: 'Private Car Washing',
    summary:
      'Careful foam wash, hand dry and interior refresh for hatchbacks, sedans and SUVs — available on-site or via house call.',
  },
  {
    id: 'bakkie-wash',
    title: 'Bakkie Washing',
    bookingOption: 'Bakkie Washing',
    summary:
      'Thorough exterior, load-bin, wheel-arch and cab cleaning for single and double-cab bakkies, including house call washes.',
  },
  {
    id: 'exterior-wash',
    title: 'Exterior Vehicle Washing',
    bookingOption: 'Private Car Washing',
    summary: 'High-pressure rinse, snow-foam wash, wheel clean and streak-free window finish.',
  },
  {
    id: 'interior-clean',
    title: 'Interior Vehicle Cleaning',
    bookingOption: 'Private Car Washing',
    summary: 'Dashboard, console, door panel and seat wipe-down for a fresh, dust-free cabin.',
  },
  {
    id: 'interior-vacuum',
    title: 'Interior Vacuuming',
    bookingOption: 'Private Car Washing',
    summary: 'Detailed floor mat, carpet, seat crevice and boot vacuuming.',
  },
];

export const BOOKING_SERVICE_OPTIONS = [
  'House Deep Cleaning',
  'Couch Cleaning',
  'Carpet Cleaning',
  'Mattress Cleaning',
  'Office Cleaning',
  'School Cleaning',
  'Guesthouse Cleaning',
  'Taxi Washing',
  'Private Car Washing',
  'Bakkie Washing',
  'House Call Carwash',
  'Other',
] as const;

export const WHY_CHOOSE_STRENGTHS = [
  {
    title: 'Youth-owned local business',
    detail: 'Founded and driven by young entrepreneurs committed to excellence in Phokwane and Kimberley.',
  },
  {
    title: 'Reliable and professional service',
    detail: 'Consistent standards, punctual arrival and careful handling of every home, workplace and vehicle.',
  },
  {
    title: 'Community-focused operations',
    detail: 'Rooted in Pampierstad and serving surrounding towns with pride and accountability.',
  },
  {
    title: 'Residential and commercial cleaning',
    detail: 'Flexible solutions tailored for family homes, guesthouses, schools, offices and fleets.',
  },
  {
    title: 'Dedicated customer service',
    detail: 'Direct communication with CharLotte and Kitso from initial quotation through completion.',
  },
  {
    title: 'Convenient business contact options',
    detail: 'Reach our team quickly by office phone, WhatsApp or our online quotation form.',
  },
  {
    title: 'Commitment to quality',
    detail: 'Thorough deep-cleaning attention to stains, odours, high-touch surfaces and vehicle finishes.',
  },
  {
    title: 'Supporting local employment',
    detail: 'Every booking helps sustain local livelihoods and youth skills development.',
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Residential' | 'Upholstery & Carpets' | 'Commercial & Schools' | 'Carwash';
  caption: string;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Residential & Vehicle Care',
    category: 'Residential',
    caption: 'Complete residential property upkeep and driveway vehicle care.',
    image: MEDIA_ASSETS.hero,
  },
  {
    id: 'g2',
    title: 'Couch & Upholstery Extraction',
    category: 'Upholstery & Carpets',
    caption: 'Deep fabric extraction lifting embedded dirt and refreshing lounge suites.',
    image: MEDIA_ASSETS.residentialCouch,
  },
  {
    id: 'g3',
    title: 'Carpet & Bedroom Deep Cleaning',
    category: 'Upholstery & Carpets',
    caption: 'Thorough carpet washing and mattress refreshing for healthier indoor spaces.',
    image: MEDIA_ASSETS.carpetMattress,
  },
  {
    id: 'g4',
    title: 'School & Office Premises',
    category: 'Commercial & Schools',
    caption: 'Polished hallways, clean classrooms and spotless commercial workspaces.',
    image: MEDIA_ASSETS.officeSchool,
  },
  {
    id: 'g5',
    title: 'Bakkie & Taxi Snow-Foam Wash',
    category: 'Carwash',
    caption: 'High-pressure rinsing and foam washing for bakkies, commuter taxis and private vehicles.',
    image: MEDIA_ASSETS.carwashBakkieTaxi,
  },
  {
    id: 'g6',
    title: 'Interior Vacuuming & Detailing',
    category: 'Carwash',
    caption: 'Careful interior vacuuming, seat care and dashboard detailing.',
    image: MEDIA_ASSETS.carwashInterior,
  },
];
