import * as THREE from './vendor/three.module.min.js';

// No textures, remote assets or post-processing: keep the hero light on mobile GPUs.
export function createCollaborationScene(canvas, compact) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 40);
  camera.position.set(0, 0, 8.4);
  const world = new THREE.Group();
  world.rotation.set(.12, -.18, -.12);
  scene.add(world);
  const materials = [];
  const tinted = [];
  const material = (key, opacity = 1) => {
    const value = new THREE.MeshBasicMaterial({ transparent: true, opacity, depthWrite: false });
    materials.push(value);
    tinted.push([value, key]);
    return value;
  };
  const paths = [
    new THREE.CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => {
      const a = i / 80 * Math.PI * 2;
      return new THREE.Vector3(2.65 * Math.cos(a), .88 * Math.sin(a), .7 * Math.sin(a + .65));
    }), true),
    new THREE.CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => {
      const a = i / 80 * Math.PI * 2;
      return new THREE.Vector3(1.28 * Math.cos(a), 1.63 * Math.sin(a), .65 * Math.cos(a + .7));
    }), true)
  ];
  const packetGroups = [];
  const packetGeometry = new THREE.SphereGeometry(.036, 10, 8);
  paths.forEach((path, index) => {
    const key = index ? '--violet' : '--cyan';
    const band = new THREE.Group();
    world.add(band);
    // Closely spaced contour lines create a fine, dimensional ribbon.
    const strands = compact ? 5 : 9;
    for (let i = 0; i < strands; i++) {
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, compact ? 100 : 160, compact ? .006 : .004, 4, true), material(key, .42 + (1 - Math.abs(i - (strands - 1) / 2) / strands) * .4));
      mesh.scale.setScalar(1 + (i - (strands - 1) / 2) * .013);
      band.add(mesh);
    }
    const packets = Array.from({ length: compact ? 5 : 8 }, () => {
      const mesh = new THREE.Mesh(packetGeometry, material(key));
      band.add(mesh);
      return mesh;
    });
    packetGroups.push(packets);
  });

  const core = new THREE.Group();
  world.add(core);
  const shellGeometry = new THREE.IcosahedronGeometry(.63, 0);
  const solidMaterial = new THREE.MeshStandardMaterial({ color: 0x173249, metalness: .65, roughness: .3, flatShading: true });
  materials.push(solidMaterial);
  core.add(new THREE.Mesh(shellGeometry, solidMaterial));
  const edgesMaterial = new THREE.LineBasicMaterial({ transparent: true, opacity: .85 });
  materials.push(edgesMaterial);
  tinted.push([edgesMaterial, '--cyan']);
  core.add(new THREE.LineSegments(new THREE.EdgesGeometry(shellGeometry), edgesMaterial));
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(.82, 0), material('--cyan', .035));
  core.add(inner);
  const ambient = new THREE.AmbientLight(0xffffff, 1.8);
  const cyanLight = new THREE.PointLight(0x22d3ee, 28, 12);
  cyanLight.position.set(2, 2, 3);
  const violetLight = new THREE.PointLight(0x9b6dfb, 22, 12);
  violetLight.position.set(-2, -1, 2);
  scene.add(ambient, cyanLight, violetLight);

  // The human approval checkpoint stays distinct from the two agent ribbons.
  const checkpoint = new THREE.Group();
  checkpoint.position.set(1.78, -1.23, .32);
  const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(.09), material('--mint'));
  const halo = new THREE.Mesh(new THREE.TorusGeometry(.18, .006, 4, 40), material('--mint', .6));
  checkpoint.add(beacon, halo);
  world.add(checkpoint);
  const stars = new THREE.BufferGeometry();
  const positions = [];
  // Deterministic positions make the still view and visual tests reproducible.
  for (let i = 0; i < (compact ? 45 : 90); i++) {
    positions.push(Math.sin(i * 127.1) * 3.7, Math.cos(i * 311.7) * 2, -.8 - (i % 7) * .2);
  }
  stars.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({ size: .018, transparent: true, opacity: .4, depthWrite: false });
  materials.push(starMaterial);
  tinted.push([starMaterial, '--muted']);
  world.add(new THREE.Points(stars, starMaterial));

  const motion = { phase: .17, turn: 0, tiltX: 0, tiltY: 0, reveal: 1 };
  const point = new THREE.Vector3();
  let disposed = false;
  return {
    motion,
    render() {
      if (disposed) return;
      world.rotation.x = .12 + motion.tiltX;
      world.rotation.y = -.18 + motion.tiltY + Math.sin(motion.turn) * .13;
      world.rotation.z = -.12 + Math.sin(motion.turn) * .04;
      world.scale.setScalar(motion.reveal);
      core.rotation.set(motion.turn, motion.turn, .3);
      halo.rotation.z = motion.turn;
      paths.forEach((path, index) => packetGroups[index].forEach((packet, i) => {
        path.getPointAt((motion.phase * (index ? -.5 : 1) + i / packetGroups[index].length + 2) % 1, point);
        packet.position.copy(point);
      }));
      renderer.render(scene, camera);
    },
    resize(width, height) {
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 600 ? 1.25 : 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Fit the entire collaboration system, including on a narrow phone.
      camera.position.z = Math.max(8.4, 3.05 / (Math.tan(THREE.MathUtils.degToRad(18)) * camera.aspect));
      camera.updateProjectionMatrix();
    },
    theme() {
      const styles = getComputedStyle(document.documentElement);
      tinted.forEach(([value, key]) => value.color.set(styles.getPropertyValue(key).trim()));
      const light = document.documentElement.dataset.theme === 'light';
      solidMaterial.color.set(light ? 0xb9d9e8 : 0x173249);
      ambient.intensity = light ? 2.5 : 1.8;
    },
    dispose() {
      disposed = true;
      const geometries = new Set();
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(value => value.dispose());
      renderer.dispose();
    }
  };
}
