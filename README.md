# Teman Iman

Aplikasi panduan ibadah berbahasa Indonesia berbasis **React Native, Expo, dan TypeScript**. Satu basis kode untuk Android, iOS, dan web, dengan navigasi bawah pada ponsel dan sidebar pada desktop.

## Fitur

- **Beranda**: ringkasan ibadah, hitung mundur salat berikutnya, lima rukun Islam, dan puasa terdekat.
- **Panduan Islam**: syahadat, salat, zakat, puasa, dan haji; dilengkapi rujukan, bookmark, pencarian, dan progres membaca.
- **Jadwal salat**: perhitungan astronomis lokal untuk 10 kota Indonesia, zona WIB/WITA/WIT, navigasi harian, dan tabel tujuh hari.
- **Kalkulator zakat**: maal/simpanan, penghasilan bulanan, dan fitrah; validasi input, nisab transparan, utang, serta syarat haul.
- **Kalender puasa**: navigasi bulan, Ramadan, Senin–Kamis, Ayyamul Bidh, Arafah, Asyura, larangan puasa, dan catatan/rencana pribadi.
- **Pengingat**: pilihan per salat dan pengingat sahur. Notifikasi lokal untuk Android/iOS; pesan dalam aplikasi untuk web.
- **Profil lokal**: nama panggilan, kota, bookmark, progres, pengingat, dan catatan puasa tersimpan di perangkat menggunakan AsyncStorage.
- Font disertakan dalam aplikasi; ilustrasi SVG buatan sendiri. Tidak menggunakan API jadwal eksternal, autentikasi, pelacakan, atau backend.

## Menjalankan

Gunakan Node.js 20.19.4+ (Node 22 direkomendasikan).

```bash
npm ci
npm run web        # http://localhost:8081
npm start          # Metro / Expo
npm run android    # Android emulator / perangkat dengan klien Expo yang sesuai
npm run ios        # Simulator iOS (memerlukan macOS)
```

Proyek menggunakan Expo SDK 54. Gunakan Expo Go yang mendukung SDK tersebut atau development build. Untuk membangun aplikasi native lokal setelah memasang Android SDK / Xcode:

```bash
npx expo run:android
npx expo run:ios
```

`expo run:*` menghasilkan folder native dan memerlukan toolchain perangkat yang sesuai. APK/IPA tidak disertakan dalam repositori ini.

Di lingkungan tanpa akses layanan Expo (seperti sandbox), gunakan:

```bash
EXPO_OFFLINE=1 npm run web
```

Server development memakai host LAN (`0.0.0.0`) dan port 8081 sehingga bisa ditampilkan melalui live preview. Browser tidak mengakses backend localhost; aplikasi bekerja secara lokal.

### Build web

```bash
npm run build:web
# keluaran: dist/ (tidak dilacak Git)
```

Host `dist/` dengan layanan hosting statis melalui HTTPS. Ini bukan PWA dengan service worker; jangan mengasumsikan reload web tersedia tanpa koneksi. Perhitungan dan konten tidak membutuhkan API setelah aplikasi termuat.

## Pengingat dan keterbatasan platform

### Android / iOS

- Menggunakan `expo-notifications`, bukan push notification server.
- Meminta izin pengguna saat pengingat diaktifkan. Android menggunakan kanal `ibadah`.
- Salat dijadwalkan hingga tujuh hari ke depan; sahur untuk hingga empat tanggal puasa terdekat, satu jam sebelum Subuh.
- Jadwal diperbarui ketika membuka kembali aplikasi, mengubah kota, atau mengganti preferensi.
- Android mendeklarasikan `SCHEDULE_EXACT_ALARM`. Perangkat tertentu juga memerlukan izin **Alarm & pengingat** di pengaturan sistem. Notifikasi tetap dipengaruhi izin, penghemat baterai, dan mode senyap.
- Aplikasi tidak menjadwalkan ulang tanpa batas di background. Buka aplikasi secara berkala.
- Keberhasilan bundling native **bukan** verifikasi penerimaan notifikasi pada perangkat fisik. Uji izin, reboot, timezone, mode hemat daya, dan pengiriman notifikasi dengan development/release build sebelum rilis.

### Web

- Pilihan pengingat tersimpan dan pesan muncul di dalam aplikasi saat halaman aktif/terbuka pada menit yang sesuai.
- Tidak ada janji push/background notification ketika browser ditutup. Browser yang menangguhkan tab juga bisa menunda atau melewatkan pengingat.

## Asumsi ibadah

### Salat

Menggunakan library `adhan` dengan koordinat pusat kota, Subuh −20°, Isya −18°, dan Asar mazhab Syafi’i. Waktu adalah estimasi astronomis, bukan data resmi Kemenag; utamakan jadwal masjid/otoritas setempat. Koordinat tidak berasal dari GPS.

### Kalender Hijriah

Menggunakan `Intl.DateTimeFormat` dengan kalender tabular `islamic-civil`. Hasil dapat berbeda 1–2 hari dari rukyat. Penentuan Ramadan, Syawal, dan Zulhijah mengikuti penetapan resmi, bukan aplikasi ini. Larangan puasa hari raya dan tasyrik didahulukan dari anjuran Senin–Kamis/Ayyamul Bidh.

### Zakat

- **Maal**: `max(0, simpanan − utang yang dapat dikurangkan) × 2,5%`, jika mencapai nisab setara 85 gram emas dan sudah satu tahun Hijriah (haul).
- **Penghasilan**: estimasi nisab bulanan `85 × harga emas / 12`, kadar 2,5% dari penghasilan bruto. Cocokkan dengan ketetapan nisab penghasilan BAZNAS terbaru.
- **Fitrah**: estimasi uang `jumlah orang × 2,5 kg × harga beras per kg`. Ikuti jumlah uang yang ditetapkan lembaga zakat setempat, terutama perbedaan penilaian 2,5 kg / 3,5 liter dan mazhab.
- Harga awal emas Rp1.500.000/gram dan beras Rp15.000/kg **hanya contoh**, bukan harga pasar terkini. Pengguna dapat mengubahnya.
- Bukan kalkulator semua jenis harta, fatwa, atau fasilitas pembayaran zakat. Ketentuan utang dan kondisi khusus perlu dikonsultasikan dengan amil.

## Pengujian

```bash
npm run typecheck
npm test
npm run format:check

# Sekali, pasang browser pengujian:
npx playwright install chromium
npm run test:e2e
```

- 18 unit test: nisab, haul, utang, penghasilan, fitrah, input invalid, urutan salat, pergantian hari dan zona waktu, hitung mundur, kalender, larangan puasa.
- Playwright: alur kalkulator semua jenis, validasi, ganti kota, jadwal harian, bookmark, progres membaca, preferensi pengingat, persistensi, kalender puasa, profil, dan tampilan ponsel.
- Konfigurasi pengujian menjalankan Metro bila diperlukan. Untuk Chromium yang sudah disediakan lingkungan, atur `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

### Dependensi

Versi native dicocokkan dengan Expo SDK 54. `npm audit` masih melaporkan advisory pada toolchain/transitive dependencies Expo, Metro, dan React Native. Pembaruan non-breaking telah dicoba; jangan menggunakan `npm audit fix --force` tanpa pengujian migrasi SDK karena dapat mengubah versi utama atau menurunkan versi Expo. Tinjau audit dan perbarui SDK sebelum rilis produksi.

## Struktur

```text
App.tsx                       Shell, navigasi, dialog, preferensi
src/components/Dashboard.tsx Beranda dan kartu panduan
src/components/Pages.tsx     Panduan, salat, zakat, kalender
src/components/ui.tsx        Komponen antarmuka bersama
src/components/illustrations.tsx  Logo dan ilustrasi SVG
src/lib/islam.ts             Perhitungan salat, zakat, kalender
src/lib/guides.ts            Materi panduan dan rujukan
src/lib/notifications.ts     Penjadwalan notifikasi native
src/lib/notifications.web.ts Perilaku pengingat web
src/theme.ts                Warna dan font
assets/                     Ikon aplikasi
tests/                     Unit test
e2e/                       Pengujian browser
```

Data disimpan lokal tanpa sinkronisasi antarperangkat. Menghapus data browser/aplikasi akan menghapus semua preferensi dan catatan.
