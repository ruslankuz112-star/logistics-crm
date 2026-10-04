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
  }
};

function updatePlanner() {
  const from    = document.getElementById('pl-from').value;
  const mode    = document.getElementById('pl-mode').value;
  const dest    = document.getElementById('pl-dest').value;
  const cargo   = document.getElementById('pl-cargo').value;
  const volume  = parseInt(document.getElementById('pl-volume').value) || 0;

  const terminal = PLANNER_DATA.terminals[dest];
  const distance = PLANNER_DATA.distances[from]?.[dest] || 0;
  const city = PLANNER_DATA.cities[from];
  const rateData = mode === 'rail' ? PLANNER_DATA.railRates[cargo] : PLANNER_DATA.autoRates[cargo];

  const costPerTon = rateData.rate * distance;
  const totalCost = costPerTon * volume;
  const costBn = (totalCost / 1e9).toFixed(2);
  const unit = mode === 'rail'
    ? '~' + Math.ceil(volume / 65) + ' вагонов-хопперов'
    : '~' + Math.ceil(volume / 20) + ' рейсов (20 т)';

  const requiredDocs = terminal.docs.map(function(d) {
    if (d === 'ГУ-12') return '<span class="doc-required">⚠️ ГУ-12 обязательна</span>';
    return '<span class="tag amber">' + d + '</span>';
  }).join(' ');

  document.getElementById('planner-result').innerHTML =
    '<div class="terminal-card">' +
      '<div class="tc-head">' +
        '<div>' +
          '<div class="tc-name">' + terminal.name + '</div>' +
          '<div class="tc-code">Код ТЛЦ: ' + terminal.code + '</div>' +
        '</div>' +
        '<span class="tag green">' + (mode === 'rail' ? '🚂 ЖД' : '🚛 Авто') + '</span>' +
      '</div>' +
      '<div class="tc-row"><span class="k">Оператор</span><span class="v">' + terminal.operator + '</span></div>' +
      '<div class="tc-row"><span class="k">Адрес</span><span class="v">' + terminal.address + '</span></div>' +
      '<div class="tc-row"><span class="k">Тип</span><span class="v">' + terminal.type + '</span></div>' +
      '<div class="tc-row"><span class="k">Мощность</span><span class="v">' + terminal.capacity + '</span></div>' +
      '<div class="tc-row"><span class="k">Контейнеры</span><span class="v">' + terminal.container + '</span></div>' +
      '<div class="tc-row"><span class="k">Причалы</span><span class="v">' + terminal.platforms + '</span></div>' +
      '<div class="tc-row"><span class="k">Склады</span><span class="v">' + terminal.warehouses + '</span></div>' +
      '<div class="tc-row"><span class="k">Краны</span><span class="v">' + terminal.cranes + '</span></div>' +
      '<div class="tc-row"><span class="k">Рефрозетки</span><span class="v">' + terminal.reefer + '</span></div>' +
      '<div class="tc-row"><span class="k">ЖД-станция</span><span class="v">' + terminal.rail + '</span></div>' +
    '</div>' +
    '<div class="route-summary">' +
      '<div class="rs-title">📋 Сводка маршрута</div>' +
      '<div class="rs-line"><b>' + city.name + '</b> (' + city.station + ') → <b>' + terminal.name + '</b></div>' +
      '<div class="rs-line">Расстояние: <b>' + distance.toLocaleString('ru-RU') + ' км</b></div>' +
      '<div class="rs-line">Транспорт: <b>' + (mode === 'rail' ? 'Железная дорога' : 'Автотранспорт') + '</b></div>' +
      '<div class="rs-line">' + unit + '</div>' +
      '<div class="rs-line">Ставка: <b>' + rateData.rate + ' ₽/т·км</b> <span style="color:var(--muted)">(' + rateData.note + ')</span></div>' +
      '<div class="rs-line" style="margin-top:10px;font-size:16px">Стоимость перевозки: <b>' + costPerTon.toLocaleString('ru-RU') + ' ₽/т</b></div>' +
      '<div class="rs-line" style="font-size:16px">Итого за ' + volume.toLocaleString('ru-RU') + ' т: <b>' + costBn + ' млрд ₽</b></div>' +
    '</div>' +
    '<div style="margin-top:14px">' +
      '<div style="font-size:11px;color:var(--accent);text-transform:uppercase;letter-spacing:.8px;font-weight:800;margin-bottom:8px">Обязательные документы</div>' +
      requiredDocs +
      (terminal.gu12 ? '<div style="font-size:12px;color:var(--muted);margin-top:8px">ГУ-12 — заявка на перевозку, оформляется через АС ЭТРАН не позднее чем за 10 дней до отправки.</div>' : '') +
    '</div>' +
    '<div class="callout" style="margin-top:14px;font-size:12.5px"><b>Примечание:</b> ' + terminal.note + '</div>';

  renderPortLoads();
}

function renderPortLoads() {
  const html = Object.values(PLANNER_DATA.ports).map(function(p) {
    const color = p.load >= 80 ? 'var(--red)' : p.load >= 60 ? 'var(--accent)' : 'var(--green)';
    const label = p.load >= 80 ? 'Критическая' : p.load >= 60 ? 'Высокая' : 'Нормальная';
    return '<div class="port-load">' +
      '<span class="pl-name">' + p.name + '</span>' +
      '<span style="font-size:11px;color:' + color + ';font-weight:700;min-width:80px">' + label + '</span>' +
      '<div class="pl-bar"><div class="pl-fill" style="width:' + p.load + '%;background:' + color + '"></div></div>' +
      '<span class="pl-pct" style="color:' + color + '">' + p.load + '%</span>' +
      '<span style="font-size:11px;color:var(--muted);min-width:40px">' + p.trend + '</span>' +
    '</div>';
  }).join('');
  document.getElementById('port-loads').innerHTML = html;
}

async function renderPlanner() {
  const r = await fetch('/planner.html');
  document.getElementById('content').innerHTML = await r.text();
  updatePlanner();
  setInterval(function() {
    Object.values(PLANNER_DATA.ports).forEach(function(p) {
      p.load = Math.max(10, Math.min(95, p.load + Math.floor(Math.random() * 5 - 2)));
    });
    renderPortLoads();
  }, 30000);
}