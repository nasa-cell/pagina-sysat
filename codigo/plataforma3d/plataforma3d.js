// Plataforma 3D del inicio: cuatro cámaras que giran, te miran y abren su ficha.
// Se compila con compilar.sh a ../plataforma3d.min.js (un solo archivo, funciona con doble clic).
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const caja = document.getElementById("lienzo");
const globo = document.getElementById("globo");
const ficha = document.getElementById("ficha3d");
const tactil = matchMedia("(pointer:coarse)").matches;

let r;
try {
  r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (e) {
  caja.innerHTML = `<div class="aviso3d">Tu navegador no puede mostrar el 3D.<br>Mira los productos más abajo 👇</div>`;
  throw e;
}
r.setPixelRatio(Math.min(devicePixelRatio, 2));
r.outputColorSpace = THREE.SRGBColorSpace;
r.toneMapping = THREE.ACESFilmicToneMapping;
r.shadowMap.enabled = true;
r.shadowMap.type = THREE.PCFSoftShadowMap;
caja.prepend(r.domElement);

const esc = new THREE.Scene();
esc.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
const vista = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
vista.position.set(0, 4.2, 9.6);
vista.lookAt(0, 0.9, 0);
const hemi = new THREE.HemisphereLight(0xdff4ff, 0x1a3cb0, 0.6);
esc.add(hemi);
const sol = new THREE.DirectionalLight(0xffffff, 2.2);
sol.position.set(4, 9, 6);
sol.castShadow = true;
sol.shadow.mapSize.set(1024, 1024);
Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
sol.shadow.bias = -0.0005;
esc.add(sol);

/* ---------- materiales ---------- */
const M = {
  blanco: new THREE.MeshPhysicalMaterial({ color: 0xf3f5f9, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
  gris: new THREE.MeshPhysicalMaterial({ color: 0xc9ced8, roughness: 0.4, metalness: 0.2 }),
  negro: new THREE.MeshPhysicalMaterial({ color: 0x0d1118, roughness: 0.18, metalness: 0.4, clearcoat: 1 }),
  lente: new THREE.MeshPhysicalMaterial({ color: 0x0a1640, roughness: 0.02, metalness: 1, clearcoat: 1, emissive: 0x0c2a80, emissiveIntensity: 0.5 }),
  cristal: new THREE.MeshPhysicalMaterial({ color: 0x1b2233, roughness: 0.04, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.42, side: THREE.DoubleSide }),
  azul: new THREE.MeshPhysicalMaterial({ color: 0x1e3fae, roughness: 0.25, metalness: 0.5, clearcoat: 1 })
};
const malla = (g, m) => { const x = new THREE.Mesh(g, m); x.castShadow = true; x.receiveShadow = true; return x; };
function textoMat(txt) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 64;
  const g = c.getContext("2d"); g.fillStyle = "#2f6bff"; g.font = "900 40px Segoe UI, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 34);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: t, transparent: true });
}
const logoMat = textoMat("SYSAT");

/* lente con anillo de LEDs infrarrojos, mira hacia +z */
function ojo(rad) {
  const g = new THREE.Group();
  g.add(malla(new THREE.CylinderGeometry(rad, rad, 0.06, 40).rotateX(Math.PI / 2), M.negro));
  const l = malla(new THREE.SphereGeometry(rad * 0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2), M.lente); l.position.z = 0.03; g.add(l);
  const aro = malla(new THREE.TorusGeometry(rad * 0.5, rad * 0.06, 10, 40), M.gris); aro.position.z = 0.035; g.add(aro);
  const leds = [];
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * Math.PI * 2;
    const d = new THREE.Mesh(new THREE.SphereGeometry(rad * 0.07, 10, 8), new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff1a1a, emissiveIntensity: 0 }));
    d.position.set(Math.cos(a) * rad * 0.78, Math.sin(a) * rad * 0.78, 0.04); g.add(d); leds.push(d);
  }
  return { g, leds };
}

function camBala() {
  const raiz = new THREE.Group(), pan = new THREE.Group(), tilt = new THREE.Group();
  raiz.add(malla(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 40), M.blanco));
  const brazo = malla(new THREE.CylinderGeometry(0.11, 0.14, 0.55, 24), M.blanco); brazo.position.y = 0.3; raiz.add(brazo);
  pan.position.y = 0.6; raiz.add(pan);
  pan.add(malla(new THREE.SphereGeometry(0.17, 24, 16), M.blanco)); pan.add(tilt);
  const cuerpo = malla(new THREE.CylinderGeometry(0.34, 0.34, 1.5, 48).rotateX(Math.PI / 2), M.blanco); cuerpo.position.set(0, 0.36, 0.25); tilt.add(cuerpo);
  const atras = malla(new THREE.SphereGeometry(0.34, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(-Math.PI / 2), M.blanco); atras.position.set(0, 0.36, -0.5); tilt.add(atras);
  const vm = M.blanco.clone(); vm.side = THREE.DoubleSide;
  const visera = malla(new THREE.CylinderGeometry(0.4, 0.4, 1.15, 48, 1, true, -Math.PI * 0.42, Math.PI * 0.84).rotateX(Math.PI / 2), vm); visera.position.set(0, 0.38, 0.55); tilt.add(visera);
  const o = ojo(0.31); o.g.position.set(0, 0.36, 1.0); tilt.add(o.g);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.14), logoMat); logo.position.set(0.345, 0.36, 0.15); logo.rotation.y = Math.PI / 2; tilt.add(logo);
  const logo2 = logo.clone(); logo2.position.x = -0.345; logo2.rotation.y = -Math.PI / 2; tilt.add(logo2);
  return { raiz, pan, tilt, leds: o.leds, alto: 1.3 };
}
function camDomo() {
  const raiz = new THREE.Group(), pan = new THREE.Group(), tilt = new THREE.Group();
  raiz.add(malla(new THREE.CylinderGeometry(0.62, 0.66, 0.22, 48), M.blanco));
  const aro = malla(new THREE.TorusGeometry(0.56, 0.05, 12, 48).rotateX(Math.PI / 2), M.blanco); aro.position.y = 0.12; raiz.add(aro);
  pan.position.y = 0.14; raiz.add(pan); pan.add(tilt);
  tilt.add(malla(new THREE.SphereGeometry(0.34, 32, 20), M.negro));
  const o = ojo(0.2); o.g.position.z = 0.33; tilt.add(o.g);
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(0.53, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), M.cristal); cupula.position.y = 0.12; raiz.add(cupula);
  return { raiz, pan, tilt, leds: o.leds, alto: 0.8 };
}
function camPTZ() {
  const raiz = new THREE.Group(), pan = new THREE.Group(), tilt = new THREE.Group();
  const poste = malla(new THREE.CylinderGeometry(0.09, 0.09, 1.6, 20), M.blanco); poste.position.y = 0.8; raiz.add(poste);
  const brazo = malla(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 20).rotateZ(Math.PI / 2), M.blanco); brazo.position.set(0.35, 1.6, 0); raiz.add(brazo);
  const cuello = malla(new THREE.CylinderGeometry(0.12, 0.16, 0.22, 24), M.blanco); cuello.position.set(0.72, 1.5, 0); raiz.add(cuello);
  pan.position.set(0.72, 1.36, 0); raiz.add(pan);
  pan.add(malla(new THREE.CylinderGeometry(0.42, 0.46, 0.36, 48), M.blanco));
  const franja = malla(new THREE.CylinderGeometry(0.465, 0.465, 0.05, 48), M.azul); franja.position.y = -0.12; pan.add(franja);
  const cup = new THREE.Mesh(new THREE.SphereGeometry(0.4, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.cristal); cup.position.y = -0.18; pan.add(cup);
  tilt.position.y = -0.24; pan.add(tilt);
  tilt.add(malla(new THREE.BoxGeometry(0.3, 0.26, 0.36), M.negro));
  const o = ojo(0.14); o.g.position.z = 0.19; tilt.add(o.g);
  return { raiz, pan, tilt, leds: o.leds, alto: 1.8 };
}
function camWifi() {
  const raiz = new THREE.Group(), pan = new THREE.Group(), tilt = new THREE.Group();
  raiz.add(malla(new THREE.CylinderGeometry(0.42, 0.48, 0.22, 48), M.blanco));
  const cuello = malla(new THREE.CylinderGeometry(0.3, 0.4, 0.18, 40), M.blanco); cuello.position.y = 0.18; raiz.add(cuello);
  pan.position.y = 0.62; raiz.add(pan); pan.add(tilt);
  tilt.add(malla(new THREE.SphereGeometry(0.45, 48, 32), M.blanco));
  tilt.add(malla(new THREE.SphereGeometry(0.452, 48, 32, Math.PI * 0.22, Math.PI * 0.56, Math.PI * 0.22, Math.PI * 0.56), M.negro));
  const o = ojo(0.16); o.g.position.z = 0.43; tilt.add(o.g);
  const luz = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0x2fe6ff })); luz.position.set(0, -0.2, 0.41); tilt.add(luz);
  return { raiz, pan, tilt, leds: o.leds, alto: 1.1 };
}

/* ---------- plataforma ---------- */
const plataforma = new THREE.Group(); esc.add(plataforma);
const disco = malla(new THREE.CylinderGeometry(3.4, 3.5, 0.3, 80), M.azul); disco.position.y = 0.15; plataforma.add(disco);
const borde = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.04, 8, 120).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xb6ff3b })); borde.position.y = 0.3; plataforma.add(borde);
const piso = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.25 })); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; esc.add(piso);

const modelos = [
  { f: camBala, id: DESTACADOS_3D.bala, titulo: "Cámara bala IP" },
  { f: camDomo, id: DESTACADOS_3D.domo, titulo: "Domo Turbo HD" },
  { f: camPTZ, id: DESTACADOS_3D.ptz, titulo: "PTZ motorizada" },
  { f: camWifi, id: DESTACADOS_3D.wifi, titulo: "WiFi 360°" }
];
const camaras = modelos.map((m, i) => {
  const c = m.f(); c.id = m.id; c.entra = i * 0.18;
  const a = i / 4 * Math.PI * 2;
  c.raiz.position.set(Math.sin(a) * 2.3, 0.3, Math.cos(a) * 2.3); c.raiz.scale.setScalar(0.0001);
  plataforma.add(c.raiz);
  c.etq = document.createElement("div"); c.etq.className = "etq"; c.etq.textContent = m.titulo; caja.appendChild(c.etq);
  return c;
});

/* ---------- apuntar ---------- */
const tmp = new THREE.Vector3();
function apuntar(c, obj, suave) {
  tmp.copy(obj); c.pan.parent.worldToLocal(tmp); tmp.sub(c.pan.position);
  const yaw = Math.atan2(tmp.x, tmp.z);
  const pitch = THREE.MathUtils.clamp(-Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z)), -1.1, 1.1);
  let d = yaw - c.pan.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
  c.pan.rotation.y += d * suave; c.tilt.rotation.x += (pitch - c.tilt.rotation.x) * suave;
}

/* ---------- entrada del usuario ---------- */
const raton = new THREE.Vector2(), ray = new THREE.Raycaster(), planoMira = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3), objetivo = new THREE.Vector3();
let hayRaton = false, arrX = null, movido = 0, velGiro = 0.004, giro = 0, sel = null;
function aRaton(e) { const b = r.domElement.getBoundingClientRect(); raton.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); hayRaton = true; }
r.domElement.addEventListener("pointermove", e => {
  aRaton(e);
  if (arrX === null) return;
  const d = e.clientX - arrX; arrX = e.clientX; movido += Math.abs(d); velGiro = d * 0.006;
});
r.domElement.addEventListener("pointerleave", () => { if (!tactil) hayRaton = false; });
r.domElement.addEventListener("pointerdown", e => { arrX = e.clientX; movido = 0; aRaton(e); r.domElement.setPointerCapture(e.pointerId); });
r.domElement.addEventListener("pointerup", () => {
  arrX = null;
  if (movido < 8) tocar();
  if (tactil) setTimeout(() => hayRaton = false, 1500);
});
// en celular, deslizar en horizontal gira; en vertical deja bajar la página
r.domElement.style.touchAction = "pan-y";

function tocar() {
  ray.setFromCamera(raton, vista);
  const c = camaras.find(c => ray.intersectObject(c.raiz, true).length);
  if (!c) return;
  sel = c; flash(); abrirFicha(c.id);
}
function abrirFicha(id) {
  const p = porId(id);
  ficha.innerHTML = `<button class="x" aria-label="Cerrar">✕</button><img src="${fotoDe(p)}" alt="">
    <div class="m">${p.marca}</div><h3>${p.nombre}</h3>
    <ul>${p.car.slice(0, 3).map(c => `<li>${c}</li>`).join("")}</ul>
    <div class="botones"><button class="btn-agregar" data-agregar="${p.id}">+ Agregar</button><button class="btn-borde" data-ver="${p.id}">Ver detalle</button></div>`;
  ficha.classList.add("ver");
  ficha.querySelector(".x").onclick = () => { ficha.classList.remove("ver"); sel = null; };
}
function flash() {
  const f = document.createElement("div");
  f.style.cssText = "position:absolute;inset:0;background:#fff;z-index:9;opacity:.85;transition:opacity .4s;pointer-events:none";
  caja.appendChild(f); setTimeout(() => f.style.opacity = 0, 60); setTimeout(() => f.remove(), 500);
}

/* ---------- botones ---------- */
let noche = false;
document.getElementById("controles3d").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.b === "noche") {
    noche = !noche; caja.classList.toggle("noche", noche); b.classList.toggle("on", noche);
    camaras.forEach(c => c.leds.forEach(l => l.material.emissiveIntensity = noche ? 2.5 : 0));
    hemi.intensity = noche ? 0.15 : 0.6; sol.intensity = noche ? 0.4 : 2.2;
    globo.textContent = noche ? "🌙 Visión nocturna: LEDs infrarrojos encendidos" : "☀ Modo día";
  }
  if (b.dataset.b === "foto") { flash(); globo.textContent = "📸 ¡Foto! Así grabamos tu casa"; }
});
globo.textContent = tactil ? "Desliza para girar · toca una cámara" : "Arrastra para girar · toca una cámara";

/* ---------- tamaño ---------- */
function tam() {
  const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
  r.setSize(w, h, false); vista.aspect = w / h;
  // en pantallas angostas la cámara se acerca para que la plataforma se vea grande
  if (vista.aspect < 1) vista.position.set(0, 3.4, 7.4); else vista.position.set(0, 4.2, 9.6);
  vista.lookAt(0, 0.9, 0);
  vista.fov = THREE.MathUtils.clamp(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(vista.aspect < 1 ? 58 : 50) / 2) / vista.aspect) * 180 / Math.PI, 30, 70);
  vista.updateProjectionMatrix();
}
new ResizeObserver(tam).observe(caja); tam();

/* ---------- bucle (se pausa si no se ve) ---------- */
let visible = true, inicio = performance.now();
new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(caja);
const pW = new THREE.Vector3();
function bucle(t) {
  requestAnimationFrame(bucle);
  if (!visible || document.hidden) return;
  const s = (t - inicio) / 1000;
  camaras.forEach(c => {
    if (c.entra === undefined) return;
    const k = THREE.MathUtils.clamp((s - c.entra) / 0.8, 0, 1);
    const e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k) * Math.cos(k * 9);
    c.raiz.scale.setScalar(Math.max(0.0001, e)); if (k === 1) delete c.entra;
  });
  if (arrX === null) velGiro += (0.004 - velGiro) * 0.02;
  giro += velGiro; plataforma.rotation.y = giro;
  if (hayRaton) { ray.setFromCamera(raton, vista); ray.ray.intersectPlane(planoMira, objetivo); }
  else objetivo.set(Math.sin(s) * 3, 2, 4);
  camaras.forEach(c => apuntar(c, objetivo, 0.1));
  const b = caja.getBoundingClientRect();
  camaras.forEach(c => {
    c.raiz.getWorldPosition(pW); pW.y += c.alto + 0.25; pW.project(vista);
    c.etq.style.left = ((pW.x + 1) / 2 * b.width) + "px"; c.etq.style.top = ((1 - pW.y) / 2 * b.height) + "px";
    c.etq.classList.toggle("sel", c === sel);
  });
  r.render(esc, vista);
}
requestAnimationFrame(bucle);
