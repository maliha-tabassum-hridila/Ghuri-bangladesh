/**
 * Transport estimates are not live fares or schedules. Train and launch
 * prices and times are route-specific and are unavailable without route data.
 */
export type Mode = "car" | "motorcycle" | "bus" | "train" | "launch" | "walk";

export interface ModeInfo {
  id: Mode;
  label: string;
  /** BDT per person per km, [low, high] — for car this is per vehicle */
  perKm: [number, number] | null;
  perVehicle: boolean;
  vehicleSeats: number;
  avgKmh: number | null;
  note: string;
  officialUrl?: string;
}

export const TRANSPORT_REVIEWED = "2026-10";

export const MODES: ModeInfo[] = [
  {
    id: "car",
    label: "Private car / microbus",
    perKm: [22, 35],
    perVehicle: true,
    vehicleSeats: 4,
    avgKmh: 45,
    note: "Rental incl. driver & fuel; tolls extra.",
  },
  {
    id: "motorcycle",
    label: "Motorcycle",
    perKm: [3, 5],
    perVehicle: true,
    vehicleSeats: 2,
    avgKmh: 45,
    note: "Fuel only, own bike.",
  },
  {
    id: "bus",
    label: "Intercity bus",
    perKm: [2.2, 4.5],
    perVehicle: false,
    vehicleSeats: 1,
    avgKmh: 40,
    note: "Non-AC to AC coach range.",
    officialUrl: "https://brta.gov.bd",
  },
  {
    id: "train",
    label: "Bangladesh Railway",
    perKm: null,
    perVehicle: false,
    vehicleSeats: 1,
    avgKmh: null,
    note: "Route-specific train fares and times are unavailable; check official tickets.",
    officialUrl: "https://eticket.railway.gov.bd",
  },
  {
    id: "launch",
    label: "Launch / ferry",
    perKm: null,
    perVehicle: false,
    vehicleSeats: 1,
    avgKmh: null,
    note: "Route-specific launch fares and times are unavailable; check official schedules.",
    officialUrl: "https://biwtc.gov.bd",
  },
  {
    id: "walk",
    label: "Walking",
    perKm: [0, 0],
    perVehicle: false,
    vehicleSeats: 1,
    avgKmh: 4.5,
    note: "Short distances only.",
  },
];

export const getMode = (m: Mode) => MODES.find((x) => x.id === m)!;

export function estimateFare(
  mode: Mode,
  km: number | null,
  travellers: number,
): { low: number; high: number } | null {
  const info = getMode(mode);
  if (km === null || info.perKm === null || !Number.isFinite(km) || km < 0) return null;

  if (info.perVehicle) {
    const vehicles = Math.ceil(Math.max(1, travellers) / info.vehicleSeats);
    return {
      low: Math.round(info.perKm[0] * km * vehicles),
      high: Math.round(info.perKm[1] * km * vehicles),
    };
  }
  return {
    low: Math.round(info.perKm[0] * km * travellers),
    high: Math.round(info.perKm[1] * km * travellers),
  };
}

export function estimateMinutes(mode: Mode, km: number | null): number | null {
  const speed = getMode(mode).avgKmh;
  if (km === null || speed === null || !Number.isFinite(km) || km < 0) return null;
  return (km / speed) * 60;
}
