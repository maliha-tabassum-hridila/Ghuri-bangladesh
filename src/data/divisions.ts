import dhaka from "@/assets/div-dhaka.jpg";
import chattogram from "@/assets/div-chattogram.jpg";
import sylhet from "@/assets/div-sylhet.jpg";
import rajshahi from "@/assets/div-rajshahi.jpg";
import khulna from "@/assets/div-khulna.jpg";
import barishal from "@/assets/div-barishal.jpg";
import rangpur from "@/assets/div-rangpur.jpg";
import mymensingh from "@/assets/div-mymensingh.jpg";

export type DivisionId =
  | "dhaka" | "chattogram" | "sylhet" | "rajshahi"
  | "khulna" | "barishal" | "rangpur" | "mymensingh";

export interface Division {
  id: DivisionId;
  name: string;
  bn: string;
  intro: string;
  introBn: string;
  image: string;
  center: [number, number]; // [lng, lat] of the divisional headquarters city
}

export const DIVISIONS: Division[] = [
  { id: "dhaka", name: "Dhaka", bn: "ঢাকা", image: dhaka, center: [90.4125, 23.8103],
    intro: "Mughal forts, colonial palaces and the ancient capital of Sonargaon around the nation's busy capital.",
    introBn: "রাজধানীর চারপাশে মুঘল দুর্গ, জমিদার বাড়ি ও প্রাচীন সোনারগাঁও।" },
  { id: "chattogram", name: "Chattogram", bn: "চট্টগ্রাম", image: chattogram, center: [91.7832, 22.3569],
    intro: "The longest natural sea beach, coral island shores and the hill tracts of Bandarban and Rangamati.",
    introBn: "দীর্ঘতম সমুদ্রসৈকত, প্রবাল দ্বীপ এবং বান্দরবান-রাঙামাটির পাহাড়।" },
  { id: "sylhet", name: "Sylhet", bn: "সিলেট", image: sylhet, center: [91.8687, 24.8949],
    intro: "Tea estates, swamp forests, haors and stone-bedded rivers at the foot of the Meghalaya hills.",
    introBn: "চা বাগান, জলাবন, হাওর ও পাহাড়ি নদীর দেশ।" },
  { id: "rajshahi", name: "Rajshahi", bn: "রাজশাহী", image: rajshahi, center: [88.6042, 24.3745],
    intro: "Archaeological heartland: Paharpur, Mahasthangarh and the terracotta temples of Puthia.",
    introBn: "প্রত্নতত্ত্বের কেন্দ্র: পাহাড়পুর, মহাস্থানগড় ও পুঠিয়ার মন্দির।" },
  { id: "khulna", name: "Khulna", bn: "খুলনা", image: khulna, center: [89.5403, 22.8456],
    intro: "Gateway to the Sundarbans mangroves and the UNESCO-listed mosque city of Bagerhat.",
    introBn: "সুন্দরবন ও ষাট গম্বুজ মসজিদের প্রবেশদ্বার।" },
  { id: "barishal", name: "Barishal", bn: "বরিশাল", image: barishal, center: [90.3535, 22.701],
    intro: "River country of launches, floating markets and the sunrise-and-sunset beach of Kuakata.",
    introBn: "লঞ্চ, ভাসমান বাজার ও কুয়াকাটার নদীমাতৃক অঞ্চল।" },
  { id: "rangpur", name: "Rangpur", bn: "রংপুর", image: rangpur, center: [89.2752, 25.7439],
    intro: "Zamindar palaces, the Teesta river and the finest terracotta temple in Bangladesh at Kantajew.",
    introBn: "জমিদার প্রাসাদ, তিস্তা নদী ও কান্তজীউ মন্দির।" },
  { id: "mymensingh", name: "Mymensingh", bn: "ময়মনসিংহ", image: mymensingh, center: [90.4203, 24.7471],
    intro: "Garo hills, blue-green clay lakes of Birishiri and the riverside heritage of the Brahmaputra.",
    introBn: "গারো পাহাড়, বিরিশিরির নীল হ্রদ ও ব্রহ্মপুত্রের ঐতিহ্য।" },
];

export const getDivision = (id: string) => DIVISIONS.find((d) => d.id === id);
