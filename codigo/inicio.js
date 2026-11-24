// Inicio: título, destacados, visión nocturna, arma tu kit y trabajos.

/* título con entrada 3D por palabra */
const h1 = $("#titulo");
h1.innerHTML = h1.textContent.trim().split(/\s+/).map((w, i) => `<span style="animation-delay:${0.1 + i * 0.12}s">${w}&nbsp;</span>`).join("");

/* destacados: dos por categoría principal */
const destacados = ["hikvision-ds2cd2023g2-iu", "ezviz-c6", "ezviz-c8w", "hikvision-ds2de4225iw-de", "hikvision-ds2cd1327g0-luf", "ezviz-hb8", "hikvision-ds2ce56d0t-irpf", "grandstream-gds3710"].map(porId);
pintarTarjetas($("#destacados"), destacados);

/* visión nocturna: barra que se arrastra */
const noche = $("#noche");
let arrN = false;
function corte(e) { const r = noche.getBoundingClientRect(); noche.style.setProperty("--corte", Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)) + "%"); }
noche.addEventListener("pointerdown", e => { arrN = true; noche.setPointerCapture(e.pointerId); corte(e); });
noche.addEventListener("pointermove", e => arrN && corte(e));
noche.addEventListener("pointerup", () => arrN = false);

/* trabajos hechos */
const TRABAJOS = [
  ["camaras-01", "camaras"], ["camaras-02", "camaras"], ["camaras-03", "camaras"], ["camaras-04", "camaras"], ["camaras-05", "camaras"], ["camaras-06", "camaras"], ["camaras-07", "camaras"], ["camaras-08", "camaras"],
  ["camaras-09", "camaras"], ["camaras-10", "camaras"], ["camaras-11", "camaras"], ["camaras-12", "camaras"], ["camaras-13", "camaras"], ["camaras-14", "camaras"], ["camaras-15", "camaras"], ["camaras-16", "camaras"],
  ["intercom-01", "intercom"], ["intercom-02", "intercom"], ["intercom-03", "intercom"], ["intercom-04", "intercom"], ["intercom-05", "intercom"], ["intercom-06", "intercom"], ["intercom-07", "intercom"], ["intercom-08", "intercom"],
  ["electrico-01", "electrico"], ["electrico-02", "electrico"], ["electrico-03", "electrico"],
  ["multimedia-01", "multimedia"], ["multimedia-02", "multimedia"], ["multimedia-03", "multimedia"],
  ["mantenimiento-01", "mantenimiento"], ["mantenimiento-02", "mantenimiento"], ["mantenimiento-03", "mantenimiento"], ["mantenimiento-04", "mantenimiento"], ["mantenimiento-05", "mantenimiento"],
  ["suelos-01", "suelos"], ["suelos-02", "suelos"], ["suelos-03", "suelos"]
];
const SERVICIOS = { camaras: "Cámaras", intercom: "Intercomunicadores", electrico: "Eléctrico", multimedia: "Multimedia", mantenimiento: "Mantenimiento y redes", suelos: "Estudios de suelos" };
$("#filtrosT").innerHTML = `<button class="on" data-s="">Todos</button>` + Object.entries(SERVICIOS).map(([k, v]) => `<button data-s="${k}">${v}</button>`).join("");
function pintarTrabajos(s) {
  const lista = TRABAJOS.filter(t => !s || t[1] === s);
  $("#listaT").innerHTML = lista.map(([f, k]) => `<figure class="aparece" data-foto="imagenes/trabajos/${f}.jpg" data-txt="${SERVICIOS[k]}"><img src="imagenes/trabajos/${f}.jpg" alt="Trabajo de ${SERVICIOS[k]}" loading="lazy"><figcaption>${SERVICIOS[k]}</figcaption></figure>`).join("");
  $$("#listaT figure").forEach(mirar);
}
$("#filtrosT").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  $$("#filtrosT button").forEach(x => x.classList.toggle("on", x === b)); pintarTrabajos(b.dataset.s);
});
$("#listaT").addEventListener("click", e => { const f = e.target.closest("figure"); if (f) verFoto(f.dataset.foto, f.dataset.txt); });
pintarTrabajos("");

$("#numWsp").textContent = WHATSAPP.replace(/^51(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
$("#enlaceWsp").href = `https://wa.me/${WHATSAPP}`;
