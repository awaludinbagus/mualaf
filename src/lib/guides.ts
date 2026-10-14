export type Guide = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  arabic?: string;
  translation?: string;
  steps: { title: string; body: string }[];
  source: string;
  sourceUrl: string;
};
export const guides: Guide[] = [
  {
    id: 'syahadat',
    title: 'Syahadat',
    subtitle: 'Awal perjalanan iman',
    intro:
      'Dua kalimat syahadat adalah kesaksian tentang keesaan Allah dan kerasulan Nabi Muhammad ﷺ. Memahaminya adalah awal dari perjalanan seorang muslim.',
    arabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ',
    translation:
      'Aku bersaksi bahwa tidak ada Tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.',
    steps: [
      {
        title: 'Pahami maknanya',
        body: 'Bersaksi dengan keyakinan bahwa hanya Allah yang berhak disembah, dan menerima Muhammad ﷺ sebagai rasul-Nya.',
      },
      {
        title: 'Ucapkan dengan tulus',
        body: 'Asyhadu al lā ilāha illallāh, wa asyhadu anna Muḥammadar rasūlullāh. Ucapkan dengan memahami dan meyakini maknanya, bukan hanya melafalkan.',
      },
      {
        title: 'Mulai belajar, selangkah demi selangkah',
        body: 'Pelajari bersuci dan salat. Anda tidak harus mengetahui semuanya sekaligus. Mintalah pendampingan dari masjid, ustaz, atau komunitas mualaf tepercaya.',
      },
      {
        title: 'Hidupkan dalam keseharian',
        body: 'Jaga keikhlasan, berbuat baik kepada sesama, dan terus belajar. Jangan berkecil hati saat belajar sesuatu yang baru.',
      },
    ],
    source: 'Al-Qur’an 47:19; Sahih Muslim, hadis 8 tentang rukun Islam.',
    sourceUrl: 'https://quran.com/47/19',
  },
  {
    id: 'salat',
    title: 'Salat',
    subtitle: 'Dekatkan diri kepada-Nya',
    intro:
      'Salat lima waktu adalah ibadah wajib yang menghubungkan seorang muslim dengan Allah. Panduan ringkas ini membantu Anda mengenal urutannya; praktik langsung bersama pembimbing sangat dianjurkan.',
    steps: [
      {
        title: 'Bersuci dan bersiap',
        body: 'Pastikan masuk waktu salat, badan, pakaian, dan tempat suci, aurat tertutup, serta menghadap kiblat. Berwudu: niat, membasuh wajah dan tangan hingga siku, mengusap kepala, lalu membasuh kaki hingga mata kaki secara tertib. Bila junub, lakukan mandi wajib.',
      },
      {
        title: 'Niat dan takbiratul ihram',
        body: 'Hadirkan niat di dalam hati sesuai salat yang dilakukan, berdiri jika mampu, lalu ucapkan “Allāhu akbar”. Subuh 2 rakaat, Zuhur 4, Asar 4, Magrib 3, dan Isya 4.',
      },
      {
        title: 'Bacaan, rukuk, dan iktidal',
        body: 'Baca Al-Fatihah pada setiap rakaat. Pada dua rakaat pertama dianjurkan membaca surah setelahnya. Rukuk dengan tenang, kemudian berdiri iktidal. Pelajari bacaan dan gerakan dengan pembimbing.',
      },
      {
        title: 'Sujud dan duduk',
        body: 'Sujud dengan tumakninah, duduk di antara dua sujud, lalu sujud kembali. Lakukan setiap gerakan dengan tenang dan ulangi sesuai jumlah rakaat.',
      },
      {
        title: 'Tasyahud dan salam',
        body: 'Pada akhir salat, duduk dan membaca tasyahud akhir serta selawat, lalu salam. Untuk salat tiga atau empat rakaat, terdapat tasyahud awal setelah rakaat kedua.',
      },
    ],
    source: 'Al-Qur’an 4:103; Sahih al-Bukhari 631. Rincian praktik dapat berbeda antarmazhab.',
    sourceUrl: 'https://quran.com/4/103',
  },
  {
    id: 'zakat',
    title: 'Zakat',
    subtitle: 'Bersihkan harta, berbagi',
    intro:
      'Zakat adalah kewajiban mengeluarkan bagian tertentu dari harta kepada penerima yang berhak, bila syaratnya terpenuhi.',
    steps: [
      {
        title: 'Kenali jenis zakat',
        body: 'Zakat fitrah berkaitan dengan berakhirnya Ramadan. Zakat maal berkaitan dengan harta yang memenuhi nisab dan syaratnya. Setiap jenis harta dapat memiliki ketentuan yang berbeda.',
      },
      {
        title: 'Periksa nisab dan haul',
        body: 'Untuk simpanan dan emas, nisab yang umum digunakan setara 85 gram emas dengan kadar zakat 2,5%, setelah kepemilikan mencapai satu tahun Hijriah (haul). Gunakan nilai emas yang sesuai ketentuan lembaga zakat setempat.',
      },
      {
        title: 'Hitung dengan cermat',
        body: 'Kalkulator di aplikasi memberi estimasi zakat simpanan, penghasilan, dan fitrah. Zakat pertanian, ternak, perdagangan kompleks, dan kondisi utang khusus perlu perhitungan tersendiri.',
      },
      {
        title: 'Tunaikan kepada yang berhak',
        body: 'Salurkan kepada delapan golongan penerima zakat sesuai Al-Qur’an 9:60, atau melalui lembaga amil tepercaya. Niatkan untuk menunaikan zakat saat membayarkannya.',
      },
    ],
    source:
      'Al-Qur’an 9:60; ketentuan zakat BAZNAS. Ikuti ketetapan resmi terbaru untuk nisab penghasilan dan fitrah.',
    sourceUrl: 'https://baznas.go.id/zakat',
  },
  {
    id: 'puasa',
    title: 'Puasa',
    subtitle: 'Latih hati dan kesabaran',
    intro:
      'Puasa mengajarkan ketakwaan dengan menahan diri dari hal-hal yang membatalkan sejak terbit fajar hingga terbenam matahari.',
    steps: [
      {
        title: 'Niat dan persiapan',
        body: 'Untuk puasa wajib, niatkan di dalam hati pada malam hari sebelum fajar. Sahur dianjurkan, meskipun hanya sedikit. Perhatikan waktu Subuh setempat sebagai awal puasa.',
      },
      {
        title: 'Jaga puasa sepanjang hari',
        body: 'Hindari makan, minum, hubungan suami istri, dan pembatal lainnya secara sengaja. Jaga lisan dan perilaku, serta isi hari dengan ibadah dan kebaikan.',
      },
      {
        title: 'Berbuka saat Magrib',
        body: 'Segerakan berbuka setelah matahari terbenam. Air dan kurma adalah pilihan sederhana. Tetap makan secukupnya dan tunaikan salat Magrib.',
      },
      {
        title: 'Kenali keringanan',
        body: 'Orang sakit, musafir, ibu hamil atau menyusui dalam kondisi tertentu, serta orang yang tidak mampu memiliki ketentuan keringanan. Haid dan nifas mengharuskan tidak berpuasa dan mengganti di hari lain. Tanyakan qada atau fidyah sesuai kondisi kepada pembimbing.',
      },
      {
        title: 'Lanjutkan dengan puasa sunah',
        body: 'Di luar Ramadan, ada puasa Senin–Kamis, Ayyamul Bidh, Arafah, dan Asyura. Tidak boleh berpuasa pada Idulfitri, Iduladha, dan hari tasyrik, kecuali pengecualian fikih tertentu bagi jemaah haji.',
      },
    ],
    source: 'Al-Qur’an 2:183–185; Sahih al-Bukhari 1923 dan 1957.',
    sourceUrl: 'https://quran.com/2/183',
  },
  {
    id: 'haji',
    title: 'Haji',
    subtitle: 'Penuhi panggilan-Nya',
    intro:
      'Haji wajib sekali seumur hidup bagi muslim yang mampu secara fisik, finansial, dan memenuhi syarat keamanan perjalanan.',
    steps: [
      {
        title: 'Persiapkan kemampuan dan ilmu',
        body: 'Pastikan kebutuhan keluarga tetap terpenuhi, urus pendaftaran melalui layanan resmi, dan ikuti manasik haji. Panduan ini bukan pengganti pendampingan manasik.',
      },
      {
        title: 'Ihram dari mikat',
        body: 'Niatkan haji sesuai jenis manasik dari batas mikat yang ditentukan. Pahami pakaian ihram dan larangannya sebelum berangkat.',
      },
      {
        title: 'Wukuf di Arafah',
        body: 'Wukuf pada waktunya adalah inti haji. Perbanyak doa dan ikuti petunjuk pembimbing rombongan mengenai waktu dan tempat.',
      },
      {
        title: 'Selesaikan rangkaian manasik',
        body: 'Tawaf ifadah, sai, dan tahalul termasuk rangkaian penting. Mabit di Muzdalifah dan Mina, melontar jumrah, serta tawaf wada memiliki ketentuan tersendiri. Pelaksanaan bergantung pada jenis haji dan kondisi jemaah.',
      },
      {
        title: 'Jaga kebaikan setelah pulang',
        body: 'Teruskan kebiasaan baik, ibadah, dan kepedulian kepada sesama. Hubungi penyelenggara resmi untuk rincian biaya, kesehatan, serta jadwal keberangkatan.',
      },
    ],
    source: 'Al-Qur’an 3:97 dan 2:196; panduan manasik Kementerian Agama RI.',
    sourceUrl: 'https://quran.com/3/97',
  },
];
