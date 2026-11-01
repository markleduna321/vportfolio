import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

export function createVintageRoom(host: HTMLDivElement, video: HTMLVideoElement) {
  RectAreaLightUniformsLib.init();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#171d14");
  scene.fog = new THREE.Fog("#252a1c", 24, 55);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 4.15, 10.4);
  camera.lookAt(0, 1.85, -0.3);

  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const textures = new Set<THREE.Texture>();
  function material(color: string, roughness = 0.8) {
    const value = new THREE.MeshStandardMaterial({ color, roughness });
    materials.add(value);
    return value;
  }
  const wood = material("#51402b");
  const trim = material("#807251");
  const dark = material("#20271c");
  const brass = material("#94845a", 0.4);
  const cream = material("#b9b18a");
  const rust = material("#654233");
  const leaves = material("#485636");
  const skin = material("#ad8c68");
  const hair = material("#30291f");
  let defaultParent: THREE.Object3D = scene;

  function mesh(
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    x: number, y: number, z: number,
    parent: THREE.Object3D = defaultParent,
  ) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, surface);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(
    x: number, y: number, z: number,
    w: number, h: number, d: number,
    surface: THREE.Material, radius = 0.025,
    parent: THREE.Object3D = defaultParent,
  ) {
    return mesh(new RoundedBoxGeometry(w, h, d, 2, radius), surface, x, y, z, parent);
  }
  function ellipsoid(
    x: number, y: number, z: number,
    w: number, h: number, d: number,
    surface: THREE.Material, parent: THREE.Object3D = defaultParent,
  ) {
    const object = mesh(new THREE.SphereGeometry(1, 24, 16), surface, x, y, z, parent);
    object.scale.set(w, h, d);
    return object;
  }
  function cylinder(
    x: number, y: number, z: number,
    top: number, bottom: number, height: number,
    surface: THREE.Material, parent: THREE.Object3D = defaultParent,
  ) {
    return mesh(new THREE.CylinderGeometry(top, bottom, height, 24), surface, x, y, z, parent);
  }
  function limb(from: THREE.Vector3, to: THREE.Vector3, radius: number, surface: THREE.Material, parent: THREE.Object3D) {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const object = mesh(new THREE.CapsuleGeometry(radius, Math.max(0.01, from.distanceTo(to) - radius * 2), 4, 12), surface, mid.x, mid.y, mid.z, parent);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
  }

  const roomTransforms: {
    object: THREE.Object3D;
    position: THREE.Vector3;
    scale: THREE.Vector3;
    rotation: THREE.Euler;
    targetPosition: THREE.Vector3;
    targetScale: THREE.Vector3;
    targetRotation: THREE.Euler;
  }[] = [];
  function modernize(
    object: THREE.Object3D,
    position: [number, number, number],
    scale: [number, number, number] = [1, 1, 1],
    rotation: [number, number, number] = [0, 0, 0],
  ) {
    roomTransforms.push({
      object,
      position: object.position.clone(),
      scale: object.scale.clone(),
      rotation: object.rotation.clone(),
      targetPosition: new THREE.Vector3(...position),
      targetScale: new THREE.Vector3(...scale),
      targetRotation: new THREE.Euler(...rotation),
    });
  }

  const ambient = new THREE.HemisphereLight("#e9e4ce", "#69705a", 2.4);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight("#dfdcb3", 3);
  sun.position.set(-4, 6, 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  const lampLight = new THREE.PointLight("#ffd490", 24, 8, 2);
  lampLight.position.set(-2.5, 2.1, -1.4);
  scene.add(lampLight);
  const tvGlow = new THREE.PointLight("#aacabd", 5, 5);
  tvGlow.position.set(0, 2.05, -0.7);
  scene.add(tvGlow);
  const windowLights = [-3.6, 3.6].map((x) => {
    const light = new THREE.RectAreaLight("#e3e9cf", 4, 1.7, 2.8);
    light.position.set(x, 2.7, -2.7);
    light.lookAt(0, 1.2, 2);
    scene.add(light);
    return light;
  });
  const ceilingLight = new THREE.PointLight("#f5dfb8", 32, 12, 2);
  ceilingLight.position.set(0, 4.8, 1);
  scene.add(ceilingLight);
  const bounceLight = new THREE.PointLight("#cbdcc1", 14, 10, 2);
  bounceLight.position.set(0, 2.7, 4.5);
  scene.add(bounceLight);

  const floorMaterial = material("#51402b");
  const wallMaterial = material("#51402b");
  box(0, -0.1, 0, 12, 0.2, 12, floorMaterial);
  for (let i = -12; i <= 12; i++) {
    const seam = box(i * 0.48, 0.006, 0, 0.012, 0.008, 11, dark, 0.001);
    modernize(seam, [i * 0.48, -0.025, 0]);
  }
  box(0, 2.7, -3.2, 12, 5.4, 0.2, wallMaterial);
  for (let i = -20; i <= 20; i++) {
    const slat = box(i * 0.3, 2.7, -3.07, 0.018, 5.4, 0.025, trim, 0.004);
    modernize(slat, [i * 0.3, 2.7, -3.27]);
  }
  box(0, 0.12, -3.02, 12, 0.24, 0.1, trim);
  box(-5.5, 2.7, 0, 0.2, 5.4, 6.4, wallMaterial);
  box(5.5, 2.7, 0, 0.2, 5.4, 6.4, wallMaterial);

  // The windows and portraits are procedural; no external models or images are required.
  const curtains: { object: THREE.Mesh; x: number; side: number; center: number }[] = [];
  const glass = new THREE.MeshBasicMaterial({ color: "#a0b6a1" });
  materials.add(glass);
  for (const x of [-3.65, 3.65]) {
    const windowFrame = box(x, 2.65, -2.98, 2.0, 3.25, 0.1, trim);
    modernize(windowFrame, [x, 2.65, -2.98], [1.08, 1.14, 0.5]);
    const windowGlass = box(x, 2.65, -2.91, 1.8, 3.05, 0.04, glass);
    modernize(windowGlass, [x, 2.65, -2.91], [1.15, 1.2, 1]);
    for (let col = -1; col <= 1; col++) {
      const mullion = box(x + col * 0.52, 2.65, -2.86, 0.045, 3.08, 0.06, cream);
      modernize(mullion, [x + col * 0.52, 2.65, -3.3]);
    }
    for (const y of [1.75, 2.65, 3.55]) {
      const mullion = box(x, y, -2.86, 1.8, 0.04, 0.06, cream);
      modernize(mullion, [x, y, -3.3]);
    }
    box(x, 4.28, -2.77, 2.25, 0.07, 0.07, brass);
    for (const side of [-1, 1]) {
      for (let fold = 0; fold < 4; fold++) {
        const curtain = box(x + side * (0.73 + fold * 0.09), 2.63, -2.69 + (fold % 2) * 0.04, 0.14, 3.2, 0.09, cream, 0.045);
        curtains.push({ object: curtain, x: curtain.position.x, side, center: x });
      }
    }
    for (let j = 0; j < 12; j++) {
      const lace = ellipsoid(x - 0.97 + j * 0.175, 4.12, -2.63, 0.12, 0.17, 0.04, cream);
      modernize(lace, [lace.position.x, 4.65, -3.35], [0.12, 0.17, 0.04]);
    }
  }
  function portrait(x: number, y: number, w: number, h: number) {
    const art = new THREE.Group();
    scene.add(art);
    defaultParent = art;
    box(x, y, -2.93, w, h, 0.13, brass);
    box(x, y, -2.84, w - 0.12, h - 0.12, 0.04, material("#6f7252"));
    for (const offset of [-0.17, 0.17]) {
      ellipsoid(x + offset, y + 0.15, -2.8, 0.095, 0.12, 0.018, dark);
      ellipsoid(x + offset, y - 0.1, -2.8, 0.13, 0.21, 0.018, dark);
    }
    modernize(art, [0, 0, -0.65]);
    defaultParent = scene;
  }
  portrait(0, 3.93, 1.25, 0.98);
  portrait(-1.78, 3.7, 0.82, 1.05);
  portrait(1.87, 3.5, 0.75, 0.92);
  defaultParent = scene;

  const rugMaterial = material("#79765a");
  const rug = box(0, 0.035, 1.35, 4.0, 0.05, 3.1, rugMaterial, 0.08);
  modernize(rug, [0, 0.035, 1.35], [1.18, 1, 1.12]);
  for (const s of [1, 0.92, 0.8]) {
    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.85 * s, 0.01, 2.95 * s)),
      new THREE.LineBasicMaterial({ color: "#aaa47b" }),
    );
    border.position.set(0, 0.068, 1.35);
    geometries.add(border.geometry);
    materials.add(border.material);
    scene.add(border);
    modernize(border, [0, -0.03, 1.35]);
  }
  for (let i = -7; i <= 7; i++) {
    for (const z of [-0.27, 2.97]) {
      const fringe = box(i * 0.23, 0.04, z, 0.02, 0.015, 0.15, cream, 0.001);
      modernize(fringe, [i * 0.23, -0.03, z]);
    }
  }

  // TV, wood stand, metal controls, and a full-UV screen that stretches every clip.
  const television = new THREE.Group();
  television.scale.setScalar(1.18);
  television.position.z = 0.18;
  scene.add(television);
  defaultParent = television;
  const consoleMaterial = material("#51402b");
  const consoleTop = box(0, 0.92, -1.9, 2.6, 0.13, 1.05, consoleMaterial);
  modernize(consoleTop, [0, 0.76, -1.9], [1.85, 0.6, 0.85]);
  const consoleBody = box(0, 0.73, -1.9, 2.1, 0.27, 0.9, consoleMaterial);
  modernize(consoleBody, [0, 0.54, -1.9], [2.2, 1.5, 0.95]);
  for (const x of [-0.95, 0.95]) {
    for (const z of [-2.23, -1.58]) {
      const leg = box(x, 0.38, z, 0.1, 0.75, 0.1, wood);
      leg.rotation.z = x * 0.08;
      modernize(leg, [x * 1.85, 0.17, z], [0.65, 0.38, 0.65]);
    }
    const handle = ellipsoid(x * 0.65, 0.74, -1.43, 0.035, 0.035, 0.02, brass);
    modernize(handle, [x * 0.65, 0.54, -1.65], [0.035, 0.035, 0.02]);
  }
  const cabinetMaterial = material("#51402b");
  const frameMaterial = material("#94845a", 0.4);
  const cabinet = box(0, 1.94, -1.9, 2.76, 1.82, 0.82, cabinetMaterial, 0.12);
  const frame = box(0, 1.94, -1.455, 2.66, 1.73, 0.12, frameMaterial, 0.07);
  const bezel = box(-0.25, 2.08, -1.365, 2.01, 1.31, 0.13, dark, 0.1);
  const glassRim = box(-0.25, 2.08, -1.28, 1.87, 1.2, 0.04, material("#54604b"), 0.08);
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  textures.add(videoTexture);
  const screenMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, toneMapped: false });
  materials.add(screenMaterial);
  const screen = mesh(new THREE.PlaneGeometry(1.78, 1.11), screenMaterial, -0.25, 2.08, -1.25);
  screen.castShadow = false;
  const hardware = new THREE.Group();
  television.add(hardware);
  defaultParent = hardware;
  for (const y of [2.48, 2.08, 1.42]) {
    const knob = cylinder(1.05, y, -1.28, 0.105, 0.105, 0.1, brass);
    knob.rotation.x = Math.PI / 2;
    const line = box(1.05, y + 0.035, -1.22, 0.02, 0.09, 0.01, cream);
    line.rotation.z = -0.3;
  }
  for (let i = 0; i < 14; i++) {
    box(-0.29, 1.3 + i * 0.011, -1.34, 1.95, 0.004, 0.015, dark, 0.001);
  }
  for (let i = 0; i < 7; i++) {
    box(1.04, 1.62 + i * 0.033, -1.34, 0.32, 0.012, 0.02, dark, 0.001);
  }
  ellipsoid(1.05, 1.8, -1.23, 0.022, 0.022, 0.012, material("#b5c58a"));
  defaultParent = scene;

  const sideTable = box(-2.6, 0.75, -1.9, 0.8, 0.09, 0.8, wood);
  modernize(sideTable, [-2.6, 0.75, -1.9], [1.15, 0.6, 1.15]);
  cylinder(-2.6, 0.37, -1.9, 0.08, 0.14, 0.74, wood);
  cylinder(-2.6, 1.4, -1.9, 0.03, 0.03, 1.25, brass);
  const lampshade = cylinder(-2.6, 1.85, -1.9, 0.23, 0.43, 0.56, cream);
  modernize(lampshade, [-2.6, 1.85, -1.9], [0.62, 0.2, 0.62]);
  cylinder(-2.6, 0.86, -1.9, 0.21, 0.23, 0.08, brass);
  for (const x of [-2.08, 2.25]) {
    cylinder(x, 0.37, -1.95, 0.2, 0.15, 0.4, rust);
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      const dx = Math.cos(angle) * 0.18;
      const dz = Math.sin(angle) * 0.18;
      limb(new THREE.Vector3(x, 0.5, -1.95), new THREE.Vector3(x + dx, 1.25 + (i % 3) * 0.12, -1.95 + dz), 0.014, leaves, scene);
      ellipsoid(x + dx, 1.1 + (i % 3) * 0.12, -1.95 + dz, 0.14, 0.1, 0.05, leaves).rotation.z = angle;
      ellipsoid(x + dx, 1.25 + (i % 3) * 0.12, -1.95 + dz, 0.065, 0.065, 0.055, cream);
    }
  }

  function chair(x: number, z: number, color: THREE.Material, rotation: number) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotation;
    scene.add(group);
    const seat = box(0, 0.59, 0, 1.15, 0.22, 1.12, color, 0.1, group);
    modernize(seat, [0, 0.59, 0], [1.12, 0.8, 1.08]);
    const back = box(0, 1.13, 0.45, 1.2, 1.04, 0.27, color, 0.12, group);
    modernize(back, [0, 0.98, 0.49], [1.1, 0.72, 0.65], [-0.12, 0, 0]);
    for (const side of [-1, 1]) {
      const arm = box(side * 0.56, 0.87, 0, 0.22, 0.36, 1.17, color, 0.09, group);
      modernize(arm, [side * 0.62, 0.77, 0], [0.6, 0.48, 1]);
      for (const dz of [-0.4, 0.4]) {
        const leg = box(side * 0.45, 0.25, dz, 0.08, 0.5, 0.08, wood, 0.025, group);
        modernize(leg, [side * 0.45, 0.25, dz], [0.55, 1, 0.55]);
      }
    }
    return group;
  }
  function person(parent: THREE.Object3D, shirt: THREE.Material, scale: number, grayHair = false) {
    const group = new THREE.Group();
    group.scale.setScalar(scale);
    group.position.y = 0.66;
    parent.add(group);
    ellipsoid(0, 0.49, 0.02, 0.29, 0.47, 0.19, shirt, group);
    ellipsoid(0, 0.07, -0.06, 0.29, 0.15, 0.24, shirt, group);
    cylinder(0, 0.99, -0.02, 0.085, 0.095, 0.17, skin, group);
    ellipsoid(0, 1.18, -0.025, 0.18, 0.235, 0.18, skin, group);
    const headHair = grayHair ? material("#807c6a") : hair;
    ellipsoid(0, 1.25, 0.015, 0.19, 0.2, 0.175, headHair, group);
    if (grayHair) {
      for (let i = 0; i < 9; i++) {
        const angle = i * 2.4;
        ellipsoid(Math.cos(angle) * 0.14, 1.25 + Math.sin(angle) * 0.12, 0.14, 0.08, 0.08, 0.07, headHair, group);
      }
    }
    const pants = material(grayHair ? "#8c8465" : "#43483b");
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Vector3(side * 0.25, 0.79, 0);
      const elbow = new THREE.Vector3(side * 0.38, 0.36, -0.07);
      const hand = new THREE.Vector3(side * 0.28, 0.18, -0.38);
      limb(shoulder, elbow, 0.105, shirt, group);
      limb(elbow, hand, 0.075, skin, group);
      ellipsoid(hand.x, hand.y, hand.z, 0.065, 0.055, 0.1, skin, group);
      const hip = new THREE.Vector3(side * 0.15, 0.07, -0.04);
      const knee = new THREE.Vector3(side * 0.18, 0.02, -0.53);
      const ankle = new THREE.Vector3(side * 0.18, -0.49, -0.67);
      limb(hip, knee, 0.135, pants, group);
      limb(knee, ankle, 0.09, pants, group);
      ellipsoid(ankle.x, -0.52, -0.76, 0.105, 0.07, 0.17, dark, group);
    }
  }
  const leftChair = chair(-2.1, 1.65, rust, -0.28);
  person(leftChair, material("#737960"), 1, true);
  const rightChair = chair(2.05, 1.85, material("#4b5846"), 0.3);
  person(rightChair, material("#637b75"), 1.12);
  const childChair = chair(-1.03, 2.58, material("#75654b"), -0.15);
  childChair.scale.setScalar(0.68);
  person(childChair, cream, 0.95);

  const glowMaterial = new THREE.MeshBasicMaterial({ color: "#c8ef72", transparent: true, opacity: 0 });
  materials.add(glowMaterial);
  const lightLines = new THREE.Group();
  scene.add(lightLines);
  for (const x of [-4.6, -2.8, 2.8, 4.6]) {
    box(x, 2.7, -2.96, 0.025, 5, 0.03, glowMaterial, 0.006, lightLines);
    box(x, 0.025, 0, 0.025, 0.015, 7, glowMaterial, 0.005, lightLines);
  }
  for (const y of [0.5, 4.65]) {
    box(0, y, -2.96, 10, 0.025, 0.03, glowMaterial, 0.006, lightLines);
  }
  const hologram = mesh(new THREE.TorusGeometry(0.75, 0.012, 8, 64), glowMaterial, 0, 0.8, -1.2, lightLines);
  hologram.rotation.x = Math.PI / 2;
  const modernDetails = new THREE.Group();
  scene.add(modernDetails);
  const stone = material("#a3ac96", 0.55);
  const architectural = material("#596c5a", 0.45);
  for (const x of [-5.25, 5.25]) {
    box(x, 2.7, -3.0, 0.28, 5.0, 0.1, architectural, 0.03, modernDetails);
  }
  for (const x of [-2.95, 2.95]) {
    box(x, 0.35, -1.7, 0.48, 0.65, 0.48, stone, 0.06, modernDetails);
    ellipsoid(x, 1.05, -1.7, 0.26, 0.44, 0.2, leaves, modernDetails);
    ellipsoid(x + 0.15, 1.32, -1.7, 0.22, 0.33, 0.16, leaves, modernDetails);
  }
  const artPanel = box(0, 4.42, -3.0, 2.6, 0.52, 0.06, stone, 0.02, modernDetails);
  for (let i = 0; i < 5; i++) {
    box(-0.9 + i * 0.45, 4.42, -2.95, 0.025, 0.3, 0.012, architectural, 0.005, modernDetails).rotation.z = i * 0.45;
  }
  modernDetails.position.y = -5.5;
  artPanel.castShadow = false;
  const palette = [
    { surface: wood, from: wood.color.clone(), to: new THREE.Color("#3a5145") },
    { surface: trim, from: trim.color.clone(), to: new THREE.Color("#7a9781") },
    { surface: brass, from: brass.color.clone(), to: new THREE.Color("#87ac89") },
    { surface: cream, from: cream.color.clone(), to: new THREE.Color("#aebfa4") },
    { surface: rust, from: rust.color.clone(), to: new THREE.Color("#384e42") },
    { surface: floorMaterial, from: floorMaterial.color.clone(), to: new THREE.Color("#879180") },
    { surface: wallMaterial, from: wallMaterial.color.clone(), to: new THREE.Color("#647463") },
    { surface: consoleMaterial, from: consoleMaterial.color.clone(), to: new THREE.Color("#39483e") },
    { surface: rugMaterial, from: rugMaterial.color.clone(), to: new THREE.Color("#b1b5a0") },
  ];
  let active = false;
  let reducedMotion = false;
  let evolution = 0;
  let cameraAngle = 0;
  let lastFrame = 0;
  type DisplayShape = {
    width: number;
    height: number;
    depth: number;
    screenWidth: number;
    screenHeight: number;
    screenX: number;
    screenY: number;
    front: number;
    centerY: number;
    rim: number;
    cabinetColor: string;
    frameColor: string;
  };
  const models: DisplayShape[] = [
    { width: 2.76, height: 1.82, depth: 0.82, screenWidth: 1.78, screenHeight: 1.11, screenX: -0.25, screenY: 2.08, front: -1.25, centerY: 1.94, rim: 0.14, cabinetColor: "#51402b", frameColor: "#94845a" },
    { width: 3.02, height: 1.94, depth: 0.43, screenWidth: 2.64, screenHeight: 1.49, screenX: 0, screenY: 2.05, front: -1.46, centerY: 2.03, rim: 0.12, cabinetColor: "#4a4c42", frameColor: "#71796d" },
    { width: 3.86, height: 2.29, depth: 0.13, screenWidth: 3.65, screenHeight: 2.05, screenX: 0, screenY: 2.22, front: -1.78, centerY: 2.22, rim: 0.045, cabinetColor: "#26312c", frameColor: "#586b5e" },
    { width: 4.5, height: 2.57, depth: 0.055, screenWidth: 4.44, screenHeight: 2.5, screenX: 0, screenY: 2.38, front: -2.12, centerY: 2.38, rim: 0.012, cabinetColor: "#253a30", frameColor: "#9cac95" },
  ];
  const dimensions = [
    { object: cabinet, width: 2.76, height: 1.82, depth: 0.82 },
    { object: frame, width: 2.66, height: 1.73, depth: 0.12 },
    { object: bezel, width: 2.01, height: 1.31, depth: 0.13 },
    { object: glassRim, width: 1.87, height: 1.2, depth: 0.04 },
  ];
  function reshape(object: THREE.Mesh, width: number, height: number, depth: number, index: number) {
    const base = dimensions[index];
    object.scale.set(width / base.width, height / base.height, depth / base.depth);
  }
  const cameraTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3(0, 1.85, -0.3);
  const currentLook = lookTarget.clone();
  function updateCameraTarget() {
    const distance = Math.max(10.4, 9.5 / camera.aspect);
    const portrait = camera.aspect < 0.8;
    if (cameraAngle === 1) {
      cameraTarget.set(-2.3, 3.4, Math.max(6.8, 5 / camera.aspect));
      lookTarget.set(0, portrait ? 0.5 : 2.05, -1.6);
    } else if (cameraAngle === 2) {
      cameraTarget.set(1.4, 2.8, Math.max(4.1, 3 / camera.aspect));
      lookTarget.set(0, portrait ? 1.1 : 2.25, -1.7);
    } else {
      cameraTarget.set(0, 4.15, distance);
      lookTarget.set(0, portrait ? -0.4 : 1.85, -0.3);
    }
  }
  function updateEvolution(value: number) {
    evolution = THREE.MathUtils.clamp(value, 0, 1);
    const blend = THREE.MathUtils.smoothstep(evolution, 0.12, 0.98);
    // One screen and cabinet persist through four model profiles, with pauses at each era.
    const stages = [
      THREE.MathUtils.smoothstep(evolution, 0.12, 0.36),
      THREE.MathUtils.smoothstep(evolution, 0.44, 0.67),
      THREE.MathUtils.smoothstep(evolution, 0.75, 0.98),
    ];
    const modelPosition = stages.reduce((sum, stage) => sum + stage, 0);
    const index = Math.min(Math.floor(modelPosition), models.length - 2);
    const fraction = modelPosition - index;
    const from = models[index];
    const to = models[index + 1];
    const mix = (key: Exclude<keyof DisplayShape, "cabinetColor" | "frameColor">) =>
      THREE.MathUtils.lerp(from[key], to[key], fraction);
    const front = mix("front");
    const centerY = mix("centerY");
    const screenX = mix("screenX");
    const screenY = mix("screenY");
    const width = mix("screenWidth");
    const height = mix("screenHeight");
    const rim = mix("rim");
    const depth = mix("depth");
    reshape(cabinet, mix("width"), mix("height"), depth, 0);
    cabinet.position.set(0, centerY, front - depth / 2 - 0.11);
    reshape(frame, mix("width") - 0.06, mix("height") - 0.06, 0.06, 1);
    frame.position.set(0, centerY, front - 0.07);
    reshape(bezel, width + rim * 1.65, height + rim * 1.45, 0.06, 2);
    bezel.position.set(screenX, screenY, front - 0.036);
    reshape(glassRim, width + rim * 0.65, height + rim * 0.65, 0.02, 3);
    glassRim.position.set(screenX, screenY, front - 0.013);
    screen.scale.set(width / 1.78, height / 1.11, 1);
    screen.position.set(screenX, screenY, front);
    cabinetMaterial.color.set(from.cabinetColor).lerp(new THREE.Color(to.cabinetColor), fraction);
    frameMaterial.color.set(from.frameColor).lerp(new THREE.Color(to.frameColor), fraction);
    cabinetMaterial.roughness = THREE.MathUtils.lerp(0.82, 0.32, blend);
    frameMaterial.metalness = blend * 0.65;
    hardware.scale.setScalar(Math.max(0.001, 1 - stages[0]));
    hardware.position.set(stages[0] * 1.05, stages[0] * 1.9, 0.07 - stages[0] * 1.37);
    hardware.visible = stages[0] < 1;
    palette.forEach(({ surface, from, to }) => surface.color.copy(from).lerp(to, blend));
    curtains.forEach(({ object, x, side, center }) => {
      object.position.x = THREE.MathUtils.lerp(x, center + side * 1.04, blend);
      object.scale.x = 1 - blend * 0.7;
    });
    const roomBlend = stages.reduce((sum, stage) => sum + stage, 0) / 3;
    roomTransforms.forEach(({ object, position, scale, rotation, targetPosition, targetScale, targetRotation }) => {
      object.position.lerpVectors(position, targetPosition, roomBlend);
      object.scale.lerpVectors(scale, targetScale, roomBlend);
      object.rotation.set(
        THREE.MathUtils.lerp(rotation.x, targetRotation.x, roomBlend),
        THREE.MathUtils.lerp(rotation.y, targetRotation.y, roomBlend),
        THREE.MathUtils.lerp(rotation.z, targetRotation.z, roomBlend),
      );
    });
    modernDetails.position.y = -5.5 * (1 - stages[2]);
    modernDetails.visible = stages[2] > 0;
    floorMaterial.roughness = 0.8 - roomBlend * 0.35;
    consoleMaterial.roughness = 0.8 - roomBlend * 0.4;
    wood.roughness = 0.8 - blend * 0.25;
    glowMaterial.opacity = stages[2] * 0.65;
    lampLight.color.set("#ffd490").lerp(new THREE.Color("#e4f0cf"), blend);
    lampLight.intensity = 24 - blend * 6;
    ceilingLight.color.set("#f5dfb8").lerp(new THREE.Color("#e0f1dd"), blend);
    ceilingLight.intensity = 32 + blend * 8;
    windowLights.forEach((light) => { light.intensity = 4 + blend; });
    tvGlow.color.set("#aacabd").lerp(new THREE.Color("#d4e7ce"), blend);
    tvGlow.intensity = 5 + blend * 3;
    tvGlow.position.y = screenY * 1.18;
    sun.color.set("#dfdcb3").lerp(new THREE.Color("#dae8dc"), blend);
    scene.background = new THREE.Color("#171d14").lerp(new THREE.Color("#19201c"), blend);
    renderer.toneMappingExposure = 1.25;
  }
  renderer.setAnimationLoop((time) => {
    if (active && time - lastFrame >= 1000 / 30) {
      const delta = Math.min((time - lastFrame) / 1000, 0.1);
      const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * 4);
      camera.position.lerp(cameraTarget, blend);
      currentLook.lerp(lookTarget, blend);
      camera.lookAt(currentLook);
      renderer.render(scene, camera);
      lastFrame = time;
    }
  });
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    updateCameraTarget();
    camera.position.copy(cameraTarget);
    currentLook.copy(lookTarget);
    camera.lookAt(currentLook);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  return {
    setActive(value: boolean) { active = value; },
    setEvolution(value: number) { updateEvolution(value); },
    setReducedMotion(value: boolean) { reducedMotion = value; },
    setCameraAngle(value: number) {
      cameraAngle = value;
      updateCameraTarget();
      if (reducedMotion) {
        camera.position.copy(cameraTarget);
        currentLook.copy(lookTarget);
        camera.lookAt(currentLook);
        renderer.render(scene, camera);
      }
    },
    dispose() {
      observer.disconnect();
      renderer.setAnimationLoop(null);
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((surface) => surface.dispose());
      textures.forEach((texture) => texture.dispose());
      sun.shadow.map?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
