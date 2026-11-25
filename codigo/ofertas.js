// Kits y ofertas: anuncios completos en móvil y vistas previas laterales en escritorio.
(() => {
  const cover = $("#cover");
  if (!cover || !KITS.length) return;

  const jugador = cover.closest(".ofertas-reproductor");
  const intervaloOfertas = 8000;
  let idx = 0, tAuto, pausado = false;
  cover.insertAdjacentHTML("beforeend", KITS.map((kit, i) =>
    `<button type="button" class="it" data-i="${i}" aria-label="Ampliar anuncio de ${kit.nombre}">
      <img src="${kit.foto}" alt="${kit.nombre}" loading="lazy" draggable="false">
    </button>`).join(""));
  document.body.insertAdjacentHTML("beforeend", `<div class="grande" id="ofGrande" role="dialog" aria-labelledby="ofGtit">
    <button type="button" class="x" id="ofX" aria-label="Cerrar">✕</button>
    <div class="caja">
      <img id="ofGimg" alt="">
      <div class="pie">
        <small>Precio sugerido: confirma el precio final por WhatsApp</small>
        <b id="ofGtit"></b>
        <button type="button" class="btn-agregar" id="ofGag">+ Agregar a mi selección</button>
        <button type="button" class="cotizar" id="ofGwsp">Cotizar por WhatsApp</button>
      </div>
    </div>
  </div>`);
  const items = $$("#cover .it");
  const grande = $("#ofGrande");
  const titulo = $("#ofTit");
  const contador = $("#ofPuntos");

  function mover() {
    const n = KITS.length;
    const anterior = (idx + n - 1) % n;
    const siguiente = (idx + 1) % n;
    items.forEach((item, i) => {
      item.dataset.lado = i === idx ? "actual" : i === anterior ? "anterior" : i === siguiente ? "siguiente" : "oculto";
      item.tabIndex = i === idx ? 0 : -1;
    });
    items[idx].querySelector("img").loading = "eager";
    contador.textContent = `${idx + 1} de ${n}`;
    titulo.textContent = KITS[idx].nombre;
  }

  function ir(paso) {
    const desdeAnuncio = cover.contains(document.activeElement);
    idx = (idx + paso + KITS.length) % KITS.length;
    mover();
    if (desdeAnuncio) items[idx].focus({preventScroll:true});
  }

  function auto() {
    clearInterval(tAuto);
    if (pausado || grande.classList.contains("ver")) return;
    tAuto = setInterval(() => ir(1), intervaloOfertas);
  }

  const botonPausa = $("#ofPausa");
  botonPausa.onclick = () => {
    pausado = !pausado;
    botonPausa.textContent = pausado ? "Reanudar" : "Pausar";
    auto();
  };

  $("#ofAnt").onclick = () => { ir(-1); auto(); };
  $("#ofSig").onclick = () => { ir(1); auto(); };
  jugador.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    ir(e.key === "ArrowLeft" ? -1 : 1);
    auto();
  });

  let x0 = null, movio = false;
  cover.addEventListener("pointerdown", e => { x0 = e.clientX; movio = false; });
  cover.addEventListener("pointerup", e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 40) {
      ir(e.clientX < x0 ? 1 : -1);
      auto();
      movio = true;
    }
    x0 = null;
  });
  cover.addEventListener("pointercancel", () => { x0 = null; });
  cover.addEventListener("click", e => {
    const item = e.target.closest(".it");
    if (!item || (movio && e.detail)) return;
    const i = +item.dataset.i;
    if (i === idx) {
      verGrande();
    } else {
      idx = i;
      mover();
      auto();
    }
  });

  function verGrande() {
    const kit = KITS[idx];
    $("#ofGimg").src = kit.foto;
    $("#ofGimg").alt = kit.nombre;
    $("#ofGtit").textContent = kit.nombre;
    grande.classList.add("ver");
    auto();
    $("#ofX").focus({preventScroll:true});
  }
  function cerrar() {
    if (!grande.classList.contains("ver")) return;
    grande.classList.remove("ver");
    items[idx].focus({preventScroll:true});
    auto();
  }
  $("#ofX").onclick = cerrar;
  grande.addEventListener("click", e => { if (e.target === grande) cerrar(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

  const agregarKit = () => agregar(KITS[idx].id);
  const cotizarKit = () => abrirWsp(`Hola SYSAT, vi esta oferta en la web y quiero cotizarla:\n• ${KITS[idx].nombre}\n\n¿Sigue disponible? ¿Cuál es el precio final con instalación?`);
  $("#ofAgregar").onclick = agregarKit;
  $("#ofWsp").onclick = cotizarKit;
  $("#ofGag").onclick = () => { agregarKit(); cerrar(); };
  $("#ofGwsp").onclick = cotizarKit;

  mover();
  auto();
})();
