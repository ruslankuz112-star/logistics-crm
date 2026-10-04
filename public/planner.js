const PLANNER_DATA = {
  cities: {
    voronezh:  { name:'Воронеж',  station:'Воронеж-Курский', code:'58200' },
    tambov:    { name:'Тамбов',   station:'Тамбов-1',       code:'63100' },
    lipetsk:   { name:'Липецк',   station:'Липецк',         code:'59200' },
    kursk:     { name:'Курск',    station:'Курск',          code:'65700' },
    belgorod:  { name:'Белгород', station:'Белгород',       code:'62400' }
  },
  terminals: {
    murmansk: {
      name:'ТЛЦ «Мурманск» (ММТП)', code:'940108', operator:'ОАО «РЖД» / ММТП',
      address:'г. Мурманск, Портовый проезд, 19', type:'Универсальный + контейнерный',
      capacity:'5,0 млн т/год', container:'50 000 TEU/год',
      platforms:'Причал № 2 · глубина 12,35 м · 284 м',
      warehouses:'12 000 м² крытых · 45 000 м² открытых',
      cranes:'4 × 40 т · 2 × 80 т', reefer:'240 розеток',
      rail:'Станция Мурманск (Окт. ж/д)',
      docs:['ГУ-12','Фитосертификат','СТ-1'], gu12:true,
      note:'Прямая перевалка «вагон — судно». Круглогодичная навигация.'
    },
    lavna: {
      name:'ТЛЦ «Лавна»', code:'940112', operator:'ОАО «РЖД» / Лавна',
      address:'Мурманская обл., Кольский р-н, ст. Лавна', type:'Специализированный (уголь/навал)',
      capacity:'18,0 млн т/год', container:'—',
      platforms:'Причал № 1 · глубина 15 м · 350 м',
      warehouses:'Склады открытого хранения 80 000 м²',
      cranes:'2 × 60 т', reefer:'—', rail:'Станция Выходной — Лавна (49 км)',
      docs:['ГУ-12','Сертификат качества'], gu12:true,
      note:'Новый терминал, введён в 2023 г.'
    },
    spb: {
      name:'ТЛЦ «Шушары» (СПб)', code:'036900', operator:'ПАО «ТрансКонтейнер»',
      address:'г. Санкт-Петербург, п. Шушары', type:'Универсальный контейнерный',
      capacity:'3,5 млн т/год', container:'180 000 TEU/год',
      platforms:'Причал № 103 · глубина 11 м · 300 м',
      warehouses:'25 000 м² крытых', cranes:'3 × 45 т RMG · 2 × 40 т',
      reefer:'180 розеток', rail:'Станция Шушары (Окт. ж/д)',
      docs:['ГУ-12','СТ-1','Сертификат'], gu12:true,
      note:'Крупнейший контейнерный хаб Северо-Запада.'
    },
    novorossiysk: {
      name:'ТЛЦ «Новороссийск»', code:'940201', operator:'ОАО «РЖД» / НМТП',
      address:'г. Новороссийск, ул. Портовая, 14', type:'Универсальный + зерновой',
      capacity:'12,0 млн т/год', container:'120 000 TEU/год',
      platforms:'Причал № 5 · глубина 13,5 м · 320 м',
      warehouses:'40 000 м² крытых · 120 000 м² открытых',
      cranes:'6 × 40 т · 2 × 63 т', reefer:'320 розеток',
      rail:'Станция Новороссийск (С-Кав. ж/д)',
      docs:['ГУ-12','Фитосертификат','СТ-1'], gu12:true,
      note:'Главный порт Юга России.'
    },
    vladivostok: {
      name:'ТЛЦ «Владивосток» (ВМТП)', code:'950101', operator:'FESCO / ВМТП',
      address:'г. Владивосток, ул. Портовая, 16', type:'Универсальный контейнерный',
      capacity:'7,0 млн т/год', container:'650 000 TEU/год',
      platforms:'Причал № 14 · глубина 13 м · 400 м',
      warehouses:'35 000 м² крытых', cranes:'8 × 40 т RMG · 4 × 45 т',
      reefer:'450 розеток', rail:'Станция Владивосток (ДВост. ж/д)',
      docs:['ГУ-12','СТ-1','Сертификат'], gu12:true,
      note:'Лидер России по контейнерообороту.'
    }
  },
  ports: {
    murmansk:     { name:'Порт Мурманск (ММТП)',  load:42, trend:'+3%' },
    spb:          { name:'Большой порт СПб',       load:60, trend:'+8%' },
    novorossiysk: { name:'Порт Новороссийск',      load:83, trend:'+12%' },
    vladivostok:  { name:'Порт Владивосток',       load:36, trend:'-2%' },
    lavna:        { name:'Терминал Лавна',         load:28, trend:'+5%' }
  },
  railRates: {
    grain:{rate:1.57,note:'С коэф. 0,929'}, containers:{rate:2.10,note:'Фитинговые платформы'},
    fertilizer:{rate:1.85,note:'Минеральные удобрения'}, coal:{rate:1.35,note:'Каменный уголь'}
  },
  autoRates: {
    grain:{rate:4.5,note:'Зерновозы 20 т'}, containers:{rate:5.2,note:'Контейнеровозы 20′'},
    fertilizer:{rate:4.8,note:'Тентованные'}, coal:{rate:4.0,note:'Самосвалы'}
  },
  distances: {
    voronezh:{murmansk:2400,lavna:2420,spb:1250,novorossiysk:1100,vladivostok:9200},
    tambov:{murmansk:2250,lavna:2270,spb:1100,novorossiysk:1200,vladivostok:9050},
    lipetsk:{murmansk:2350,lavna:2370,spb:1200,novorossiysk:1050,vladivostok:9150},
    kursk:{murmansk:2500,lavna:2520,spb:1350,novorossiysk:1000,vladivostok:9300},
    belgorod:{murmansk:2550,lavna:2570,spb:1400,novorossiysk:950,vladivostok:9350}
  },

  /* ============================================================
     МОРСКИЕ ПЕРЕВОЗКИ
     ============================================================ */
  seaPortsFrom: {
    murmansk:     { name:'Мурманск (ММТП)', code:'RUMMK', deep:'12.35 м', ice:'Незамерзающий' },
    spb:          { name:'Санкт-Петербург',  code:'RULED', deep:'11.00 м', ice:'Зимой ледоколы' },
    novorossiysk: { name:'Новороссийск',     code:'RUNVS', deep:'13.50 м', ice:'Незамерзающий' },
    vladivostok:  { name:'Владивосток',      code:'RUVVO', deep:'13.00 м', ice:'Зимой ледоколы' }
  },

  seaPortsTo: {
    /* Турция */
    istanbul:  { name:'Стамбул (Амбарли)', country:'Турция', code:'TRIST', region:'Мармара' },
    mersin:    { name:'Мерсин',            country:'Турция', code:'TRMER', region:'Средиземное' },
    izmir:     { name:'Измир (Алсанджак)', country:'Турция', code:'TRIZM', region:'Эгейское' },
    gemlik:    { name:'Гемлик',            country:'Турция', code:'TRGEM', region:'Мармара' },
    iskenderun:{ name:'Искендерун