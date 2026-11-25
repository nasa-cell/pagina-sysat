// Plataforma 3D del inicio: cuatro cámaras que giran, te miran y abren su ficha.
// compilar.sh integra esta escena en escenas3d.min.js.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { camBala, camDomo, camPTZ, camWifi, M, malla } from "./modelos.js";

const caja = document.getElementById("lienzo");
const superficie = caja.querySelector(".vista3d");
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
r.setPixelRatio(Math.min(devicePixelRatio, 1.65));
r.outputColorSpace = THREE.SRGBColorSpace;
r.toneMapping = THREE.ACESFilmicToneMapping;
r.shadowMap.enabled = true;
r.shadowMap.type = THREE.PCFSoftShadowMap;
superficie.prepend(r.domElement);

const esc = new THREE.Scene();
esc.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
const vista = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
vista.position.set(0, 4.2, 9.6);
vista.lookAt(0, 0.9, 0);
const hemi = new THREE.HemisphereLight(0xdff4ff, 0x1a3cb0, 0.9);
esc.add(hemi);
const sol = new THREE.DirectionalLight(0xffffff, 2.7);
sol.position.set(4, 9, 6);
sol.castShadow = true;
sol.shadow.mapSize.set(1024, 1024);
Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
sol.shadow.bias = -0.0005;
esc.add(sol);

/* ---------- plataforma ---------- */
const plataforma = new THREE.Group();
esc.add(plataforma);
const superficieBase = .3;
const acabado = new THREE.MeshStandardMaterial({color:0x284477,roughness:.5,metalness:.35});
const canto = new THREE.MeshStandardMaterial({color:0x172b53,roughness:.3,metalness:.55});
const luzBorde = new THREE.MeshBasicMaterial({color:0x74d5ff});
const luzSeleccion = new THREE.MeshBasicMaterial({color:0xe1f8ff});
const disco = malla(new THREE.CylinderGeometry(3.58,3.64,.25,96),canto);
disco.position.y = .125;
plataforma.add(disco);
const cubierta = malla(new THREE.CylinderGeometry(3.56,3.59,.05,96),acabado);
cubierta.position.y = superficieBase - .025;
plataforma.add(cubierta);

function aro(radio,grosor,material) {
  return new THREE.Mesh(new THREE.TorusGeometry(radio,grosor,8,96).rotateX(Math.PI / 2),material);
}
const borde = aro(3.57,.027,luzBorde);
borde.position.y = .251;
plataforma.add(borde);
const anillo = aro(1,.018,luzSeleccion);
anillo.visible = false;
plataforma.add(anillo);
const piso = new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.25}));
piso.rotation.x = -Math.PI / 2;
piso.receiveShadow = true;
esc.add(piso);

const modelos = [
  { f:camBala,id:DESTACADOS_3D.bala,titulo:"Cámara bala IP",x:-1.76,z:1.15 },
  { f:camDomo,id:DESTACADOS_3D.domo,titulo:"Domo Turbo HD",x:1.77,z:-1.29 },
  { f:camPTZ,id:DESTACADOS_3D.ptz,titulo:"PTZ motorizada",x:-1.74,z:-1.35 },
  { f:camWifi,id:DESTACADOS_3D.wifi,titulo:"WiFi 360°",x:1.02,z:1.6 }
];
const camaras = modelos.map((modelo,i) => {
  const camara = modelo.f();
  camara.id = modelo.id;
  camara.entra = i * .18;
  camara.raiz.position.set(modelo.x,superficieBase,modelo.z);
  camara.raiz.scale.setScalar(.0001);
  plataforma.add(camara.raiz);

  const etiqueta = document.createElement("button");
  etiqueta.type = "button";
  etiqueta.className = "etq";
  etiqueta.textContent = modelo.titulo;
  etiqueta.setAttribute("aria-pressed","false");
  etiqueta.setAttribute("aria-controls","ficha3d");
  etiqueta.addEventListener("click",() => seleccionar(camara));
  superficie.appendChild(etiqueta);
  camara.etq = etiqueta;
  return camara;
});
/* ---------- apuntar ---------- */
const tmp = new THREE.Vector3();
function apuntar(c, obj, suave) {
  tmp.copy(obj); c.pan.parent.worldToLocal(tmp); tmp.sub(c.pan.position);
  const yaw = Math.atan2(tmp.x, tmp.z);
  const pitch = THREE.MathUtils.clamp(-Math.atan2(tmp.y, Math.hypot(tmp.x, tmp.z)), -.38, .44);
  let d = yaw - c.pan.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
  c.pan.rotation.y += d * suave; c.tilt.rotation.x += (pitch - c.tilt.rotation.x) * suave;
}

/* ---------- entrada del usuario ---------- */
const raton = new THREE.Vector2(), ray = new THREE.Raycaster(), planoMira = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3), objetivo = new THREE.Vector3();
const velocidadAutomatica = .17; // Radianes por segundo.
const sensibilidadArrastre = .006;
let hayRaton = false, arrastre = null, giro = -.16, sel = null;
let esperaMirada;
function aRaton(e) {
  const b = r.domElement.getBoundingClientRect();
  raton.set((e.clientX - b.left) / b.width * 2 - 1, 1 - (e.clientY - b.top) / b.height * 2);
  hayRaton = true;
}

r.domElement.addEventListener("pointermove", e => {
  if (!e.isPrimary) return;
  aRaton(e);
  if (arrastre?.id !== e.pointerId) return;
  const dx = e.clientX - arrastre.x;
  const dy = e.clientY - arrastre.y;
  arrastre.girando ||= Math.abs(dx) >= 8 && Math.abs(dx) >= Math.abs(dy);
  if (arrastre.girando) giro = arrastre.angulo + dx * sensibilidadArrastre;
});
r.domElement.addEventListener("pointerleave", () => { if (!tactil) hayRaton = false; });
r.domElement.addEventListener("pointerdown", e => {
  if (!e.isPrimary || e.button !== 0 || arrastre) return;
  clearTimeout(esperaMirada);
  arrastre = {id:e.pointerId,x:e.clientX,y:e.clientY,angulo:giro,girando:false};
  aRaton(e);
  r.domElement.setPointerCapture(e.pointerId);
});
r.domElement.addEventListener("pointerup", e => {
  if (arrastre?.id !== e.pointerId) return;
  const {x,y,girando} = arrastre;
  arrastre = null;
  aRaton(e);
  if (!girando && Math.hypot(e.clientX-x,e.clientY-y) < 8) tocar();
  if (tactil) esperaMirada = setTimeout(() => hayRaton = false,1500);
});
function cancelarArrastre(e) {
  if (arrastre?.id !== e.pointerId) return;
  arrastre = null;
  hayRaton = false;
}
r.domElement.addEventListener("pointercancel",cancelarArrastre);
r.domElement.addEventListener("lostpointercapture",cancelarArrastre);
// en celular, deslizar en horizontal gira; en vertical deja bajar la página
r.domElement.style.touchAction = "pan-y";

function tocar() {
  ray.setFromCamera(raton, vista);
  const [impacto] = ray.intersectObjects(camaras.map(camara => camara.raiz),true);
  if (!impacto) return;
  let raiz = impacto.object;
  while (raiz.parent !== plataforma) raiz = raiz.parent;
  seleccionar(camaras.find(camara => camara.raiz === raiz));
}

function seleccionar(camara) {
  if (sel) {
    sel.etq.classList.remove("sel");
    sel.etq.setAttribute("aria-pressed","false");
  }
  sel = camara;
  anillo.visible = Boolean(camara);
  if (!camara) {
    ficha.classList.remove("ver");
    return;
  }
  const {x,z,radio} = camara.base;
  anillo.position.set(camara.raiz.position.x+x,superficieBase+.012,camara.raiz.position.z+z);
  anillo.scale.setScalar(radio);
  camara.etq.classList.add("sel");
  camara.etq.setAttribute("aria-pressed","true");
  abrirFicha(camara.id);
}

function abrirFicha(id) {
  const p = porId(id);
  ficha.innerHTML = `<button class="x" aria-label="Cerrar">✕</button><img src="${fotoDe(p)}" alt="">
    <div class="m">${p.marca}</div><h3>${p.nombre}</h3>
    <ul>${p.car.slice(0, 3).map(c => `<li>${c}</li>`).join("")}</ul>
    <div class="botones"><button class="btn-agregar" data-agregar="${p.id}">+ Agregar</button><button class="btn-borde" data-ver="${p.id}">Ver detalle</button></div>`;
  ficha.classList.add("ver");
  ficha.querySelector(".x").onclick = () => seleccionar(null);
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
    noche = !noche;
    caja.classList.toggle("noche",noche);
    b.classList.toggle("on",noche);
    b.setAttribute("aria-pressed",String(noche));
    const acento = noche ? 0x78fac4 : 0x74d5ff;
    acabado.color.setHex(noche ? 0x263d42 : 0x284477);
    canto.color.setHex(noche ? 0x121c22 : 0x172b53);
    luzBorde.color.setHex(acento);
    luzSeleccion.color.setHex(noche ? 0xb2ffde : 0xe1f8ff);
    M.azul.color.setHex(acento);
    camaras.forEach(c => c.leds.forEach(led => led.material.emissiveIntensity = noche ? 2.1 : 0));
    hemi.intensity = noche ? .46 : .9;
    sol.intensity = noche ? 1.6 : 2.7;
    sol.color.setHex(noche ? 0xc1fbed : 0xffffff);
    globo.textContent = noche ? "🌙 Visión nocturna: LEDs infrarrojos encendidos" : "☀ Modo día";
  }
  if (b.dataset.b === "foto") { flash(); globo.textContent = "📸 ¡Foto! Así grabamos tu casa"; }
});
globo.textContent = tactil ? "Desliza para girar · toca una cámara" : "Arrastra para girar · toca una cámara";

/* ---------- tamaño ---------- */
function tam() {
  const { clientWidth: w, clientHeight: h } = superficie;
  if (!w || !h) return;
  r.setSize(w, h, false);
  vista.aspect = w / h;

  const anguloHorizontal = Math.tan(THREE.MathUtils.degToRad(25));
  const fovVertical = THREE.MathUtils.radToDeg(2 * Math.atan(anguloHorizontal / vista.aspect));
  vista.fov = THREE.MathUtils.clamp(fovVertical, 30, 65);
  // Aleja la cámara si el límite vertical reduce el espacio horizontal disponible.
  const anguloVertical = Math.tan(THREE.MathUtils.degToRad(vista.fov / 2));
  const distancia = Math.max(1, anguloHorizontal / (anguloVertical * vista.aspect));
  vista.position.set(0, 0.9 + 4.05 * distancia, 10.8 * distancia);
  vista.lookAt(0, 0.9, 0);
  vista.updateProjectionMatrix();
}
new ResizeObserver(tam).observe(superficie); tam();

/* ---------- bucle (se pausa si no se ve) ---------- */
let visible = true, inicio = performance.now();
let ultimoCuadro;
new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(caja);
const pW = new THREE.Vector3();
function bucle(t) {
  requestAnimationFrame(bucle);
  const dt = ultimoCuadro === undefined ? 0 : Math.min((t - ultimoCuadro) / 1000,.1);
  ultimoCuadro = t;
  if (!visible || document.hidden) return;
  const s = (t - inicio) / 1000;
  camaras.forEach(c => {
    if (c.entra === undefined) return;
    const k = THREE.MathUtils.clamp((s - c.entra) / 0.8, 0, 1);
    const e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k) * Math.cos(k * 9);
    c.raiz.scale.setScalar(Math.max(0.0001, e)); if (k === 1) delete c.entra;
  });
  if (!arrastre) giro += velocidadAutomatica * dt;
  plataforma.rotation.y = giro;
  if (hayRaton) { ray.setFromCamera(raton, vista); ray.ray.intersectPlane(planoMira, objetivo); }
  else objetivo.set(Math.sin(s) * 3, 2, 4);
  camaras.forEach(c => apuntar(c, objetivo, 1 - Math.exp(-6 * dt)));
  const b = superficie.getBoundingClientRect();
  camaras.forEach(c => {
    c.raiz.getWorldPosition(pW); pW.y += c.base.alto + .17; pW.project(vista);
    c.etq.style.left = ((pW.x + 1) / 2 * b.width) + "px"; c.etq.style.top = ((1 - pW.y) / 2 * b.height) + "px";
  });
  r.render(esc, vista);
}
requestAnimationFrame(bucle);
