// Kits y ofertas: carrusel 3D con las publicidades de SYSAT.
(() => {
  const cover = $("#cover"); if (!cover) return;
  let idx = 0, pausa = false, tAuto;
  cover.insertAdjacentHTML("beforeend", KITS.map((k, i) =>
    `<div class="it" data-i="${i}"><img src="${k.foto}" alt="${k.nombre}" ${i > 3 ? 'loading="lazy"' : ""} draggable="false"></div>`).join(""));
  $("#ofPuntos").innerHTML = KITS.map(() => "<i></i>").join("");
  document.body.insertAdjacentHTML("beforeend", `<div class="grande" id="ofGrande"><button class="x" id="ofX" aria-label="Cerrar">✕</button>
    <div class="caja"><img id="ofGimg" alt=""><div class="pie"><small>Precio sugerido: confirma el precio final por WhatsApp</small><b id="ofGtit"></b>
    <button class="btn-agregar" id="ofGag">+ Agregar a mi selección</button><button class="cotizar" id="ofGwsp">Cotizar por WhatsApp</button></div></div></div>`);
  const items = $$("#cover .it"), puntos = $$("#ofPuntos i"), grande = $("#ofGrande");

  function mover() {
    const n = KITS.length;
    items.forEach(el => {
      let d = +el.dataset.i - idx; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
      const a = Math.abs(d);
      el.style.transform = `translateX(calc(-50% + ${d * 58}%)) translateZ(${-a * 180}px) rotateY(${-Math.sign(d) * Math.min(a, 1) * 38}deg)`;
      el.style.opacity = a > 2 ? 0 : 1; el.style.zIndex = 20 - a;
      el.style.filter = a ? "brightness(.75)" : "none"; el.style.pointerEvents = a > 2 ? "none" : "";
    });
    puntos.forEach((p, i) => p.classList.toggle("on", i === idx));
    $("#ofTit").textContent = KITS[idx].nombre;
  }
  const ir = d => { idx = (idx + d + KITS.length) % KITS.length; mover(); };
  function auto() { clearInterval(tAuto); tAuto = setInterval(() => { if (!pausa && !grande.classList.contains("ver") && !document.hidden) ir(1); }, 3500); }

  $("#ofAnt").onclick = () => { ir(-1); auto(); };
  $("#ofSig").onclick = () => { ir(1); auto(); };
  cover.addEventListener("keydown", e => { if (e.key === "ArrowLeft") { ir(-1); auto(); } if (e.key === "ArrowRight") { ir(1); auto(); } });
  cover.addEventListener("pointerenter", () => pausa = true);
  cover.addEventListener("pointerleave", () => pausa = false);
  let x0 = null, movio = false;
  cover.addEventListener("pointerdown", e => { x0 = e.clientX; movio = false; });
  cover.addEventListener("pointerup", e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 40) { ir(e.clientX < x0 ? 1 : -1); auto(); movio = true; }
    x0 = null; if (e.pointerType === "touch") pausa = false;
  });
  cover.addEventListener("click", e => {
    const it = e.target.closest(".it"); if (!it || movio) return;
    const i = +it.dataset.i;
    if (i === idx) verGrande(); else { idx = i; mover(); auto(); }
  });

  function verGrande() {
    const k = KITS[idx]; $("#ofGimg").src = k.foto; $("#ofGimg").alt = k.nombre; $("#ofGtit").textContent = k.nombre;
    grande.classList.add("ver");
  }
  const cerrar = () => grande.classList.remove("ver");
  $("#ofX").onclick = cerrar;
  grande.addEventListener("click", e => { if (e.target === grande) cerrar(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

  const agregarKit = () => agregar(KITS[idx].id);
  const cotizarKit = () => abrirWsp(`Hola SYSAT, vi esta oferta en la web y quiero cotizarla:\n• ${KITS[idx].nombre}\n\n¿Sigue disponible? ¿Cuál es el precio final con instalación?`);
  $("#ofAgregar").onclick = agregarKit; $("#ofWsp").onclick = cotizarKit;
  $("#ofGag").onclick = () => { agregarKit(); cerrar(); }; $("#ofGwsp").onclick = cotizarKit;

  mover(); auto();
})();
