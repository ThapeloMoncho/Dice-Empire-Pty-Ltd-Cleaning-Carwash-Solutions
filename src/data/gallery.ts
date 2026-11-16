export type GalleryArea = 'Carpets' | 'Kitchen' | 'Floors' | 'Rooms' | 'Windows';
export type GalleryStage = 'After' | 'Before & In Progress';

export interface ProjectGalleryPhoto {
  id: string;
  src: string;
  area: GalleryArea;
  stage: GalleryStage;
  title: string;
  caption: string;
}

export interface BeforeAfterPair {
  id: string;
  title: string;
  area: GalleryArea;
  beforeSrc: string;
  afterSrc: string;
  summary: string;
}

export const BEFORE_AFTER_HIGHLIGHTS: BeforeAfterPair[] = [
  {
    id: 'ba-carpets',
    title: 'Carpet Deep Wash & Extraction',
    area: 'Carpets',
    beforeSrc: '/assets/aistudio/before-carpets-63_48cd2597.jpg',
    afterSrc: '/assets/aistudio/after-carpets-21_58e859cf.jpg',
    summary: 'Heavy water-ring staining scrubbed with rotary foam extraction and rinsed clean.',
  },
  {
    id: 'ba-kitchen',
    title: 'Commercial Kitchen Deep Clean',
    area: 'Kitchen',
    beforeSrc: '/assets/aistudio/before-kitchen-24_1e5e2672.jpg',
    afterSrc: '/assets/aistudio/after-kitchen-02_62874856.jpg',
    summary: 'Floors, stainless prep tables, walls and food storage areas degreased and sanitised.',
  },
  {
    id: 'ba-floors',
    title: 'School & Facility Floor Restoration',
    area: 'Floors',
    beforeSrc: '/assets/aistudio/before-floors-12_9614300d.jpg',
    afterSrc: '/assets/aistudio/after-floors-08_50a0faf4.jpg',
    summary: 'Scuffed vinyl floors stripped, scrubbed by machine and finished to a clean sheen.',
  },
  {
    id: 'ba-rooms',
    title: 'Classroom & Washroom Refresh',
    area: 'Rooms',
    beforeSrc: '/assets/aistudio/before-rooms-31_21b1850a.jpg',
    afterSrc: '/assets/aistudio/after-rooms-14_87a6f510.jpg',
    summary: 'Cluttered, dusty rooms vacuumed, wiped down and restored for safe daily use.',
  },
];

function makePhotos(
  area: GalleryArea,
  stage: GalleryStage,
  files: string[],
  titlePrefix: string,
  caption: string,
): ProjectGalleryPhoto[] {
  return files.map((file, idx) => ({
    id: `${area.toLowerCase()}-${stage === 'After' ? 'after' : 'before'}-${idx + 1}`,
    src: `/assets/aistudio/${file}`,
    area,
    stage,
    title: `${titlePrefix} #${idx + 1}`,
    caption,
  }));
}

const AFTER_CARPETS = makePhotos(
  'Carpets',
  'After',
  [
    'after-carpets-17_a2648372.jpg',
    'after-carpets-18_608f5298.jpg',
    'after-carpets-19_8ca76a01.jpg',
    'after-carpets-20_151283dd.jpg',
    'after-carpets-21_58e859cf.jpg',
    'after-carpets-22_3cfe8135.jpg',
  ],
  'Carpet Cleaning Result',
  'Clean, freshly washed and air-dried carpets after rotary deep cleaning and rinsing.',
);

const AFTER_KITCHEN = makePhotos(
  'Kitchen',
  'After',
  [
    'after-kitchen-01_a7c91a7e.jpg',
    'after-kitchen-02_62874856.jpg',
    'after-kitchen-03_74a40fbe.jpg',
    'after-kitchen-04_898ced29.jpg',
    'after-kitchen-05_edbbc01c.jpg',
    'after-kitchen-06_4d57fc65.jpg',
  ],
  'Kitchen Cleaning Result',
  'Sanitised stainless steel counters, stoves, appliances and gleaming kitchen floors.',
);

const AFTER_FLOORS = makePhotos(
  'Floors',
  'After',
  [
    'after-floors-07_48b46088.jpg',
    'after-floors-08_50a0faf4.jpg',
    'after-floors-09_688ac736.jpg',
    'after-floors-10_d65e439d.jpg',
  ],
  'Floor Cleaning Result',
  'Machine-scrubbed and polished hallway, washroom and utility room floors.',
);

const AFTER_ROOMS = makePhotos(
  'Rooms',
  'After',
  [
    'after-rooms-11_e514bd52.jpg',
    'after-rooms-12_cd9a2c40.jpg',
    'after-rooms-13_f5f54a4c.jpg',
    'after-rooms-14_87a6f510.jpg',
    'after-rooms-15_6606aa51.jpg',
    'after-rooms-16_8c116e41.jpg',
  ],
  'Room & Washroom Result',
  'Spotless, hygienic rooms and washroom facilities ready for daily use.',
);

const BEFORE_CARPETS = makePhotos(
  'Carpets',
  'Before & In Progress',
  [
    'before-carpets-61_e815fd90.jpg',
    'before-carpets-62_8d356c00.jpg',
    'before-carpets-63_48cd2597.jpg',
    'before-carpets-64_1dcf9b31.jpg',
    'before-carpets-65_768fc045.jpg',
    'before-carpets-66_543202d9.jpg',
    'before-carpets-67_4e41db16.jpg',
    'before-carpets-68_dbe82e51.jpg',
    'before-carpets-69_f144b51f.jpg',
    'before-carpets-70_ff1c5ab7.jpg',
    'before-carpets-71_061b484c.jpg',
    'before-carpets-72_ab59544a.jpg',
  ],
  'Carpet Deep Wash In Progress',
  'Pre-treatment, rotary brush agitation and pressure rinsing on heavily soiled carpets.',
);

const BEFORE_FLOORS = makePhotos(
  'Floors',
  'Before & In Progress',
  [
    'before-floors-07_b7edd23c.jpg',
    'before-floors-08_33f166bf.jpg',
    'before-floors-09_e26d2853.jpg',
    'before-floors-10_1eeaa407.jpg',
    'before-floors-11_72bce627.jpg',
    'before-floors-12_9614300d.jpg',
    'before-floors-37_0df913db.jpg',
    'before-floors-38_16a8156c.jpg',
    'before-floors-39_0bdd7d48.jpg',
    'before-floors-40_2259ae8a.jpg',
    'before-floors-41_ca5f9d26.jpg',
    'before-floors-42_4c76ba00.jpg',
  ],
  'Floor Scrubbing & Prep',
  'Classroom, corridor and facility floors undergoing deep scrubbing and edge detailing.',
);

const BEFORE_KITCHEN = makePhotos(
  'Kitchen',
  'Before & In Progress',
  [
    'before-kitchen-19_8c0511e3.jpg',
    'before-kitchen-20_3e794f38.jpg',
    'before-kitchen-21_9fd94a36.jpg',
    'before-kitchen-22_859b69bc.jpg',
    'before-kitchen-23_4a2c8da1.jpg',
    'before-kitchen-24_1e5e2672.jpg',
    'before-kitchen-43_e52caf4f.jpg',
    'before-kitchen-44_0930fd8c.jpg',
    'before-kitchen-45_00f66858.jpg',
    'before-kitchen-46_15f45f6a.jpg',
    'before-kitchen-47_28df3569.jpg',
    'before-kitchen-48_5db5c9d2.jpg',
  ],
  'Kitchen Deep Clean In Progress',
  'Machine floor scrubbing, tile degreasing, skirting detailing and prep-table sanitising.',
);

const BEFORE_ROOMS = makePhotos(
  'Rooms',
  'Before & In Progress',
  [
    'before-rooms-13_99fea1af.jpg',
    'before-rooms-14_e89d94ed.jpg',
    'before-rooms-15_d3bd1a70.jpg',
    'before-rooms-16_110c0125.jpg',
    'before-rooms-17_0777edb9.jpg',
    'before-rooms-18_b483be9a.jpg',
    'before-rooms-31_21b1850a.jpg',
    'before-rooms-32_a84c1fc8.jpg',
    'before-rooms-33_d116aef2.jpg',
    'before-rooms-34_bd00d36c.jpg',
    'before-rooms-35_1fc7f4ea.jpg',
    'before-rooms-36_af1a065c.jpg',
    'before-rooms-55_698cbe4a.jpg',
    'before-rooms-56_77d56b97.jpg',
    'before-rooms-57_11345467.jpg',
    'before-rooms-58_ace81eb0.jpg',
    'before-rooms-59_6d637225.jpg',
    'before-rooms-60_87ceba37.jpg',
  ],
  'Room Deep Clean In Progress',
  'Before cleaning, sweeping, storeroom clearing and wet-extraction vacuuming.',
);

const BEFORE_WINDOWS = makePhotos(
  'Windows',
  'Before & In Progress',
  [
    'before-windows-01_cb7ef4f2.jpg',
    'before-windows-02_6d31c2a4.jpg',
    'before-windows-03_debd9406.jpg',
    'before-windows-04_e613c165.jpg',
    'before-windows-05_f3f80fa4.jpg',
    'before-windows-06_2308033a.jpg',
    'before-windows-25_a880de11.jpg',
    'before-windows-26_8ca69a67.jpg',
    'before-windows-27_ee3cdf6b.jpg',
    'before-windows-28_cd57a46e.jpg',
    'before-windows-29_1cf2cd80.jpg',
    'before-windows-30_0637a92e.jpg',
    'before-windows-49_e3e27afd.jpg',
    'before-windows-50_36daf66d.jpg',
    'before-windows-51_cce195e7.jpg',
    'before-windows-52_18236184.jpg',
    'before-windows-53_7e921cd2.jpg',
    'before-windows-54_16fac9ac.jpg',
  ],
  'Window, Sill & Grille Cleaning',
  'Detailed cleaning of window panes, burglar bars, ledges, high walls and classroom fittings.',
);

// Order finished After results first, followed by Before & In Progress work photos
export const PROJECT_GALLERY_PHOTOS: ProjectGalleryPhoto[] = [
  ...AFTER_CARPETS,
  ...AFTER_KITCHEN,
  ...AFTER_FLOORS,
  ...AFTER_ROOMS,
  ...BEFORE_CARPETS,
  ...BEFORE_KITCHEN,
  ...BEFORE_FLOORS,
  ...BEFORE_ROOMS,
  ...BEFORE_WINDOWS,
];
