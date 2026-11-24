#!/bin/sh
# Junta las escenas 3D (banner y «Arma tu kit») con Three.js en un solo archivo
# que abre con doble clic: escenas3d.js -> escenas3d.min.js
# Herramientas en C:/herramientas/compilacion/sysat (npm i three@0.160.0 esbuild)
H=/c/herramientas/compilacion/sysat
cd "$(dirname "$0")"
NODE_PATH="$H/node_modules" "$H/node_modules/.bin/esbuild" escenas3d.js --bundle --minify --format=iife --target=es2019 --outfile=escenas3d.min.js
