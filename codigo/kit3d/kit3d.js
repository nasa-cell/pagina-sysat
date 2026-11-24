// «Arma tu kit»: casa 3D vista desde arriba con cámaras que se arrastran.
// Usa lo que define comun.js (porId, carrito, guardar, avisar, abrirPanel, abrirWsp, fotoDe).
// Se compila con ../compilar.sh a ../kit3d.min.js
import * as THREE from "three";

const $k = s => document.querySelector(s), $$k = s => [...document.querySelectorAll(s)];

const SUG = {
  "Casa|WiFi": ["ezviz-c6", "ezviz-c8w"],
  "Negocio|WiFi": ["ezviz-c6", "ezviz-c3w-pro"],
  "Casa|Cable": ["hikvision-ds2ce56d0t-irpf", "hikvision-ds2ce16d0t-irf"],
  "Negocio|Cable": ["hikvision-ds2cd1327g0-luf", "hikvision-ds2cd1027g0-luf"]
};
const INCLUYE = {
  WiFi: ["App en tu celular", "MicroSD para grabar", "Ver en vivo", "Instalación y configuración"],
  Cable: ["Grabador DVR/NVR", "Disco duro", "Cableado", "Ver en vivo en tu celular", "Instalación y configuración"]
};
// [nombre, emoji, x1, x2, z1, z2, color]; z negativo = fondo, z positivo = frente con la entrada
const CUARTOS = {
  Casa: [["Dormitorio", "🛏", -5, 0, -3.5, 0, 0xefe4ff], ["Cocina", "🍳", 0, 5, -3.5, 0, 0xfff1d6], ["Sala", "🛋", -5, 0, 0, 3.5, 0xdcebff], ["Cochera", "🚗", 0, 5, 0, 3.5, 0xe6e9ef]],
  Negocio: [["Almacén", "📦", -5, 0, -3.5, 0, 0xfff1d6], ["Oficina", "💼", 0, 5, -3.5, 0, 0xefe4ff], ["Tienda", "🛍", -5, 0, 0, 3.5, 0xdcebff], ["Caja", "💵", 0, 5, 0, 3.5, 0xe3f7dc]]
};
const MUROS = [[-5, -3.5, 5, -3.5], [-5, -3.5, -5, 3.5], [5, -3.5, 5, 3.5], [-5, 3.5, -3, 3.5], [-2, 3.5, 1.5, 3.5], [4, 3.5, 5, 3.5],
  [0, -3.5, 0, -0.7], [0, 0.7, 0, 3.5], [-5, 0, -3.2, 0], [-1.8, 0, 1.8, 0], [3.2, 0, 5, 0]];
const SLOT_IN = [[-4.6, 3.1], [4.6, 3.1], [4.6, -3.1], [-4.6, -3.1]];
const SLOT_EX = [[-2.5, 4.0], [2.8, 4.0], [-5.5, 0], [5.5, 0]];
const FOV_IN = 1.65, FOV_EX = 1.75, R_IN = 3.6, R_EX = 4.4;
const dentro = (x, z) => Math.abs(x) < 5 && Math.abs(z) < 3.5;

const st = { lugar: "Casa", n: 4, con: "WiFi", cams: [] };

/* ---------- cámaras ---------- */
function apuntar(c) {
  c.tipo = dentro(c.x, c.z) ? "in" : "ex";
  if (c.tipo === "in") {
    const q = CUARTOS[st.lugar].find(([, , x1, x2, z1, z2]) => c.x >= x1 && c.x <= x2 && c.z >= z1 && c.z <= z2) || CUARTOS[st.lugar][0];
    c.ang = Math.atan2((q[4] + q[5]) / 2 - c.z, (q[2] + q[3]) / 2 - c.x);
  } else {
    c.ang = Math.abs(c.z) - 3.5 > Math.abs(c.x) - 5 ? (c.z > 0 ? Math.PI / 2 : -Math.PI / 2) : (c.x > 0 ? 0 : Math.PI);
  }
}
function rehacer() {
  const ni = Math.min(4, Math.ceil(st.n / 2)), ne = st.n - ni, viejas = st.cams, nuevas = [];
  const reusar = (orig, k) => viejas.find(v => v.orig === orig && v.k === k);
  for (let k = 0; k < ni; k++) nuevas.push(reusar("in", k) || { orig: "in", k, x: SLOT_IN[k][0], z: SLOT_IN[k][1], nueva: true });
  for (let k = 0; k < ne; k++) nuevas.push(reusar("ex", k) || { orig: "ex", k, x: SLOT_EX[k][0], z: SLOT_EX[k][1], nueva: true });
  nuevas.forEach(apuntar); st.cams = nuevas; pintar();
}
function mover(i, x, z) {
  const c = st.cams[i]; if (!c) return;
  c.x = THREE.MathUtils.clamp(x, -7, 7); c.z = THREE.MathUtils.clamp(z, -5.5, 5.5);
  apuntar(c); pintar();
  $k("#kitPista").style.opacity = 0;
}

/* ---------- cobertura: interior = la casa; exterior = franja de 1.6 alrededor ---------- */
function cobertura() {
  let ti = 0, ci = 0, te = 0, ce = 0;
  for (let x = -6.6; x <= 6.6; x += 0.25) for (let z = -5.1; z <= 5.1; z += 0.25) {
    const inn = dentro(x, z);
    const ok = st.cams.some(c => {
      const dx = x - c.x, dz = z - c.z, d = Math.hypot(dx, dz), r = c.tipo === "in" ? R_IN : R_EX, f = c.tipo === "in" ? FOV_IN : FOV_EX;
      if (d > r) return false;
      let a = Math.atan2(dz, dx) - c.ang; a = Math.atan2(Math.sin(a), Math.cos(a)); return Math.abs(a) < f / 2;
    });
    if (inn) { ti++; if (ok) ci++; } else { te++; if (ok) ce++; }
  }
  return [Math.round(ci / ti * 100), Math.round(ce / te * 100)];
}

/* ---------- escena 3D ---------- */
const caja = $k("#kitEsc");
let r;
try { r = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
catch (e) { caja.insertAdjacentHTML("beforeend", `<div class="aviso3d">Tu navegador no puede mostrar el 3D, pero el kit sugerido sí funciona 👇</div>`); }

let sync3d = () => {}, construir = () => {};
if (r) {
  r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.outputColorSpace = THREE.SRGBColorSpace;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  caja.prepend(r.domElement);
  const esc = new THREE.Scene();
  esc.add(new THREE.HemisphereLight(0xffffff, 0x8fb4e8, 1.6));
  const sol = new THREE.DirectionalLight(0xffffff, 1.6); sol.position.set(6, 12, 8); sol.castShadow = true; sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9 }); esc.add(sol);
  const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  const casa = new THREE.Group(), grupoCams = new THREE.Group(); esc.add(casa, grupoCams);
  const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7 });
  const bloque = (w, h, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c)); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; casa.add(m); return m; };

  construir = () => {
    casa.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    casa.clear();
    bloque(20, 0.1, 17, 0x9ad97a, 0, -0.05, 0.5);
    bloque(1.2, 0.02, 2.4, 0xd8d2c4, -2.5, 0.01, 4.7);
    bloque(2.6, 0.02, 2.4, 0xbfc4cc, 2.75, 0.01, 4.7);
    CUARTOS[st.lugar].forEach(([, , x1, x2, z1, z2, col]) => bloque(x2 - x1, 0.06, z2 - z1, col, (x1 + x2) / 2, 0.03, (z1 + z2) / 2));
    MUROS.forEach(([x1, z1, x2, z2]) => { const v = x1 === x2, L = Math.hypot(x2 - x1, z2 - z1); bloque(v ? 0.14 : L + 0.14, 0.8, v ? L + 0.14 : 0.14, 0xffffff, (x1 + x2) / 2, 0.4, (z1 + z2) / 2); });
    if (st.lugar === "Casa") {
      bloque(2.2, 0.45, 0.8, 0x5b7bd5, -2.5, 0.25, 2.8); bloque(1, 0.3, 0.6, 0x9b6b43, -2.5, 0.17, 1.6);
      bloque(2, 0.35, 2.4, 0xffffff, -3, 0.2, -2); bloque(2, 0.15, 0.5, 0x9fc3ff, -3, 0.45, -3);
      bloque(4.6, 0.7, 0.6, 0xd5d9e0, 2.5, 0.35, -3.1); bloque(1.2, 0.5, 0.8, 0x9b6b43, 2.5, 0.26, -1.3);
      bloque(1.5, 0.45, 2.6, 0xff2b3d, 2.6, 0.3, 1.8); bloque(1.1, 0.35, 1.3, 0x222a38, 2.6, 0.7, 1.7);
    } else {
      [-4.4, -3.4].forEach(x => bloque(0.4, 0.9, 2.6, 0xffffff, x, 0.45, 1.8));
      [[-4, -2.6], [-3.2, -2.6], [-4, -1.8], [-2, -2.8], [-2.8, -1.6]].forEach(([x, z]) => bloque(0.7, 0.7, 0.7, 0xc8935a, x, 0.35, z));
      bloque(1.8, 0.6, 0.7, 0x2f6bff, 2.5, 0.3, 2.2); bloque(1.6, 0.5, 0.8, 0x9b6b43, 2.5, 0.26, -2);
    }
  };

  const matCono = { in: new THREE.MeshBasicMaterial({ color: 0x2f6bff, transparent: true, opacity: 0.26, depthWrite: false, side: THREE.DoubleSide }),
    ex: new THREE.MeshBasicMaterial({ color: 0x6cbf1f, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }) };
  const matBlanco = M(0xffffff), matLente = M(0x111622), matPalo = M(0xdfe6f0);
  const matAro = { in: new THREE.MeshBasicMaterial({ color: 0x2f6bff }), ex: new THREE.MeshBasicMaterial({ color: 0x6cbf1f }) };
  const geo = { base: new THREE.SphereGeometry(0.26, 24, 16), lente: new THREE.SphereGeometry(0.13, 16, 12), aro: new THREE.TorusGeometry(0.27, 0.04, 8, 24), palo: new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8) };
  const zonaToque = new THREE.SphereGeometry(0.7, 8, 6), matInvisible = new THREE.MeshBasicMaterial({ visible: false });

  sync3d = () => {
    grupoCams.children.forEach(g => g.children[0].geometry.dispose());
    grupoCams.clear();
    st.cams.forEach((c, i) => {
      const g = new THREE.Group(); g.position.set(c.x, 0, c.z); g.userData.i = i;
      const cono = new THREE.Mesh(new THREE.CircleGeometry(c.tipo === "in" ? R_IN : R_EX, 40, -c.ang - (c.tipo === "in" ? FOV_IN : FOV_EX) / 2, c.tipo === "in" ? FOV_IN : FOV_EX), matCono[c.tipo]);
      cono.rotation.x = -Math.PI / 2; cono.position.y = 0.09; g.add(cono);
      const cuerpo = new THREE.Group(); cuerpo.position.y = 0.95; cuerpo.rotation.y = -c.ang; g.add(cuerpo);
      const base = new THREE.Mesh(geo.base, matBlanco); base.castShadow = true; cuerpo.add(base);
      const lente = new THREE.Mesh(geo.lente, matLente); lente.position.x = 0.2; cuerpo.add(lente);
      const aro = new THREE.Mesh(geo.aro, matAro[c.tipo]); aro.rotation.x = Math.PI / 2; cuerpo.add(aro);
      const toque = new THREE.Mesh(zonaToque, matInvisible); cuerpo.add(toque);
      const palo = new THREE.Mesh(geo.palo, matPalo); palo.position.y = 0.47; g.add(palo);
      g.scale.setScalar(c.nueva ? 0.01 : 1); c.nueva = false; grupoCams.add(g);
    });
  };

  function tam() {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    r.setSize(w, h, false); cam.aspect = w / h;
    // pantallas angostas: se acerca para que la casa ocupe casi todo el ancho
    const angosta = cam.aspect < 1;
    cam.position.set(0, angosta ? 12.5 : 14, angosta ? 7.2 : 9);
    cam.lookAt(0, 0, angosta ? 0.7 : 0.4);
    cam.fov = THREE.MathUtils.clamp(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(angosta ? 54 : 64) / 2) / cam.aspect) * 180 / Math.PI, 30, 80);
    cam.updateProjectionMatrix();
  }
  new ResizeObserver(tam).observe(caja); tam();

  /* arrastrar: ratón con pointer; dedo con touch (fuera de una cámara la página sigue bajando) */
  const ray = new THREE.Raycaster(), p = new THREE.Vector2(), piso = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), q = new THREE.Vector3();
  let arr = -1;
  const apuntarRayo = (cx, cy) => { const b = r.domElement.getBoundingClientRect(); p.set((cx - b.left) / b.width * 2 - 1, -(cy - b.top) / b.height * 2 + 1); ray.setFromCamera(p, cam); };
  const camaraEn = (cx, cy) => {
    apuntarRayo(cx, cy);
    const h = ray.intersectObjects(grupoCams.children.map(g => g.children[1]), true)[0]; if (!h) return -1;
    let o = h.object; while (o && o.userData.i === undefined) o = o.parent; return o ? o.userData.i : -1;
  };
  const moverA = (cx, cy) => { apuntarRayo(cx, cy); if (ray.ray.intersectPlane(piso, q)) mover(arr, q.x, q.z); };
  const el = r.domElement;
  el.addEventListener("pointerdown", e => { if (e.pointerType === "touch") return; arr = camaraEn(e.clientX, e.clientY); if (arr >= 0) { el.setPointerCapture(e.pointerId); el.style.cursor = "grabbing"; } });
  el.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    if (arr < 0) { el.style.cursor = camaraEn(e.clientX, e.clientY) >= 0 ? "grab" : ""; return; }
    moverA(e.clientX, e.clientY);
  });
  el.addEventListener("pointerup", () => { arr = -1; el.style.cursor = ""; });
  el.addEventListener("touchstart", e => { const t = e.touches[0]; arr = camaraEn(t.clientX, t.clientY); if (arr >= 0) e.preventDefault(); }, { passive: false });
  el.addEventListener("touchmove", e => { if (arr < 0) return; e.preventDefault(); const t = e.touches[0]; moverA(t.clientX, t.clientY); }, { passive: false });
  el.addEventListener("touchend", () => arr = -1);

  /* etiquetas de cuartos y números */
  const capa = $k("#kitCapa"), proy = new THREE.Vector3();
  function etiquetas() {
    const w = caja.clientWidth, h = caja.clientHeight, pos = (x, y, z) => { proy.set(x, y, z).project(cam); return [(proy.x + 1) / 2 * w, (1 - proy.y) / 2 * h]; };
    capa.innerHTML = CUARTOS[st.lugar].map(([n, e, x1, x2, z1, z2]) => { const [a, b] = pos((x1 + x2) / 2, 0.9, (z1 + z2) / 2 + (z1 < 0 ? 0.6 : -0.6)); return `<span class="et" style="left:${a}px;top:${b}px">${e} ${n}</span>`; }).join("")
      + st.cams.map((c, i) => { const [a, b] = pos(c.x, 1.25, c.z); return `<span class="nc" style="left:${a}px;top:${b}px">${i + 1}</span>`; }).join("");
  }
  let visible = false;
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(caja);
  (function bucle() {
    requestAnimationFrame(bucle);
    if (!visible || document.hidden) return;
    grupoCams.children.forEach(g => { const s = g.scale.x; if (s < 1) g.scale.setScalar(Math.min(1, s + (1.15 - s) * 0.18)); });
    r.render(esc, cam); etiquetas();
  })();
}

/* ---------- panel ---------- */
function cuenta() { const ni = st.cams.filter(c => c.tipo === "in").length; return [ni, st.n - ni]; }
function pintar() {
  sync3d();
  const [ci, ce] = cobertura();
  $k("#cobIn").textContent = ci + "%"; $k("#barIn").style.width = ci + "%";
  $k("#cobEx").textContent = ce + "%"; $k("#barEx").style.width = ce + "%";
  const [ni, ne] = cuenta(), [pi, pe] = SUG[`${st.lugar}|${st.con}`].map(porId);
  $k("#kitMinis").innerHTML = [[pi, ni, "Interior", "in"], [pe, ne, "Exterior", "ex"]].filter(x => x[1] > 0).map(([p, k, t, c]) =>
    `<div class="mini ${c}"><img src="${fotoDe(p)}" alt=""><div><span class="x">${k}×</span><b>${p.nombre}</b><small>${t}</small></div></div>`).join("");
  $k("#kitIncluye").innerHTML = INCLUYE[st.con].map(x => `<li>${x}</li>`).join("");
  $k("#numV").textContent = st.n;
  $k("#numTxt").textContent = `${ni} interior${ni !== 1 ? "es" : ""} · ${ne} exterior${ne !== 1 ? "es" : ""}`;
}
$$k("#kit .cards").forEach(g => g.addEventListener("click", e => {
  const b = e.target.closest(".card"); if (!b) return;
  g.querySelectorAll(".card").forEach(x => x.classList.toggle("on", x === b));
  st[g.dataset.g] = b.dataset.v;
  if (g.dataset.g === "lugar") { construir(); st.cams.forEach(apuntar); }
  pintar();
}));
$k("#num").addEventListener("input", e => { st.n = +e.target.value; rehacer(); });

$k("#kitAgregar").onclick = () => {
  const [ni, ne] = cuenta(), [pi, pe] = SUG[`${st.lugar}|${st.con}`];
  if (ni) carrito[pi] = (carrito[pi] || 0) + ni;
  if (ne) carrito[pe] = (carrito[pe] || 0) + ne;
  guardar(); avisar(`✔ Kit de ${st.n} cámaras agregado`); abrirPanel();
};
$k("#kitWsp").onclick = () => {
  const [ni, ne] = cuenta(), [pi, pe] = SUG[`${st.lugar}|${st.con}`].map(porId);
  const lineas = [[pi, ni, "interior"], [pe, ne, "exterior"]].filter(x => x[1]).map(([p, k, t]) => `• ${k} × ${p.marca} ${p.modelo} (${p.nombre}, ${t})`);
  abrirWsp(`Hola SYSAT, quiero cotizar un kit para mi ${st.lugar.toLowerCase()}:\n${lineas.join("\n")}\nTotal: ${st.n} cámaras ${st.con === "WiFi" ? "WiFi" : "con cable"}.\nIncluye: ${INCLUYE[st.con].join(", ")}.\n\n¿Me pueden dar precio con instalación?`);
};

// en celular el botón flotante de WhatsApp se oculta mientras se ve el kit, para no tapar «Cotizar kit»
new IntersectionObserver(es => document.body.classList.toggle("kit-visible", es[0].isIntersecting), { threshold: 0.35 }).observe($k("#kit"));

construir(); rehacer();
