import React from 'react';
import { View, Pressable } from 'react-native';
import {
  ArrowUpRight,
  ArrowRight,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Bell,
  BellOff,
  BookOpen,
  Sparkles,
  HandCoins,
  CalendarDays,
  Clock3,
  Heart,
} from 'lucide-react-native';
import { Badge, Button, Card, Icon, IconButton, SectionTitle, T } from './ui';
import { Mosque, Kaaba } from './illustrations';
import { colors as C, fonts as F } from '../theme';
import {
  City,
  PrayerName,
  cityDate,
  countdown,
  formatTime,
  nextPrayer,
  prayersForDate,
  upcomingFasts,
  hijriLabel,
} from '../lib/islam';
import { guides, Guide } from '../lib/guides';
export const prayerIcons = [Sunrise, Sun, Sun, Sunset, Moon];
export function GuideIcon({
  id,
  size = 25,
  color = C.green,
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  if (id === 'haji') return <Kaaba size={size + 2} color={color} />;
  return (
    <Icon
      icon={
        id === 'syahadat' ? Sparkles : id === 'salat' ? BookOpen : id === 'zakat' ? HandCoins : Moon
      }
      size={size}
      color={color}
    />
  );
}
export function GuideCard({
  guide,
  index,
  onPress,
  completed,
  compact = false,
}: {
  guide: Guide;
  index: number;
  onPress: () => void;
  completed: boolean;
  compact?: boolean;
}) {
  const shades = ['#EDF3E9', '#EDF4EE', '#FAF3E5', '#EDF1F8', '#F3EEF5'];
  const inks = [C.green, '#53806B', '#AC8D51', '#728AAD', '#9B80A5'];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Baca panduan ${guide.title}`}
      style={({ hovered }: any) =>
        ({
          flex: 1,
          minWidth: compact ? 125 : 170,
          backgroundColor: hovered ? '#F9FBF7' : '#FFF',
          borderWidth: 1,
          borderColor: hovered ? '#B9CDBB' : C.line,
          borderRadius: 13,
          padding: compact ? 18 : 24,
          minHeight: compact ? 145 : 200,
          transitionDuration: '180ms',
        }) as any
      }
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: compact ? 16 : 25,
        }}
      >
        <View
          style={{
            backgroundColor: shades[index],
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GuideIcon id={guide.id} color={inks[index]} size={compact ? 22 : 26} />
        </View>
        <T style={{ fontSize: 10, color: completed ? C.green : '#AEB7AC', fontFamily: F.medium }}>
          {completed ? '✓' : `0${index + 1}`}
        </T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T style={{ fontFamily: F.bold, fontSize: compact ? 13 : 17 }}>{guide.title}</T>
        <Icon icon={ArrowUpRight} size={14} color="#96A18F" />
      </View>
      <T style={{ fontSize: compact ? 10 : 12, color: C.muted, marginTop: 5, lineHeight: 17 }}>
        {guide.subtitle}
      </T>
      {!compact && (
        <T numberOfLines={2} style={{ fontSize: 12, color: '#7E8D7F', marginTop: 15 }}>
          {guide.intro}
        </T>
      )}
    </Pressable>
  );
}
export type DashboardProps = {
  now: Date;
  city: City;
  wide: boolean;
  mobile: boolean;
  navigate: (page: string) => void;
  openGuide: (guide: Guide) => void;
  openReminders: () => void;
  reminders: PrayerName[];
  completed: string[];
  fastingReminder: boolean;
};
export default function Dashboard({
  now,
  city,
  wide,
  mobile,
  navigate,
  openGuide,
  openReminders,
  reminders,
  completed,
  fastingReminder,
}: DashboardProps) {
  const next = nextPrayer(now, city);
  const prayers = prayersForDate(cityDate(now, city), city);
  const upcoming = upcomingFasts(cityDate(now, city), 1)[0];
  return (
    <View style={{ gap: 29 }}>
      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20 }}>
        <View style={{ flex: 1, gap: 15 }}>
          <View
            style={{
              backgroundColor: '#234F3E',
              borderRadius: 16,
              minHeight: 270,
              overflow: 'hidden',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                right: mobile ? -88 : -12,
                bottom: -5,
                opacity: mobile ? 0.42 : 1,
              }}
            >
              <Mosque width={wide ? 350 : 390} height={270} />
            </View>
            <View style={{ padding: 29, paddingVertical: 28, zIndex: 1 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 15 }}
              >
                <View
                  style={{ height: 5, width: 5, backgroundColor: '#D1DDB7', borderRadius: 3 }}
                />
                <T
                  style={{
                    color: '#D0DABF',
                    fontSize: 9,
                    fontFamily: F.semibold,
                    letterSpacing: 1.6,
                  }}
                >
                  SELANGKAH LEBIH DEKAT
                </T>
              </View>
              <T
                style={{
                  fontFamily: F.serif,
                  color: '#FFFDF1',
                  fontSize: mobile ? 29 : 32,
                  lineHeight: 43,
                }}
              >
                Ibadah lebih terarah,{'\n'}hati lebih{' '}
                <T
                  style={{
                    fontFamily: F.italic,
                    color: '#D9DFB7',
                    fontSize: mobile ? 29 : 32,
                    lineHeight: 43,
                  }}
                >
                  tenang.
                </T>
              </T>
              <T
                style={{
                  color: '#C3D3C3',
                  fontSize: 11,
                  lineHeight: 20,
                  marginTop: 12,
                  maxWidth: mobile ? 245 : 280,
                }}
              >
                Temani perjalanan imanmu, mulai dari{'\n'}langkah kecil yang berarti setiap hari.
              </T>
              <View style={{ alignSelf: 'flex-start', marginTop: 22 }}>
                <Button
                  variant="white"
                  small
                  icon={ArrowUpRight}
                  onPress={() => navigate('Panduan Islam')}
                >
                  Mulai perjalananmu
                </Button>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F0F3E9',
              borderWidth: 1,
              borderColor: '#E8EDDD',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 20,
              alignItems: 'center',
              gap: 15,
            }}
          >
            <View
              style={{
                height: 35,
                width: 35,
                backgroundColor: '#E7ECD9',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
            >
              <Icon icon={BookOpen} size={18} color="#7A8F61" />
            </View>
            <View style={{ flex: 1 }}>
              <T style={{ fontSize: 11, fontFamily: F.medium, color: '#63764F', lineHeight: 18 }}>
                “Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.”
              </T>
              <T style={{ fontSize: 9, color: '#8D9C7B', marginTop: 3 }}>QS. Ar-Ra’d : 28</T>
            </View>
            <T style={{ fontFamily: F.serif, fontSize: 41, color: '#C2CEAB', lineHeight: 42 }}>”</T>
          </View>
        </View>
        <Card style={{ width: wide ? 308 : '100%', padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 13,
            }}
          >
            <T style={{ fontFamily: F.bold, fontSize: 14 }}>Waktu Salat</T>
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#5D926D' }} />
              <T style={{ fontSize: 9, color: C.muted }}>Hari ini</T>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#EFF5EE',
              borderRadius: 10,
              padding: 13,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 11,
            }}
          >
            <View>
              <T style={{ fontSize: 9, color: '#789374' }}>Menuju {next.name}</T>
              <T
                style={{
                  fontSize: 23,
                  lineHeight: 32,
                  fontFamily: F.semibold,
                  letterSpacing: 1.5,
                  color: C.green,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {countdown(next.time, now)}
              </T>
            </View>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 20,
                backgroundColor: '#E2EDDF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon={Clock3} size={17} color="#6B8B5D" />
            </View>
          </View>
          <View>
            {prayers.map((p, i) => {
              const active = next.name === p.name && next.time.getDate() === p.time.getDate();
              return (
                <View
                  key={p.name}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 2,
                    paddingHorizontal: 9,
                    borderRadius: 7,
                    backgroundColor: active ? '#F1F5ED' : 'transparent',
                    gap: 11,
                  }}
                >
                  <Icon icon={prayerIcons[i]} size={16} color={active ? C.green : '#9DA797'} />
                  <T
                    style={{
                      flex: 1,
                      fontSize: 11,
                      color: active ? C.green : '#7E8A7B',
                      fontFamily: active ? F.bold : F.medium,
                    }}
                  >
                    {p.name}
                  </T>
                  <T
                    style={{
                      fontSize: 12,
                      fontFamily: active ? F.bold : F.semibold,
                      color: active ? C.green : '#697666',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {formatTime(p.time, city)}
                  </T>
                  <IconButton
                    icon={reminders.includes(p.name) ? Bell : BellOff}
                    label={`Pengingat ${p.name}`}
                    onPress={openReminders}
                    color={reminders.includes(p.name) ? C.green : '#B5BDAF'}
                  />
                </View>
              );
            })}
          </View>
          <Pressable
            onPress={() => navigate('Jadwal Salat')}
            accessibilityRole="button"
            style={{
              borderTopWidth: 1,
              borderTopColor: C.line,
              paddingTop: 11,
              marginTop: 9,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <T style={{ color: C.green, fontSize: 10, fontFamily: F.semibold }}>
              Lihat jadwal lengkap
            </T>
            <Icon icon={ArrowRight} size={13} />
          </Pressable>
        </Card>
      </View>
      <View>
        <SectionTitle
          title="Lima rukun, satu perjalanan"
          caption="Fondasi iman untuk setiap langkah kehidupanmu."
          action={mobile ? 'Semua' : 'Jelajahi panduan'}
          onPress={() => navigate('Panduan Islam')}
        />
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: !wide ? 'wrap' : 'nowrap' }}>
          {guides.map((guide, index) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              index={index}
              compact
              completed={completed.includes(guide.id)}
              onPress={() => openGuide(guide)}
            />
          ))}
        </View>
      </View>
      <View style={{ flexDirection: mobile ? 'column' : 'row', gap: 20 }}>
        <Card style={{ flex: 1, padding: 22 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>
              <Icon icon={CalendarDays} size={18} />
              <T style={{ fontFamily: F.bold, fontSize: 14 }}>Jaga semangat puasamu</T>
            </View>
            <Badge>PUASA SUNAH</Badge>
          </View>
          {upcoming && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View
                style={{
                  backgroundColor: '#F1F4EC',
                  borderWidth: 1,
                  borderColor: '#E7ECDF',
                  width: 57,
                  height: 66,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T
                  style={{ fontSize: 9, lineHeight: 14, color: '#839775', fontFamily: F.semibold }}
                >
                  {upcoming.date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}
                </T>
                <T style={{ fontSize: 24, lineHeight: 31, fontFamily: F.semibold, color: C.green }}>
                  {upcoming.date.getDate()}
                </T>
              </View>
              <View style={{ flex: 1 }}>
                <T style={{ fontFamily: F.semibold, fontSize: 13 }}>{upcoming.name}</T>
                <T style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                  {upcoming.date.toLocaleDateString('id-ID', { weekday: 'long' })},{' '}
                  {hijriLabel(upcoming.date)}
                </T>
                <T style={{ fontSize: 10, color: '#9EA78F', marginTop: 2 }}>
                  Niatkan kebaikan, persiapkan dari sekarang.
                </T>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 19,
              borderTopWidth: 1,
              borderTopColor: C.line,
              paddingTop: 13,
            }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={openReminders}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Icon icon={Bell} size={13} color={C.muted} />
              <T style={{ color: C.muted, fontSize: 10 }}>
                {fastingReminder ? 'Pengingat tersimpan' : 'Aktifkan pengingat'}
              </T>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigate('Kalender Puasa')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <T style={{ fontSize: 10, color: C.green, fontFamily: F.semibold }}>Lihat kalender</T>
              <Icon icon={ArrowRight} size={13} />
            </Pressable>
          </View>
        </Card>
        <Card style={{ flex: 1, backgroundColor: '#F2F4EB', borderColor: '#E5EADB', padding: 23 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <View style={{ backgroundColor: '#E5EAD8', padding: 7, borderRadius: 9 }}>
              <Icon icon={HandCoins} size={19} color="#788C5D" />
            </View>
            <T style={{ fontSize: 14, fontFamily: F.bold }}>Harta berkah, hati lapang</T>
          </View>
          <T
            style={{ fontSize: 11, color: '#869376', marginTop: 13, lineHeight: 20, maxWidth: 335 }}
          >
            Tunaikan hak sesama dengan lebih mudah. Hitung zakatmu dan mulai berbagi kebaikan.
          </T>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 17,
            }}
          >
            <Button small onPress={() => navigate('Kalkulator Zakat')} icon={ArrowUpRight}>
              Hitung zakat
            </Button>
            <T style={{ color: '#98A589', fontSize: 10 }}>Mudah & transparan</T>
          </View>
        </Card>
      </View>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 7,
        }}
      >
        <Icon icon={Heart} size={12} color="#A6B39C" />
        <T style={{ color: '#A0AA97', fontSize: 10 }}>
          Tidak harus sempurna. Yang terpenting, terus melangkah.
        </T>
      </View>
    </View>
  );
}
