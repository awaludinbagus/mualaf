import { test, expect } from '@playwright/test';

test('desktop journey: zakat, city, bookmarks, reminders, and persistence', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  await expect(page.getByText('Lima rukun, satu perjalanan')).toBeVisible();
  await page.getByRole('button', { name: 'Kalkulator Zakat', exact: true }).click();
  await page.getByRole('button', { name: 'Hitung zakat sekarang' }).click();
  await expect(
    page.getByText('Lengkapi nilai perhitungan dengan angka yang valid terlebih dahulu.'),
  ).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Total harta simpanan yang wajib dizakati' })
    .fill('200000000');
  await page
    .getByRole('textbox', { name: 'Utang jatuh tempo yang dapat dikurangkan' })
    .fill('20000000');
  await page.getByRole('switch', { name: 'Sudah mencapai haul' }).click();
  await page.getByRole('button', { name: 'Hitung zakat sekarang' }).click();
  await expect(page.getByText('Rp4.500.000', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Zakat Fitrah' }).click();
  await page.getByRole('textbox', { name: 'Jumlah orang yang dizakati' }).fill('4');
  await page.getByRole('button', { name: 'Hitung zakat sekarang' }).click();
  await expect(page.getByText('Rp150.000', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Penghasilan' }).click();
  await page.getByRole('textbox', { name: 'Total penghasilan bruto per bulan' }).fill('12000000');
  await page.getByRole('button', { name: 'Hitung zakat sekarang' }).click();
  await expect(page.getByText('Rp300.000', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pilih lokasi kota' }).click();
  await page.getByRole('textbox', { name: 'Cari kota' }).fill('Makassar');
  await page.getByRole('button', { name: /Makassar Sulawesi Selatan/ }).click();
  await expect(page.getByRole('button', { name: 'Pilih lokasi kota' })).toContainText('Makassar');
  await page.getByRole('button', { name: 'Jadwal Salat', exact: true }).click();
  await expect(page.getByText('Tujuh hari ke depan')).toBeVisible();
  await page.getByRole('button', { name: 'Hari berikutnya' }).click();
  await expect(page.getByRole('button', { name: 'Kembali ke hari ini' })).toBeVisible();
  await page.getByRole('button', { name: 'Kembali ke hari ini' }).click();
  await page.getByRole('button', { name: 'Panduan Islam', exact: true }).click();
  await page.getByRole('button', { name: 'Baca panduan Syahadat' }).click();
  await page.getByRole('button', { name: 'Simpan panduan', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hapus dari tersimpan' })).toBeVisible();
  await page.getByRole('button', { name: 'Tandai sudah dibaca' }).click();
  await expect(page.getByText('1 dari 5 panduan dibaca')).toBeVisible();
  await page.getByRole('button', { name: 'Tersimpan', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Baca panduan Syahadat' })).toBeVisible();
  await page.getByRole('button', { name: 'Pengaturan pengingat' }).click();
  await page.getByRole('switch', { name: 'Subuh', exact: true }).click();
  await expect(page.getByText(/Preferensi tersimpan. Notifikasi terjadwal/)).toBeVisible();
  await page.getByRole('button', { name: 'Selesai', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Pilih lokasi kota' })).toContainText('Makassar');
  await page.getByRole('button', { name: 'Pengaturan pengingat' }).click();
  await expect(page.getByRole('switch', { name: 'Subuh', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Selesai', exact: true }).click();
  expect(errors).toEqual([]);
});

test('calendar journal and profile work on mobile without horizontal overflow', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByText('Lima rukun, satu perjalanan')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: testInfo.outputPath('mobile-home.png') });
  await page.getByRole('button', { name: 'Kalender Puasa', exact: true }).click();
  await expect(page.getByText('Puasa yang akan datang', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bulan berikutnya' }).click();
  const candidate = page
    .getByRole('button', { name: /^\d+ .*Puasa (Senin|Kamis|Ayyamul Bidh|Ramadan|Asyura|Arafah)/ })
    .first();
  await candidate.click();
  await page.getByRole('button', { name: 'Rencanakan puasa' }).click();
  await expect(page.getByRole('button', { name: 'Batalkan catatan' })).toBeVisible();
  await page.getByRole('button', { name: 'Batalkan catatan' }).click();
  await expect(page.getByRole('button', { name: 'Rencanakan puasa' })).toBeVisible();
  await page.getByRole('button', { name: 'Profil dan pengaturan' }).click();
  await page.getByRole('textbox', { name: 'Nama panggilan' }).fill('Aisyah');
  await page.getByRole('button', { name: 'Simpan pengaturan' }).click();
  await page.getByRole('button', { name: 'Beranda', exact: true }).click();
  await expect(page.getByText('Assalamu’alaikum, Aisyah')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Assalamu’alaikum, Aisyah')).toBeVisible();
  await page.getByRole('button', { name: 'Buka menu' }).click();
  await page.getByRole('button', { name: 'Tersimpan', exact: true }).click();
  await expect(page.getByText('Ruang untuk panduan favoritmu')).toBeVisible();
});
