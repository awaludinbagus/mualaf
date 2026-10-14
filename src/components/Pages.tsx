import React, { useState } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bell,
  Calculator,
  Info,
  Check,
  BookOpen,
  Search,
  CalendarDays,
  Moon,
  Heart,
  Bookmark,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react-native';
import { Badge, Button, Card, Field, Icon, IconButton, SectionTitle, T, ToggleRow } from './ui';
import { colors as C, fonts as F } from '../theme';
import {
  City,
  PrayerName,
  calculateZakat,
  rupiah,
  prayersForDate,
  cityDate,
  formatTime,
  countdown,
  nextPrayer,
  hijriLabel,
  fastingForDate,
  dateKey,
  upcomingFasts,
} from '../lib/islam';
import { guides, Guide } from '../lib/guides';
import { GuideCard, prayerIcons } from './Dashboard';

export function GuidesPage({
  mobile,
  openGuide,
  completed,
  savedOnly = false,
  saved,
}: {
  mobile: boolean;
  openGuide: (g: Guide) => void;
  completed: string[];
  savedOnly?: boolean;
  saved: string[];
}) {
  const [query, setQuery] = useState('');
  const filtered = guides.filter(
    (g) =>
      (!savedOnly || saved.includes(g.id)) &&
      `${g.title} ${g.subtitle} ${g.intro}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <View style={{ gap: 24 }}>
      {!savedOnly && (
        <Card
          style={{ backgroundColor: '#EAF0E3', borderColor: '#DEE7D6', padding: mobile ? 22 : 30 }}
        >
          <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: '#DFE8D4',
                width: 61,
                height: 61,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon={BookOpen} size={29} />
            </View>
            <View style={{ flex: 1 }}>
              <Badge>PANDUAN UNTUK SETIAP LANGKAH</Badge>
              <T style={{ fontFamily: F.serif, fontSize: 24, lineHeight: 34, marginTop: 10 }}>
                Belajar perlahan, tumbuh dalam iman.
              </T>
              <T style={{ color: '#7E8E70', fontSize: 12, marginTop: 7 }}>
                Mulai dari dasar. Baca, pahami, lalu praktikkan dengan hati yang tulus.
              </T>
            </View>
          </View>
          <View style={{ marginTop: 25, flexDirection: 'row', gap: 15, alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                height: 5,
                borderRadius: 5,
                backgroundColor: '#D7E2CE',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${(completed.length / 5) * 100}%`,
                  height: 5,
                  backgroundColor: C.green,
                  borderRadius: 5,
                }}
              />
            </View>
            <T style={{ fontSize: 10, color: C.green, fontFamily: F.semibold }}>
              {completed.length} dari 5 panduan dibaca
            </T>
          </View>
        </Card>
      )}
      <View
        style={{
          flexDirection: mobile ? 'column' : 'row',
          alignItems: mobile ? 'stretch' : 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <T style={{ fontFamily: F.bold, fontSize: 18 }}>
          {savedOnly ? 'Panduan yang kamu simpan' : 'Kenali lima rukun Islam'}
        </T>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 13,
            borderWidth: 1,
            borderColor: C.line,
            backgroundColor: '#FFF',
            borderRadius: 9,
            width: mobile ? '100%' : 260,
          }}
        >
          <Icon icon={Search} size={16} color={C.muted} />
          <TextInput
            accessibilityLabel="Cari panduan"
            placeholder="Cari panduan..."
            placeholderTextColor="#99A292"
            value={query}
            onChangeText={setQuery}
            style={
              {
                flex: 1,
                paddingVertical: 12,
                fontFamily: F.regular,
                fontSize: 12,
                color: C.ink,
                outlineWidth: 0,
              } as any
            }
          />
        </View>
      </View>
      {filtered.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
          {filtered.map((g) => (
            <View
              key={g.id}
              style={{
                width: mobile ? '100%' : '31.8%',
                flexGrow: 1,
                maxWidth: mobile ? undefined : '49%',
              }}
            >
              <GuideCard
                guide={g}
                index={guides.indexOf(g)}
                onPress={() => openGuide(g)}
                completed={completed.includes(g.id)}
              />
            </View>
          ))}
        </View>
      ) : (
        <Card style={{ alignItems: 'center', padding: 48 }}>
          <Icon icon={savedOnly ? Bookmark : Search} size={36} color="#93A78A" />
          <T style={{ fontFamily: F.bold, fontSize: 17, marginTop: 20 }}>
            {query ? 'Panduan belum ditemukan' : 'Ruang untuk panduan favoritmu'}
          </T>
          <T style={{ color: C.muted, textAlign: 'center', marginTop: 8 }}>
            {query
              ? 'Coba kata kunci lain, seperti “salat” atau “puasa”.'
              : 'Buka sebuah panduan lalu ketuk Simpan panduan agar mudah dibaca kembali.'}
          </T>
        </Card>
      )}
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
          padding: 17,
          backgroundColor: '#F0F3EC',
          borderRadius: 10,
        }}
      >
        <Icon icon={Info} size={17} color="#8B997E" />
        <T style={{ flex: 1, fontSize: 11, color: '#88967A', lineHeight: 20 }}>
          Panduan ini adalah pengantar, bukan pengganti bimbingan ustaz atau guru. Perbedaan rincian
          praktik antarmazhab perlu disikapi dengan saling menghormati.
        </T>
      </View>
    </View>
  );
}
export function PrayerPage({
  city,
  now,
  mobile,
  openCity,
  openReminders,
  reminders,
  openGuide,
}: {
  city: City;
  now: Date;
  mobile: boolean;
  openCity: () => void;
  openReminders: () => void;
  reminders: PrayerName[];
  openGuide: (g: Guide) => void;
}) {
  const [offset, setOffset] = useState(0);
  const date = cityDate(now, city);
  date.setDate(date.getDate() + offset);
  const prayers = prayersForDate(date, city);
  const next = nextPrayer(now, city);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(date);
    d.setDate(d.getDate() + i);
    return { date: d, prayers: prayersForDate(d, city) };
  });
  return (
    <View style={{ gap: 23 }}>
      <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 20 }}>
        <Card style={{ flex: 1, backgroundColor: C.dark, borderColor: C.dark, padding: 28 }}>
          <T style={{ color: '#BDCCB7', fontSize: 11 }}>
            SALAT BERIKUTNYA • {city.name.toUpperCase()}
          </T>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <View>
              <T style={{ fontFamily: F.serif, fontSize: 30, lineHeight: 42, color: '#FFF' }}>
                {next.name}
              </T>
              <T style={{ color: '#D2DBC6', fontFamily: F.medium, marginTop: 4 }}>
                {formatTime(next.time, city)} {city.zone}
              </T>
            </View>
            <Icon
              icon={prayerIcons[['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'].indexOf(next.name)]}
              size={48}
              color="#B8C89C"
            />
          </View>
          <View style={{ height: 1, backgroundColor: '#416150', marginVertical: 22 }} />
          <T
            style={{
              color: '#E4EACF',
              fontSize: 32,
              lineHeight: 43,
              letterSpacing: 3,
              fontFamily: F.medium,
              fontVariant: ['tabular-nums'],
            }}
          >
            {countdown(next.time, now)}
          </T>
          <T style={{ color: '#A9BFA6', fontSize: 11, marginTop: 5 }}>
            Waktu tersisa menuju {next.name.toLowerCase()}
          </T>
        </Card>
        <Card style={{ flex: 1, justifyContent: 'center', gap: 15 }}>
          <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
            <View style={{ padding: 12, backgroundColor: C.soft, borderRadius: 13 }}>
              <Icon icon={Bell} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <T style={{ fontSize: 16, fontFamily: F.bold }}>Jangan lewatkan panggilan-Nya</T>
              <T style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                {reminders.length} dari 5 pengingat salat dipilih
              </T>
            </View>
          </View>
          <T style={{ color: C.muted, fontSize: 12 }}>
            Atur pengingat untuk membantu menjaga salat di awal waktu. Notifikasi terjadwal tersedia
            pada aplikasi seluler.
          </T>
          <Button onPress={openReminders} variant="secondary" icon={Bell}>
            Atur pengingat salat
          </Button>
        </Card>
      </View>
      <Card>
        <View
          style={{
            flexDirection: mobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: 15,
            marginBottom: 25,
          }}
        >
          <View>
            <T style={{ fontFamily: F.bold, fontSize: 17 }}>Jadwal salat harian</T>
            <Pressable
              onPress={openCity}
              accessibilityRole="button"
              style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 7 }}
            >
              <Icon icon={MapPin} size={13} />
              <T style={{ fontSize: 11, color: C.green }}>
                {city.name}, {city.region} · {city.zone}
              </T>
              <Icon icon={ChevronRight} size={12} />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconButton
              icon={ChevronLeft}
              label="Hari sebelumnya"
              onPress={() => setOffset(offset - 1)}
            />
            <View style={{ alignItems: 'center', minWidth: 175 }}>
              <T style={{ fontSize: 12, fontFamily: F.semibold }}>
                {date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </T>
              <T style={{ fontSize: 10, color: C.muted }}>{hijriLabel(date)}</T>
            </View>
            <IconButton
              icon={ChevronRight}
              label="Hari berikutnya"
              onPress={() => setOffset(offset + 1)}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 11, flexWrap: 'wrap' }}>
          {prayers.map((p, i) => (
            <View
              key={p.name}
              style={{
                flex: 1,
                minWidth: mobile ? 86 : 110,
                alignItems: 'center',
                paddingVertical: 24,
                paddingHorizontal: 10,
                backgroundColor: offset === 0 && next.name === p.name ? '#EAF2E6' : '#F8FAF5',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#EAF0E3',
              }}
            >
              <Icon
                icon={prayerIcons[i]}
                size={25}
                color={offset === 0 && next.name === p.name ? C.green : '#96A58A'}
              />
              <T style={{ marginTop: 14, fontSize: 12, color: '#7D8C71' }}>{p.name}</T>
              <T style={{ fontFamily: F.bold, fontSize: 22, lineHeight: 32, marginTop: 7 }}>
                {formatTime(p.time, city)}
              </T>
              <T style={{ fontSize: 9, color: C.muted }}>{city.zone}</T>
            </View>
          ))}
        </View>
        {offset !== 0 && (
          <View style={{ alignSelf: 'center', marginTop: 16 }}>
            <Button variant="ghost" small onPress={() => setOffset(0)} icon={RotateCcw}>
              Kembali ke hari ini
            </Button>
          </View>
        )}
      </Card>
      <Card>
        <SectionTitle
          title="Tujuh hari ke depan"
          caption="Rencanakan aktivitasmu tanpa melewatkan waktu ibadah."
        />
        <ScrollView horizontal>
          <View style={{ minWidth: mobile ? 570 : 650, flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                padding: 12,
                backgroundColor: '#F4F7EF',
                borderRadius: 7,
              }}
            >
              <T style={{ width: 170, fontFamily: F.semibold, fontSize: 11 }}>Tanggal</T>
              {['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'].map((n) => (
                <T
                  key={n}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    minWidth: 80,
                    fontSize: 11,
                    fontFamily: F.semibold,
                  }}
                >
                  {n}
                </T>
              ))}
            </View>
            {week.map((row) => (
              <View
                key={dateKey(row.date)}
                style={{
                  flexDirection: 'row',
                  padding: 13,
                  borderBottomWidth: 1,
                  borderBottomColor: C.line,
                }}
              >
                <T style={{ width: 170, fontSize: 11, color: C.muted }}>
                  {row.date.toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </T>
                {row.prayers.map((p) => (
                  <T
                    key={p.name}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      textAlign: 'center',
                      fontSize: 11,
                      fontFamily: F.medium,
                    }}
                  >
                    {formatTime(p.time, city)}
                  </T>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <T style={{ fontSize: 10, color: C.muted, lineHeight: 18, marginTop: 17 }}>
          Estimasi astronomis menggunakan Adhan: Subuh −20°, Isya −18°, Asar mazhab Syafi’i. Dapat
          berbeda beberapa menit dari jadwal resmi. Utamakan jadwal Kemenag atau masjid setempat.
        </T>
      </Card>
      <Button variant="secondary" icon={BookOpen} onPress={() => openGuide(guides[1])}>
        Pelajari panduan bersuci dan salat
      </Button>
    </View>
  );
}
export function ZakatPage({
  mobile,
  openGuide,
}: {
  mobile: boolean;
  openGuide: (g: Guide) => void;
}) {
  const [mode, setMode] = useState<'maal' | 'penghasilan' | 'fitrah'>('maal');
  const [amount, setAmount] = useState('');
  const [debt, setDebt] = useState('');
  const [gold, setGold] = useState('1500000');
  const [people, setPeople] = useState('1');
  const [rice, setRice] = useState('15000');
  const [haul, setHaul] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState('');
  const result = calculateZakat(
    mode,
    Number(amount),
    Number(debt),
    Number(gold),
    Number(people),
    Number(rice),
    haul,
  );
  const change = (setter: (s: string) => void) => (s: string) => {
    setter(s);
    setCalculated(false);
    setError('');
  };
  function calculate() {
    if (
      mode === 'fitrah' ? Number(people) < 1 || Number(rice) <= 0 : !amount || Number(gold) <= 0
    ) {
      setError('Lengkapi nilai perhitungan dengan angka yang valid terlebih dahulu.');
      return;
    }
    setError('');
    setCalculated(true);
  }
  return (
    <View style={{ gap: 23 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          backgroundColor: '#EDF3E8',
          borderWidth: 1,
          borderColor: '#E2EBDD',
          borderRadius: 12,
          padding: 19,
        }}
      >
        <Icon icon={Heart} size={20} />
        <T style={{ flex: 1, fontSize: 12, color: '#6D805F', lineHeight: 22 }}>
          “Ambillah zakat dari harta mereka, guna membersihkan dan menyucikan mereka...”{' '}
          <T style={{ fontFamily: F.semibold, fontSize: 11, color: '#7D916A' }}>
            — QS. At-Taubah : 103
          </T>
        </T>
      </View>
      <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 23, alignItems: 'flex-start' }}>
        <Card style={{ flex: 1.15, width: mobile ? '100%' : undefined }}>
          <T style={{ fontFamily: F.bold, fontSize: 17, marginBottom: 20 }}>Hitung zakatmu</T>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F2F5EE',
              borderRadius: 10,
              padding: 4,
              marginBottom: 25,
            }}
          >
            {(
              [
                { id: 'maal', title: 'Zakat Maal' },
                { id: 'penghasilan', title: 'Penghasilan' },
                { id: 'fitrah', title: 'Zakat Fitrah' },
              ] as const
            ).map((t) => (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === t.id }}
                key={t.id}
                onPress={() => {
                  setMode(t.id);
                  setCalculated(false);
                  setError('');
                }}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 11,
                  backgroundColor: mode === t.id ? '#FFF' : 'transparent',
                  borderRadius: 7,
                  borderWidth: 1,
                  borderColor: mode === t.id ? '#E2E8DC' : 'transparent',
                }}
              >
                <T
                  style={{
                    fontSize: 10,
                    fontFamily: mode === t.id ? F.bold : F.medium,
                    color: mode === t.id ? C.green : C.muted,
                  }}
                >
                  {t.title}
                </T>
              </Pressable>
            ))}
          </View>
          {mode === 'fitrah' ? (
            <>
              <Field
                label="Jumlah orang yang dizakati"
                value={people}
                onChange={change(setPeople)}
                prefix="Orang"
              />
              <Field
                label="Harga beras per kilogram"
                value={rice}
                onChange={change(setRice)}
                hint="Isi harga beras yang biasa dikonsumsi. Nilai awal hanya contoh."
              />
              <View style={{ backgroundColor: '#F6F7F1', padding: 16, borderRadius: 9 }}>
                <T style={{ fontSize: 11, color: '#829073' }}>
                  Dasar perhitungan: 2,5 kg beras per orang (atau 3,5 liter makanan pokok). Untuk
                  pembayaran uang, ikuti nominal yang ditetapkan lembaga zakat setempat.
                </T>
              </View>
            </>
          ) : (
            <>
              <Field
                label={
                  mode === 'maal'
                    ? 'Total harta simpanan yang wajib dizakati'
                    : 'Total penghasilan bruto per bulan'
                }
                value={amount}
                onChange={change(setAmount)}
                hint={
                  mode === 'maal'
                    ? 'Jumlahkan uang tunai, tabungan, emas, dan simpanan sejenis.'
                    : 'Gaji, honor, dan pendapatan rutin lainnya.'
                }
              />
              {mode === 'maal' && (
                <Field
                  label="Utang jatuh tempo yang dapat dikurangkan"
                  value={debt}
                  onChange={change(setDebt)}
                  hint="Pengurangan utang dapat berbeda menurut pendapat fikih. Konsultasikan kondisi Anda."
                />
              )}
              <Field
                label="Harga emas per gram"
                value={gold}
                onChange={change(setGold)}
                hint="Nilai awal Rp1.500.000 hanya contoh, bukan harga terkini. Ubah sesuai rujukan lembaga zakat."
              />
              {mode === 'maal' && (
                <ToggleRow
                  title="Sudah mencapai haul"
                  subtitle="Harta dimiliki selama satu tahun Hijriah."
                  value={haul}
                  onChange={(v) => {
                    setHaul(v);
                    setCalculated(false);
                  }}
                />
              )}
              {mode === 'penghasilan' && (
                <T style={{ fontSize: 10, color: C.muted }}>
                  Estimasi nisab bulanan = 85 gram emas ÷ 12. Ketetapan nominal BAZNAS terbaru dapat
                  berbeda; cocokkan sebelum membayar.
                </T>
              )}
            </>
          )}
          {!!error && (
            <T accessibilityRole="alert" style={{ color: '#AD634A', fontSize: 11, marginTop: 15 }}>
              {error}
            </T>
          )}
          <View style={{ marginTop: 25 }}>
            <Button onPress={calculate} icon={Calculator}>
              Hitung zakat sekarang
            </Button>
          </View>
        </Card>
        <View style={{ flex: 1, width: mobile ? '100%' : undefined, gap: 18 }}>
          <Card style={{ backgroundColor: '#234F3F', borderColor: '#234F3F', padding: 27 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <Icon icon={ShieldCheck} color="#B8CCAB" size={20} />
              <T style={{ fontSize: 14, color: '#F1F4E9', fontFamily: F.semibold }}>
                Ringkasan perhitungan
              </T>
            </View>
            <T style={{ color: '#B6C9AE', fontSize: 11, marginTop: 29 }}>
              {calculated ? 'Estimasi zakat yang ditunaikan' : 'Kebaikan dimulai dari niat'}
            </T>
            <T
              style={{
                fontSize: 34,
                lineHeight: 48,
                color: '#F6F6E9',
                fontFamily: F.semibold,
                marginTop: 8,
              }}
            >
              {calculated ? rupiah(result.total) : 'Rp —'}
            </T>
            <T style={{ color: '#9FB997', fontSize: 10, marginTop: 7 }}>
              {calculated
                ? mode === 'fitrah'
                  ? `Setara ${Number(people) * 2.5} kg beras untuk ${people} orang`
                  : result.eligible
                    ? '2,5% dari harta / penghasilan yang memenuhi syarat'
                    : mode === 'maal' && !haul
                      ? 'Syarat haul belum terpenuhi'
                      : 'Belum mencapai nisab berdasarkan nilai yang diisi'
                : 'Lengkapi data di samping untuk melihat estimasi zakatmu.'}
            </T>
            <View style={{ height: 1, backgroundColor: '#456A50', marginVertical: 25 }} />
            {mode !== 'fitrah' && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                  <T style={{ color: '#B6C9AE', fontSize: 11 }}>
                    Nisab {mode === 'maal' ? 'tahunan' : 'bulanan'}
                  </T>
                  <T style={{ color: '#E1E8D3', fontSize: 12, fontFamily: F.semibold }}>
                    {rupiah(result.nisab)}
                  </T>
                </View>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}
                >
                  <T style={{ color: '#B6C9AE', fontSize: 11 }}>Kadar zakat</T>
                  <T style={{ color: '#E1E8D3', fontSize: 12, fontFamily: F.semibold }}>2,5%</T>
                </View>
              </>
            )}
            {mode === 'fitrah' && (
              <T style={{ color: '#B6C9AE', fontSize: 11 }}>
                Jumlah orang × 2,5 kg × harga beras per kg
              </T>
            )}
          </Card>
          <Card style={{ padding: 21 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <Icon icon={Info} size={17} color="#96A17C" />
              <T style={{ fontFamily: F.semibold, fontSize: 12 }}>Penting untuk diketahui</T>
            </View>
            <T style={{ fontSize: 11, color: C.muted, lineHeight: 21 }}>
              Perhitungan ini adalah estimasi untuk simpanan sederhana, bukan fatwa atau layanan
              pembayaran. Jenis harta lain, perbedaan mazhab, serta kondisi khusus perlu
              dikonsultasikan kepada amil tepercaya.
            </T>
            <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
              <Button variant="ghost" small onPress={() => openGuide(guides[2])} icon={ArrowRight}>
                Pelajari panduan zakat
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </View>
  );
}
export function FastingPage({
  mobile,
  now,
  city,
  journal,
  toggleJournal,
  openReminders,
  fastingReminder,
  openGuide,
}: {
  mobile: boolean;
  now: Date;
  city: City;
  journal: string[];
  toggleJournal: (key: string) => void;
  openReminders: () => void;
  fastingReminder: boolean;
  openGuide: (g: Guide) => void;
}) {
  const today = cityDate(now, city);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1, 12));
  const [selected, setSelected] = useState(today);
  const firstDay = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const fast = fastingForDate(selected);
  const upcoming = upcomingFasts(today, 3);
  const passed = dateKey(selected) <= dateKey(today);
  function moveMonth(n: number) {
    const d = new Date(month.getFullYear(), month.getMonth() + n, 1, 12);
    setMonth(d);
    setSelected(d);
  }
  return (
    <View style={{ gap: 23 }}>
      <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 23, alignItems: 'flex-start' }}>
        <Card style={{ flex: 1.4, width: mobile ? '100%' : undefined, padding: mobile ? 18 : 26 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 23,
            }}
          >
            <View>
              <T style={{ fontSize: 19, fontFamily: F.bold, textTransform: 'capitalize' }}>
                {month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </T>
              <T style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                Temukan hari untuk menambah kebaikan.
              </T>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <IconButton
                icon={ChevronLeft}
                label="Bulan sebelumnya"
                onPress={() => moveMonth(-1)}
              />
              <IconButton
                icon={ChevronRight}
                label="Bulan berikutnya"
                onPress={() => moveMonth(1)}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((n) => (
              <T
                key={n}
                style={{
                  width: '14.2857%',
                  textAlign: 'center',
                  fontSize: 10,
                  fontFamily: F.semibold,
                  color: C.muted,
                  paddingBottom: 15,
                }}
              >
                {n}
              </T>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from({ length: firstDay }, (_, i) => (
              <View key={`b${i}`} style={{ width: '14.2857%', height: mobile ? 54 : 66 }} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const date = new Date(month.getFullYear(), month.getMonth(), i + 1, 12);
              const key = dateKey(date);
              const f = fastingForDate(date);
              const active = key === dateKey(selected);
              const isToday = key === dateKey(today);
              const done = journal.includes(key);
              return (
                <View key={key} style={{ width: '14.2857%', padding: 3 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${i + 1} ${month.toLocaleDateString('id-ID', { month: 'long' })}, ${f.name}${done ? ', tercatat berpuasa' : ''}`}
                    onPress={() => setSelected(date)}
                    style={{
                      height: mobile ? 49 : 60,
                      borderRadius: 9,
                      backgroundColor: active
                        ? C.green
                        : f.kind === 'sunnah' || f.kind === 'ramadan'
                          ? '#EDF3E7'
                          : '#FAFBF8',
                      borderWidth: 1,
                      borderColor: isToday ? C.green : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}
                  >
                    <T
                      style={{
                        fontSize: 13,
                        color: active ? '#FFF' : f.kind === 'forbidden' ? '#B18169' : C.ink,
                        fontFamily: isToday || active ? F.bold : F.medium,
                      }}
                    >
                      {i + 1}
                    </T>
                    {done ? (
                      <Icon icon={Check} size={9} color={active ? '#D6E5BF' : C.green} />
                    ) : (
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor:
                            f.kind === 'sunnah'
                              ? active
                                ? '#D6E5BF'
                                : '#829B64'
                              : f.kind === 'ramadan'
                                ? '#BD9D5F'
                                : f.kind === 'forbidden'
                                  ? '#C99379'
                                  : 'transparent',
                        }}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 15,
              flexWrap: 'wrap',
              paddingTop: 19,
              marginTop: 15,
              borderTopWidth: 1,
              borderTopColor: C.line,
            }}
          >
            {[
              { name: 'Puasa sunah', color: '#829B64' },
              { name: 'Ramadan', color: '#BD9D5F' },
              { name: 'Dilarang puasa', color: '#C99379' },
            ].map((l) => (
              <View key={l.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ height: 6, width: 6, borderRadius: 4, backgroundColor: l.color }} />
                <T style={{ fontSize: 9, color: C.muted }}>{l.name}</T>
              </View>
            ))}
          </View>
          <View style={{ alignSelf: 'center', marginTop: 12 }}>
            <Button
              variant="ghost"
              small
              onPress={() => {
                setSelected(today);
                setMonth(new Date(today.getFullYear(), today.getMonth(), 1, 12));
              }}
            >
              Kembali ke hari ini
            </Button>
          </View>
        </Card>
        <View style={{ flex: 1, width: mobile ? '100%' : undefined, gap: 18 }}>
          <Card style={{ backgroundColor: '#EEF3E8', borderColor: '#E1E9D9' }}>
            <Badge>{selected.toLocaleDateString('id-ID', { weekday: 'long' }).toUpperCase()}</Badge>
            <T style={{ fontSize: 22, fontFamily: F.serif, lineHeight: 33, marginTop: 16 }}>
              {selected.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </T>
            <T style={{ color: '#8C9B7B', fontSize: 11, marginTop: 4 }}>
              {hijriLabel(selected)} · perkiraan
            </T>
            <View style={{ height: 1, backgroundColor: '#DDE6D1', marginVertical: 20 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon icon={Moon} size={19} />
              <T style={{ fontFamily: F.bold, fontSize: 14 }}>{fast.name}</T>
            </View>
            <T style={{ color: '#819172', fontSize: 12, marginTop: 10, lineHeight: 22 }}>
              {fast.description}
            </T>
            {fast.kind !== 'forbidden' && (
              <View style={{ marginTop: 21 }}>
                <Button
                  icon={journal.includes(dateKey(selected)) ? Check : CalendarDays}
                  variant={journal.includes(dateKey(selected)) ? 'secondary' : 'primary'}
                  onPress={() => toggleJournal(dateKey(selected))}
                >
                  {journal.includes(dateKey(selected))
                    ? 'Batalkan catatan'
                    : passed
                      ? 'Catat saya berpuasa'
                      : 'Rencanakan puasa'}
                </Button>
                <T style={{ color: '#96A487', fontSize: 9, textAlign: 'center', marginTop: 8 }}>
                  Catatan pribadi, tersimpan di perangkat ini.
                </T>
              </View>
            )}
          </Card>
          <Card style={{ padding: 21 }}>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Icon icon={Bell} size={20} />
              <T style={{ fontFamily: F.bold, fontSize: 13 }}>Persiapkan sahurmu</T>
            </View>
            <T style={{ color: C.muted, fontSize: 11, marginVertical: 12 }}>
              {fastingReminder
                ? 'Preferensi pengingat puasa sudah tersimpan.'
                : 'Atur pengingat satu jam sebelum Subuh pada hari puasa yang akan datang.'}
            </T>
            <Button variant="secondary" small onPress={openReminders}>
              Atur pengingat puasa
            </Button>
          </Card>
        </View>
      </View>
      <Card>
        <SectionTitle
          title="Puasa yang akan datang"
          action="Panduan puasa"
          onPress={() => openGuide(guides[3])}
        />
        <View style={{ gap: 6 }}>
          {upcoming.map((item) => (
            <Pressable
              key={dateKey(item.date)}
              accessibilityRole="button"
              onPress={() => {
                setSelected(item.date);
                setMonth(new Date(item.date.getFullYear(), item.date.getMonth(), 1, 12));
              }}
              style={{
                flexDirection: 'row',
                gap: 15,
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: C.line,
                paddingVertical: 14,
              }}
            >
              <View style={{ padding: 10, backgroundColor: C.soft, borderRadius: 9 }}>
                <Icon icon={Moon} size={17} />
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontSize: 12, fontFamily: F.semibold }}>{item.name}</T>
                <T style={{ fontSize: 10, color: C.muted }}>
                  {item.date.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  · {hijriLabel(item.date)}
                </T>
              </View>
              <Icon icon={ChevronRight} size={15} color={C.muted} />
            </Pressable>
          ))}
        </View>
      </Card>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
        <Icon icon={Info} size={17} color="#95A082" />
        <T style={{ flex: 1, color: '#8C987F', fontSize: 11, lineHeight: 20 }}>
          Kalender Hijriah menggunakan perhitungan tabular (islamic-civil) dan bisa berbeda 1–2 hari
          dari rukyat. Awal Ramadan, Syawal, dan Zulhijah wajib disesuaikan dengan penetapan
          pemerintah atau otoritas setempat.
        </T>
      </View>
    </View>
  );
}
