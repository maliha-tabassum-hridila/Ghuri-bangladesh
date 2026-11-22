import type { DivisionId } from "./divisions";

/**
 * Destination dataset.
 * Coordinates are approximate site centres taken from the linked Wikipedia /
 * OpenStreetMap records. Fees and hours are only filled when published by an
 * official source; otherwise they are null and the UI shows "Not verified".
 * To add a destination, append a record — every page reads from this list.
 */
export type Category = "nature" | "beach" | "hill" | "historical" | "religious" | "wildlife" | "water" | "urban";
export type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";
export type Tag = "family" | "adventure" | "couple" | "budget" | "weekend" | "hidden";

export interface Destination {
  id: string;
  slug: string;
  name: string;
  bangla_name: string;
  division: DivisionId;
  district: string;
  coordinates: [number, number]; // [lng, lat]
  category: Category;
  tags: Tag[];
  description: string;
  history?: string;
  famous_for: string;
  attractions: string[];
  activities: string[];
  best_season: Season[];
  seasonal_warning?: string;
  seasonal_warning_bn?: string;
  recommended_duration: string; // e.g. "Half day", "2 days"
  recommended_nights: number;
  entry_fee: string | null;
  opening_hours: string | null;
  transport_information: string;
  travel_tips: string[];
  safety_information: string;
  cost_level: 1 | 2 | 3; // relative accommodation/food cost of the area
  source_urls: string[];
  last_verified: string;
}

const W = (t: string) => `https://en.wikipedia.org/wiki/${t}`;
const LV = "2026-10-30";

type Seed = Omit<Destination, "id" | "slug" | "source_urls" | "last_verified"> & { wiki: string; extra?: string[] };

const seeds: Seed[] = [
  // ---------------- DHAKA ----------------
  { name: "Lalbagh Fort", bangla_name: "লালবাগ কেল্লা", division: "dhaka", district: "Dhaka", coordinates: [90.3881, 23.7189], category: "historical", tags: ["family", "budget", "weekend"],
    description: "An unfinished 17th-century Mughal fort complex in Old Dhaka with a mosque, audience hall and the tomb of Pari Bibi.",
    history: "Construction began in 1678 under Prince Muhammad Azam and was abandoned after the death of Pari Bibi, daughter of Shaista Khan.",
    famous_for: "Mughal architecture and the Tomb of Pari Bibi", attractions: ["Tomb of Pari Bibi", "Diwan-i-Aam", "Fort mosque", "Museum"], activities: ["Heritage walk", "Photography", "Old Dhaka food trail"],
    best_season: ["winter", "spring", "autumn"], recommended_duration: "2–3 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Located in Old Dhaka; reachable by rickshaw, CNG auto-rickshaw or ride-hailing from anywhere in the city.",
    travel_tips: ["Closed days vary — check with the Department of Archaeology before visiting.", "Combine with Ahsan Manzil and a Puran Dhaka food walk."],
    safety_information: "Old Dhaka streets are very congested; keep valuables secure.", cost_level: 2, wiki: "Lalbagh_Fort" },
  { name: "Ahsan Manzil", bangla_name: "আহসান মঞ্জিল", division: "dhaka", district: "Dhaka", coordinates: [90.4063, 23.7086], category: "historical", tags: ["family", "budget", "weekend"],
    description: "The pink palace of the Nawabs of Dhaka on the Buriganga riverbank, now a museum.",
    history: "Completed in 1872 for Nawab Abdul Ghani and named after his son Khwaja Ahsanullah.",
    famous_for: "Nawab palace and riverside view of Sadarghat", attractions: ["Rangmahal", "Museum galleries", "Buriganga riverfront"], activities: ["Museum visit", "Boat ride at Sadarghat"],
    best_season: ["winter", "spring", "autumn"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Near Sadarghat in Old Dhaka; rickshaw or ride-hailing.",
    travel_tips: ["Photography inside galleries may be restricted."], safety_information: "Crowded riverfront; watch for pickpockets.", cost_level: 2, wiki: "Ahsan_Manzil" },
  { name: "Sonargaon", bangla_name: "সোনারগাঁও", division: "dhaka", district: "Narayanganj", coordinates: [90.6086, 23.6475], category: "historical", tags: ["family", "weekend", "budget"],
    description: "Medieval capital of Bengal, home to the Folk Arts and Crafts Museum and old trading-town buildings.",
    history: "Seat of Isa Khan and of the independent Sultanate of Bengal in the 14th century.",
    famous_for: "Folk Art Museum and medieval heritage", attractions: ["Folk Arts & Crafts Museum", "Panam City", "Goaldi Mosque"], activities: ["Museum visit", "Heritage walk", "Handicraft shopping"],
    best_season: ["winter", "spring"], recommended_duration: "Full day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 27 km from Dhaka via the Dhaka–Chattogram highway; buses run to Mograpara, then rickshaw.",
    travel_tips: ["Start early to avoid highway traffic."], safety_information: "Ruined buildings at Panam are fragile; do not climb.", cost_level: 1, wiki: "Sonargaon" },
  { name: "Panam City", bangla_name: "পানাম নগর", division: "dhaka", district: "Narayanganj", coordinates: [90.6094, 23.6589], category: "historical", tags: ["couple", "weekend", "hidden"],
    description: "A single street of 19th-century merchant houses in Sonargaon, one of the most photographed ruins in Bangladesh.",
    famous_for: "Colonial-era merchant houses", attractions: ["Panam street", "Old canals"], activities: ["Photography", "Heritage walk"],
    best_season: ["winter", "spring"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Short rickshaw ride from the Sonargaon Folk Art Museum.", travel_tips: ["Visit with Sonargaon in one day."], safety_information: "Do not enter unstable buildings.", cost_level: 1, wiki: "Panam_City" },
  { name: "Jatiya Sangsad Bhaban", bangla_name: "জাতীয় সংসদ ভবন", division: "dhaka", district: "Dhaka", coordinates: [90.3785, 23.7625], category: "urban", tags: ["budget", "couple"],
    description: "Louis Kahn's monumental National Parliament House, an icon of modern architecture surrounded by lakes.",
    famous_for: "Louis I. Kahn architecture", attractions: ["Parliament complex exterior", "Crescent Lake", "Chandrima Udyan"], activities: ["Architecture photography", "Evening walk"],
    best_season: ["winter", "spring", "autumn"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Sher-e-Bangla Nagar, central Dhaka; any city transport.", travel_tips: ["Interior visits require prior permission."], safety_information: "Security zone — follow guard instructions.", cost_level: 2, wiki: "Jatiya_Sangsad_Bhaban" },
  { name: "Baliati Palace", bangla_name: "বালিয়াটি জমিদার বাড়ি", division: "dhaka", district: "Manikganj", coordinates: [90.0564, 23.9333], category: "historical", tags: ["hidden", "weekend", "family"],
    description: "A complex of seven 19th-century zamindar buildings with Corinthian columns in Saturia, Manikganj.",
    famous_for: "Zamindar palace architecture", attractions: ["Main palace blocks", "Pond"], activities: ["Day trip", "Photography"],
    best_season: ["winter", "spring"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 35 km north-west of Dhaka; bus to Saturia then local transport.", travel_tips: ["Usually closed one day a week — confirm locally."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Baliati_Palace" },
  { name: "Mawa Ghat & Padma", bangla_name: "মাওয়া", division: "dhaka", district: "Munshiganj", coordinates: [90.2575, 23.4425], category: "water", tags: ["budget", "weekend", "family"],
    description: "Riverbank on the mighty Padma near the Padma Bridge, famous for fresh fried hilsa.",
    famous_for: "Padma river views and ilish bhaja", attractions: ["Padma Bridge view", "Riverside restaurants"], activities: ["Hilsa lunch", "River viewing"],
    best_season: ["monsoon", "autumn", "winter"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 40 km from Dhaka via the Dhaka–Mawa expressway.", travel_tips: ["Hilsa is best in monsoon season."], safety_information: "River currents are strong; avoid swimming.", cost_level: 1, wiki: "Padma_Bridge" },

  // ---------------- CHATTOGRAM ----------------
  { name: "Cox's Bazar Beach", bangla_name: "কক্সবাজার সমুদ্র সৈকত", division: "chattogram", district: "Cox's Bazar", coordinates: [91.9741, 21.4272], category: "beach", tags: ["family", "couple"],
    description: "One of the world's longest natural sandy sea beaches, stretching about 120 km along the Bay of Bengal.",
    famous_for: "Uninterrupted sandy beach", attractions: ["Laboni Point", "Sugandha Point", "Kolatoli"], activities: ["Beach walk", "Sunset", "Seafood"],
    best_season: ["winter", "spring"], seasonal_warning: "Rough sea and cyclone risk in monsoon (Jun–Sep). Follow lifeguard flags.", seasonal_warning_bn: "বর্ষায় (জুন–সেপ্টেম্বর) সমুদ্র উত্তাল ও ঘূর্ণিঝড়ের ঝুঁকি থাকে। লাইফগার্ডের পতাকার নির্দেশনা মেনে চলুন।",
    recommended_duration: "2–3 days", recommended_nights: 2, entry_fee: null, opening_hours: null,
    transport_information: "Direct trains from Dhaka (Bangladesh Railway), long-distance buses, and domestic flights to Cox's Bazar Airport.",
    travel_tips: ["Book trains early on weekends and holidays.", "Hotels along Kolatoli Road are the most convenient."], safety_information: "Swim only in marked lifeguard zones; rip currents are common.", cost_level: 2, wiki: "Cox%27s_Bazar_Beach" },
  { name: "Saint Martin's Island", bangla_name: "সেন্টমার্টিন দ্বীপ", division: "chattogram", district: "Cox's Bazar", coordinates: [92.3236, 20.6237], category: "beach", tags: ["couple", "adventure"],
    description: "Bangladesh's only coral island, with turquoise water, coconut palms and rocky shores.",
    famous_for: "Coral island and clear water", attractions: ["Chera Dwip", "West beach", "Coral shoreline"], activities: ["Island walk", "Snorkelling (limited)", "Night sky"],
    best_season: ["winter"], seasonal_warning: "Access is restricted by government environmental rules; ships run only in permitted months (roughly Nov–Jan in recent years) with visitor caps. Verify before planning.", seasonal_warning_bn: "সরকারি পরিবেশগত বিধিনিষেধে যাতায়াত সীমিত। সাম্প্রতিক বছরগুলোতে অনুমোদিত মাসে (সাধারণত নভেম্বর–জানুয়ারি) সীমিতসংখ্যক যাত্রী নিয়ে জাহাজ চলেছে। পরিকল্পনার আগে সর্বশেষ নিয়ম যাচাই করুন।",
    recommended_duration: "1–2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Ships from Cox's Bazar or Teknaf during the permitted tourist season only.",
    travel_tips: ["Check the latest Department of Environment notice.", "Carry cash; ATMs are scarce."], safety_information: "Do not walk on or collect coral. Sea crossings are cancelled in rough weather.", cost_level: 2, wiki: "St._Martin%27s_Island" },
  { name: "Inani Beach", bangla_name: "ইনানী সৈকত", division: "chattogram", district: "Cox's Bazar", coordinates: [92.0466, 21.2286], category: "beach", tags: ["couple", "family"],
    description: "A quieter stretch of Cox's Bazar coast with coral-like rocks exposed at low tide.",
    famous_for: "Rocky shoreline and Marine Drive", attractions: ["Rock beds", "Marine Drive"], activities: ["Marine Drive ride", "Tide-pool walk"],
    best_season: ["winter", "spring"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 27 km south of Cox's Bazar along the Marine Drive by CNG, jeep or car.", travel_tips: ["Visit at low tide to see the rocks."], safety_information: "Rocks are slippery.", cost_level: 2, wiki: "Inani_Beach" },
  { name: "Himchari", bangla_name: "হিমছড়ি", division: "chattogram", district: "Cox's Bazar", coordinates: [92.0236, 21.3586], category: "nature", tags: ["family", "budget"],
    description: "Hills meeting the sea along Marine Drive, with a seasonal waterfall and a hilltop viewpoint.",
    famous_for: "Hilltop sea view", attractions: ["Viewpoint stairs", "Waterfall (monsoon)"], activities: ["Short hike", "Photography"],
    best_season: ["winter", "monsoon"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 12 km south of Cox's Bazar on Marine Drive.", travel_tips: ["Combine with Inani on the same trip."], safety_information: "Steep stairs.", cost_level: 2, wiki: "Himchari_National_Park" },
  { name: "Sajek Valley", bangla_name: "সাজেক ভ্যালি", division: "chattogram", district: "Rangamati", coordinates: [92.2936, 23.3819], category: "hill", tags: ["adventure", "couple"],
    description: "A ridge-top settlement famous for sunrise views over a sea of clouds.",
    famous_for: "Clouds at dawn", attractions: ["Konglak Para", "Ruilui Para", "Helipad viewpoint"], activities: ["Sunrise", "Hill trekking", "Cottage stay"],
    best_season: ["monsoon", "autumn", "winter"], seasonal_warning: "Road access is via army escort from Khagrachhari; access may be suspended during unrest or landslides.", seasonal_warning_bn: "খাগড়াছড়ি থেকে সেনাবাহিনীর এসকর্টে সড়কপথে যেতে হয়। অস্থিরতা বা ভূমিধসের সময় যাতায়াত বন্ধ থাকতে পারে।",
    recommended_duration: "2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Although in Rangamati district, it is reached by road from Khagrachhari (about 70 km) by jeep ('chander gari').",
    travel_tips: ["Escort convoy times are fixed — arrive at Baghaihat on time.", "Book cottages in advance on weekends."], safety_information: "Follow security instructions; carry NID/passport.", cost_level: 2, wiki: "Sajek_Valley" },
  { name: "Kaptai Lake", bangla_name: "কাপ্তাই হ্রদ", division: "chattogram", district: "Rangamati", coordinates: [92.2000, 22.5833], category: "water", tags: ["family", "couple"],
    description: "The largest man-made lake in Bangladesh, created by the Kaptai Dam in the 1960s.",
    famous_for: "Boat trips among green hills", attractions: ["Hanging Bridge", "Shuvolong waterfall", "Peda Ting Ting"], activities: ["Boat ride", "Tribal cuisine"],
    best_season: ["monsoon", "autumn", "winter"], recommended_duration: "1–2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Rangamati town is about 77 km from Chattogram by bus.", travel_tips: ["Hire boats from the Rangamati tourist jetty."], safety_information: "Wear life jackets on boats.", cost_level: 2, wiki: "Kaptai_Lake" },
  { name: "Rangamati Town", bangla_name: "রাঙামাটি", division: "chattogram", district: "Rangamati", coordinates: [92.1753, 22.6533], category: "hill", tags: ["family"],
    description: "Hill district town on Kaptai Lake with indigenous culture and the Rajban Vihara.",
    famous_for: "Lake town and hill culture", attractions: ["Rajban Vihara", "Hanging Bridge", "Tribal museum"], activities: ["Lake cruise", "Handloom shopping"],
    best_season: ["autumn", "winter"], recommended_duration: "1–2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Buses from Chattogram and Dhaka.", travel_tips: ["Respect local customs at monasteries."], safety_information: "Check security situation before travel.", cost_level: 2, wiki: "Rangamati" },
  { name: "Nilgiri", bangla_name: "নীলগিরি", division: "chattogram", district: "Bandarban", coordinates: [92.3333, 21.9333], category: "hill", tags: ["adventure", "couple"],
    description: "A hilltop resort area on the Thanchi road, around 2,200 ft above sea level, known for cloud views.",
    famous_for: "Cloud views from the ridge", attractions: ["Viewpoint", "Ridge road"], activities: ["Jeep ride", "Sunrise"],
    best_season: ["monsoon", "autumn", "winter"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 46 km from Bandarban town by jeep.", travel_tips: ["Combine with Nilachal and Shailapropat."], safety_information: "Mountain road; travel by day.", cost_level: 2, wiki: "Nilgiri,_Bandarban" },
  { name: "Nilachal", bangla_name: "নীলাচল", division: "chattogram", district: "Bandarban", coordinates: [92.2036, 22.1789], category: "hill", tags: ["family", "budget"],
    description: "Viewpoint just outside Bandarban town overlooking rolling hills.",
    famous_for: "Sunset viewpoint", attractions: ["Viewing decks"], activities: ["Sunset", "Photography"],
    best_season: ["autumn", "winter", "monsoon"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 6 km from Bandarban town by CNG.", travel_tips: ["Best at sunset."], safety_information: "Standard precautions.", cost_level: 2, wiki: "Bandarban_District" },
  { name: "Nafakhum Waterfall", bangla_name: "নাফাখুম জলপ্রপাত", division: "chattogram", district: "Bandarban", coordinates: [92.4167, 21.7167], category: "nature", tags: ["adventure", "hidden"],
    description: "A wide waterfall on the Remakri river deep in Thanchi upazila.",
    famous_for: "Remote river waterfall", attractions: ["Remakri river", "Nafakhum falls"], activities: ["Boat & trek", "Camping with guides"],
    best_season: ["autumn", "winter"], seasonal_warning: "Monsoon flash floods make the Sangu and Remakri dangerous; access may be closed by authorities.", seasonal_warning_bn: "বর্ষায় আকস্মিক বন্যায় সাঙ্গু ও রেমাক্রি নদী বিপজ্জনক হয়ে ওঠে; কর্তৃপক্ষ যাতায়াত বন্ধ করতে পারে।",
    recommended_duration: "2–3 days", recommended_nights: 2, entry_fee: null, opening_hours: null,
    transport_information: "Jeep to Thanchi, boat up the Sangu to Remakri, then trek. A registered local guide is required.",
    travel_tips: ["Register with police/army at Thanchi.", "Carry water purification."], safety_information: "Remote area; no hospital nearby.", cost_level: 2, wiki: "Nafakhum_Waterfall" },
  { name: "Boga Lake", bangla_name: "বগা লেক", division: "chattogram", district: "Bandarban", coordinates: [92.4722, 21.9800], category: "hill", tags: ["adventure", "hidden"],
    description: "A natural highland lake at about 1,200 ft in Ruma upazila, surrounded by Bawm villages.",
    famous_for: "Highland lake and trekking base", attractions: ["Boga Lake", "Keokradong trail"], activities: ["Trekking", "Village homestay"],
    best_season: ["autumn", "winter"], seasonal_warning: "Access has been suspended at times for security reasons; check with Bandarban district administration.", seasonal_warning_bn: "নিরাপত্তার কারণে কখনো কখনো যাতায়াত স্থগিত থাকে। যাওয়ার আগে বান্দরবান জেলা প্রশাসনের সঙ্গে জেনে নিন।",
    recommended_duration: "2–3 days", recommended_nights: 2, entry_fee: null, opening_hours: null,
    transport_information: "Jeep to Ruma Bazar, register, then jeep/trek to the lake with a guide.", travel_tips: ["Guide is mandatory."], safety_information: "Follow security registration rules.", cost_level: 2, wiki: "Boga_Lake" },
  { name: "Patenga Beach", bangla_name: "পতেঙ্গা সৈকত", division: "chattogram", district: "Chattogram", coordinates: [91.7983, 22.2347], category: "beach", tags: ["budget", "family", "weekend"],
    description: "City beach at the mouth of the Karnaphuli river, near Shah Amanat Airport.",
    famous_for: "Sunset and ships at anchor", attractions: ["Beach promenade", "Karnaphuli estuary"], activities: ["Evening walk", "Street food"],
    best_season: ["winter", "spring"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 14 km from Chattogram city centre.", travel_tips: ["Swimming is not recommended."], safety_information: "Strong currents.", cost_level: 2, wiki: "Patenga" },

  // ---------------- SYLHET ----------------
  { name: "Jaflong", bangla_name: "জাফলং", division: "sylhet", district: "Sylhet", coordinates: [92.0175, 25.1633], category: "nature", tags: ["family", "budget"],
    description: "Stone-bedded Piyain river beneath the Meghalaya hills and the Dawki bridge on the border.",
    famous_for: "Clear river and hill backdrop", attractions: ["Piyain river", "Zero point view", "Khasi villages"], activities: ["Boat ride", "Village walk"],
    best_season: ["monsoon", "autumn", "winter"], recommended_duration: "Full day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 60 km from Sylhet city by bus, CNG or private car.", travel_tips: ["Water is clearest after the monsoon."], safety_information: "Do not cross the border line; strong currents in monsoon.", cost_level: 1, wiki: "Jaflong" },
  { name: "Ratargul Swamp Forest", bangla_name: "রাতারগুল জলাবন", division: "sylhet", district: "Sylhet", coordinates: [91.9294, 25.0067], category: "nature", tags: ["couple", "hidden", "adventure"],
    description: "Freshwater swamp forest where trees stand in water during the rainy season.",
    famous_for: "Boat rides through a flooded forest", attractions: ["Watch tower", "Swamp channels"], activities: ["Rowing boat ride", "Birdwatching"],
    best_season: ["monsoon", "autumn"], seasonal_warning: "In dry season (Dec–Apr) the water recedes and boat trips are limited.", seasonal_warning_bn: "শুষ্ক মৌসুমে (ডিসেম্বর–এপ্রিল) পানি কমে যায় এবং নৌভ্রমণ সীমিত থাকে।",
    recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 26 km from Sylhet city in Gowainghat upazila.", travel_tips: ["Keep silent to see birds."], safety_information: "Snakes and leeches; wear covered clothing.", cost_level: 1, wiki: "Ratargul_Swamp_Forest" },
  { name: "Bisnakandi", bangla_name: "বিছনাকান্দি", division: "sylhet", district: "Sylhet", coordinates: [91.8833, 25.1667], category: "nature", tags: ["adventure", "hidden"],
    description: "Where several hill streams pour over boulders at the foot of the Khasi hills.",
    famous_for: "Boulder streams", attractions: ["Stone bed", "Hill streams"], activities: ["Wading", "Boat trip"],
    best_season: ["monsoon", "autumn"], seasonal_warning: "Sudden water surges during heavy rain.", seasonal_warning_bn: "ভারী বৃষ্টিতে হঠাৎ পানির প্রবাহ বেড়ে যেতে পারে।",
    recommended_duration: "Full day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Road to Hadarpar, then boat.", travel_tips: ["Wear grip sandals."], safety_information: "Flash-flood risk; leave if water rises.", cost_level: 1, wiki: "Bisnakandi" },
  { name: "Lalakhal", bangla_name: "লালাখাল", division: "sylhet", district: "Sylhet", coordinates: [92.0333, 25.1000], category: "water", tags: ["couple", "family"],
    description: "Turquoise-blue stretch of the Sari river flowing past tea gardens in Jaintiapur.",
    famous_for: "Blue-green river water", attractions: ["Sari river", "Lalakhal tea estate"], activities: ["Boat ride"],
    best_season: ["winter", "autumn"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 35 km from Sylhet on the Jaflong road, then boat from Sarighat.", travel_tips: ["Water colour is best in winter."], safety_information: "Wear life jackets.", cost_level: 1, wiki: "Lalakhal" },
  { name: "Tanguar Haor", bangla_name: "টাঙ্গুয়ার হাওর", division: "sylhet", district: "Sunamganj", coordinates: [91.0667, 25.1333], category: "water", tags: ["adventure", "hidden"],
    description: "A Ramsar-listed wetland of seasonal lakes; a vast inland sea in the monsoon and a bird habitat in winter.",
    famous_for: "Houseboat stays and migratory birds", attractions: ["Watch tower", "Niladri lake", "Shimul bagan"], activities: ["Houseboat trip", "Birdwatching"],
    best_season: ["monsoon", "winter"], seasonal_warning: "Monsoon is for houseboats; winter for birds. Storms can be dangerous on open water.", seasonal_warning_bn: "বর্ষায় হাউসবোট ভ্রমণ এবং শীতে পাখি দেখা যায়। খোলা পানিতে ঝড় বিপজ্জনক হতে পারে।",
    recommended_duration: "2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Bus to Sunamganj, then road to Tahirpur and boat.", travel_tips: ["Choose houseboats with life jackets."], safety_information: "Lightning risk in monsoon storms.", cost_level: 2, wiki: "Tanguar_Haor" },
  { name: "Madhabkunda Waterfall", bangla_name: "মাধবকুণ্ড জলপ্রপাত", division: "sylhet", district: "Moulvibazar", coordinates: [92.2269, 24.6386], category: "nature", tags: ["family"],
    description: "One of the tallest waterfalls in Bangladesh, in Barlekha upazila.",
    famous_for: "Waterfall in eco-park", attractions: ["Main fall", "Parikunda fall"], activities: ["Short walk", "Picnic"],
    best_season: ["monsoon", "autumn"], seasonal_warning: "Flow is low in dry season.", seasonal_warning_bn: "শুষ্ক মৌসুমে পানির প্রবাহ কম থাকে।", recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 70 km from Moulvibazar town.", travel_tips: ["Weekdays are less crowded."], safety_information: "Rocks are slippery; don't climb the fall.", cost_level: 1, wiki: "Madhabkunda_Waterfall" },
  { name: "Lawachara National Park", bangla_name: "লাউয়াছড়া জাতীয় উদ্যান", division: "sylhet", district: "Moulvibazar", coordinates: [91.7833, 24.3167], category: "wildlife", tags: ["adventure", "family"],
    description: "A semi-evergreen forest home to the western hoolock gibbon.",
    famous_for: "Hoolock gibbons and forest trails", attractions: ["Nature trails", "Railway line through forest"], activities: ["Guided trek", "Wildlife watching"],
    best_season: ["winter", "autumn"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 8 km from Sreemangal.", travel_tips: ["Hire a forest guide at the gate."], safety_information: "Leeches in monsoon.", cost_level: 1, wiki: "Lawachara_National_Park" },
  { name: "Sreemangal Tea Gardens", bangla_name: "শ্রীমঙ্গল চা বাগান", division: "sylhet", district: "Moulvibazar", coordinates: [91.7300, 24.3065], category: "nature", tags: ["family", "couple", "weekend"],
    description: "The 'tea capital' of Bangladesh, surrounded by estates, lakes and forest.",
    famous_for: "Tea estates and seven-layer tea", attractions: ["Tea estates", "Tea Research Institute", "Madhabpur Lake"], activities: ["Tea garden walk", "Cycling"],
    best_season: ["monsoon", "autumn", "winter"], recommended_duration: "1–2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Intercity trains from Dhaka and Sylhet stop at Sreemangal.", travel_tips: ["Tea plucking is visible Mar–Nov."], safety_information: "Standard precautions.", cost_level: 2, wiki: "Sreemangal_Upazila" },
  { name: "Baikka Beel", bangla_name: "বাইক্কা বিল", division: "sylhet", district: "Moulvibazar", coordinates: [91.7111, 24.3833], category: "wildlife", tags: ["hidden"],
    description: "A permanent wetland sanctuary in Hail Haor with a bird-watching tower.",
    famous_for: "Winter migratory birds", attractions: ["Watch tower"], activities: ["Birdwatching"],
    best_season: ["winter"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 15 km from Sreemangal.", travel_tips: ["Go at dawn with binoculars."], safety_information: "Muddy tracks in rain.", cost_level: 1, wiki: "Baikka_Beel" },

  // ---------------- RAJSHAHI ----------------
  { name: "Paharpur Buddhist Vihara", bangla_name: "পাহাড়পুর বৌদ্ধ বিহার", division: "rajshahi", district: "Naogaon", coordinates: [88.9767, 25.0311], category: "historical", tags: ["family", "budget"],
    description: "Somapura Mahavihara, a UNESCO World Heritage Site and one of the largest Buddhist monasteries south of the Himalayas.",
    history: "Built by the Pala king Dharmapala in the late 8th century.",
    famous_for: "UNESCO World Heritage monastery", attractions: ["Central shrine", "Terracotta plaques", "Site museum"], activities: ["Heritage tour"],
    best_season: ["winter", "spring"], recommended_duration: "3 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Train or bus to Jaipurhat, then about 10 km by road.", travel_tips: ["Visit the site museum first."], safety_information: "Little shade — carry water.", cost_level: 1, wiki: "Somapura_Mahavihara" },
  { name: "Mahasthangarh", bangla_name: "মহাস্থানগড়", division: "rajshahi", district: "Bogura", coordinates: [89.3667, 24.9611], category: "historical", tags: ["family", "budget"],
    description: "Ruins of Pundranagara, one of the earliest urban archaeological sites in Bangladesh (3rd century BCE).",
    famous_for: "Ancient citadel and Bogura doi", attractions: ["Citadel walls", "Site museum", "Gokul Medh"], activities: ["Archaeology walk"],
    best_season: ["winter", "spring"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 13 km north of Bogura town.", travel_tips: ["Try Bogura's famous curd (doi)."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Mahasthangarh" },
  { name: "Varendra Research Museum", bangla_name: "বরেন্দ্র গবেষণা জাদুঘর", division: "rajshahi", district: "Rajshahi", coordinates: [88.5917, 24.3647], category: "historical", tags: ["family", "budget"],
    description: "The oldest museum in Bangladesh (1910), with Pala-era sculpture and archaeology.",
    famous_for: "Ancient sculptures", attractions: ["Sculpture galleries"], activities: ["Museum visit"],
    best_season: ["winter", "spring", "autumn"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Central Rajshahi city.", travel_tips: ["Combine with the Padma riverbank in the evening."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Varendra_Research_Museum" },
  { name: "Puthia Temple Complex", bangla_name: "পুঠিয়া মন্দির", division: "rajshahi", district: "Rajshahi", coordinates: [88.8333, 24.3667], category: "religious", tags: ["hidden", "family"],
    description: "A cluster of Hindu temples and the Puthia Rajbari, with fine terracotta work.",
    famous_for: "Terracotta temples", attractions: ["Shiva temple", "Govinda temple", "Rajbari"], activities: ["Heritage walk"],
    best_season: ["winter", "spring"], recommended_duration: "2–3 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 23 km east of Rajshahi city by bus.", travel_tips: ["Dress modestly at temples."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Puthia_Temple_Complex" },

  // ---------------- KHULNA ----------------
  { name: "Sundarbans", bangla_name: "সুন্দরবন", division: "khulna", district: "Bagerhat / Khulna / Satkhira", coordinates: [89.1833, 21.9497], category: "wildlife", tags: ["adventure", "family"],
    description: "The world's largest mangrove forest and a UNESCO World Heritage Site, home of the Royal Bengal tiger.",
    famous_for: "Mangroves and Bengal tigers", attractions: ["Kotka", "Kochikhali", "Harbaria", "Hiron Point"], activities: ["Multi-day boat cruise", "Wildlife watching"],
    best_season: ["winter"], seasonal_warning: "Forest is closed to tourists for part of the monsoon breeding season (Jun–Aug in recent years). Cyclone risk Apr–May and Oct–Nov.", seasonal_warning_bn: "প্রজনন মৌসুমে বর্ষার কিছু সময় (সাম্প্রতিক বছরগুলোতে জুন–আগস্ট) পর্যটকদের জন্য বন বন্ধ থাকে। এপ্রিল–মে এবং অক্টোবর–নভেম্বরে ঘূর্ণিঝড়ের ঝুঁকি থাকে।",
    recommended_duration: "3 days", recommended_nights: 2, entry_fee: null, opening_hours: null,
    transport_information: "Licensed tour boats from Khulna or Mongla; entry permits are arranged by the Forest Department through operators.",
    travel_tips: ["Only use Forest Department licensed operators.", "Carry ID for permits."], safety_information: "Never leave the boat without an armed forest guard.", cost_level: 3, wiki: "Sundarbans" },
  { name: "Sixty Dome Mosque", bangla_name: "ষাট গম্বুজ মসজিদ", division: "khulna", district: "Bagerhat", coordinates: [89.7419, 22.6744], category: "religious", tags: ["family", "budget"],
    description: "Shait Gumbad Mosque, the centrepiece of the UNESCO-listed Mosque City of Bagerhat built by Khan Jahan Ali.",
    history: "Built in the 15th century; the largest historic mosque in Bangladesh.",
    famous_for: "UNESCO World Heritage mosque", attractions: ["Shait Gumbad", "Khan Jahan Ali's tomb", "Bagerhat museum"], activities: ["Heritage tour"],
    best_season: ["winter", "spring"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 7 km from Bagerhat town; buses from Khulna.", travel_tips: ["Closed to visitors during prayer times."], safety_information: "Dress modestly.", cost_level: 1, wiki: "Sixty_Dome_Mosque" },
  { name: "Karamjal", bangla_name: "করমজল", division: "khulna", district: "Bagerhat", coordinates: [89.5917, 22.4250], category: "wildlife", tags: ["family", "budget", "weekend"],
    description: "A Forest Department wildlife and crocodile breeding centre at the edge of the Sundarbans — the easiest day visit.",
    famous_for: "Crocodile and deer breeding centre", attractions: ["Wooden trail", "Watch tower", "Breeding centre"], activities: ["Short forest walk"],
    best_season: ["winter", "spring"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Boat from Mongla port, about 1 hour.", travel_tips: ["Good option if you lack time for a multi-day cruise."], safety_information: "Keep to the boardwalk.", cost_level: 1, wiki: "Karamjal" },
  { name: "Dublar Char", bangla_name: "দুবলার চর", division: "khulna", district: "Bagerhat", coordinates: [89.5833, 21.7333], category: "beach", tags: ["adventure", "hidden"],
    description: "A fishing island at the southern edge of the Sundarbans, known for dried-fish camps and the Rash Mela festival.",
    famous_for: "Rash Mela and fishing camps", attractions: ["Fishing camps", "Beach"], activities: ["Cultural festival", "Boat trip"],
    best_season: ["winter"], seasonal_warning: "Accessible only by boat within Sundarbans permits.", seasonal_warning_bn: "সুন্দরবনের অনুমতিপত্র নিয়ে শুধু নৌপথে যাওয়া যায়।", recommended_duration: "Part of a Sundarbans cruise", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Only as part of licensed Sundarbans boat tours.", travel_tips: ["Rash Mela falls in Nov (lunar date)."], safety_information: "Remote; no medical facilities.", cost_level: 3, wiki: "Dublar_Char" },

  // ---------------- BARISHAL ----------------
  { name: "Kuakata", bangla_name: "কুয়াকাটা", division: "barishal", district: "Patuakhali", coordinates: [90.1206, 21.8167], category: "beach", tags: ["family", "couple"],
    description: "A long beach where both sunrise and sunset can be seen over the Bay of Bengal.",
    famous_for: "Sunrise and sunset from one beach", attractions: ["Main beach", "Rakhine villages", "Fatrar Char"], activities: ["Sunrise", "Motorbike beach ride"],
    best_season: ["winter"], seasonal_warning: "Cyclone risk Apr–May and Oct–Nov.", seasonal_warning_bn: "এপ্রিল–মে এবং অক্টোবর–নভেম্বরে ঘূর্ণিঝড়ের ঝুঁকি থাকে।", recommended_duration: "2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Direct buses from Dhaka via the Padma Bridge; or overnight launch to Patuakhali then bus.", travel_tips: ["Sunrise is best seen from the east end (Gangamati)."], safety_information: "Strong currents.", cost_level: 2, wiki: "Kuakata" },
  { name: "Durga Sagar", bangla_name: "দুর্গাসাগর", division: "barishal", district: "Barishal", coordinates: [90.2667, 22.7667], category: "water", tags: ["family", "budget"],
    description: "One of the largest historic ponds in southern Bangladesh, dug in 1780 with a small island in the centre.",
    famous_for: "Historic pond and winter birds", attractions: ["Pond walk", "Central island"], activities: ["Picnic", "Boating"],
    best_season: ["winter"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 11 km from Barishal city.", travel_tips: ["Visit with Guthia Mosque."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Durga_Sagar" },
  { name: "Guthia Mosque", bangla_name: "গুঠিয়া মসজিদ", division: "barishal", district: "Barishal", coordinates: [90.2394, 22.8244], category: "religious", tags: ["family"],
    description: "Baitul Aman Jame Mosque complex in Wazirpur, set among gardens and a large pond.",
    famous_for: "Modern mosque complex", attractions: ["Mosque", "Minaret", "Gardens"], activities: ["Photography"],
    best_season: ["winter", "spring"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 20 km from Barishal city.", travel_tips: ["Dress modestly."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Guthia_Mosque" },
  { name: "Floating Guava Market", bangla_name: "ভাসমান পেয়ারা বাজার", division: "barishal", district: "Jhalokati / Pirojpur", coordinates: [90.1, 22.7], category: "water", tags: ["hidden", "adventure"],
    description: "Seasonal floating market on canals around Bhimruli and Atghar-Kuriana where farmers trade guavas from boats.",
    famous_for: "Boats laden with guava", attractions: ["Bhimruli market", "Canal network"], activities: ["Canal boat ride"],
    best_season: ["monsoon"], seasonal_warning: "Market runs mainly during guava season (about Jul–Sep).", seasonal_warning_bn: "বাজারটি মূলত পেয়ারার মৌসুমে (প্রায় জুলাই–সেপ্টেম্বর) বসে।", recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Road from Barishal to Bhimruli (Jhalokati), then hire a small boat.", travel_tips: ["Go early morning."], safety_information: "Wear life jackets on small boats.", cost_level: 1, wiki: "Jhalokati_District" },

  // ---------------- RANGPUR ----------------
  { name: "Tajhat Palace", bangla_name: "তাজহাট জমিদার বাড়ি", division: "rangpur", district: "Rangpur", coordinates: [89.2764, 25.7697], category: "historical", tags: ["family", "budget"],
    description: "Early 20th-century palace of Maharaja Kumar Gopal Lal Roy, now the Rangpur Museum.",
    famous_for: "White marble staircase palace", attractions: ["Palace", "Museum"], activities: ["Museum visit"],
    best_season: ["winter", "spring"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 3 km from Rangpur city centre.", travel_tips: ["Closed one day a week — confirm locally."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Tajhat_Palace" },
  { name: "Kantajew Temple", bangla_name: "কান্তজীউ মন্দির", division: "rangpur", district: "Dinajpur", coordinates: [88.6714, 25.7903], category: "religious", tags: ["family", "hidden"],
    description: "An 18th-century Hindu temple covered in exquisite terracotta panels depicting epics and daily life.",
    history: "Completed in 1752 by Maharaja Ramnath of Dinajpur.",
    famous_for: "Finest terracotta temple in Bangladesh", attractions: ["Terracotta panels", "Nayabad Mosque nearby"], activities: ["Heritage visit"],
    best_season: ["winter", "spring"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 20 km north of Dinajpur town (Dinajpur is in Rangpur Division).", travel_tips: ["Visit during the Rash Mela for festivities."], safety_information: "Dress modestly.", cost_level: 1, wiki: "Kantajew_Temple" },
  { name: "Teesta Barrage", bangla_name: "তিস্তা ব্যারেজ", division: "rangpur", district: "Lalmonirhat", coordinates: [89.0667, 26.1833], category: "water", tags: ["budget", "weekend"],
    description: "The largest irrigation barrage in Bangladesh at Dalia on the Teesta river.",
    famous_for: "Teesta river views", attractions: ["Barrage", "Riverbank"], activities: ["River walk", "Picnic"],
    best_season: ["winter", "monsoon"], recommended_duration: "2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 70 km from Rangpur city.", travel_tips: ["Sunset views are popular."], safety_information: "Do not swim near sluice gates.", cost_level: 1, wiki: "Teesta_Barrage" },
  { name: "Ramsagar National Park", bangla_name: "রামসাগর", division: "rangpur", district: "Dinajpur", coordinates: [88.6278, 25.5528], category: "water", tags: ["family", "budget"],
    description: "One of the largest man-made ponds in Bangladesh, dug in the 18th century, now a national park.",
    famous_for: "Historic giant pond", attractions: ["Pond", "Mini zoo", "Picnic spots"], activities: ["Picnic", "Walk"],
    best_season: ["winter"], recommended_duration: "2–3 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 8 km south of Dinajpur town.", travel_tips: ["Combine with Kantajew."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Ramsagar_National_Park" },

  // ---------------- MYMENSINGH ----------------
  { name: "Shashi Lodge", bangla_name: "শশী লজ", division: "mymensingh", district: "Mymensingh", coordinates: [90.4083, 24.7556], category: "historical", tags: ["family", "budget"],
    description: "A zamindar mansion of Muktagachha zamindars in Mymensingh town, known for its Venus statue fountain.",
    famous_for: "Colonial mansion and garden", attractions: ["Mansion", "Venus fountain"], activities: ["Heritage visit"],
    best_season: ["winter", "spring"], recommended_duration: "1–2 hours", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Central Mymensingh city; trains and buses from Dhaka.", travel_tips: ["Walk to the Brahmaputra riverbank afterwards."], safety_information: "Standard precautions.", cost_level: 1, wiki: "Shashi_Lodge" },
  { name: "Birishiri", bangla_name: "বিরিশিরি", division: "mymensingh", district: "Netrokona", coordinates: [90.6417, 25.1333], category: "nature", tags: ["hidden", "adventure", "budget"],
    description: "Garo-inhabited area on the Someshwari river with blue-green ceramic-clay lakes.",
    famous_for: "Clay hills and lakes", attractions: ["Someshwari river", "Garo culture centre", "Clay lakes"], activities: ["River crossing", "Cultural visit"],
    best_season: ["winter", "autumn"], recommended_duration: "1–2 days", recommended_nights: 1, entry_fee: null, opening_hours: null,
    transport_information: "Bus from Dhaka to Durgapur (about 5–6 hours), then local motorbikes.", travel_tips: ["Basic accommodation only."], safety_information: "Clay slopes are slippery.", cost_level: 1, wiki: "Birishiri" },
  { name: "China Matir Pahar (Bijoypur)", bangla_name: "চীনামাটির পাহাড়", division: "mymensingh", district: "Netrokona", coordinates: [90.6667, 25.1667], category: "hill", tags: ["hidden", "couple"],
    description: "White china-clay hills at Bijoypur with a turquoise lake formed by clay quarrying.",
    famous_for: "Turquoise clay lake", attractions: ["Clay hills", "Blue lake"], activities: ["Photography", "Short hike"],
    best_season: ["winter", "autumn"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "Short ride from Birishiri / Durgapur.", travel_tips: ["Visit with Birishiri."], safety_information: "Unstable edges near quarry lake.", cost_level: 1, wiki: "Durgapur_Upazila,_Netrokona" },
  { name: "Gazni Garo Hills", bangla_name: "গজনী অবকাশ", division: "mymensingh", district: "Sherpur", coordinates: [90.1333, 25.2333], category: "hill", tags: ["family", "budget"],
    description: "Gazni Abakash recreation centre on the forested Garo hills near the Indian border.",
    famous_for: "Garo hill forests", attractions: ["Watch tower", "Lake", "Forest"], activities: ["Picnic", "Forest walk"],
    best_season: ["winter"], recommended_duration: "Half day", recommended_nights: 0, entry_fee: null, opening_hours: null,
    transport_information: "About 30 km from Sherpur town in Jhenaigati upazila.", travel_tips: ["Wild elephants roam the area at times."], safety_information: "Avoid forest at dusk due to elephants.", cost_level: 1, wiki: "Sherpur_District" },
];

const slugify = (s: string) => s.toLowerCase().replace(/['’()]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const DESTINATIONS: Destination[] = seeds.map(({ wiki, extra, ...s }) => {
  const slug = slugify(s.name);
  return { ...s, id: slug, slug, source_urls: [W(wiki), ...(extra ?? [])], last_verified: LV };
});

export const getDestination = (slug: string) => DESTINATIONS.find((d) => d.slug === slug);
export const byDivision = (id: string) => DESTINATIONS.filter((d) => d.division === id);

export const CATEGORIES: Category[] = ["nature", "beach", "hill", "historical", "religious", "wildlife", "water", "urban"];
export const SEASONS: Season[] = ["winter", "spring", "summer", "monsoon", "autumn"];
export const TAGS: Tag[] = ["family", "adventure", "couple", "budget", "weekend", "hidden"];

export const SEASON_INFO: Record<Season, { months: string; weather: string; caution: string }> = {
  winter: { months: "Dec – Feb", weather: "Dry, cool and sunny; foggy mornings in the north.", caution: "Fog can delay ferries, trains and flights." },
  spring: { months: "Mar – Apr", weather: "Warming up, occasional nor'wester storms (kalbaishakhi).", caution: "Sudden afternoon storms — avoid open water." },
  summer: { months: "Apr – May", weather: "Hot and humid; pre-monsoon cyclone season on the coast.", caution: "Heat stress and coastal cyclone warnings." },
  monsoon: { months: "Jun – Sep", weather: "Heavy rain; rivers, haors and waterfalls at their fullest.", caution: "Landslides in hill tracts, flash floods, rough seas." },
  autumn: { months: "Oct – Nov", weather: "Clear skies, green landscapes, kash flowers.", caution: "Late cyclone season on the coast (Oct–Nov)." },
};

export const SEASON_INFO_BN: Record<Season, { months: string; weather: string; caution: string }> = {
  winter: { months: "ডিসেম্বর – ফেব্রুয়ারি", weather: "শুষ্ক, শীতল ও রৌদ্রোজ্জ্বল; উত্তরে সকালে কুয়াশা থাকে।", caution: "কুয়াশার কারণে ফেরি, ট্রেন ও উড়োজাহাজ চলাচলে দেরি হতে পারে।" },
  spring: { months: "মার্চ – এপ্রিল", weather: "তাপমাত্রা বাড়ে; মাঝে মাঝে কালবৈশাখী হয়।", caution: "বিকেলে হঠাৎ ঝড় হতে পারে—খোলা জলাশয়ে সতর্ক থাকুন।" },
  summer: { months: "এপ্রিল – মে", weather: "গরম ও আর্দ্র; উপকূলে প্রাক্‌-বর্ষা ঘূর্ণিঝড়ের মৌসুম।", caution: "তাপজনিত অসুস্থতা ও উপকূলীয় ঘূর্ণিঝড়ের সতর্কতা মেনে চলুন।" },
  monsoon: { months: "জুন – সেপ্টেম্বর", weather: "প্রচুর বৃষ্টি; নদী, হাওর ও জলপ্রপাত পূর্ণ থাকে।", caution: "পাহাড়ি এলাকায় ভূমিধস, আকস্মিক বন্যা ও উত্তাল সমুদ্রের ঝুঁকি থাকে।" },
  autumn: { months: "অক্টোবর – নভেম্বর", weather: "আকাশ পরিষ্কার, প্রকৃতি সবুজ, মাঠে কাশফুল ফোটে।", caution: "উপকূলে অক্টোবর–নভেম্বরে ঘূর্ণিঝড়ের মৌসুম চলতে পারে।" },
};
