/* ============================================================
   МОРСКОЙ МОДУЛЬ — Карта + AIS + Порты
   ============================================================ */

const MARITIME_PORTS = {
  murmansk: {
    name: 'Мурманск (ММТП)',
    code: 'RUMMK',
    lat: 68.9712, lng: 33.0827,
    country: '🇷🇺 Россия',
    type: 'Морской',
    depth: '12,35 м',
    berths: 'Причал № 2 · 284 м',
    capacity: '5,0 млн т/год',
    container: '50 000 TEU/год',
    cranes: '4 × 40 т · 2 × 80 т',
    reefer: '240 розеток',
    iceClass: 'Незамерзающий',
    load: 42,
    cargoTypes: ['Зерно', 'Удобрения', 'Уголь', 'Контейнеры', 'Генеральные']
  },
  spb: {
    name: 'Большой порт Санкт-Петербург',
    code: 'RULED',
    lat: 59.8781, lng: 30.2229,
    country: '🇷🇺 Россия',
    type: 'Морской',
    depth: '11,0 м',
    berths: 'Причал № 103 · 300 м',
    capacity: '3,5 млн т/год',
    container: '180 000 TEU/год',
    cranes: '3 × 45 т RMG · 2 × 40 т',
    reefer: '180 розеток',
    iceClass: 'Требуется ледокол зимой',
    load: 60,
    cargoTypes: ['Контейнеры', 'Генеральные', 'Зерно']
  },
  novorossiysk: {
    name: 'Новороссийск (НМТП)',
    code: 'RUNVS',
    lat: 44.7236, lng: 37.7775,
    country: '🇷🇺 Россия',
    type: 'Морской',
    depth: '13,5 м',
    berths: 'Причал № 5 · 320 м',
    capacity: '12,0 млн т/год',
    container: '120 000 TEU/год',
    cranes: '6 × 40 т · 2 × 63 т',
    reefer: '320 розеток',
    iceClass: 'Незамерзающий',
    load: 83,
    cargoTypes: ['Зерно', 'Нефтепродукты', 'Удобрения', 'Контейнеры', 'Металлы']
  },
  vladivostok: {
    name: 'Владивосток (ВМТП)',
    code: 'RUVVO',
    lat: 43.1144, lng: 131.8856,
    country: '🇷🇺 Россия',
    type: 'Морской',
    depth: '13,0 м',
    berths: 'Причал № 14 · 400 м',
    capacity: '7,0 млн т/год',
    container: '650 000 TEU/год',
    cranes: '8 × 40 т RMG · 4 × 45 т',
    reefer: '450 розеток',
    iceClass: 'Требуется ледокол зимой',
    load: 36,
    cargoTypes: ['Контейнеры', 'Рыба', 'Генеральные', 'Автомобили']
  },
  istanbul: {
    name: 'Стамбул (Стамбульский порт)',
    code: 'TRIST',
    lat: 41.0082, lng: 28.9784,
    country: '🇹🇷 Турция',
    type: 'Морской',
    depth: '14,0 м',
    berths: 'Причалы 1-4 · 350 м',
    capacity: '8,0 млн т/год',
    container: '250 000 TEU/год',
    cranes: '5 × 45 т RMG · 4 × 40 т',
    reefer: '320 розеток',
    iceClass: 'Незамерзающий',
    load: 71,
    cargoTypes: ['Контейнеры', 'Зерно', 'Овощи/фрукты', 'Текстиль']
  },
  mersin: {
    name: 'Мерсин (Mersin Port)',
    code: 'TRMER',
    lat: 36.7967, lng: 34.6400,
    country: '🇹🇷 Турция',
    type: 'Морской',
    depth: '13,5 м',
    berths: 'Причалы 1-3 · 300 м',
    capacity: '6,5 млн т/год',
    container: '220 000 TEU/год',
    cranes: '6 × 40 т RMG · 3 × 45 т',
    reefer: '280 розеток',
    iceClass: 'Незамерзающий',
    load: 66,
    cargoTypes: ['Контейнеры', 'Зерно', 'Стройматериалы', 'Овощи/фрукты']
  },
  gemlik: {
    name: 'Гемлик (Gemlik Port)',
    code: 'TRGEM',
    lat: 40.4322, lng: 29.1556,
    country: '🇹🇷 Турция',
    type: 'Морской',
    depth: '12,0 м',
    berths: 'Причалы 1-2 · 280 м',
    capacity: '4,0 млн т/год',
    container: '150 000 TEU/год',
    cranes: '4 × 40 т',
    reefer: '160 розеток',
    iceClass: 'Незамерзающий',
    load: 55,
    cargoTypes: ['Контейнеры', 'Зерно', 'Автомобили', 'Химия']
  }
};

/* --- Морские маршруты --- */
const MARITIME_ROUTES = [
  { from:'murmansk',    to:'istanbul',    distance:5500, days:14, name:'Мурманск → Стамбул' },
  { from:'murmansk',    to:'mersin',      distance:6100, days:16, name:'Мурманск → Мерсин' },
  { from:'murmansk',    to:'gemlik',      distance:5600, days:15, name:'Мурманск → Гемлик' },
  { from:'spb',         to:'istanbul',    distance:4800, days:12, name:'СПб → Стамбул' },
  { from:'novorossiysk',to:'istanbul',    distance:600,  days:2,  name:'Новороссийск → Стамбул' },
  { from:'novorossiysk',to:'mersin',      distance:1200, days:4,  name:'Новороссийск → Мерсин' }
];

/* --- Состояние --- */
let marineMap = null;
let layers = { ports:true, routes:true, vessels:false, marine:false };
let portMarkers = [];
let routeLines = [];
let vesselMarkers = {};
let vesselData = {};
let wsConnection = null;
let streamSubscription = null;

/* ============================================================
   ИНИЦИАЛИЗАЦИЯ КАРТЫ
   ============================================================ */
async function renderMaritime() {
  const r = await fetch('/maritime.html');
  document.getElementById('content').innerHTML = await r.text();
  await new Promise(res => setTimeout(res, 100));

  marineMap = L.map('marine-map', {
    center: [55, 30],
    zoom: 3,
    worldCopyJump: true,
    minZoom: 2,
    maxZoom: 14
  });

  /* Базовая карта — OpenStreetMap */
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(marineMap);

  drawPorts();
  drawRoutes();
  renderPortPanel();
  renderVesselList();
}

/* ============================================================
   ПОРТЫ НА КАРТЕ
   ============================================================ */
function drawPorts() {
  portMarkers.forEach(m => marineMap.removeLayer(m));
  portMarkers = [];

  Object.entries(MARITIME_PORTS).forEach(([key, port]) => {
    const isRu = port.country.includes('Россия');
    const color = isRu ? '#f5a623' : '#3ecf8e';
    const size = 32;

    const icon = L.divIcon({
      className: 'port-icon',
      html: `<div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 0 12px ${color}88,0 0 4px #000;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;color:#111;font-weight:700;">⚓</div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });

    const marker = L.marker([port.lat, port.lng], { icon }).addTo(marineMap);
    marker.bindPopup(`
      <div style="min-width:260px">
        <div style="font-weight:800;font-size:15px;margin-bottom:6px">${port.name}</div>
        <div style="font-size:11px;color:var(--muted);font-family:monospace;margin-bottom:10px">${port.code} · ${port.country}</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 10px;font-size:12px">
          <span style="color:var(--muted)">Тип</span><span style="font-weight:700">${port.type}</span>
          <span style="color:var(--muted)">Глубина</span><span style="font-weight:700">${port.depth}</span>
          <span style="color:var(--muted)">Причалы</span><span style="font-weight:700">${port.berths}</span>
          <span style="color:var(--muted)">Мощность</span><span style="font-weight:700">${port.capacity}</span>
          <span style="color:var(--muted)">Контейнеры</span><span style="font-weight:700">${port.container}</span>
          <span style="color:var(--muted)">Краны</span><span style="font-weight:700">${port.cranes}</span>
          <span style="color:var(--muted)">Рефрозетки</span><span style="font-weight:700">${port.reefer}</span>
        </div>
        <div style="margin-top:10px;font-size:12px">
          <span style="color:var(--muted)">Грузы: </span>
          ${port.cargoTypes.map(c => `<span style="background:rgba(245,166,35,.15);color:var(--accent);padding:2px 7px;border-radius:5px;margin-right:3px;font-size:11px">${c}</span>`).join('')}
        </div>
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line)">
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Текущая загрузка</div>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:8px;background:var(--line);border-radius:4px;overflow:hidden">
              <div style="width:${port.load}%;height:100%;background:${port.load>=80?'var(--red)':port.load>=60?'var(--accent)':'var(--green)'};border-radius:4px"></div>
            </div>
            <span style="font-weight:800;font-size:12px">${port.load}%</span>
          </div>
        </div>
      </div>
    `);
    portMarkers.push(marker);
  });
}

/* ============================================================
   МОРСКИЕ МАРШРУТЫ
   ============================================================ */
function drawRoutes() {
  routeLines.forEach(l => marineMap.removeLayer(l));
  routeLines = [];

  MARITIME_ROUTES.forEach(r => {
    const p1 = MARITIME_PORTS[r.from];
    const p2 = MARITIME_PORTS[r.to];
    if (!p1 || !p2) return;

    const line = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
      color: '#4ea8de',
      weight: 2,
      opacity: 0.7,
      dashArray: '8 6'
    }).addTo(marineMap);

    line.bindPopup(`
      <div style="min-width:220px">
        <div style="font-weight:800;margin-bottom:6px">${r.name}</div>
        <div style="font-size:12px;display:grid;grid-template-columns:auto 1fr;gap:4px 10px">
          <span style="color:var(--muted)">Расстояние</span><span style="font-weight:700">${r.distance.toLocaleString('ru-RU')} км</span>
          <span style="color:var(--muted)">Транзит</span><span style="font-weight:700">~${r.days} дней</span>
          <span style="color:var(--muted)">Тип судна</span><span style="font-weight:700">Panamax / Handysize</span>
        </div>
      </div>
    `);
    routeLines.push(line);
  });
}

/* ============================================================
   ПАНЕЛЬ ПОРТОВ
   ============================================================ */
function renderPortPanel() {
  document.getElementById('port-panel').innerHTML = Object.entries(MARITIME_PORTS).map(([key, p]) => `
    <div class="port-card" onclick="focusPort('${key}')">
      <div class="pc-head">
        <div>
          <div class="pc-name">${p.name}</div>
          <div class="pc-code">${p.code}</div>
        </div>
        <span style="font-size:20px">${p.country.split(' ')[0]}</span>
      </div>
      <div class="pc-row"><span class="k">Глубина</span><span>${p.depth}</span></div>
      <div class="pc-row"><span class="k">Мощность</span><span>${p.capacity}</span></div>
      <div class="pc-row"><span class="k">Контейнеры</span><span>${p.container}</span></div>
      <div class="pc-row"><span class="k">Лёд</span><span>${p.iceClass}</span></div>
      <div style="margin-top:8px;display:flex;align-items:center;gap:6px">
        <div style="flex:1;height:6px;background:var(--line);border-radius:3px;overflow:hidden">
          <div style="width:${p.load}%;height:100%;background:${p.load>=80?'var(--red)':p.load>=60?'var(--accent)':'var(--green)'}"></div>
        </div>
        <span style="font-size:11px;font-weight:800">${p.load}%</span>
      </div>
    </div>
  `).join('');
}

function focusPort(key) {
  const p = MARITIME_PORTS[key];
  if (p && marineMap) {
    marineMap.flyTo([p.lat, p.lng], 9, { duration: 1 });
    portMarkers.forEach(m => {
      if (m.getLatLng().lat === p.lat && m.getLatLng().lng === p.lng) m.openPopup();
    });
  }
}

/* ============================================================
   ПЕРЕКЛЮЧЕНИЕ СЛОЁВ
   ============================================================ */
function toggleLayer(layer) {
  layers[layer] = !layers[layer];
  const btn = document.getElementById('btn-' + layer);
  if (btn) btn.classList.toggle('active', layers[layer]);

  if (layer === 'ports') {
    portMarkers.forEach(m => layers.ports ? m.addTo(marineMap) : marineMap.removeLayer(m));
  }
  if (layer === 'routes') {
    routeLines.forEach(l => layers.routes ? l.addTo(marineMap) : marineMap.removeLayer(l));
  }
  if (layer === 'vessels') {
    if (layers.vessels) connectAIS();
    else disconnectAIS();
  }
}

/* ============================================================
   AIS STREAM — подключение к релею
   ============================================================ */
function connectAIS() {
  if (wsConnection) return;

  const proto = location.protocol === 'https:' ? 'wss://' : 'ws://';
  const url = proto + location.host + '/api/ais-stream';

  setAisStatus('подключение...');
  wsConnection = new WebSocket(url);

  wsConnection.onopen = () => {
    setAisStatus('подключено');
    document.getElementById('vessel-hint').textContent = 'Получение данных из AIS...';
  };

  wsConnection.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.type === 'vessel' && msg.mmsi) {
        vesselData[msg.mmsi] = msg;
        updateVesselMarker(msg);
        document.getElementById('vessel-count').textContent = Object.keys(vesselData).length;
      }
    } catch (e) { /* игнорируем битые сообщения */ }
  };

  wsConnection.onclose = () => {
    setAisStatus('отключено');
    wsConnection = null;
  };

  wsConnection.onerror = () => {
    setAisStatus('ошибка подключения');
  };
}

function disconnectAIS() {
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
  Object.values(vesselMarkers).forEach(m => marineMap.removeLayer(m));
  vesselMarkers = {};
  vesselData = {};
  document.getElementById('vessel-count').textContent = '0';
  renderVesselList();
}

function setAisStatus(status) {
  const el = document.getElementById('ais-status');
  if (el) el.textContent = status;
}

/* ============================================================
   МАРКЕР СУДНА
   ============================================================ */
function updateVesselMarker(v) {
  const color = v.type === 'Cargo' ? '#3ecf8e' : v.type === 'Tanker' ? '#ef5b5b' : '#4ea8de';

  const icon = L.divIcon({
    className: 'vessel-icon',
    html: `<div style="
      width:18px;height:18px;
      background:${color};
      border:2px solid #fff;
      border-radius:3px;
      box-shadow:0 0 8px ${color}88;
      transform:rotate(${v.course || 0}deg);
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });

  if (vesselMarkers[v.mmsi]) {
    vesselMarkers[v.mmsi].setLatLng([v.lat, v.lon]).setIcon(icon);
  } else {
    vesselMarkers[v.mmsi] = L.marker([v.lat, v.lon], { icon })
      .addTo(marineMap)
      .bindPopup(`
        <div style="min-width:220px">
          <div style="font-weight:800;font-size:14px;margin-bottom:4px">${v.name || 'Неизвестно'}</div>
          <div style="font-size:11px;color:var(--muted);font-family:monospace;margin-bottom:8px">MMSI ${v.mmsi}</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:12px">
            <span style="color:var(--muted)">Тип</span><span>${v.type || '—'}</span>
            <span style="color:var(--muted)">Курс</span><span>${v.course ? v.course.toFixed(0) + '°' : '—'}</span>
            <span style="color:var(--muted)">Скорость</span><span>${v.speed ? v.speed.toFixed(1) + ' узл' : '—'}</span>
            <span style="color:var(--muted)">Координаты</span><span style="font-family:monospace;font-size:11px">${v.lat.toFixed(3)}, ${v.lon.toFixed(3)}</span>
          </div>
        </div>
      `);
  }

  renderVesselList();
}

function renderVesselList() {
  const list = document.getElementById('vessel-list');
  if (!list) return;
  const vessels = Object.values(vesselData).slice(0, 50);

  if (vessels.length === 0) {
    list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">Нет данных. Нажмите «Суда (live)» выше.</div>';
    return;
  }

  list.innerHTML = vessels.map(v => `
    <div class="vessel-item" onclick="focusVessel('${v.mmsi}')">
      <span class="v-flag">${v.type === 'Cargo' ? '🚢' : v.type === 'Tanker' ? '⛽' : '🛥️'}</span>
      <span class="v-name">${v.name || 'MMSI ' + v.mmsi}</span>
      <span class="v-meta">${v.speed ? v.speed.toFixed(1) : '0'} узл · ${v.course ? v.course.toFixed(0) : '—'}°</span>
    </div>
  `).join('');
}

function focusVessel(mmsi) {
  const v = vesselData[mmsi];
  if (v && marineMap) {
    marineMap.flyTo([v.lat, v.lon], 12, { duration: 1 });
    if (vesselMarkers[mmsi]) vesselMarkers[mmsi].openPopup();
  }
}