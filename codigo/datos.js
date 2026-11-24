// Productos del catálogo SYSAT 2023. "pag" = página del catálogo en línea (flipbook).
const CATALOGO_URL = "https://online.flipbuilder.com/SYSAT/ymnz/";
const WHATSAPP = "51941052910";

const CATEGORIAS = {
  wifi: "Cámaras WiFi",
  bateria: "Batería y solar",
  analogica: "Analógicas Turbo HD",
  ip: "Cámaras IP",
  ptz: "Con movimiento (PTZ)",
  video: "Videoconferencia y videoportero",
  accesorio: "Accesorios"
};

const PRODUCTOS = [
  // EZVIZ interiores y exteriores (pág. 4-5)
  { id: "ezviz-c2c", marca: "EZVIZ", modelo: "CS-C2C-B0-1E2WF", nombre: "C2C mini cámara interior", cat: "wifi", pag: 4, car: ["1080p", "Visión nocturna hasta 10 m", "Ángulo de visión 111° diagonal", "Audio bidireccional", "WiFi 2.4 GHz", "Base magnética", "MicroSD hasta 256 GB (no incluida)"] },
  { id: "ezviz-c6n-4mp-y-1080p", marca: "EZVIZ", modelo: "CS-C6N-R101-1G2WF / CS-C6N-4MP", nombre: "C6N cámara 360° interior", cat: "wifi", pag: 4, car: ["Versiones 1080p y 4MP", "Cobertura visual de 360°", "Pan 340° · Tilt 120°", "Seguimiento inteligente", "Audio bidireccional", "Visión nocturna hasta 10 m", "MicroSD hasta 256 GB (no incluida)"] },
  { id: "ezviz-c6", marca: "EZVIZ", modelo: "CS-C6-A0-8C4WF", nombre: "C6 cámara 360° 2K+", cat: "wifi", pag: 4, car: ["Resolución 2K+", "Cobertura visual 360°", "Seguimiento inteligente", "Detección de movimiento con IA", "Visión nocturna a color", "WiFi doble banda 2.4/5 GHz", "Alertas de voz personalizables"] },
  { id: "ezviz-c3tn-1080p", marca: "EZVIZ", modelo: "CS-C3TN-A0-1H2WF", nombre: "C3TN exterior 1080p", cat: "wifi", pag: 4, car: ["1080p", "Visión nocturna hasta 30 m", "Captura de sonido", "Compresión H.265", "WiFi 2.4 GHz con antenas internas", "Grado IP67"] },
  { id: "ezviz-c3tn-2k", marca: "EZVIZ", modelo: "CS-C3TN-A0-1H3WKFL", nombre: "C3TN exterior 2K+", cat: "wifi", pag: 4, car: ["Resolución 2K+", "Visión nocturna hasta 30 m", "Audio bidireccional", "Compresión H.265", "WiFi con dos antenas externas", "Grado IP67"] },
  { id: "ezviz-c3w-pro", marca: "EZVIZ", modelo: "CS-C3W-A0-1F4WFL / 3H2WFL", nombre: "C3W Pro exterior", cat: "wifi", pag: 4, car: ["Versiones 1080p y 4MP", "Visión nocturna a color hasta 30 m", "Detección de personas", "Percepción de audio hasta 5 m", "WiFi con dos antenas externas", "Grado IP67"] },
  { id: "ezviz-c3x", marca: "EZVIZ", modelo: "CS-CV310-C1-6B22WFR", nombre: "C3X lente doble", cat: "wifi", pag: 5, car: ["1080p · lente doble 2.8 mm", "Visión nocturna a color", "Detecta personas y vehículos", "Defensa activa con sirena y luz", "Alertas de voz personalizables", "Grado IP67"] },
  { id: "ezviz-c8c-lite", marca: "EZVIZ", modelo: "CS-C8C-A0-1F2WF", nombre: "C8C Lite exterior 360°", cat: "wifi", pag: 5, car: ["1080p", "Cobertura visual de 360°", "Captura de sonido", "Compresión H.265", "WiFi con dos antenas externas", "Grado IP65"] },
  { id: "ezviz-c8w", marca: "EZVIZ", modelo: "CS-C8W-A0-1F4WKFL", nombre: "C8W exterior 360° 2K+", cat: "wifi", pag: 5, car: ["Resolución 2K+", "Visión nocturna a color hasta 30 m", "Cobertura visual de 360°", "Detección de personas", "Defensa activa", "Grado IP65"] },
  { id: "ezviz-c8pf", marca: "EZVIZ", modelo: "CS-C8PF-A0-6E22WFR", nombre: "C8PF lente doble con zoom", cat: "wifi", pag: 5, car: ["1080p · lente doble 2.8 y 12 mm", "Zoom mixto 8X", "Imagen en imagen", "Cobertura visual de 360°", "Visión nocturna hasta 30 m", "MicroSD hasta 512 GB (no incluida)"] },
  { id: "ezviz-lc1c", marca: "EZVIZ", modelo: "CS-LC1C-A0-1F2WPFRL", nombre: "LC1C cámara con reflectores", cat: "wifi", pag: 5, car: ["1080p", "Focos activados por movimiento PIR", "Sirena integrada", "Visión nocturna hasta 25 m", "Audio bidireccional", "WiFi 2.4 GHz"] },
  { id: "ezviz-lc3", marca: "EZVIZ", modelo: "CS-LC3-A0-8B4WDL", nombre: "LC3 lámpara con cámara", cat: "wifi", pag: 5, car: ["4MP", "Lente gran angular de 157°", "Detección de personas con IA", "Luz de 700 lúmenes", "Visión nocturna a color", "Memoria eMMC de 32 GB incluida"] },
  // EZVIZ batería (pág. 6)
  { id: "ezviz-bc2", marca: "EZVIZ", modelo: "CS-BC2 (A0-2C2WPFB)", nombre: "BC2 cámara a batería", cat: "bateria", pag: 6, car: ["2MP", "Hasta 50 días de batería (2000 mAh)", "Visión nocturna hasta 5 m", "Detección de movimiento", "Compatible con Google y Alexa", "Base magnética"] },
  { id: "ezviz-hb8", marca: "EZVIZ", modelo: "CS-HB8-R100-2C4WDL", nombre: "HB8 360° a batería", cat: "bateria", pag: 6, car: ["2K+ / 4MP", "Cobertura visual 360°", "Hasta 210 días de batería (10400 mAh)", "Detección inteligente de personas", "Visión nocturna a color", "Memoria eMMC de 32 GB incluida"] },
  { id: "ezviz-bc1c", marca: "EZVIZ", modelo: "CS-BC1C", nombre: "BC1C exterior a batería", cat: "bateria", pag: 6, car: ["1080p", "Hasta 210 días de batería", "Detección de personas", "Defensa activa", "Visión nocturna a color", "Grado IP66 · carga opcional con panel solar"] },
  { id: "ezviz-eb3", marca: "EZVIZ", modelo: "CS-EB3-R100-2C3WFL", nombre: "EB3 exterior a batería", cat: "bateria", pag: 6, car: ["2K / 3MP", "Hasta 120 días de batería (5200 mAh)", "Detección de movimiento humano", "Defensa activa con sirena y luz", "Visión nocturna a color", "Resistente a la intemperie"] },
  { id: "ezviz-cmt-solar", marca: "EZVIZ", modelo: "CS-CMT-SOLAR", nombre: "Panel solar para cámaras", cat: "bateria", pag: 6, car: ["Energía solar ecológica", "Celdas de silicio monocristalino", "Cable de 4 m", "Hasta 6.18 W de carga", "Grado IP65", "Compatible con EB3, HB8 y BC1C"] },
  // Hikvision analógicas Turbo HD (pág. 8)
  { id: "hikvision-ds2ce56c0t-irpf", marca: "Hikvision", modelo: "HK-DS2CE56C0T-IRPF", nombre: "Domo Turbo HD 720p", cat: "analogica", pag: 8, car: ["Tipo domo · 720p", "Plástico", "Lente 2.8 mm (92°)", "IR 20 m", "Tecnología 4 en 1"] },
  { id: "hikvision-ds2ce16c0t-irpf", marca: "Hikvision", modelo: "HK-DS2CE16C0T-IRPF", nombre: "Bala Turbo HD 720p", cat: "analogica", pag: 8, car: ["Tipo tubo · 720p", "Plástico", "Lente 2.8 mm (92°)", "IR 20 m", "Grado IP66"] },
  { id: "hikvision-ds2ce56d0t-irpf", marca: "Hikvision", modelo: "HK-DS2CE56D0T-IRPF", nombre: "Domo Turbo HD 1080p", cat: "analogica", pag: 8, car: ["Tipo domo · 2MP", "Plástico", "Lente 2.8 mm (101°)", "IR 20 m", "Tecnología 4 en 1"] },
  { id: "hikvision-ds2ce56d0t-irmf", marca: "Hikvision", modelo: "HK-DS2CE56D0T-IRMF", nombre: "Domo metálico 1080p", cat: "analogica", pag: 8, car: ["Tipo domo · 2MP", "Metal", "Lente 2.8 mm (101°)", "IR 25 m", "Grado IP67"] },
  { id: "hikvision-ds2ce56d0t-it3f", marca: "Hikvision", modelo: "HK-DS2CE56D0T-IT3F", nombre: "Domo exterior 1080p IR 40 m", cat: "analogica", pag: 8, car: ["Tipo domo · 2MP", "Lente 2.8 mm (103°)", "IR 40 m", "Grado IP66", "Tecnología 4 en 1"] },
  { id: "hikvision-ds2ce76d0t-itpfs", marca: "Hikvision", modelo: "HK-DS2CE76D0T-ITPFS", nombre: "Domo 1080p con micrófono", cat: "analogica", pag: 8, car: ["Tipo domo · 2MP", "Lente 2.8 mm (106.4°)", "IR 20 m", "Micrófono incorporado", "Tecnología 4 en 1"] },
  { id: "hikvision-ds2ce79d0t-vfit3f", marca: "Hikvision", modelo: "HK-DS2CE79D0T-VFIT3F", nombre: "Domo varifocal 1080p", cat: "analogica", pag: 8, car: ["Tipo domo · 2MP", "Metal", "Lente varifocal 2.7 a 13.5 mm", "IR 40 m", "Grado IP67"] },
  { id: "hikvision-ds2ce16d0t-irf", marca: "Hikvision", modelo: "HK-DS2CE16D0T-IRF", nombre: "Bala metálica 1080p", cat: "analogica", pag: 8, car: ["Tipo tubo · 2MP", "Metal", "Lente 2.8 mm (101°)", "IR 25 m", "Grado IP67"] },
  // Hikvision IP (pág. 16 y 18)
  { id: "hikvision-ds2cd2023g2-iu", marca: "Hikvision", modelo: "HK-DS2CD2023G2-IU", nombre: "Bala IP 2MP AcuSense", cat: "ip", pag: 16, car: ["Tipo tubo · 2MP · metal", "Lente 2.8 mm (107°)", "IR 40 m · WDR 120 dB", "PoE · grado IP67", "AcuSense (distingue personas y vehículos)", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd1623g0-iz", marca: "Hikvision", modelo: "HK-DS2CD1623G0-IZ", nombre: "Bala IP 2MP zoom motorizado", cat: "ip", pag: 16, car: ["Tipo tubo · 2MP · metal", "Lente varifocal motorizado 2.8 a 12 mm", "IR 50 m", "PoE · grado IP67", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd2625fwd-izs", marca: "Hikvision", modelo: "HK-DS2CD2625FWD-IZS", nombre: "Bala IP 2MP varifocal antivandálica", cat: "ip", pag: 16, car: ["Tipo tubo · 2MP · metal", "Lente motorizado 2.8 a 12 mm", "IR 50 m · WDR 120 dB", "IP66 · IK10 · PoE", "MicroSD hasta 128 GB"] },
  { id: "hikvision-ds2cv2q21fd-iw", marca: "Hikvision", modelo: "HK-DS2CV2Q21FD-IW", nombre: "Cubo PT WiFi 2MP", cat: "ip", pag: 16, car: ["Tipo cubo con giro (PT)", "2MP · lente 2.8 mm", "IR 10 m", "Audio", "MicroSD hasta 128 GB"] },
  { id: "hikvision-ds2cd2423g0-iw", marca: "Hikvision", modelo: "HK-DS2CD2423G0-IW", nombre: "Cubo IP 2MP con PIR", cat: "ip", pag: 16, car: ["Tipo cubo · 2MP", "Lente 2.8 mm (114°)", "IR 10 m", "Sensor PIR · audio · PoE", "MicroSD hasta 128 GB"] },
  { id: "hikvision-ds2cd1143g0-i", marca: "Hikvision", modelo: "HK-DS2CD1143G0-I", nombre: "Domo IP 4MP antivandálico", cat: "ip", pag: 16, car: ["Tipo domo · 4MP · metal", "Lente 2.8 mm (98°)", "WDR 120 dB", "IP67 · IK10 · PoE"] },
  { id: "hikvision-ds2cd1343g0-i", marca: "Hikvision", modelo: "HK-DS2CD1343G0-I", nombre: "Domo IP 4MP", cat: "ip", pag: 16, car: ["Tipo domo · 4MP · metal", "Lente 2.8 mm (98°)", "IR 30 m", "IP67 · audio · PoE", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd1743g0-iz", marca: "Hikvision", modelo: "HK-DS2CD1743G0-IZ", nombre: "Domo IP 4MP zoom motorizado", cat: "ip", pag: 16, car: ["Tipo domo · 4MP · metal", "Lente motorizado 2.8 a 12 mm", "IR 30 m", "IP67 · IK10 · PoE"] },
  { id: "hikvision-ds2cd2746g2-izs", marca: "Hikvision", modelo: "HK-DS2CD2746G2-IZS", nombre: "Domo IP 4MP AcuSense varifocal", cat: "ip", pag: 16, car: ["Tipo domo · 4MP · metal", "Lente motorizado 2.8 a 12 mm", "IR 40 m · WDR 120 dB", "IP66 · IK10 · PoE · audio", "AcuSense"] },
  { id: "hikvision-ds2cd1327g0-l", marca: "Hikvision", modelo: "HK-DS2CD1327G0-L", nombre: "Domo ColorVu IP 2MP", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo domo · 2MP · metal", "Lente 2.8 mm (107°)", "Luz blanca 30 m · WDR 120 dB", "IP67 · PoE"] },
  { id: "hikvision-ds2cd1327g0-luf", marca: "Hikvision", modelo: "HK-DS2CD1327G0-LUF", nombre: "Domo ColorVu IP 2MP con audio", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo domo · 2MP · metal", "Luz blanca 30 m", "Audio · IP67 · PoE", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd1027g0-l", marca: "Hikvision", modelo: "HK-DS2CD1027G0-L", nombre: "Bala ColorVu IP 2MP", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo tubo · 2MP · metal", "Lente 2.8 mm (107°)", "Luz blanca 30 m", "IP67 · PoE"] },
  { id: "hikvision-ds2cd1027g0-luf", marca: "Hikvision", modelo: "HK-DS2CD1027G0-LUF", nombre: "Bala ColorVu IP 2MP con audio", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo tubo · 2MP · metal", "Lente 2.8 mm (105.2°)", "Audio · IP67 · PoE", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd1047g0-luf", marca: "Hikvision", modelo: "HK-DS2CD1047G0-LUF", nombre: "Bala ColorVu IP 4MP con audio", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo tubo · 4MP · metal", "Lente 2.8 mm (96.5°)", "Audio · IP67 · PoE", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2cd1347g0-luf", marca: "Hikvision", modelo: "HK-DS2CD1347G0-LUF", nombre: "Domo ColorVu IP 4MP con audio", cat: "ip", pag: 18, car: ["Imagen a color de noche (ColorVu)", "Tipo domo · 4MP · metal", "Luz blanca 30 m · WDR 120 dB", "Audio · IP67 · PoE", "MicroSD hasta 256 GB"] },
  // PTZ (pág. 18)
  { id: "hikvision-ds2de2c400mw-de", marca: "Hikvision", modelo: "HK-DS2DE2C400MW-DE", nombre: "Mini PTZ 4MP con altavoz", cat: "ptz", pag: 18, car: ["Gira e inclina · 4MP · metal", "Lente 2.8 mm (97°)", "IR 30 m", "Micrófono y altavoz", "IP66 · PoE", "MicroSD hasta 256 GB"] },
  { id: "hikvision-ds2de2a404iw-de3", marca: "Hikvision", modelo: "HK-DS2DE2A404IW-DE3", nombre: "Domo PTZ 4MP zoom 4x", cat: "ptz", pag: 18, car: ["Domo PTZ · 4MP · metal", "Lente 2.8 a 12 mm", "Zoom óptico 4x · digital 16x", "IR 20 m · WDR 120 dB", "IP66 · IK10 · PoE"] },
  { id: "hikvision-ds2de4225iw-de", marca: "Hikvision", modelo: "HK-DS2DE4225IW-DE", nombre: "Domo PTZ 2MP zoom 25x", cat: "ptz", pag: 18, car: ["Domo PTZ · 2MP · metal", "Lente 4.8 a 120 mm", "Zoom óptico 25x · digital 16x", "IR 100 m · WDR 120 dB", "IP66 · PoE · audio · alarma", "MicroSD hasta 256 GB"] },
  // Grandstream (pág. 45)
  { id: "grandstream-gvc3210", marca: "Grandstream", modelo: "GVC3210", nombre: "Videoconferencia 4K", cat: "video", pag: 45, car: ["Resolución hasta 4K", "16 M píxeles y ePTZ", "Campo de visión de 90°", "Bluetooth e infrarrojo", "Control remoto con touchpad"] },
  { id: "grandstream-gvc3200", marca: "Grandstream", modelo: "GVC-3200", nombre: "Videoconferencia Full HD con PTZ", cat: "video", pag: 45, car: ["Full HD multiplataforma", "Cámara PTZ", "3 salidas de video", "Sistema Android", "Incluye base de audio GS-GAC2500"] },
  { id: "grandstream-gac2500", marca: "Grandstream", modelo: "GS-GAC2500", nombre: "Teléfono de conferencia Android", cat: "video", pag: 45, car: ["Conferencia de 6 líneas", "Llamadas de 7 vías", "Pantalla táctil", "Gigabit · PoE · WiFi", "Audio HD"] },
  { id: "grandstream-gds3710", marca: "Grandstream", modelo: "GS-GDS3710", nombre: "Videoportero IP HD", cat: "video", pag: 45, car: ["Full HD", "Cámara IP de 180°", "Lector RFID", "Micrófono y altavoz", "Metálico · PoE · ONVIF"] },
  { id: "grandstream-inyector-poe", marca: "Grandstream", modelo: "GS-POE-INJECTOR", nombre: "Inyector PoE 48 V", cat: "accesorio", pag: 45, car: ["Inyector PoE 802.3af", "48 V", "Para equipos Grandstream"] },
  // Accesorios Hikvision (pág. 24)
  { id: "hikvision-ae-dc2018-k2", marca: "Hikvision", modelo: "HK-AE-DC2018-K2", nombre: "Cámara para auto 1080p", cat: "accesorio", pag: 24, car: ["1080p gran angular (122°)", "Micrófono y altavoz", "WiFi incorporado", "Tarjeta hasta 128 GB", "Sensor G (detecta golpes)"] },
  { id: "hikvision-ae-dc5313-c6", marca: "Hikvision", modelo: "HK-AE-DC5313-C6", nombre: "Cámara para auto 1600p con pantalla", cat: "accesorio", pag: 24, car: ["1600p gran angular (130°)", "Visión nocturna F1.6", "Pantalla IPS de 3 pulgadas", "Control por voz y ADAS", "WiFi · Sensor G"] },
  { id: "hikvision-hs-tf-l2i-32g", marca: "Hikvision", modelo: "HK-HS-TF-L2I/32G", nombre: "MicroSD 32 GB videovigilancia", cat: "accesorio", pag: 24, car: ["32 GB", "Lectura hasta 90 MB/s", "Escritura hasta 20 MB/s", "Especial para videovigilancia"] },
  { id: "hikvision-hs-tf-l2i-64g", marca: "Hikvision", modelo: "HK-HS-TF-L2I/64G", nombre: "MicroSD 64 GB videovigilancia", cat: "accesorio", pag: 24, car: ["64 GB", "Lectura hasta 95 MB/s", "Escritura hasta 24 MB/s", "Especial para videovigilancia"] },
  { id: "hikvision-hs-tf-l2i-128g", marca: "Hikvision", modelo: "HK-HS-TF-L2I/128G", nombre: "MicroSD 128 GB videovigilancia", cat: "accesorio", pag: 24, car: ["128 GB", "Lectura hasta 95 MB/s", "Escritura hasta 24 MB/s", "Especial para videovigilancia"] },
  { id: "hikvision-ds-1ln5e", marca: "Hikvision", modelo: "HK-DS-1LN5E-E/E", nombre: "Cable UTP Cat 5e (305 m)", cat: "accesorio", pag: 24, car: ["Rollo de 305 metros", "Categoría 5e", "Conductor de 0.45 mm", "Para CCTV"] },
  { id: "hikvision-ds-1ln6", marca: "Hikvision", modelo: "HK-DS-1LN6-UE-W", nombre: "Cable UTP Cat 6 (305 m)", cat: "accesorio", pag: 24, car: ["Rollo de 305 metros", "Categoría 6", "Conductor de 0.53 mm", "Para CCTV"] },
  { id: "hikvision-ds-1h18s-e", marca: "Hikvision", modelo: "HK-DS-1H18S/E", nombre: "Convertidor de video (balun)", cat: "accesorio", pag: 24, car: ["Convertidor de video HD", "1 canal", "Entrada BNC a UTP"] }
];

// Las 4 cámaras de la plataforma 3D del inicio
const DESTACADOS_3D = {
  bala: "hikvision-ds2cd2023g2-iu",
  domo: "hikvision-ds2ce56d0t-irpf",
  ptz: "hikvision-ds2de4225iw-de",
  wifi: "ezviz-c6"
};

/* Kits y ofertas: publicidades de SYSAT (precios sugeridos dentro de la imagen) */
const KITS = [
  ["kit-hogar-01", "Kit Hogar 01 · 4 cámaras 720p"], ["kit-hogar-02", "Kit Hogar 02 · 4 cámaras 1080p"], ["kit-hogar-03-audio", "Kit Hogar 03 · 4 cámaras con audio"],
  ["kit-hogar-03-5mp", "Kit Hogar 03 · 4 cámaras 5MP"], ["kit-hogar-ip-01", "Kit Hogar IP 01 · 2MP"], ["kit-hogar-ip-02-4mp", "Kit Hogar IP 02 · 4MP"],
  ["kit-hogar-ip-03-4k", "Kit Hogar IP 03 · 4K"], ["kit-4-camaras-1080-audio", "Kit 4 cámaras 1080p con audio"], ["kit-8-camaras-1080-audio", "Kit 8 cámaras 1080p con audio"],
  ["kit-8-camaras-720", "Kit 8 cámaras 720p"], ["kit-4-camaras-720", "Kit 4 cámaras 720p"], ["kit-4-camaras-ip-2mp", "Kit 4 cámaras IP 2MP (PoE)"],
  ["duo-ezviz-interior", "DUO EZVIZ interior"], ["duo-ezviz-exterior", "DUO EZVIZ exterior"], ["duo-ezviz-exterior-ptz", "DUO EZVIZ exterior giratoria"],
  ["duo-ezviz-exterior-bateria", "DUO EZVIZ exterior con batería"], ["camara-sin-cables-bateria", "Cámara sin cables con batería"], ["camara-4g-solar-2k", "Cámara 4G 2K con panel solar"],
  ["camara-4g-solar-4mp", "Cámara 4G 4MP con panel solar"], ["kit-alarma-hikvision", "Kit alarma Hikvision"], ["kit-alarma-inalambrica-ezviz", "Kit alarma inalámbrica"],
  ["kit-alarma-wifi-64-zonas", "Kit alarma WiFi 64 zonas"], ["detector-robo-tienda", "Detector de robo para tienda"], ["kit-videoportero-01", "Kit videoportero Hikvision"],
  ["kit-videoportero-wifi-ezviz", "Kit videoportero WiFi EZVIZ"], ["kit-videoportero-hikvision", "Kit video portero analógico"], ["protege-tu-hogar", "Protege tu hogar · videocámara de regalo"],
  ["mantenimiento-cctv", "Mantenimiento de cámaras CCTV"], ["mantenimiento-cerco-electrico", "Mantenimiento de cerco eléctrico"]
].map(([f, nombre]) => ({ id: "kit-" + f, foto: `imagenes/kits/${f}.webp`, nombre, marca: "Oferta SYSAT", modelo: "precio sugerido", kit: true }));
