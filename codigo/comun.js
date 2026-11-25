// Partes que comparten el inicio y el catálogo: tarjetas, detalle, carrito y WhatsApp.
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const porId = id => PRODUCTOS.find(p => p.id === id) || (typeof KITS !== "undefined" ? KITS.find(k => k.id === id) : undefined);
const fotoDe = p => p.foto || `imagenes/productos/${p.id}.webp`;
const LLAVE = "sysat-carrito";

/* ---------- piezas fijas de la página ---------- */
document.body.insertAdjacentHTML("beforeend", `
<div class="sombra" id="sombra"></div>
<aside class="panel" id="panel" aria-label="Carrito de cotización">
  <div class="cab"><h3>🛒 Mi selección</h3><button id="cerrarPanel" aria-label="Cerrar">✕</button></div>
  <div class="lista" id="listaCarrito"></div>
  <div class="pie" id="pieCarrito">
    <div class="total" id="totalCarrito"></div>
    <input id="nombreCliente" placeholder="Tu nombre (opcional)" autocomplete="name">
    <input id="lugarCliente" placeholder="Distrito o ciudad (opcional)">
    <button class="btn-wsp" id="verResumen" type="button" aria-haspopup="dialog">${iconoWsp(22)} Ver resumen</button>
    <button class="vaciar" id="vaciar">Vaciar selección</button>
  </div>
</aside>
<dialog class="resumen-seleccion" id="resumenSeleccion" aria-labelledby="tituloResumen">
  <header>
    <h3 id="tituloResumen">Resumen de mi selección</h3>
    <form method="dialog"><button class="cerrar-resumen" aria-label="Cerrar resumen">✕</button></form>
  </header>
  <div class="vista-resumen"><img id="imagenResumen" alt="Imagen con los equipos y cantidades de la solicitud"></div>
  <footer>
    <p id="ayudaResumen" role="status"></p>
    <div class="acciones-resumen">
      <button class="btn-wsp" type="button" id="enviarResumen">${iconoWsp(20)} Enviar por WhatsApp</button>
      <a class="enlace-descarga" id="descargarResumen" download="seleccion-sysat.png">Descargar imagen</a>
    </div>
  </footer>
</dialog>
<div class="velo" id="velo"></div>
<div class="aviso" id="aviso"></div>
<div class="flotantes">
  <a class="wsp" id="wspFlotante" href="#" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${iconoWsp(30)}</a>
</div>`);

function iconoWsp(t) {
  return `<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.2z"/></svg>`;
}

/* ---------- WhatsApp ---------- */
function abrirWsp(texto) {
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
}
$("#wspFlotante").href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola SYSAT, quiero una cotización.")}`;
function cotizarUno(id) {
  const p = porId(id);
  abrirWsp(`Hola SYSAT, quiero cotizar:\n• ${p.marca} ${p.modelo} (${p.nombre})\n\n¿Me pueden dar precio con instalación?`);
}

/* ---------- carrito ---------- */
let carrito = {};
try { carrito = JSON.parse(localStorage.getItem(LLAVE)) || {}; } catch { carrito = {}; }
for (const id in carrito) if (!porId(id) || !(carrito[id] > 0)) delete carrito[id];

function guardar() { try { localStorage.setItem(LLAVE, JSON.stringify(carrito)); } catch {} pintarCarrito(); }
function totalUnidades() { return Object.values(carrito).reduce((a, b) => a + b, 0); }
function agregar(id, boton) {
  carrito[id] = (carrito[id] || 0) + 1; guardar();
  avisar(`✔ ${porId(id).nombre} agregado`);
  $$(".btn-carrito").forEach(b => { b.classList.remove("salta"); b.offsetWidth; b.classList.add("salta"); });
  if (boton) { boton.classList.add("hecho"); setTimeout(() => boton.classList.remove("hecho"), 900); }
}
function cambiar(id, d) { carrito[id] = (carrito[id] || 0) + d; if (carrito[id] <= 0) delete carrito[id]; guardar(); }

function pintarCarrito() {
  const n = totalUnidades();
  $$(".btn-carrito .num").forEach(e => e.textContent = n);
  const ids = Object.keys(carrito);
  $("#listaCarrito").innerHTML = ids.length ? ids.map(id => {
    const p = porId(id);
    return `<div class="item"><img src="${fotoDe(p)}" alt=""><div><b>${p.nombre}</b><small>${p.marca} · ${p.modelo}</small></div>
      <div class="cant"><button data-d="-1" data-id="${id}" aria-label="Quitar uno">−</button><span>${carrito[id]}</span><button data-d="1" data-id="${id}" aria-label="Agregar uno">+</button></div>
      <button class="quitar" data-quitar="${id}">Quitar</button></div>`;
  }).join("") : `<div class="carrito-vacio"><b>🛒</b>Aún no elegiste productos.<br>Toca <b style="display:inline;font-size:inherit">+</b> en los que te interesen.</div>`;
  $("#totalCarrito").textContent = ids.length ? `${ids.length} producto${ids.length > 1 ? "s" : ""} · ${n} unidad${n > 1 ? "es" : ""}` : "";
  $("#verResumen").disabled = !ids.length;
  $("#vaciar").style.display = ids.length ? "" : "none";
}
$("#listaCarrito").addEventListener("click", e => {
  const b = e.target.closest("[data-d]"); if (b) cambiar(b.dataset.id, +b.dataset.d);
  const q = e.target.closest("[data-quitar]"); if (q) { delete carrito[q.dataset.quitar]; guardar(); }
});
$("#vaciar").onclick = () => { carrito = {}; guardar(); };
const resumen = $("#resumenSeleccion");
const enviarResumen = $("#enviarResumen");
const descargarResumen = $("#descargarResumen");
const ayudaResumen = $("#ayudaResumen");
const esCelular = matchMedia("(pointer:coarse)").matches;
let archivoResumen;
let urlResumen;
let mensajeResumen = "";

function abrirChatSysat(texto) {
  const destino = esCelular
    ? "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto)
    : "https://web.whatsapp.com/send?phone=" + WHATSAPP + "&text=" + encodeURIComponent(texto);
  window.open(destino, "_blank", "noopener");
}

$("#verResumen").addEventListener("click", () => {
  const elementos = Object.entries(carrito).map(([id,cantidad]) => ({producto:porId(id),cantidad}));
  if (!elementos.length || resumen.open) return;
  const datos = {
    nombre:$("#nombreCliente").value.trim(),
    lugar:$("#lugarCliente").value.trim()
  };
  try {
    archivoResumen = crearImagenSeleccion(elementos,datos);
    urlResumen = URL.createObjectURL(archivoResumen);
  } catch {
    avisar("No se pudo generar la imagen. Inténtalo de nuevo.");
    return;
  }
  $("#imagenResumen").src = urlResumen;
  descargarResumen.href = urlResumen;
  const saludo = datos.nombre ? "Hola SYSAT, soy " + datos.nombre + "." : "Hola SYSAT.";
  mensajeResumen = saludo + " Les envío mi selección para cotizar con instalación.";
  enviarResumen.disabled = false;
  ayudaResumen.textContent = esCelular
    ? "Toca el botón y elige WhatsApp para enviar la imagen a SYSAT."
    : "Toca el botón: la imagen se copia sola y se abre el chat de SYSAT.";
  resumen.showModal();
});

// Celular: menú Compartir con la imagen. PC: copia la imagen y abre WhatsApp Web.
enviarResumen.addEventListener("click", async () => {
  if (!archivoResumen) return;
  enviarResumen.disabled = true;
  try {
    if (esCelular && navigator.canShare?.({files:[archivoResumen]})) {
      try {
        await navigator.share({files:[archivoResumen],text:mensajeResumen});
      } catch (error) {
        if (error.name !== "AbortError") abrirChatSysat(mensajeResumen);
      }
      return;
    }
    let copiada = false;
    let causa = "este navegador no permite copiar imágenes";
    if (navigator.clipboard?.write && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([new ClipboardItem({"image/png":archivoResumen})]);
        copiada = true;
      } catch {
        causa = location.protocol === "file:"
          ? "la página está abierta como archivo; en la página publicada sí se copia"
          : "el navegador bloqueó el portapapeles";
      }
    }
    abrirChatSysat(mensajeResumen);
    if (copiada) {
      ayudaResumen.innerHTML = esCelular
        ? "✔ <b>Imagen copiada.</b> En el chat mantén presionado, elige <b>Pegar</b> y Enviar."
        : "✔ <b>Imagen copiada.</b> En el chat pulsa <b>Ctrl+V</b> y Enviar.";
    } else {
      descargarResumen.click();
      ayudaResumen.textContent = "No se pudo copiar (" + causa + "). Se descargó la imagen: adjúntala en el chat.";
    }
  } finally {
    enviarResumen.disabled = false;
  }
});
resumen.addEventListener("close", () => {
  $("#imagenResumen").removeAttribute("src");
  descargarResumen.removeAttribute("href");
  if (urlResumen) URL.revokeObjectURL(urlResumen);
  urlResumen = archivoResumen = undefined;
});
function abrirPanel() { $("#panel").classList.add("abierto"); $("#sombra").classList.add("ver"); }
function cerrarPanel() { $("#panel").classList.remove("abierto"); $("#sombra").classList.remove("ver"); }
$("#cerrarPanel").onclick = cerrarPanel; $("#sombra").onclick = cerrarPanel;
document.addEventListener("click", e => { if (e.target.closest(".btn-carrito")) abrirPanel(); });

let tAviso;
function avisar(t) { const a = $("#aviso"); a.textContent = t; a.classList.add("ver"); clearTimeout(tAviso); tAviso = setTimeout(() => a.classList.remove("ver"), 1800); }

/* ---------- tarjetas ---------- */
function tarjeta(p) {
  return `<article class="prod aparece" data-id="${p.id}">
    <span class="tipo">${CATEGORIAS[p.cat]}</span>
    <div class="foto" data-ver="${p.id}"><img src="${fotoDe(p)}" alt="${p.nombre}" loading="lazy"></div>
    <div class="m">${p.marca}</div><h3>${p.nombre}</h3><div class="mod">${p.modelo}</div>
    <div class="pie"><button class="ver" data-ver="${p.id}">Ver detalle ›</button><button class="mas" data-agregar="${p.id}" aria-label="Agregar ${p.nombre} a mi selección" title="Agregar a mi selección">+</button></div>
    <div class="brillo"></div></article>`;
}
let listaActual = PRODUCTOS;
function pintarTarjetas(contenedor, lista) {
  listaActual = lista;
  contenedor.innerHTML = lista.map(tarjeta).join("");
  contenedor.querySelectorAll(".prod").forEach(el => {
    if (matchMedia("(hover:hover)").matches) {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(700px) rotateY(${(x - .5) * 12}deg) rotateX(${(.5 - y) * 12}deg) translateY(-6px)`;
        el.style.setProperty("--gx", x * 100 + "%"); el.style.setProperty("--gy", y * 100 + "%");
      });
      el.addEventListener("pointerleave", () => el.style.transform = "");
    }
    mirar(el);
  });
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-agregar]"); if (a) { agregar(a.dataset.agregar, a); return; }
  const v = e.target.closest("[data-ver]"); if (v) abrirDetalle(v.dataset.ver);
  const c = e.target.closest("[data-cotizar]"); if (c) cotizarUno(c.dataset.cotizar);
});

/* ---------- detalle ---------- */
let enDetalle = null;
function abrirDetalle(id) {
  const lista = listaActual.some(p => p.id === id) ? listaActual : PRODUCTOS;
  enDetalle = { id, lista };
  const p = porId(id);
  $("#velo").innerHTML = `<div class="detalle" role="dialog" aria-label="${p.nombre}"><button class="cerrar" aria-label="Cerrar">✕</button>
    <div class="zoom"><img src="${fotoDe(p)}" alt="${p.nombre}"></div>
    <div class="detalle-info"><span class="chip">${CATEGORIAS[p.cat]}</span><div class="m">${p.marca}</div><h2>${p.nombre}</h2><div class="mod">${p.modelo}</div>
    <ul>${p.car.map(c => `<li>${c}</li>`).join("")}</ul>
    <div class="botones"><button class="btn-agregar" data-agregar="${p.id}">+ Agregar a mi selección</button>
    <button class="cotizar" data-cotizar="${p.id}">Cotizar por WhatsApp</button>
    <a class="btn-borde" href="${CATALOGO_URL}#p=${p.pag}" target="_blank" rel="noopener">Ver en catálogo (pág. ${p.pag})</a></div>
    <div class="flechas"><button data-paso="-1">‹ Anterior</button><button data-paso="1">Siguiente ›</button></div></div></div>`;
  $("#velo").classList.add("abierto");
  const z = $("#velo .zoom"), im = z.querySelector("img");
  z.onpointermove = e => { const r = z.getBoundingClientRect(); im.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; im.style.transform = "scale(2.3)"; };
  z.onpointerleave = () => im.style.transform = "";
}
function pasoDetalle(d) {
  if (!enDetalle) return;
  const l = enDetalle.lista, i = l.findIndex(p => p.id === enDetalle.id);
  abrirDetalle(l[(i + d + l.length) % l.length].id);
}
function verFoto(src, texto) {
  $("#velo").innerHTML = `<div style="position:relative"><button class="cerrar" aria-label="Cerrar">✕</button><img class="foto-grande" src="${src}" alt="${texto || ""}"></div>`;
  $("#velo").classList.add("abierto"); enDetalle = null;
}
function cerrarVelo() { $("#velo").classList.remove("abierto"); enDetalle = null; }
$("#velo").addEventListener("click", e => {
  if (e.target.id === "velo" || e.target.closest(".cerrar")) cerrarVelo();
  const f = e.target.closest("[data-paso]"); if (f) pasoDetalle(+f.dataset.paso);
});
addEventListener("keydown", e => {
  if (e.key === "Escape" && !resumen.open) { cerrarVelo(); cerrarPanel(); }
  if (!$("#velo").classList.contains("abierto") || !enDetalle) return;
  if (e.key === "ArrowRight") pasoDetalle(1);
  if (e.key === "ArrowLeft") pasoDetalle(-1);
});

/* ---------- aparecer al bajar ---------- */
const observador = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("visto"); observador.unobserve(x.target); } }), { threshold: .1 }) : null;
function mirar(el) { observador ? observador.observe(el) : el.classList.add("visto"); }
$$(".aparece").forEach(mirar);

pintarCarrito();
