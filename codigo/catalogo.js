// Catálogo: buscador, filtros por categoría y marca.
const selectorCategoria = $("#categoriaCatalogo");
const categorias = Object.entries(CATEGORIAS);
const categoriaInicial = new URLSearchParams(location.search).get("cat");
let cat = Object.hasOwn(CATEGORIAS,categoriaInicial) ? categoriaInicial : "";
const marcas = [...new Set(PRODUCTOS.map(p => p.marca))];
$("#marca").innerHTML += marcas.map(m => `<option>${m}</option>`).join("");
for (const [id,nombre] of categorias) selectorCategoria.add(new Option(nombre,id));
$("#filtros").innerHTML = `<button data-c="">Todos</button>` + categorias.map(([id,nombre]) =>
  `<button data-c="${id}">${nombre}</button>`
).join("");

const sinTildes = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function filtrar() {
  const palabras = sinTildes($("#q").value).split(/\s+/).filter(Boolean);
  const marca = $("#marca").value;
  const lista = PRODUCTOS.filter(p => {
    if (cat && p.cat !== cat) return false;
    if (marca && p.marca !== marca) return false;
    const txt = sinTildes([p.nombre, p.marca, p.modelo, CATEGORIAS[p.cat], ...p.car].join(" "));
    return palabras.every(w => txt.includes(w));
  });
  selectorCategoria.value = cat;
  $$("#filtros button").forEach(boton => {
    const activo = boton.dataset.c === cat;
    boton.classList.toggle("on",activo);
    boton.setAttribute("aria-pressed",String(activo));
  });
  $("#conteo").textContent = `${lista.length} de ${PRODUCTOS.length} productos`;
  if (lista.length) pintarTarjetas($("#rejilla"), lista);
  else $("#rejilla").innerHTML = `<div class="vacio">No encontramos «${$("#q").value}». Prueba con otra palabra o escríbenos por WhatsApp.</div>`;
}
$("#q").addEventListener("input", filtrar);
$("#marca").addEventListener("change", filtrar);
selectorCategoria.addEventListener("change", () => {
  cat = selectorCategoria.value;
  filtrar();
});
$("#filtros").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; cat = b.dataset.c; filtrar(); });
filtrar();
