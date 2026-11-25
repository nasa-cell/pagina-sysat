import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const M = {
  blanco: new THREE.MeshPhysicalMaterial({color:0xe5e9ef,roughness:.29,clearcoat:.35}),
  gris: new THREE.MeshStandardMaterial({color:0x718097,roughness:.3,metalness:.58}),
  negro: new THREE.MeshPhysicalMaterial({color:0x111722,roughness:.37,clearcoat:.38}),
  cristal: new THREE.MeshPhysicalMaterial({color:0x10192c,roughness:.1,clearcoat:1,metalness:.22}),
  lente: new THREE.MeshPhysicalMaterial({color:0x132d59,roughness:.045,clearcoat:1,metalness:.48}),
  filtro: new THREE.MeshPhysicalMaterial({color:0x134859,roughness:.095,clearcoat:.95,metalness:.46}),
  azul: new THREE.MeshStandardMaterial({color:0x4e79be,roughness:.42,metalness:.25})
};
function malla(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function add(parent, geometry, material, x=0, y=0, z=0) {
  const mesh = malla(geometry, material);
  mesh.position.set(x,y,z);
  parent.add(mesh);
  return mesh;
}
function shell(parent, profile, material, x=0, y=0, z=0, frontal=false) {
  const geometry = new THREE.LatheGeometry(profile.map(([r,h]) => new THREE.Vector2(r,h)),48);
  if (frontal) geometry.rotateX(Math.PI / 2);
  return add(parent,geometry,material,x,y,z);
}
function disc(parent, radius, depth, material, x, y, z) {
  return add(parent,new THREE.CylinderGeometry(radius,radius,depth,36).rotateX(Math.PI / 2),material,x,y,z);
}
function torus(parent,radius,thickness,material,x,y,z,horizontal=false) {
  const geometry = new THREE.TorusGeometry(radius,thickness,8,48);
  if(horizontal) geometry.rotateX(Math.PI / 2);
  return add(parent,geometry,material,x,y,z);
}
function rounded(parent,w,h,d,r,material,x,y,z) {
  return add(parent,new RoundedBoxGeometry(w,h,d,3,r),material,x,y,z);
}
function sphere(parent,r,material,x,y,z,sx=1,sy=1,sz=1) {
  const geometry=new THREE.SphereGeometry(r,36,22).scale(sx,sy,sz);
  return add(parent,geometry,material,x,y,z);
}
function light(parent,x,y,z,rectangular=false) {
  const material=new THREE.MeshStandardMaterial({color:0x8b99a3,roughness:.33,emissive:0x4ce9c0,emissiveIntensity:0});
  return rectangular
    ? rounded(parent,.14,.07,.022,.018,material,x,y,z)
    : disc(parent,.024,.018,material,x,y,z);
}
function optic(parent,r,x,y,z) {
  disc(parent,r*1.15,.032,M.negro,x,y,z);
  disc(parent,r*.94,.028,M.gris,x,y,z+.019);
  disc(parent,r*.83,.023,M.cristal,x,y,z+.034);
  torus(parent,r*.71,.008,M.filtro,x,y,z+.048);
  sphere(parent,r*.63,M.lente,x,y,z+.044,1,1,.24);
  sphere(parent,r*.32,M.filtro,x+.01,y+.006,z+r*.17+.044,1,1,.16);
}
function assembly(base) {
  const raiz=new THREE.Group(),pan=new THREE.Group(),tilt=new THREE.Group();
  raiz.add(pan);
  pan.add(tilt);
  return {raiz,pan,tilt,base,leds:[]};
}
function camBala() {
  const unit=assembly({x:0,z:-.42,radio:.52,alto:1.26}),{raiz,pan,tilt}=unit;
  shell(raiz,[[0,0],[.35,0],[.43,.03],[.43,.09],[.38,.13],[0,.13]],M.blanco,0,0,-.42);
  torus(raiz,.398,.012,M.gris,0,.085,-.42,true);
  for (const angle of [.2,2.3,4.4]) {
    const screw=add(raiz,new THREE.CylinderGeometry(.032,.032,.019,12),M.gris,Math.sin(angle)*.31,.125,-.42+Math.cos(angle)*.31);
    screw.castShadow=false;
  }
  const neck=add(raiz,new THREE.CylinderGeometry(.13,.17,.44,28),M.blanco,0,.31,-.34);
  neck.rotation.x=.29;
  pan.position.set(0,.54,-.29);
  sphere(pan,.18,M.gris,0,0,0);
  shell(tilt,[[0,-.37],[.22,-.37],[.30,-.32],[.36,-.22],[.375,.1],[.38,.83],[.37,.99],[.345,1.02],[.326,1.0],[.326,.93]],M.blanco,0,.19,0,true);
  disc(tilt,.332,.045,M.negro,0,.19,.958);
  torus(tilt,.34,.013,M.gris,0,.19,.986);
  torus(tilt,.379,.007,M.gris,0,.19,.69);
  rounded(tilt,.37,.30,.044,.07,M.cristal,0,.235,.989);
  optic(tilt,.114,0,.241,1.014);
  rounded(tilt,.20,.096,.026,.018,M.negro,0,.017,.994);
  unit.leds.push(light(tilt,0,.017,1.015,true));
  disc(tilt,.019,.014,M.gris,0,.405,1.002);
  return unit;
}
function camDomo() {
  const unit=assembly({x:0,z:0,radio:.72,alto:.91}),{raiz,pan,tilt}=unit;
  shell(raiz,[[0,0],[.57,0],[.65,.035],[.66,.17],[.615,.23],[.52,.28],[.42,.34]],M.blanco);
  torus(raiz,.637,.012,M.gris,0,.125,0,true);
  for(let i=0;i<18;i++){
    const angle=i*Math.PI/9;
    const notch=rounded(raiz,.021,.077,.022,.006,M.gris,Math.sin(angle)*.646,.108,Math.cos(angle)*.646);
    notch.rotation.y=angle;
  }
  pan.position.y=.413;
  sphere(tilt,.44,M.blanco,0,-.03,0,1,.91,1);
  disc(tilt,.325,.12,M.blanco,0,-.011,.321);
  torus(tilt,.27,.023,M.gris,0,-.01,.385);
  disc(tilt,.26,.034,M.negro,0,-.01,.392);
  optic(tilt,.135,0,-.01,.423);
  for (let i=0;i<6;i++){
    const a=i*Math.PI/3;
    unit.leds.push(light(tilt,Math.sin(a)*.198,-.01+Math.cos(a)*.198,.422));
  }
  return unit;
}
function camPTZ() {
  const unit=assembly({x:-.39,z:0,radio:.43,alto:2.13}),{raiz,pan,tilt}=unit;
  rounded(raiz,.47,.13,.44,.043,M.blanco,-.39,.064,0);
  rounded(raiz,.29,1.41,.20,.052,M.blanco,-.41,.768,0);
  const bracket=new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.41,1.38,0),new THREE.Vector3(-.41,1.75,0),
    new THREE.Vector3(-.20,1.97,0),new THREE.Vector3(.26,1.97,0),
    new THREE.Vector3(.37,1.88,0)
  ]);
  add(raiz,new THREE.TubeGeometry(bracket,28,.087,14,false),M.blanco);
  for (const y of [.25,1.3]) {
    disc(raiz,.042,.019,M.gris,-.41,y,.105);
    disc(raiz,.019,.018,M.negro,-.41,y,.122);
  }
  pan.position.set(.37,1.41,0);
  shell(pan,[[.46,-.045],[.48,-.009],[.47,.073],[.43,.206],[.35,.31],[.24,.36],[.16,.38],[.16,.45],[0,.45]],M.blanco);
  torus(pan,.461,.024,M.negro,0,-.034,0,true);
  torus(pan,.455,.013,M.azul,0,-.062,0,true);
  tilt.position.y=-.25;
  sphere(tilt,.424,M.cristal,0,-.005,0,1,1.045,1);
  rounded(tilt,.53,.39,.11,.10,M.negro,0,-.022,.374);
  optic(tilt,.169,0,.01,.442);
  for (const x of [-.21,.21]) {
    unit.leds.push(light(tilt,x,-.095,.438));
    const hinge=disc(pan,.111,.043,M.gris,x*1.99,-.245,0);
    hinge.rotation.y=Math.PI/2;
  }
  return unit;
}
function camWifi() {
  const unit=assembly({x:0,z:0,radio:.55,alto:1.08}),{raiz,pan,tilt}=unit;
  shell(raiz,[[0,0],[.33,0],[.41,.04],[.47,.11],[.49,.224],[.486,.263],[0,.263]],M.blanco);
  torus(raiz,.481,.012,M.gris,0,.261,0,true);
  pan.position.y=.587;
  sphere(pan,.494,M.blanco,0,-.025,-.012,1,.90,.92);
  sphere(tilt,.35,M.cristal,0,.035,.204,.91,1.065,.77);
  rounded(tilt,.45,.52,.078,.14,M.cristal,0,.042,.389);
  optic(tilt,.146,0,.055,.444);
  const indicator = light(tilt,0,-.133,.428);
  indicator.material.color.setHex(0x237e72);
  unit.leds.push(indicator);
  for(let i=-2;i<=2;i++) disc(raiz,.013,.02,M.gris,i*.043,.151,.455);
  const socket=rounded(pan,.135,.068,.023,.014,M.negro,0,-.154,-.417);
  socket.rotation.y=Math.PI;
  return unit;
}

export { camBala, camDomo, camPTZ, camWifi, M, malla };