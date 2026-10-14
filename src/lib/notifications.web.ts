import { City, PrayerName } from './islam';
export async function syncReminders(_city: City, enabled: PrayerName[], fasting: boolean) {
  if (enabled.length || fasting)
    return 'Preferensi tersimpan. Notifikasi terjadwal tersedia di aplikasi Android/iOS; versi web menampilkan pengingat saat aplikasi terbuka.';
  return 'Semua pengingat dinonaktifkan.';
}
