// Generates index.html for the GitHub Pages portfolio from the shared project data.
// Run: node build-site.js   (images come from ./img, copied from fiverr-pcb-gig/portfolio-pdf/opt)
const fs = require('fs');
const path = require('path');
const projects = require('../fiverr-pcb-gig/portfolio-pdf/projects.js');

const jpg = f => f.replace(/\.(png|jpg)$/i, '.jpg');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Filter groups shown above the grid. A project belongs to a group when any tag matches.
const groups = [
  { id: 'wearable', label: 'Wearable and BLE', match: /\b(wearable|ble|nrf52|bluetooth)\b/i },
  { id: 'power', label: 'Battery and power', match: /\b(battery|power|charging|usb-c)\b/i },
  { id: 'sensors', label: 'Sensors and analog', match: /\b(sensors?|analog|imu|gps|motion|thermal|radar|current)\b/i },
  { id: 'wireless', label: 'RF and wireless', match: /\b(lora|wifi|zigbee|rf|ethernet|poe)\b/i },
  { id: 'fourlayer', label: '4 layer', match: /4 layer/i },
  { id: 'built', label: 'Assembled and tested', match: /assembled|production/i },
  { id: 'medical', label: 'Medical and safety', match: /therapy|medical|safety|security/i },
];

const data = projects.map((p, i) => {
  const images = [p.hero, ...p.thumbs, ...(p.extra || [])].map(f => `img/${p.folder}/${jpg(f)}`);
  const cats = groups.filter(g => p.tags.some(t => g.match.test(t)) || g.match.test(p.subtitle)).map(g => g.id);
  return { n: i + 1, title: p.title, subtitle: p.subtitle, tags: p.tags, desc: p.desc, points: p.points, specs: p.specs, images, cats, photo: p.thumbClass === 'photo', hero: `img/${p.folder}/${jpg(p.hero)}` };
});

const cards = data.map(p => `
<article class="card" data-cats="${p.cats.join(' ')}" data-n="${p.n}" tabindex="0" role="button" aria-label="Open ${esc(p.title)}">
  <div class="card-img${p.photo ? ' photo' : ''}"><img loading="lazy" src="${p.hero}" alt="${esc(p.title)} 3D render"></div>
  <div class="card-body">
    <div class="card-num">Project ${String(p.n).padStart(2, '0')}</div>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.subtitle)}</p>
    <div class="tags">${p.tags.slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>
  </div>
</article>`).join('');

const filterButtons = `<button class="chip active" data-filter="all">All projects <b>${data.length}</b></button>` +
  groups.map(g => `<button class="chip" data-filter="${g.id}">${esc(g.label)} <b>${data.filter(p => p.cats.includes(g.id)).length}</b></button>`).join('');

const css = fs.readFileSync(path.join(__dirname, 'src', 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'src', 'app.js'), 'utf8');
const json = JSON.stringify(data).replace(/<\//g, '<\\/');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shuja Chaudhry | PCB and Embedded Hardware Design</title>
<meta name="description" content="PCB and embedded hardware design portfolio of Shuja Chaudhry: multilayer PCB layout, ESP32, STM32, nRF52, BLE, battery powered and sensor electronics. Schematic to fabrication ready files.">
<meta property="og:title" content="Shuja Chaudhry | PCB and Embedded Hardware Design">
<meta property="og:description" content="16 selected PCB projects: wearable BLE devices, battery management, sensor front ends, 4 layer boards and assembled hardware.">
<meta property="og:image" content="https://shuja848.github.io/img/13-stm32-nrf52-secure-ble-device/render.jpg">
<meta property="og:url" content="https://shuja848.github.io/">
<link rel="canonical" href="https://shuja848.github.io/">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%230f2238'/%3E%3Ccircle cx='20' cy='20' r='6' fill='%2338bdf8'/%3E%3Ccircle cx='44' cy='44' r='6' fill='%2338bdf8'/%3E%3Cpath d='M20 26v10h24v2' stroke='%2338bdf8' stroke-width='4' fill='none'/%3E%3C/svg%3E">
<style>${css}</style>
</head>
<body>
<a class="skip" href="#work">Skip to projects</a>
<header class="nav">
  <a class="brand" href="#top"><span class="logo"></span>Shuja Chaudhry</a>
  <nav>
    <a href="#work">Projects</a>
    <a href="#skills">Skills</a>
    <a href="#process">Process</a>
    <a href="#contact">Contact</a>
    <a class="btn small" href="Shuja_Chaudhry_PCB_Portfolio.pdf" target="_blank" rel="noopener">PDF portfolio</a>
  </nav>
  <button class="menu" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
</header>

<main id="top">
<section class="hero">
  <div class="hero-text">
    <div class="kicker">PCB and Embedded Hardware Design</div>
    <h1>Boards that go from requirements to fabrication ready files, and then actually work.</h1>
    <p class="lead">I am Shuja Chaudhry, a Hardware Design Engineer specialising in multilayer PCB design and embedded electronics. Over 100 delivered projects: battery powered wearables, BLE and WiFi devices, sensor front ends, power management and safety critical drivers, designed in KiCad and Altium Designer.</p>
    <div class="cta">
      <a class="btn" href="#work">See the projects</a>
      <a class="btn ghost" href="mailto:shujachaudhry814@gmail.com">Start a project</a>
    </div>
    <div class="stats">
      <div><b>100+</b><span>PCB projects delivered</span></div>
      <div><b>2 to 4</b><span>layer boards</span></div>
      <div><b>${data.length}</b><span>case studies below</span></div>
      <div><b>Remote</b><span>UK hours available</span></div>
    </div>
  </div>
  <div class="hero-art" aria-hidden="true">
    <img src="img/13-stm32-nrf52-secure-ble-device/render.jpg" alt="" class="a1">
    <img src="img/16-pemf-therapy-controller-hat/render.jpg" alt="" class="a2">
    <img src="img/02-esp32-ble-led-badge/5-render.jpg" alt="" class="a3">
  </div>
</section>

<section class="strip">
  <span>ESP32</span><span>STM32</span><span>nRF52</span><span>RP2040</span><span>BLE</span><span>WiFi</span><span>LoRa</span><span>CAN</span><span>USB-C</span><span>PoE</span><span>Li ion</span><span>KiCad</span><span>Altium</span><span>JLCPCB</span>
</section>

<section id="work" class="work">
  <div class="section-head">
    <div>
      <div class="kicker">Selected work</div>
      <h2>Project case studies</h2>
    </div>
    <p>Click any board for the full write up, 3D render, routed layout and schematic sheets.</p>
  </div>
  <div class="filters" role="tablist">${filterButtons}</div>
  <div class="grid">${cards}</div>
  <p class="empty" hidden>No projects in this group.</p>
</section>

<section id="skills" class="skills">
  <div class="section-head"><div><div class="kicker">Capabilities</div><h2>What I bring to a hardware team</h2></div></div>
  <div class="skill-grid">
    <div class="skill"><h3>PCB design</h3><ul><li>Schematic capture and multilayer layout, 2 to 4 layers shown here</li><li>KiCad and Altium Designer</li><li>Custom outlines, castellated modules, HAT and carrier boards</li><li>DRC clean layouts inside JLCPCB and PCBWay assembly rules</li><li>Impedance aware routing for USB, RF and high speed lines</li></ul></div>
    <div class="skill"><h3>Embedded platforms</h3><ul><li>ESP32, ESP32-S3, ESP32-C3, STM32G0, nRF52832, RP2040</li><li>Bluetooth Low Energy, WiFi, LoRa, Zigbee, 433 MHz, Ethernet with PoE</li><li>UART, SPI, I2C, I2S, CAN, USB</li><li>Firmware bring up support and test firmware</li></ul></div>
    <div class="skill"><h3>Power and analog</h3><ul><li>Li ion and LiPo charging, protection and power path</li><li>Buck, boost and buck boost converters, LDOs, power multiplexing</li><li>Load cell, current sense, temperature, motion and gas sensor front ends</li><li>ESD, TVS, polyfuse and reverse polarity protection</li></ul></div>
    <div class="skill"><h3>Deliverables</h3><ul><li>Schematics with design notes</li><li>Gerbers, drill files and stack up notes</li><li>BOM with manufacturer part numbers and stock check</li><li>Pick and place files and assembly drawings</li><li>Bring up plan, test points and design review notes</li></ul></div>
  </div>
</section>

<section id="process" class="process">
  <div class="section-head"><div><div class="kicker">How I work</div><h2>From idea to a board in your hand</h2></div></div>
  <ol class="steps">
    <li><b>01</b><h3>Requirements</h3><p>Block diagram, interfaces, power budget, size and cost targets agreed up front.</p></li>
    <li><b>02</b><h3>Parts and BOM</h3><p>Component selection against stock and assembly capability so nothing needs a redesign later.</p></li>
    <li><b>03</b><h3>Schematic</h3><p>Clean, annotated schematics with a review pass before any layout starts.</p></li>
    <li><b>04</b><h3>Layout</h3><p>Stack up, placement, routing, DRC and DFM checks with renders shared as it progresses.</p></li>
    <li><b>05</b><h3>Fab package</h3><p>Gerbers, drill, BOM, pick and place and assembly drawings ready for the fab house.</p></li>
    <li><b>06</b><h3>Bring up</h3><p>Test plan, first power up support and fixes for the next revision.</p></li>
  </ol>
</section>

<section id="contact" class="contact">
  <div class="contact-card">
    <div>
      <div class="kicker">Contact</div>
      <h2>Have a board that needs designing?</h2>
      <p>I work remotely and can align with UK and European hours. Happy to begin with a scoped evaluation task so you can judge the work on real output.</p>
    </div>
    <div class="contact-links">
      <a class="btn" href="mailto:shujachaudhry814@gmail.com">shujachaudhry814@gmail.com</a>
      <a class="btn ghost" href="https://www.linkedin.com/in/shuja-chaudhry-pcbdesign" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn ghost" href="https://www.fiverr.com/users/shuja_chaudhry/portfolio" target="_blank" rel="noopener">Fiverr</a>
      <a class="btn ghost" href="https://github.com/Shuja848" target="_blank" rel="noopener">GitHub</a>
      <a class="btn ghost" href="Shuja_Chaudhry_PCB_Portfolio.pdf" target="_blank" rel="noopener">Download PDF portfolio</a>
    </div>
  </div>
</section>
</main>

<footer class="foot">
  <span>Shuja Chaudhry, Hardware Design Engineer, PCB and Embedded Systems</span>
  <span>Native KiCad files, Gerbers and BOMs available on request, subject to client confidentiality.</span>
</footer>

<div class="modal" id="modal" hidden role="dialog" aria-modal="true" aria-labelledby="m-title">
  <div class="modal-back" data-close></div>
  <div class="modal-box">
    <button class="close" data-close aria-label="Close">&times;</button>
    <div class="m-gallery">
      <div class="m-main"><button class="m-prev" aria-label="Previous image">&#8249;</button><img id="m-img" alt=""><button class="m-next" aria-label="Next image">&#8250;</button></div>
      <div class="m-thumbs" id="m-thumbs"></div>
    </div>
    <div class="m-text">
      <div class="card-num" id="m-num"></div>
      <h2 id="m-title"></h2>
      <p class="m-sub" id="m-sub"></p>
      <div class="tags" id="m-tags"></div>
      <p id="m-desc"></p>
      <h4>Key design points</h4>
      <ul id="m-points"></ul>
      <table class="specs" id="m-specs"></table>
      <div class="m-nav"><button id="m-prevp">&#8249; Previous project</button><button id="m-nextp">Next project &#8250;</button></div>
    </div>
  </div>
</div>

<script>window.PROJECTS = ${json};</script>
<script>${js}</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('wrote index.html with', data.length, 'projects');
