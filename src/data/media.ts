import heroImg from '../assets/images/hero_cleaning_carwash_1794554149945.jpg';
import residentialCouchImg from '../assets/images/service_residential_couch_1794554150761.jpg';
import carpetMattressImg from '../assets/images/service_carpet_mattress_1794554151010.jpg';
import officeSchoolImg from '../assets/images/service_office_school_1794554151649.jpg';
import carwashBakkieTaxiImg from '../assets/images/carwash_bakkie_taxi_1794554151292.jpg';
import carwashInteriorImg from '../assets/images/carwash_interior_detail_1794554152452.jpg';

export function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export const MEDIA_ASSETS = {
  hero: heroImg,
  heroVideo: publicAsset('assets/dice-home-video.mp4'),
  heroPoster: publicAsset('assets/dice-home-poster.jpg'),
  residentialCouch: residentialCouchImg,
  carpetMattress: carpetMattressImg,
  officeSchool: officeSchoolImg,
  carwashBakkieTaxi: carwashBakkieTaxiImg,
  carwashInterior: carwashInteriorImg,
  logoBlue: publicAsset('assets/aistudio/4_030e035f.png'),
  logoWhite: publicAsset('assets/aistudio/Primary_Logo_1cf39809.png'),
} as const;
