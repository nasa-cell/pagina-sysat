// Catálogo: buscador, filtros por categoría y marca.
let cat = new URLSearchParams(location.search).get("cat") || "";
const marcas = [...new Set(PRODUCTOS.map(p => p.marca))];
$("#marca").innerHTML += marcas.map(m => `<option>${m}</option>`).join("");
$("#filtros").innerHTML = `<button data-c="">Todos</button>` + Object.entries(CATEGORIAS).map(([k, v]) => `<button data-c="${k}">${v}</button>`).join("");

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
  $$("#filtros button").forEach(b => b.classList.toggle("on", b.dataset.c === cat));
  $("#conteo").textContent = `${lista.length} de ${PRODUCTOS.length} productos`;
  if (lista.length) pintarTarjetas($("#rejilla"), lista);
  else $("#rejilla").innerHTML = `<div class="vacio">No encontramos «${$("#q").value}». Prueba con otra palabra o escríbenos por WhatsApp.</div>`;
}
$("#q").addEventListener("input", filtrar);
$("#marca").addEventListener("change", filtrar);
$("#filtros").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; cat = b.dataset.c; filtrar(); });
filtrar();
