import { CalculationMethod, Coordinates, PrayerTimes, Madhab } from 'adhan';

export type City = {
  name: string;
  region: string;
  lat: number;
  lng: number;
  timezone: string;
  zone: string;
};
export const cities: City[] = [
  {
    name: 'Jakarta',
    region: 'DKI Jakarta',
    lat: -6.2088,
    lng: 106.8456,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Bandung',
    region: 'Jawa Barat',
    lat: -6.9175,
    lng: 107.6191,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Surabaya',
    region: 'Jawa Timur',
    lat: -7.2575,
    lng: 112.7521,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Yogyakarta',
    region: 'DI Yogyakarta',
    lat: -7.7956,
    lng: 110.3695,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Semarang',
    region: 'Jawa Tengah',
    lat: -6.9667,
    lng: 110.4167,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Medan',
    region: 'Sumatera Utara',
    lat: 3.5952,
    lng: 98.6722,
    timezone: 'Asia/Jakarta',
    zone: 'WIB',
  },
  {
    name: 'Makassar',
    region: 'Sulawesi Selatan',
    lat: -5.1477,
    lng: 119.4327,
    timezone: 'Asia/Makassar',
    zone: 'WITA',
  },
  {
    name: 'Denpasar',
    region: 'Bali',
    lat: -8.65,
    lng: 115.2167,
    timezone: 'Asia/Makassar',
    zone: 'WITA',
  },
  {
    name: 'Balikpapan',
    region: 'Kalimantan Timur',
    lat: -1.2379,
    lng: 116.8529,
    timezone: 'Asia/Makassar',
    zone: 'WITA',
  },
  {
    name: 'Jayapura',
    region: 'Papua',
    lat: -2.5337,
    lng: 140.7181,
    timezone: 'Asia/Jayapura',
    zone: 'WIT',
  },
];
export const prayerNames = ['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'] as const;
export type PrayerName = (typeof prayerNames)[number];
export function prayersForDate(date: Date, city: City) {
  const parameters = CalculationMethod.Singapore();
  parameters.fajrAngle = 20;
  parameters.ishaAngle = 18;
  parameters.madhab = Madhab.Shafi;
  const times = new PrayerTimes(new Coordinates(city.lat, city.lng), date, parameters);
  return prayerNames.map((name, i) => ({
    name,
    time: [times.fajr, times.dhuhr, times.asr, times.maghrib, times.isha][i],
  }));
}
export function cityDate(now: Date, city: City) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: city.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(get('year'), get('month') - 1, get('day'), 12);
}
export function nextPrayer(now: Date, city: City) {
  const date = cityDate(now, city);
  const found = prayersForDate(date, city).find((p) => p.time > now);
  if (found) return found;
  date.setDate(date.getDate() + 1);
  return prayersForDate(date, city)[0];
}
export function formatTime(date: Date, city: City) {
  return date
    .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: city.timezone })
    .replace('.', ':');
}
export function countdown(to: Date, from: Date) {
  const seconds = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(' : ');
}
export const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID');
export function calculateZakat(
  mode: 'maal' | 'penghasilan' | 'fitrah',
  amount: number,
  debt: number,
  gold: number,
  people: number,
  rice: number,
  haul: boolean,
) {
  const safe = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  if (mode === 'fitrah')
    return {
      base: Math.floor(safe(people)),
      nisab: 0,
      eligible: safe(people) >= 1,
      total: Math.floor(safe(people)) * 2.5 * safe(rice),
    };
  const base = Math.max(0, safe(amount) - (mode === 'maal' ? safe(debt) : 0));
  const nisab = (safe(gold) * 85) / (mode === 'penghasilan' ? 12 : 1);
  const eligible = safe(gold) > 0 && base >= nisab && (mode !== 'maal' || haul);
  return { base, nisab, eligible, total: eligible ? base * 0.025 : 0 };
}
export function hijriParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-civil', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { day: get('day'), month: get('month'), year: get('year') };
}
const hijriMonths = [
  'Muharam',
  'Safar',
  'Rabiulawal',
  'Rabiulakhir',
  'Jumadilawal',
  'Jumadilakhir',
  'Rajab',
  'Syakban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
];
export function hijriLabel(date: Date) {
  const h = hijriParts(date);
  return `${h.day} ${hijriMonths[h.month - 1]} ${h.year} H`;
}
export function fastingForDate(date: Date) {
  const { day, month } = hijriParts(date);
  if ((month === 10 && day === 1) || (month === 12 && day >= 10 && day <= 13))
    return {
      name: 'Hari raya / tasyrik',
      kind: 'forbidden',
      description:
        'Hari yang dilarang untuk berpuasa. Nikmati hari ini dengan bersyukur dan berbagi.',
    };
  if (month === 9)
    return {
      name: 'Puasa Ramadan',
      kind: 'ramadan',
      description:
        'Puasa wajib bagi muslim yang memenuhi syarat, sejak terbit fajar hingga terbenam matahari.',
    };
  if (month === 12 && day === 9)
    return {
      name: 'Puasa Arafah',
      kind: 'sunnah',
      description: 'Puasa sunah pada 9 Zulhijah bagi yang tidak sedang berhaji.',
    };
  if (month === 1 && day === 10)
    return {
      name: 'Puasa Asyura',
      kind: 'sunnah',
      description: 'Puasa sunah 10 Muharam, dianjurkan bersama puasa pada 9 Muharam.',
    };
  if (day >= 13 && day <= 15)
    return {
      name: 'Puasa Ayyamul Bidh',
      kind: 'sunnah',
      description:
        'Puasa sunah pada tanggal 13, 14, dan 15 setiap bulan Hijriah, kecuali hari yang dilarang.',
    };
  if (date.getDay() === 1 || date.getDay() === 4)
    return {
      name: `Puasa ${date.getDay() === 1 ? 'Senin' : 'Kamis'}`,
      kind: 'sunnah',
      description: 'Menghidupkan sunah dengan berpuasa di hari Senin dan Kamis.',
    };
  return {
    name: 'Hari biasa',
    kind: 'normal',
    description:
      'Tidak ada puasa khusus pada tanggal ini. Anda tetap dapat merencanakan puasa sunah atau mengganti puasa wajib.',
  };
}
export function upcomingFasts(from: Date, count = 3) {
  const result = [];
  for (let i = 0; i < 60 && result.length < count; i++) {
    const date = new Date(from);
    date.setDate(date.getDate() + i);
    const fast = fastingForDate(date);
    if (fast.kind === 'sunnah' || fast.kind === 'ramadan') result.push({ date, ...fast });
  }
  return result;
}
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
