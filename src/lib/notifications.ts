import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { City, PrayerName, cityDate, prayersForDate, upcomingFasts } from './islam';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export async function syncReminders(city: City, enabled: PrayerName[], fasting: boolean) {
  if (Platform.OS === 'android')
    await Notifications.setNotificationChannelAsync('ibadah', {
      name: 'Pengingat ibadah',
      importance: Notifications.AndroidImportance.HIGH,
    });
  if (enabled.length || fasting) {
    const permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== 'granted')
      throw new Error('Izin notifikasi belum diberikan. Aktifkan izin di pengaturan perangkat.');
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const date = cityDate(now, city);
    date.setDate(date.getDate() + i);
    for (const prayer of prayersForDate(date, city)) {
      if (enabled.includes(prayer.name) && prayer.time > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Waktunya salat ${prayer.name}`,
            body: `Jadwal ${city.name}. Mari luangkan waktu untuk mendekat kepada-Nya.`,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: prayer.time,
            channelId: 'ibadah',
          },
        });
      }
    }
  }
  if (fasting) {
    for (const fast of upcomingFasts(cityDate(now, city), 4)) {
      const reminder = new Date(prayersForDate(fast.date, city)[0].time.getTime() - 60 * 60 * 1000);
      if (reminder > now)
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Persiapan ${fast.name.toLowerCase()}`,
            body: 'Subuh sekitar satu jam lagi. Jangan lupa niat dan sahur.',
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminder,
            channelId: 'ibadah',
          },
        });
    }
  }
  return 'Pengingat perangkat aktif untuk 7 hari ke depan. Buka aplikasi secara berkala untuk memperbaruinya.';
}
