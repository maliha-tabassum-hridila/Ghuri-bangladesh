import type { Destination } from "./destinations";

export interface AvailableDestinationPhoto {
  status: "available";
  src: string;
  sourceUrl: string;
  fileName: string;
  creator: string;
  license: string;
  licenseUrl: string;
  changes: string;
  attribution: string;
}

export interface UnavailableDestinationPhoto {
  status: "unavailable";
  src: "/destination-photo-unavailable.svg";
  sourceUrl: null;
  fileName: null;
  creator: null;
  license: null;
  licenseUrl: null;
  changes: null;
  attribution: null;
}

export type DestinationPhoto = AvailableDestinationPhoto | UnavailableDestinationPhoto;

const unavailable: UnavailableDestinationPhoto = {
  status: "unavailable",
  src: "/destination-photo-unavailable.svg",
  sourceUrl: null,
  fileName: null,
  creator: null,
  license: null,
  licenseUrl: null,
  changes: null,
  attribution: null,
};

const commons = (
  slug: string,
  file: string,
  creator: string,
  license: string,
  licenseUrl: string,
  changes = "Used the Wikimedia Commons 960px display thumbnail; no other edits.",
): DestinationPhoto => {
  return {
    status: "available",
    src: `/destination-photos/${slug}.jpg`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%20/g, "_")}`,
    fileName: file,
    creator,
    license,
    licenseUrl,
    changes,
    attribution: `${file} — ${creator} — ${license} — ${changes}`,
  };
};

export const DESTINATION_PHOTOS: Record<string, DestinationPhoto> = {
  "lalbagh-fort": commons(
    "lalbagh-fort",
    "Lalbagh Kella (Lalbagh Fort) (3).jpg",
    "Tasmin Tripty",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "ahsan-manzil": commons(
    "ahsan-manzil",
    "Ahsan Manzil Museum, Dhaka, Bangladesh.jpg",
    "Tanvir Rahat",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  sonargaon: commons(
    "sonargaon",
    "Craft fair and folk festival Bangladesh 2024 at Sonargaon museum 93.jpg",
    "Wasiul Bahar",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "panam-city": commons(
    "panam-city",
    "Old building at Panam Nagar, Narayanganj 38.jpg",
    "Wasiul Bahar",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "jatiya-sangsad-bhaban": commons(
    "jatiya-sangsad-bhaban",
    "Jatiya Sangsad Bhaban backside.jpg",
    "Wasiul Bahar",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "baliati-palace": commons(
    "baliati-palace",
    "Baliati Palace 2.jpg",
    "Nahid Sultan",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  "coxs-bazar-beach": commons(
    "coxs-bazar-beach",
    "Cox's Bazar sea beach 01.jpg",
    "Tanweer Morshed",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  "saint-martins-island": commons(
    "saint-martins-island",
    "Saint Martin (6).jpg",
    "ROCKY",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "inani-beach": commons(
    "inani-beach",
    "Inani Beach in the day (21 February 2014).jpg",
    "Arjit Chowdhury",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  himchari: commons(
    "himchari",
    "Himchari, Cox's Bazar (2Q7A1950).jpg",
    "Moheen Reeyad",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "sajek-valley": commons(
    "sajek-valley",
    "Sunrise at Sajek Valley.jpg",
    "Rocky Masum",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "kaptai-lake": commons(
    "kaptai-lake",
    "Hanging Bridge, Kaptai Lake.jpg",
    "Shakhawat Hossen Shafat",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  nilgiri: commons(
    "nilgiri",
    "Nilgiri, Bandarban, Bangladesh 3.jpg",
    "Tanvir Rahat",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  nilachal: commons(
    "nilachal",
    "Nilachal, Bandarban (2Q7A0635).jpg",
    "Moheen Reeyad",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "nafakhum-waterfall": commons(
    "nafakhum-waterfall",
    "Nafakhum Waterfalls.jpg",
    "লাজ মাহমুদ",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "boga-lake": commons(
    "boga-lake",
    "Boga Lake at Bandarban, Bangladesh.JPG",
    "Masum Ibn Musa",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "patenga-beach": commons(
    "patenga-beach",
    "Side view of Patenga sea beach (10).jpg",
    "Moheen Reeyad",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  jaflong: commons(
    "jaflong",
    "By the river bank.jpg",
    "Tamim Mahrush Naser",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "ratargul-swamp-forest": commons(
    "ratargul-swamp-forest",
    "Ratargul 0276.jpg",
    "Abdulmominbd",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  bisnakandi: commons(
    "bisnakandi",
    "Bisnakandi, Bangladesh - panoramio.jpg",
    "Sabbir Sohan",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  lalakhal: commons(
    "lalakhal",
    "Lalakhal, Sharighat, Sylhet, Bangladesh.jpg",
    "Fahadzyl",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "tanguar-haor": commons(
    "tanguar-haor",
    "Tanguar haor, Bangladesh 01.jpg",
    "Abdul Momin",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "madhabkunda-waterfall": commons(
    "madhabkunda-waterfall",
    "Madhabkunda waterfall in winter.jpg",
    "Shahriar Islam Alvi",
    "CC0 1.0 (public domain dedication; attribution not required)",
    "https://creativecommons.org/publicdomain/zero/1.0/",
  ),
  "lawachara-national-park": commons(
    "lawachara-national-park",
    "Lawachara National Park - 04.jpg",
    "Redmin",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "sreemangal-tea-gardens": commons(
    "sreemangal-tea-gardens",
    "Tea gardens in Sreemangal 03.jpg",
    "Kritzolina",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "baikka-beel": commons(
    "baikka-beel",
    "Baikka Beel (28406754880).jpg",
    "David Stanley from Nanaimo, Canada",
    "CC BY 2.0",
    "https://creativecommons.org/licenses/by/2.0/",
  ),
  "paharpur-buddhist-vihara": commons(
    "paharpur-buddhist-vihara",
    "Aerial view of Somapura Mahavihara.jpg",
    "Md. Ahsanul Haque Nayem",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  mahasthangarh: commons(
    "mahasthangarh",
    "Walls of Mahasthangarh.jpg",
    "Zaheed Sarwer Khan",
    "CC BY 4.0",
    "https://creativecommons.org/licenses/by/4.0/",
  ),
  "varendra-research-museum": commons(
    "varendra-research-museum",
    "Varendra Research Museum (26).jpg",
    "Masum-al-hasan",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "dublar-char": commons(
    "dublar-char",
    "Near Dublar Char, Sundarbans.jpg",
    "Fuadctg009",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  kuakata: commons(
    "kuakata",
    "Sunrise at Kuakata beach, Bangladesh.jpg",
    "Lonely Explorer",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "durga-sagar": commons(
    "durga-sagar",
    "Durga Sagar.jpg",
    "Ajad Islam",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "guthia-mosque": commons(
    "guthia-mosque",
    "Cloudy Sky with Sunshine at Guthia Mosque, Barishal.jpg",
    "MD Shaha Riaz",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "tajhat-palace": commons(
    "tajhat-palace",
    "Tajhat Palace front.jpg",
    "Nasar-A-Tawhid Siddiquey (Naogaon)",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  "kantajew-temple": commons(
    "kantajew-temple",
    "Kantajew Temple-Terracotta 2.jpg",
    "Shuvajit BD",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "teesta-barrage": commons(
    "teesta-barrage",
    "Tista Barrage Bangladesh (5).jpg",
    "Salim_Khandoker",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "puthia-temple-complex": commons(
    "puthia-temple-complex",
    "Shiva temple at Puthia, Rajshahi.JPG",
    "Tanweer Morshed",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  karamjal: commons(
    "karamjal",
    "Spotted Deer at Sundarbans 14.jpg",
    "Fabian Roudra Baroi",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "floating-guava-market": commons(
    "floating-guava-market",
    "Bhimruli Floating Guava Market, Jhalokathi, Barisal.jpg",
    "Lonely Explorer",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "ramsagar-national-park": commons(
    "ramsagar-national-park",
    "Ramsagar National Park, Dinajpur.jpg",
    "Masum-al-hasan",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  "shashi-lodge": commons(
    "shashi-lodge",
    "Shashi Lodge (Present Teachers' Training College), Mymensingh, Bangladesh 16.JPG",
    "Ibrahim Husain Meraj",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  birishiri: commons(
    "birishiri",
    "Birishiri Durgapur Netrakona Bangladesh (159746505).jpeg",
    "Topu Saha",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
  ),
  "sixty-dome-mosque": commons(
    "sixty-dome-mosque",
    "Sixty Dome Mosque at Bagerhat (2).jpg",
    "Anup Sadi",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "china-matir-pahar-bijoypur": commons(
    "china-matir-pahar-bijoypur",
    "Hill of China clay, Bijoypur, Netrokona.jpg",
    "কুপি বাতি",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
  ),
  "mawa-ghat-and-padma": commons(
    "mawa-ghat-and-padma",
    "Boat terminal, Mawa Ghat, Bangladesh.jpg",
    "FahimHP",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
    "Original image downloaded and stored unchanged.",
  ),
  "rangamati-town": commons(
    "rangamati-town",
    "Hanging Bridge, Kaptai Lake.jpg",
    "Shakhawat Hossen Shafat",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
    "Original image downloaded and stored unchanged.",
  ),
  sundarbans: commons(
    "sundarbans",
    "A View of the Largest Mangrove Forest in the World.JPG",
    "Zeesan R Chowdhury",
    "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/",
    "Original image downloaded and stored unchanged.",
  ),
  "gazni-garo-hills": commons(
    "gazni-garo-hills",
    "Gajni, Icho Park, Sherpur - panoramio.jpg",
    "MD. Shoriful Islam T…",
    "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/",
    "Original image downloaded and stored unchanged.",
  ),
};

export const getDestinationPhoto = (destination: Pick<Destination, "slug">) =>
  DESTINATION_PHOTOS[destination.slug] ?? unavailable;
