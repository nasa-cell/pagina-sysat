// Inicio: título, destacados, visión nocturna, arma tu kit y trabajos.

/* título con entrada 3D por palabra */
const h1 = $("#titulo");
h1.innerHTML = h1.textContent.trim().split(/\s+/).map((w, i) => `<span style="animation-delay:${0.1 + i * 0.12}s">${w}&nbsp;</span>`).join("");

/* destacados: dos por categoría principal */
const destacados = ["hikvision-ds2cd2023g2-iu", "ezviz-c6", "ezviz-c8w", "hikvision-ds2de4225iw-de", "hikvision-ds2cd1327g0-luf", "ezviz-hb8", "hikvision-ds2ce56d0t-irpf", "grandstream-gds3710"].map(porId);
const rejillaDestacados = $("#destacados");
const masDestacados = $("#masDestacados");
pintarTarjetas(rejillaDestacados, destacados);
masDestacados.addEventListener("click", e => {
  const expandido = rejillaDestacados.classList.toggle("expandido");
  masDestacados.setAttribute("aria-expanded", String(expandido));
  masDestacados.textContent = expandido ? "Ver menos destacados" : "Ver más destacados";
  if (expandido && e.detail === 0) rejillaDestacados.children[4].querySelector(".ver").focus();
  if (!expandido) masDestacados.scrollIntoView({block:"nearest"});
});

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
const menuTrabajos = $("#menuT");
const resumenTrabajos = menuTrabajos.querySelector("summary");
const filtrosTrabajos = $("#filtrosT");
const galeriaTrabajos = $("#listaT");
const masTrabajos = $("#masT");
const galeriaMovil = matchMedia("(max-width: 700px)");
const categoriasTrabajos = { "": "Todos los trabajos", ...SERVICIOS };
let trabajosFiltrados = TRABAJOS;

filtrosTrabajos.innerHTML = Object.entries(categoriasTrabajos).map(([id, nombre]) =>
  '<button type="button" data-categoria="' + id + '" aria-pressed="' + (id === "") + '">' + nombre + '</button>'
).join("");

function cargarTrabajos() {
  const inicio = galeriaTrabajos.children.length;
  const cantidad = galeriaMovil.matches ? 4 : 6;
  const lote = trabajosFiltrados.slice(inicio, inicio + cantidad);
  galeriaTrabajos.insertAdjacentHTML("beforeend", lote.map(([archivo, id]) => {
    const foto = "imagenes/trabajos/" + archivo + ".jpg";
    const servicio = SERVICIOS[id];
    const numero = archivo.split("-").at(-1);
    return `<figure>
      <button class="trabajos-foto" type="button" data-foto="${foto}" data-txt="${servicio}" aria-label="Ampliar foto ${numero} de ${servicio}">
        <img src="${foto}" alt="" loading="lazy">
      </button>
      <figcaption>${servicio}</figcaption>
    </figure>`;
  }).join(""));
  const visibles = galeriaTrabajos.children.length;
  $("#totalT").textContent = visibles + " de " + trabajosFiltrados.length + " fotos";
  masTrabajos.hidden = visibles >= trabajosFiltrados.length;
  return galeriaTrabajos.children[inicio]?.querySelector("button");
}

filtrosTrabajos.addEventListener("click", e => {
  const boton = e.target.closest("[data-categoria]");
  if (!boton) return;
  const categoria = boton.dataset.categoria;
  filtrosTrabajos.querySelector('[aria-pressed="true"]').setAttribute("aria-pressed", "false");
  boton.setAttribute("aria-pressed", "true");
  $("#categoriaT").textContent = categoriasTrabajos[categoria];
  trabajosFiltrados = categoria ? TRABAJOS.filter(([, id]) => id === categoria) : TRABAJOS;
  galeriaTrabajos.replaceChildren();
  cargarTrabajos();
  menuTrabajos.open = false;
  resumenTrabajos.focus();
});
menuTrabajos.addEventListener("keydown", e => {
  if (e.key !== "Escape" || !menuTrabajos.open) return;
  menuTrabajos.open = false;
  resumenTrabajos.focus();
});
document.addEventListener("click", e => {
  if (menuTrabajos.open && !menuTrabajos.contains(e.target)) menuTrabajos.open = false;
});
masTrabajos.addEventListener("click", e => {
  const primeraNueva = cargarTrabajos();
  if (e.detail === 0 || masTrabajos.hidden) primeraNueva?.focus();
});
galeriaTrabajos.addEventListener("click", e => {
  const foto = e.target.closest("[data-foto]");
  if (foto) verFoto(foto.dataset.foto, foto.dataset.txt);
});
cargarTrabajos();

$("#numWsp").textContent = WHATSAPP.replace(/^51(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
$("#enlaceWsp").href = `https://wa.me/${WHATSAPP}`;
