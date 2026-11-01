import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function createTVWall(host: HTMLDivElement, root: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 40);
  camera.position.z = 18;
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const cleanup: (() => void)[] = [];
  const televisions: {
    id: string;
    group: THREE.Group;
    cabinet: HTMLElement;
    rim: THREE.MeshStandardMaterial;
    led: THREE.MeshStandardMaterial;
    yaw: number;
    roll: number;
    baseY: number;
    hover: boolean;
  }[] = [];
  let disposed = false;
  let inView = false;
  let frame = 0;
  let lastFrame = 0;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function surface(color: string, roughness = 0.7, metalness = 0.1) {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.add(material);
    return material;
  }

  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function box(parent: THREE.Object3D, material: THREE.Material, w: number, h: number, d: number, x = 0, y = 0, z = 0, radius = 0.035) {
    const object = mesh(new RoundedBoxGeometry(w, h, d, 3, radius), material, parent);
    object.position.set(x, y, z);
    return object;
  }

  function listen(target: EventTarget, type: string, handler: EventListener) {
    target.addEventListener(type, handler);
    cleanup.push(() => target.removeEventListener(type, handler));
  }

  function draw() {
    if (!disposed && inView && !document.hidden) renderer.render(scene, camera);
  }

  function animate(now: number) {
    frame = 0;
    if (disposed || !inView || document.hidden) return;
    if (now - lastFrame >= 1000 / 30) {
      lastFrame = now;
      televisions.forEach((tv) => {
        const blend = preference.matches ? 1 : 0.14;
        tv.group.rotation.y = THREE.MathUtils.lerp(tv.group.rotation.y, tv.yaw + (tv.hover ? 0.09 : 0), blend);
        tv.group.rotation.x = THREE.MathUtils.lerp(tv.group.rotation.x, 0.075 + (tv.hover ? -0.045 : 0), blend);
        tv.group.position.y = THREE.MathUtils.lerp(tv.group.position.y, tv.baseY + (tv.hover ? 0.04 : 0), blend);
      });
      draw();
    }
    if (!preference.matches) frame = requestAnimationFrame(animate);
  }

  function syncActivity() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (!disposed && inView && !document.hidden) {
      lastFrame = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    cleanup.forEach((release) => release());
    textures.forEach((texture) => texture.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    scene.traverse((object) => {
      if (object instanceof THREE.DirectionalLight) {
        object.shadow.dispose();
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  }

  try {
    scene.add(new THREE.HemisphereLight("#f0ead5", "#243629", 2.3));
    const key = new THREE.DirectionalLight("#fff0cc", 4);
    key.position.set(-4, 7, 9);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    key.shadow.normalBias = 0.035;
    key.shadow.bias = -0.0005;
    scene.add(key);
    const fill = new THREE.DirectionalLight("#a1bbbc", 1.8);
    fill.position.set(5, 1, 5);
    scene.add(fill);
    const floorGlow = new THREE.PointLight("#c8ef72", 8, 12, 2);
    floorGlow.position.set(0, -3, 3);
    scene.add(floorGlow);

    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.28 });
    materials.add(shadowMaterial);
    const shadow = mesh(new THREE.PlaneGeometry(20, 30), shadowMaterial, scene);
    shadow.position.z = -0.75;
    shadow.castShadow = false;
    const dark = surface("#121b16", 0.55);
    const metal = surface("#b6ae87", 0.35, 0.65);
    const grille = surface("#243025", 0.85);
    const bodyColors = ["#615b3d", "#3b5449", "#746a49"];

    root.querySelectorAll<HTMLButtonElement>("button[data-project-id]").forEach((button, index) => {
      const cabinet = button.querySelector<HTMLElement>("[data-tv-cabinet]");
      if (!cabinet) throw new Error("A television is missing its layout anchor.");
      const video = button.querySelector<HTMLVideoElement>("video");
      const model = index % 3;
      const height = 2 / [1.3, 1.44, 1.2][model];
      const depth = [0.72, 0.5, 0.85][model];
      const group = new THREE.Group();
      scene.add(group);
      const body = surface(bodyColors[model], 0.66, 0.12);
      const rim = surface("#938764", 0.4, 0.45);
      const led = surface("#8eaa62", 0.3);
      const yaw = [0.17, -0.2, 0.13, -0.13, -0.19, 0.14, 0.08, -0.18][index % 8];
      const roll = [0, 0.015, 0.022, 0, -0.018, 0.012, 0, -0.012][index % 8];
      const tv = { id: button.dataset.projectId ?? "", group, cabinet, rim, led, yaw, roll, baseY: 0, hover: false };
      televisions.push(tv);
      group.rotation.set(0.075, yaw, roll);

      box(group, body, 2, height, depth, 0, 0, -depth / 2);
      box(group, dark, 1.82, height * 0.87, 0.035, 0, 0, 0.012, 0.03);
      box(group, body, 0.29, height * 0.88, 0.08, 0.77, 0, 0.035);
      box(group, rim, 1.49, height * 0.88, 0.105, -0.18, 0, 0.06, 0.09);
      box(group, dark, 1.41, height * 0.81, 0.115, -0.18, 0, 0.105, 0.1);

      // Bow the CRT surface and taper its corners without cropping the video's UVs.
      const screenGeometry = new THREE.PlaneGeometry(1.28, height * 0.7, 32, 24);
      const positions = screenGeometry.getAttribute("position");
      const uv = screenGeometry.getAttribute("uv");
      for (let vertex = 0; vertex < positions.count; vertex++) {
        const u = uv.getX(vertex) * 2 - 1;
        const v = uv.getY(vertex) * 2 - 1;
        positions.setXYZ(
          vertex,
          positions.getX(vertex) * (1 - 0.075 * Math.pow(Math.abs(v), 8)),
          positions.getY(vertex) * (1 - 0.065 * Math.pow(Math.abs(u), 8)),
          0.065 * (1 - u * u) * (1 - v * v),
        );
      }
      screenGeometry.computeVertexNormals();
      let screenMaterial: THREE.MeshBasicMaterial;
      if (video) {
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        textures.add(texture);
        screenMaterial = new THREE.MeshBasicMaterial({ map: texture, color: "#d7e0cd", toneMapped: false });
        const refreshTexture = () => {
          texture.needsUpdate = true;
          draw();
        };
        listen(video, "loadeddata", refreshTexture);
        listen(video, "seeked", refreshTexture);
      } else {
        screenMaterial = new THREE.MeshBasicMaterial({ color: "#173023" });
      }
      materials.add(screenMaterial);
      const screen = mesh(screenGeometry, screenMaterial, group);
      screen.position.set(-0.18, 0, 0.178);
      screen.castShadow = false;
      screen.receiveShadow = false;

      const glassMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { lines: { value: 130 } },
        vertexShader: `varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec2 vUv;
          uniform float lines;
          void main() {
            float scan = smoothstep(0.35, 0.75, fract(vUv.y * lines));
            float sheen = pow(max(0.0, 1.0 - abs(vUv.x + vUv.y - 1.35) * 3.0), 5.0);
            float edge = pow(length((vUv - 0.5) * 1.35), 3.0);
            gl_FragColor = vec4(mix(vec3(0.04, 0.08, 0.045), vec3(0.85, 0.92, 0.75), sheen), 0.08 * scan + edge * 0.26 + sheen * 0.12);
          }`,
      });
      materials.add(glassMaterial);
      const glass = mesh(screenGeometry, glassMaterial, group);
      glass.position.copy(screen.position);
      glass.position.z += 0.002;
      glass.castShadow = false;
      glass.receiveShadow = false;

      for (const y of [height * 0.3, height * 0.12]) {
        const knob = mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.055, 24), metal, group);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(0.77, y, 0.13);
        box(group, dark, 0.012, 0.1, 0.01, 0.77, y, 0.164, 0.002).rotation.z = -0.3;
      }
      for (let slot = 0; slot < 11; slot++) {
        box(group, grille, 0.22, 0.016, 0.016, 0.77, -height * 0.04 - slot * height * 0.025, 0.083, 0.005);
      }
      const power = mesh(new THREE.SphereGeometry(0.018, 12, 8), led, group);
      power.position.set(0.77, -height * 0.37, 0.095);
      box(group, dark, 0.21, 0.065, 0.4, -0.64, -height / 2, -depth / 2);
      box(group, dark, 0.21, 0.065, 0.4, 0.64, -height / 2, -depth / 2);
      // Side ventilation and the recessed back make cabinet depth visible at angled views.
      box(group, grille, 1.7, height * 0.75, 0.04, 0, 0, -depth);
      for (let slot = 0; slot < 7; slot++) {
        box(group, grille, 0.015, 0.015, depth * 0.62, -1.002, height * 0.19 - slot * 0.065, -depth * 0.52, 0.003);
        box(group, grille, 0.015, 0.015, depth * 0.62, 1.002, height * 0.19 - slot * 0.065, -depth * 0.52, 0.003);
      }
      const setHover = (hover: boolean) => {
        tv.hover = hover;
        syncActivity();
      };
      listen(button, "pointerenter", () => setHover(true));
      listen(button, "pointerleave", () => setHover(false));
      listen(button, "focus", () => setHover(true));
      listen(button, "blur", () => setHover(false));
    });

    function resize() {
      const bounds = root.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const unit = 10 / bounds.width;
      const height = bounds.height * unit;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
      televisions.forEach((tv) => {
        const rect = tv.cabinet.getBoundingClientRect();
        const scale = rect.width * unit / 2 * 0.92;
        tv.group.scale.setScalar(scale);
        tv.group.position.x = (rect.left + rect.width / 2 - bounds.left) * unit - 5;
        tv.baseY = height / 2 - (rect.top + rect.height / 2 - bounds.top) * unit;
        tv.group.position.y = tv.baseY;
      });
      floorGlow.position.y = -height / 2;
      syncActivity();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    cleanup.push(() => resizeObserver.disconnect());
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncActivity();
    }, { threshold: 0 });
    visibility.observe(root);
    cleanup.push(() => visibility.disconnect());
    listen(document, "visibilitychange", syncActivity);
    listen(preference, "change", syncActivity);
    resize();

    return {
      resize,
      setSelected(id: string) {
        televisions.forEach((tv) => {
          const selected = tv.id === id;
          tv.rim.color.set(selected ? "#c8ef72" : "#938764");
          tv.rim.emissive.set(selected ? "#c8ef72" : "#000000");
          tv.rim.emissiveIntensity = selected ? 0.16 : 0;
          tv.led.emissive.set(selected ? "#c8ef72" : "#637a45");
          tv.led.emissiveIntensity = selected ? 1.8 : 0.35;
        });
        draw();
      },
      dispose,
    };
  } catch (cause) {
    dispose();
    throw cause;
  }
}
