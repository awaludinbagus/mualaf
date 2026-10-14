import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Platform,
  Linking,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { Lora_500Medium } from '@expo-google-fonts/lora/500Medium';
import { Lora_500Medium_Italic } from '@expo-google-fonts/lora/500Medium_Italic';
import {
  House,
  BookOpen,
  CalendarDays,
  Calculator,
  Bookmark,
  Settings,
  CircleHelp,
  ChevronRight,
  ChevronDown,
  MapPin,
  Bell,
  Sun,
  ArrowUpRight,
  Check,
  X,
  Search,
  ExternalLink,
  Sparkles,
  Leaf,
  Clock3,
} from 'lucide-react-native';
import { colors as C, fonts as F } from './src/theme';
import { T, Button, Card, Icon, IconButton, Dialog, ToggleRow } from './src/components/ui';
import { BrandMark } from './src/components/illustrations';
import Dashboard from './src/components/Dashboard';
import { GuidesPage, PrayerPage, ZakatPage, FastingPage } from './src/components/Pages';
import {
  cities,
  City,
  prayerNames,
  PrayerName,
  cityDate,
  hijriLabel,
  prayersForDate,
  dateKey,
  fastingForDate,
} from './src/lib/islam';
import { Guide, guides } from './src/lib/guides';
import { syncReminders } from './src/lib/notifications';

const NAV = [
  { name: 'Beranda', icon: House, short: 'Beranda' },
  { name: 'Panduan Islam', icon: BookOpen, short: 'Panduan' },
  { name: 'Jadwal Salat', icon: Clock3, short: 'Salat' },
  { name: 'Kalkulator Zakat', icon: Calculator, short: 'Zakat' },
  { name: 'Kalender Puasa', icon: CalendarDays, short: 'Puasa' },
];
const STORAGE_KEY = 'teman-iman:preferences:v1';
const pageCopy: Record<string, { title: string; description: string }> = {
  'Panduan Islam': {
    title: 'Kenali, pahami, amalkan.',
    description: 'Panduan sederhana untuk mendampingi perjalanan imanmu.',
  },
  'Jadwal Salat': {
    title: 'Ada waktu untuk mendekat.',
    description: 'Jaga lima waktu, hadirkan ketenangan di setiap harimu.',
  },
  'Kalkulator Zakat': {
    title: 'Berbagi, menyucikan hati.',
    description: 'Hitung kewajiban zakatmu dengan mudah dan transparan.',
  },
  'Kalender Puasa': {
    title: 'Latih diri, lapangkan hati.',
    description: 'Rencanakan puasa dan rawat niat baikmu, hari demi hari.',
  },
  Tersimpan: {
    title: 'Kebaikan untuk dibaca kembali.',
    description: 'Semua panduan favoritmu, dalam satu tempat.',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <TemanIman />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TemanIman() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1080;
  const mobile = width < 720;
  const wide = width >= 1200;
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Lora_500Medium,
    Lora_500Medium_Italic,
  });
  const [page, setPage] = useState('Beranda');
  const [city, setCity] = useState(cities[0]);
  const [name, setName] = useState('Sahabat');
  const [saved, setSaved] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [journal, setJournal] = useState<string[]>([]);
  const [reminders, setReminders] = useState<PrayerName[]>([]);
  const [fastingReminder, setFastingReminder] = useState(false);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(new Date());
  const [guide, setGuide] = useState<Guide | null>(null);
  const [modal, setModal] = useState<'city' | 'reminders' | 'settings' | 'help' | 'menu' | null>(
    null,
  );
  const [cityQuery, setCityQuery] = useState('');
  const [toast, setToast] = useState('');
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [reminderStatus, setReminderStatus] = useState('');
  const [draftName, setDraftName] = useState('Sahabat');
  const scroller = useRef<ScrollView>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNotification = useRef('');
  function notify(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 7000);
  }
  function navigate(next: string) {
    setPage(next);
    setModal(null);
    scroller.current?.scrollTo({ y: 0, animated: false });
  }
  function openSettings() {
    setDraftName(name);
    setModal('settings');
  }
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'Teman Iman — Selangkah lebih dekat';
      document.documentElement.lang = 'id';
      const style = document.createElement('style');
      style.textContent =
        'html,body,#root{height:100%;margin:0;background:#F7F9F5}*{box-sizing:border-box}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:#d7dfd0;border-radius:8px}::-webkit-scrollbar-track{background:transparent}input:focus{outline:none}button:focus-visible,[role="button"]:focus-visible{outline:2px solid #88a978;outline-offset:3px}::selection{background:#d6e5ca}';
      document.head.appendChild(style);
      return () => {
        style.remove();
      };
    }
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(timer);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(async (raw) => {
        if (raw) {
          const data = JSON.parse(raw);
          const validIds = (values: unknown) =>
            Array.isArray(values)
              ? values.filter(
                  (v): v is string => typeof v === 'string' && guides.some((g) => g.id === v),
                )
              : [];
          const chosen = cities.find((c) => c.name === data.city) || cities[0];
          const chosenReminders = Array.isArray(data.reminders)
            ? data.reminders.filter((v: PrayerName) => prayerNames.includes(v))
            : [];
          setCity(chosen);
          setName(
            typeof data.name === 'string' && data.name.trim() ? data.name.slice(0, 30) : 'Sahabat',
          );
          setSaved(validIds(data.saved));
          setCompleted(validIds(data.completed));
          setJournal(
            Array.isArray(data.journal)
              ? data.journal.filter(
                  (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v),
                )
              : [],
          );
          setReminders(chosenReminders);
          setFastingReminder(data.fastingReminder === true);
          if (Platform.OS !== 'web' && (chosenReminders.length || data.fastingReminder === true))
            syncReminders(chosen, chosenReminders, data.fastingReminder === true)
              .then(setReminderStatus)
              .catch(() =>
                notify(
                  'Preferensi dimuat, tetapi notifikasi belum dapat diperbarui. Periksa izin perangkat.',
                ),
              );
        }
      })
      .catch(() => notify('Preferensi belum dapat dimuat. Anda tetap dapat menggunakan aplikasi.'))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          city: city.name,
          name,
          saved,
          completed,
          journal,
          reminders,
          fastingReminder,
        }),
      ).catch(() =>
        notify('Perubahan belum tersimpan. Penyimpanan perangkat mungkin penuh atau dibatasi.'),
      );
  }, [city, name, saved, completed, journal, reminders, fastingReminder, ready]);
  useEffect(() => {
    if (Platform.OS !== 'web' || !ready) return;
    const today = cityDate(now, city);
    const times = prayersForDate(today, city);
    const minute = Math.floor(now.getTime() / 60000);
    const p = times.find(
      (p) => reminders.includes(p.name) && Math.floor(p.time.getTime() / 60000) === minute,
    );
    const fast = fastingForDate(today);
    const sahur =
      fastingReminder &&
      ['sunnah', 'ramadan'].includes(fast.kind) &&
      Math.floor(times[0].time.getTime() / 60000) - 60 === minute;
    const id = p ? `${dateKey(today)}-${p.name}` : sahur ? `${dateKey(today)}-sahur` : '';
    if (id && lastNotification.current !== id) {
      lastNotification.current = id;
      notify(
        p
          ? `Waktunya salat ${p.name} untuk wilayah ${city.name}.`
          : `Persiapan ${fast.name.toLowerCase()}. Subuh sekitar satu jam lagi.`,
      );
    }
  }, [now, reminders, fastingReminder, city, ready]);
  useEffect(() => {
    if (Platform.OS === 'web' || !ready) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && (reminders.length || fastingReminder))
        syncReminders(city, reminders, fastingReminder)
          .then(setReminderStatus)
          .catch(() => notify('Pengingat belum diperbarui. Periksa izin notifikasi.'));
    });
    return () => sub.remove();
  }, [city, reminders, fastingReminder, ready]);
  async function changeReminder(next: PrayerName[], fast: boolean) {
    setNotificationBusy(true);
    try {
      const message = await syncReminders(city, next, fast);
      setReminders(next);
      setFastingReminder(fast);
      setReminderStatus(message);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Pengingat belum dapat diaktifkan.');
    } finally {
      setNotificationBusy(false);
    }
  }
  async function selectCity(next: City) {
    if (notificationBusy) return;
    setNotificationBusy(true);
    try {
      if (reminders.length || fastingReminder) {
        const message = await syncReminders(next, reminders, fastingReminder);
        setReminderStatus(message);
      }
      setCity(next);
      setModal(null);
      setCityQuery('');
      notify(`Lokasi diperbarui ke ${next.name}. Jadwal salat telah disesuaikan.`);
    } catch {
      notify('Lokasi belum diubah karena pengingat tidak dapat diperbarui. Coba kembali.');
    } finally {
      setNotificationBusy(false);
    }
  }
  function toggleSaved(id: string) {
    setSaved((old) => (old.includes(id) ? old.filter((v) => v !== id) : [...old, id]));
  }
  const date = cityDate(now, city);
  const openReminders = () => setModal('reminders');
  const openCity = () => {
    setCityQuery('');
    setModal('city');
  };
  const navButton = (item: (typeof NAV)[number]) => (
    <Pressable
      key={item.name}
      accessibilityRole="button"
      accessibilityState={{ selected: page === item.name }}
      onPress={() => navigate(item.name)}
      style={({ hovered }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 9,
        marginBottom: 5,
        backgroundColor: page === item.name ? '#EAF1E7' : hovered ? '#F5F7F0' : 'transparent',
      })}
    >
      <Icon icon={item.icon} size={18} color={page === item.name ? C.green : '#909B86'} />
      <T
        style={{
          flex: 1,
          fontSize: 11,
          fontFamily: page === item.name ? F.bold : F.medium,
          color: page === item.name ? C.green : '#7E8976',
        }}
      >
        {item.name}
      </T>
      {page === item.name && (
        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: C.green }} />
      )}
    </Pressable>
  );
  if ((!fontsLoaded && !fontError) || !ready)
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.bg,
          gap: 22,
        }}
      >
        <BrandMark size={52} />
        <ActivityIndicator color={C.green} />
      </View>
    );
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: C.bg }}>
      <StatusBar style="dark" />
      {desktop && (
        <View
          style={{
            width: 224,
            backgroundColor: '#FEFFFB',
            borderRightWidth: 1,
            borderRightColor: C.line,
            paddingHorizontal: 19,
            paddingTop: 29,
            paddingBottom: 22,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Teman Iman, kembali ke beranda"
            onPress={() => navigate('Beranda')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 7 }}
          >
            <BrandMark size={36} />
            <View>
              <T style={{ fontFamily: F.extra, fontSize: 20, letterSpacing: -0.8, lineHeight: 27 }}>
                teman iman<T style={{ color: '#9BAE7F', fontSize: 20, fontFamily: F.extra }}>.</T>
              </T>
              <T style={{ color: '#A0AA95', fontSize: 8, lineHeight: 15, letterSpacing: 0.3 }}>
                TUMBUH BERSAMA IMAN
              </T>
            </View>
          </Pressable>
          <View style={{ marginTop: 45 }}>
            <T
              style={{
                paddingLeft: 15,
                fontSize: 8,
                fontFamily: F.semibold,
                letterSpacing: 1.5,
                color: '#A3AC99',
                marginBottom: 16,
              }}
            >
              MENU UTAMA
            </T>
            {NAV.map((item) => navButton(item))}
          </View>
          <View
            style={{ height: 1, backgroundColor: C.line, marginVertical: 19, marginHorizontal: 12 }}
          />
          <T
            style={{
              paddingLeft: 15,
              fontSize: 8,
              fontFamily: F.semibold,
              letterSpacing: 1.5,
              color: '#A3AC99',
              marginBottom: 15,
            }}
          >
            RUANG PERSONAL
          </T>
          {navButton({ name: 'Tersimpan', icon: Bookmark, short: 'Tersimpan' })}
          <Pressable
            accessibilityRole="button"
            onPress={openSettings}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 }}
          >
            <Icon icon={Settings} size={18} color="#909B86" />
            <T style={{ color: '#7E8976', fontSize: 11, fontFamily: F.medium }}>Pengaturan</T>
          </Pressable>
          <View style={{ flex: 1, minHeight: 40 }} />
          <View
            style={{
              backgroundColor: '#F2F5EB',
              borderRadius: 12,
              padding: 17,
              marginHorizontal: 4,
              marginBottom: 19,
            }}
          >
            <View
              style={{
                width: 29,
                height: 29,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: '#E6EDD9',
                marginBottom: 12,
              }}
            >
              <Icon icon={Leaf} size={15} color="#8B9D70" />
            </View>
            <T style={{ fontFamily: F.semibold, fontSize: 11, lineHeight: 19 }}>
              Langkah kecil,{'\n'}kebaikan yang berarti.
            </T>
            <T style={{ color: '#95A185', fontSize: 9, lineHeight: 17, marginTop: 7 }}>
              Setiap niat baik adalah awal{'\n'}dari perjalanan yang indah.
            </T>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setModal('help')}
            style={{ flexDirection: 'row', gap: 9, padding: 12, alignItems: 'center' }}
          >
            <Icon icon={CircleHelp} size={16} color="#9AA78C" />
            <T style={{ color: '#8B987E', fontSize: 10 }}>Bantuan & informasi</T>
            <Icon icon={ArrowUpRight} size={12} color="#A1AE91" />
          </Pressable>
          <T style={{ color: '#B6BEAC', fontSize: 8, paddingHorizontal: 12, marginTop: 8 }}>
            TEMAN IMAN · VERSI 1.0
          </T>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View
          style={{
            height: mobile ? 70 : 77,
            backgroundColor: '#FEFFFC',
            borderBottomWidth: 1,
            borderBottomColor: C.line,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: mobile ? 19 : 33,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {!desktop && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Buka menu"
                onPress={() => setModal('menu')}
              >
                <BrandMark size={32} />
              </Pressable>
            )}
            {desktop && <Icon icon={House} size={15} color="#99A48D" />}
            {desktop && <Icon icon={ChevronRight} size={12} color="#B5BDAC" />}
            <T style={{ fontSize: 11, fontFamily: F.semibold }}>{page}</T>
          </View>
          <View style={{ flexDirection: 'row', gap: mobile ? 10 : 20, alignItems: 'center' }}>
            {!mobile && (
              <View style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }}>
                <Icon icon={Sun} color="#B4A06C" size={15} />
                <T style={{ color: '#929D87', fontSize: 10 }}>Semoga harimu penuh berkah</T>
              </View>
            )}
            <View style={{ width: 1, height: 22, backgroundColor: C.line }} />
            <IconButton
              icon={Bell}
              label="Pengaturan pengingat"
              onPress={openReminders}
              color="#75856A"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profil dan pengaturan"
              onPress={openSettings}
              style={{
                height: 33,
                width: 33,
                backgroundColor: '#E9EDDF',
                borderRadius: 18,
                borderWidth: 3,
                borderColor: '#F3F5ED',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <T style={{ color: '#71865C', fontFamily: F.semibold, fontSize: 11 }}>
                {name.slice(0, 1).toUpperCase()}
              </T>
            </Pressable>
          </View>
        </View>
        <ScrollView
          ref={scroller}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: mobile ? 20 : 33,
            paddingTop: mobile ? 26 : 30,
            paddingBottom: 35,
            maxWidth: 1320,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flexDirection: mobile ? 'column' : 'row',
              alignItems: mobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: 18,
              marginBottom: 27,
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <T
                  style={{
                    fontFamily: F.bold,
                    fontSize: mobile ? 23 : 25,
                    lineHeight: 37,
                    letterSpacing: -0.7,
                  }}
                >
                  {page === 'Beranda' ? `Assalamu’alaikum, ${name}` : pageCopy[page]?.title}
                </T>
                {page === 'Beranda' && !mobile && (
                  <Icon icon={Sparkles} size={21} color="#A4AD76" />
                )}
              </View>
              <T style={{ fontSize: 11, color: '#95A089', marginTop: 5, lineHeight: 20 }}>
                {page === 'Beranda'
                  ? 'Mari jadikan hari ini lebih bermakna dengan ibadah.'
                  : pageCopy[page]?.description}
              </T>
            </View>
            <View style={{ alignItems: mobile ? 'flex-start' : 'flex-end', gap: 8 }}>
              <T style={{ fontSize: 10, color: '#80906F', fontFamily: F.medium }}>
                {hijriLabel(date)} <T style={{ fontSize: 9, color: '#B1B9A5' }}> / </T>{' '}
                {date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </T>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pilih lokasi kota"
                onPress={openCity}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderWidth: 1,
                  borderColor: '#E5EADD',
                  borderRadius: 7,
                  paddingVertical: 6,
                  paddingHorizontal: 9,
                  backgroundColor: '#FEFFFC',
                }}
              >
                <Icon icon={MapPin} size={12} color="#8F9D7C" />
                <T style={{ fontSize: 9, color: '#7E8C6E', fontFamily: F.medium }}>
                  {city.name}, Indonesia
                </T>
                <Icon icon={ChevronDown} size={11} color="#8F9D7C" />
              </Pressable>
            </View>
          </View>
          {page === 'Beranda' && (
            <Dashboard
              now={now}
              city={city}
              wide={wide}
              mobile={mobile}
              navigate={navigate}
              openGuide={setGuide}
              openReminders={openReminders}
              reminders={reminders}
              completed={completed}
              fastingReminder={fastingReminder}
            />
          )}
          {(page === 'Panduan Islam' || page === 'Tersimpan') && (
            <GuidesPage
              key={page}
              mobile={mobile}
              openGuide={setGuide}
              completed={completed}
              saved={saved}
              savedOnly={page === 'Tersimpan'}
            />
          )}
          {page === 'Jadwal Salat' && (
            <PrayerPage
              city={city}
              now={now}
              mobile={mobile}
              openCity={openCity}
              openReminders={openReminders}
              reminders={reminders}
              openGuide={setGuide}
            />
          )}
          {page === 'Kalkulator Zakat' && <ZakatPage mobile={mobile} openGuide={setGuide} />}
          {page === 'Kalender Puasa' && (
            <FastingPage
              now={now}
              city={city}
              mobile={mobile}
              journal={journal}
              toggleJournal={(key) =>
                setJournal((old) =>
                  old.includes(key) ? old.filter((k) => k !== key) : [...old, key],
                )
              }
              openReminders={openReminders}
              fastingReminder={fastingReminder}
              openGuide={setGuide}
            />
          )}
        </ScrollView>
        {!desktop && (
          <View
            style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: C.line,
              backgroundColor: '#FEFFFB',
              paddingTop: 10,
              paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            }}
          >
            {NAV.map((item) => (
              <Pressable
                key={item.name}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => navigate(item.name)}
                style={{ flex: 1, alignItems: 'center', gap: 3 }}
              >
                <Icon icon={item.icon} size={19} color={page === item.name ? C.green : '#A0AA95'} />
                <T
                  style={{
                    fontSize: 8,
                    fontFamily: page === item.name ? F.bold : F.medium,
                    color: page === item.name ? C.green : '#9CA78F',
                  }}
                >
                  {item.short}
                </T>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <Dialog
        visible={!!guide}
        onClose={() => setGuide(null)}
        title={guide ? `Panduan ${guide.title}` : ''}
        subtitle={guide?.subtitle}
        wide
      >
        {guide && (
          <>
            <T style={{ color: '#7A8971', lineHeight: 25, marginBottom: 22 }}>{guide.intro}</T>
            {guide.arabic && (
              <Card
                style={{ backgroundColor: '#EAF0E4', borderColor: '#E0E7D7', marginBottom: 22 }}
              >
                <T
                  style={{
                    fontFamily: undefined,
                    fontSize: 27,
                    lineHeight: 54,
                    textAlign: 'center',
                    color: C.green,
                    writingDirection: 'rtl',
                  }}
                >
                  {guide.arabic}
                </T>
                <T
                  style={{
                    fontSize: 12,
                    color: '#829171',
                    textAlign: 'center',
                    marginTop: 13,
                    lineHeight: 23,
                  }}
                >
                  {guide.translation}
                </T>
              </Card>
            )}
            {guide.steps.map((step, i) => (
              <View key={step.title} style={{ flexDirection: 'row', gap: 15, marginBottom: 23 }}>
                <View
                  style={{
                    width: 29,
                    height: 29,
                    backgroundColor: '#E7EEDF',
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <T style={{ fontFamily: F.bold, color: C.green, fontSize: 11 }}>{i + 1}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T style={{ fontFamily: F.bold, fontSize: 14, marginBottom: 7 }}>{step.title}</T>
                  <T style={{ fontSize: 12, lineHeight: 24, color: '#819074' }}>{step.body}</T>
                </View>
              </View>
            ))}
            <View
              style={{
                backgroundColor: '#EFF3E9',
                borderRadius: 10,
                padding: 17,
                marginBottom: 23,
              }}
            >
              <T
                style={{ fontFamily: F.semibold, fontSize: 10, color: '#7C8E69', marginBottom: 4 }}
              >
                RUJUKAN & CATATAN
              </T>
              <T style={{ fontSize: 10, lineHeight: 19, color: '#8F9D7C' }}>{guide.source}</T>
              <Pressable
                accessibilityRole="link"
                onPress={() =>
                  Linking.openURL(guide.sourceUrl).catch(() =>
                    notify('Rujukan tidak dapat dibuka. Periksa koneksi internet.'),
                  )
                }
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9 }}
              >
                <T style={{ color: C.green, fontFamily: F.semibold, fontSize: 10 }}>Buka rujukan</T>
                <Icon icon={ExternalLink} size={12} />
              </Pressable>
            </View>
            <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Button variant="secondary" icon={Bookmark} onPress={() => toggleSaved(guide.id)}>
                  {saved.includes(guide.id) ? 'Hapus dari tersimpan' : 'Simpan panduan'}
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  icon={Check}
                  onPress={() => {
                    if (!completed.includes(guide.id)) setCompleted((old) => [...old, guide.id]);
                    setGuide(null);
                    notify('Alhamdulillah, satu langkah lagi dalam perjalanan imanmu.');
                  }}
                >
                  {completed.includes(guide.id) ? 'Selesai membaca' : 'Tandai sudah dibaca'}
                </Button>
              </View>
            </View>
          </>
        )}
      </Dialog>
      <Dialog
        visible={modal === 'city'}
        onClose={() => setModal(null)}
        title="Pilih lokasi kamu"
        subtitle="Jadwal salat menyesuaikan koordinat pusat kota."
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#DEE6D7',
            backgroundColor: '#FFF',
            borderRadius: 10,
            paddingHorizontal: 13,
            gap: 9,
            marginBottom: 18,
          }}
        >
          <Icon icon={Search} size={17} color={C.muted} />
          <TextInput
            accessibilityLabel="Cari kota"
            placeholder="Cari nama kota..."
            placeholderTextColor="#A3AE98"
            value={cityQuery}
            onChangeText={setCityQuery}
            style={
              {
                flex: 1,
                paddingVertical: 13,
                fontFamily: F.regular,
                fontSize: 12,
                color: C.ink,
                outlineWidth: 0,
              } as any
            }
          />
        </View>
        {cities
          .filter((c) => `${c.name} ${c.region}`.toLowerCase().includes(cityQuery.toLowerCase()))
          .map((c) => (
            <Pressable
              key={c.name}
              accessibilityRole="button"
              disabled={notificationBusy}
              onPress={() => selectCity(c)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 13,
                marginBottom: 5,
                borderRadius: 9,
                backgroundColor: c.name === city.name ? '#E8F0E0' : '#FFF',
                borderWidth: 1,
                borderColor: c.name === city.name ? '#DFE8D6' : C.line,
              }}
            >
              <Icon icon={MapPin} size={16} color="#8FA47C" />
              <View style={{ flex: 1 }}>
                <T style={{ fontFamily: F.semibold, fontSize: 12 }}>{c.name}</T>
                <T style={{ fontSize: 10, color: C.muted }}>
                  {c.region} · {c.zone}
                </T>
              </View>
              {c.name === city.name && <Icon icon={Check} size={17} />}
            </Pressable>
          ))}
        {!cities.some((c) =>
          `${c.name} ${c.region}`.toLowerCase().includes(cityQuery.toLowerCase()),
        ) && (
          <T style={{ textAlign: 'center', padding: 25, color: C.muted }}>
            Kota belum tersedia. Coba pilih kota terdekat dari daftar.
          </T>
        )}
      </Dialog>
      <Dialog
        visible={modal === 'reminders'}
        onClose={() => setModal(null)}
        title="Pengingat ibadah"
        subtitle={`Luangkan waktu untuk-Nya · ${city.name}`}
      >
        <View
          style={{ backgroundColor: '#EAF0E3', borderRadius: 10, padding: 16, marginBottom: 21 }}
        >
          <T style={{ fontSize: 11, color: '#7B8E69', lineHeight: 21 }}>
            {Platform.OS === 'web'
              ? 'Di web, pengingat muncul di dalam aplikasi saat halaman terbuka. Untuk notifikasi terjadwal saat aplikasi ditutup, gunakan versi Android/iOS dan berikan izin notifikasi.'
              : 'Notifikasi salat dijadwalkan untuk 7 hari ke depan. Buka aplikasi secara berkala agar jadwal terus diperbarui. Pengingat puasa dijadwalkan untuk 4 hari puasa terdekat.'}
          </T>
        </View>
        <T style={{ fontFamily: F.bold, fontSize: 14 }}>Salat lima waktu</T>
        {prayerNames.map((p) => (
          <ToggleRow
            key={p}
            title={p}
            subtitle={`Saat masuk waktu ${p.toLowerCase()}`}
            value={reminders.includes(p)}
            disabled={notificationBusy}
            onChange={(v) =>
              changeReminder(
                v ? [...reminders, p] : reminders.filter((n) => n !== p),
                fastingReminder,
              )
            }
          />
        ))}
        <T style={{ fontFamily: F.bold, fontSize: 14, marginTop: 25 }}>Puasa</T>
        <ToggleRow
          title="Pengingat sahur"
          subtitle="1 jam sebelum Subuh pada hari puasa di kalender."
          value={fastingReminder}
          disabled={notificationBusy}
          onChange={(v) => changeReminder(reminders, v)}
        />
        {notificationBusy && <ActivityIndicator style={{ marginTop: 15 }} color={C.green} />}
        {!!reminderStatus && (
          <T
            accessibilityLiveRegion="polite"
            style={{
              fontSize: 11,
              color: C.green,
              backgroundColor: '#EDF3E8',
              padding: 13,
              borderRadius: 8,
              marginTop: 17,
            }}
          >
            {reminderStatus}
          </T>
        )}
        <View style={{ marginTop: 23 }}>
          <Button onPress={() => setModal(null)} icon={Check}>
            Selesai
          </Button>
        </View>
      </Dialog>
      <Dialog
        visible={modal === 'settings'}
        onClose={() => setModal(null)}
        title="Ruang personalmu"
        subtitle="Buat perjalanan ini terasa lebih dekat."
      >
        <T style={{ fontFamily: F.semibold, fontSize: 12, marginBottom: 9 }}>Nama panggilan</T>
        <TextInput
          accessibilityLabel="Nama panggilan"
          value={draftName}
          onChangeText={setDraftName}
          maxLength={30}
          placeholder="Sahabat"
          style={{
            padding: 14,
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#DDE5D6',
            borderRadius: 9,
            fontFamily: F.regular,
            fontSize: 14,
            color: C.ink,
          }}
        />
        <T style={{ color: C.muted, fontSize: 10, marginTop: 8, marginBottom: 22 }}>
          Nama dan preferensi hanya disimpan di perangkat ini.
        </T>
        <Button
          onPress={() => {
            setName(draftName.trim() || 'Sahabat');
            setModal(null);
            notify('Pengaturan profil diperbarui.');
          }}
          icon={Check}
        >
          Simpan pengaturan
        </Button>
        <View style={{ height: 1, backgroundColor: C.line, marginVertical: 25 }} />
        <ToggleRow
          title="Lokasi saat ini"
          subtitle={`${city.name}, ${city.zone}`}
          value={true}
          disabled
          onChange={() => {}}
        />
        <View style={{ marginTop: 16, gap: 9 }}>
          <Button variant="secondary" onPress={openCity} icon={MapPin}>
            Ubah lokasi
          </Button>
          <Button variant="secondary" onPress={openReminders} icon={Bell}>
            Atur pengingat ibadah
          </Button>
          <Button variant="ghost" onPress={() => setModal('help')} icon={CircleHelp}>
            Bantuan & informasi
          </Button>
        </View>
      </Dialog>
      <Dialog
        visible={modal === 'help'}
        onClose={() => setModal(null)}
        title="Ditemani, bukan dihakimi."
        subtitle="Tentang Teman Iman"
      >
        <View style={{ alignItems: 'center', marginBottom: 23 }}>
          <BrandMark size={50} />
          <T style={{ fontFamily: F.bold, fontSize: 20, marginTop: 14 }}>Teman Iman</T>
          <T style={{ fontSize: 11, color: C.muted }}>Selangkah lebih dekat · Versi 1.0</T>
        </View>
        {[
          {
            title: 'Mulai dari mana?',
            body: 'Buka Panduan Islam dan mulai dari Syahadat. Simpan panduan favorit, tandai yang sudah dibaca, lalu lanjutkan sesuai kemampuanmu.',
          },
          {
            title: 'Seberapa akurat jadwalnya?',
            body: 'Jadwal salat dihitung secara astronomis berdasarkan pusat kota pilihanmu. Cocokkan dengan jadwal resmi Kemenag atau masjid setempat. Kalender Hijriah merupakan perkiraan dan dapat berbeda 1–2 hari.',
          },
          {
            title: 'Bagaimana pengingat bekerja?',
            body: 'Web memberikan pesan saat halaman terbuka. Android/iOS menggunakan notifikasi lokal dengan izin pengguna. Buka aplikasi secara berkala untuk memperbarui jadwal. Mode senyap dan penghemat baterai dapat memengaruhi notifikasi.',
          },
          {
            title: 'Apakah data saya aman?',
            body: 'Nama, lokasi pilihan, catatan puasa, dan progres panduan disimpan hanya secara lokal di perangkat. Tidak ada akun, pelacakan lokasi otomatis, ataupun pengiriman data ke server aplikasi. Menghapus data browser/aplikasi akan menghapus catatan ini.',
          },
          {
            title: 'Perlu bimbingan lebih lanjut?',
            body: 'Materi di aplikasi merupakan pengantar. Untuk persoalan fikih atau kondisi pribadi, hubungi ustaz, masjid, komunitas mualaf, atau lembaga amil zakat tepercaya.',
          },
        ].map((item) => (
          <View key={item.title} style={{ marginBottom: 21 }}>
            <T style={{ fontFamily: F.bold, fontSize: 13, marginBottom: 7 }}>{item.title}</T>
            <T style={{ fontSize: 12, color: C.muted, lineHeight: 23 }}>{item.body}</T>
          </View>
        ))}
      </Dialog>
      <Dialog
        visible={modal === 'menu'}
        onClose={() => setModal(null)}
        title="Teman Iman"
        subtitle="Tumbuh bersama iman"
      >
        {NAV.map((item) => navButton(item))}
        {navButton({ name: 'Tersimpan', icon: Bookmark, short: 'Tersimpan' })}
        <View style={{ marginTop: 15 }}>
          <Button variant="secondary" onPress={openSettings} icon={Settings}>
            Pengaturan
          </Button>
        </View>
      </Dialog>
      {!!toast && (
        <View
          style={{
            position: 'absolute',
            bottom: desktop ? 25 : 85,
            left: mobile ? 16 : undefined,
            right: mobile ? 16 : 28,
            maxWidth: 460,
            padding: 17,
            backgroundColor: '#234F3F',
            borderWidth: 1,
            borderColor: '#416A4F',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            zIndex: 999,
          }}
        >
          <Icon icon={Bell} size={18} color="#D6E5C7" />
          <T
            accessibilityRole="alert"
            style={{ flex: 1, fontSize: 11, lineHeight: 21, color: '#F0F4E8' }}
          >
            {toast}
          </T>
          <IconButton
            icon={X}
            label="Tutup pemberitahuan"
            onPress={() => setToast('')}
            color="#B8C9A9"
          />
        </View>
      )}
    </View>
  );
}
