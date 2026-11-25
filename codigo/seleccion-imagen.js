// Genera la imagen localmente con los datos de la selección.
function crearImagenSeleccion(elementos, datos) {
  const lienzo = document.createElement("canvas");
  const dibujo = lienzo.getContext("2d");
  const ancho = 800;
  const margen = 36;
  const textoProducto = "700 25px sans-serif";
  const textoSecundario = "19px sans-serif";
  const textoDatos = "21px sans-serif";

  function envolver(texto, fuente, anchoMaximo) {
    dibujo.font = fuente;
    const lineas = [];
    let actual = "";
    for (const palabra of texto.split(/\s+/).filter(Boolean)) {
      const siguiente = actual ? actual + " " + palabra : palabra;
      if (dibujo.measureText(siguiente).width <= anchoMaximo) {
        actual = siguiente;
        continue;
      }
      if (actual) lineas.push(actual);
      actual = "";
      for (const letra of palabra) {
        if (dibujo.measureText(actual + letra).width > anchoMaximo) {
          lineas.push(actual);
          actual = "";
        }
        actual += letra;
      }
    }
    if (actual) lineas.push(actual);
    return lineas;
  }

  const datosVisibles = [
    datos.nombre && "Cliente: " + datos.nombre,
    datos.lugar && "Lugar de instalación: " + datos.lugar
  ].filter(Boolean).flatMap(linea => envolver(linea,textoDatos,ancho - margen * 2));
  const filas = elementos.map(({producto,cantidad}) => {
    const nombre = envolver(producto.nombre,textoProducto,548);
    const modelo = envolver(producto.kit ? "Oferta SYSAT" : producto.marca + " · " + producto.modelo,textoSecundario,548);
    return {nombre,modelo,cantidad,alto:26 + nombre.length * 29 + modelo.length * 23};
  });

  const inicioFilas = 175 + datosVisibles.length * 26;
  const finFilas = inicioFilas + filas.reduce((total,fila) => total + fila.alto,0);
  const alto = finFilas + 84;
  const altoExportado = Math.min(alto,3900);
  lienzo.width = Math.max(1,Math.floor(ancho * altoExportado / alto));
  lienzo.height = altoExportado;
  dibujo.scale(lienzo.width / ancho,lienzo.height / alto);
  dibujo.textBaseline = "top";

  function rectangulo(x,y,w,h,color) {
    dibujo.fillStyle = color;
    dibujo.fillRect(x,y,w,h);
  }
  function lineas(textos,x,y,fuente,color,paso) {
    dibujo.font = fuente;
    dibujo.fillStyle = color;
    textos.forEach((texto,i) => dibujo.fillText(texto,x,y+i*paso));
  }

  rectangulo(0,0,ancho,alto,"#f1f6fc");
  rectangulo(0,0,ancho,126,"#102e69");
  rectangulo(0,122,ancho,4,"#2c79e7");
  lineas(["SYSAT"],margen,24,"800 25px sans-serif","#9fe0ff",28);
  lineas(["Solicitud de cotización"],margen,61,"800 37px sans-serif","#fff",40);
  lineas(datosVisibles,margen,143,textoDatos,"#314767",26);
  lineas(["Equipos seleccionados"],margen,inicioFilas-28,"700 19px sans-serif","#39577f",22);
  dibujo.textAlign = "right";
  lineas(["Cantidad"],ancho-margen,inicioFilas-28,"700 19px sans-serif","#39577f",22);
  dibujo.textAlign = "left";

  let y = inicioFilas;
  for (const [indice,fila] of filas.entries()) {
    rectangulo(20,y,760,fila.alto,indice % 2 === 0 ? "#fff" : "#e8f0fb");
    lineas(fila.nombre,margen,y+13,textoProducto,"#0d244a",29);
    lineas(fila.modelo,margen,y+13+fila.nombre.length*29,textoSecundario,"#456082",23);
    dibujo.textAlign = "right";
    lineas([String(fila.cantidad)],ancho-margen,y+13,textoProducto,"#123b84",29);
    dibujo.textAlign = "left";
    y += fila.alto;
  }
  const unidades = elementos.reduce((total,fila) => total + Number(fila.cantidad),0);
  lineas(["Total: " + unidades + (unidades === 1 ? " unidad" : " unidades")],margen,finFilas+14,"800 23px sans-serif","#0d244a",28);
  lineas(["Precios y disponibilidad sujetos a cotización."],margen,finFilas+46,textoSecundario,"#456082",24);

  const contenido = lienzo.toDataURL("image/png").split(",")[1];
  if (!contenido) throw new Error("No se pudo codificar el resumen.");
  const bytes = Uint8Array.from(atob(contenido),letra => letra.charCodeAt(0));
  return new File([bytes],"seleccion-sysat.png",{type:"image/png"});
}