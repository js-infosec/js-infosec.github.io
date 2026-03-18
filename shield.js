// ==================== THREE.JS SHIELD ANIMATION V7 ====================
(function () {

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (typeof THREE === 'undefined') return;

  console.log('SHIELD V7 LOADED');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.z = 7;

  // ==================== COLORS ====================
  const BLUE   = new THREE.Color(0x2776EA);
  const ORANGE = new THREE.Color(0xFF6F00);
  const CYAN   = new THREE.Color(0x00e5ff);

  // ==================== RESIZE ====================
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const scale = Math.max(0.5, w / 500);
    camera.position.z = 8 / scale;
    camera.updateProjectionMatrix();
  }
  setTimeout(resize, 100);
  window.addEventListener('resize', resize);

  // ==================== SHIELD SHAPE ====================
  // Matches reference: rounded curved top peaking center, wide shoulders, tapered point
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(-0.78, 0.62);
  shieldShape.bezierCurveTo(-0.50, 0.62, -0.08, 1.04, 0, 1.04);
  shieldShape.bezierCurveTo(0.08, 1.04, 0.50, 0.62, 0.78, 0.62);
  shieldShape.bezierCurveTo(0.78, 0.1, 0.78, -0.18, 0.44, -0.52); // right side curving in
  shieldShape.bezierCurveTo(0.28, -0.7, 0.14, -0.82, 0, -0.92);   // right to bottom point
  shieldShape.bezierCurveTo(-0.14, -0.82, -0.28, -0.7, -0.44, -0.52); // point to left
  shieldShape.bezierCurveTo(-0.78, -0.18, -0.78, 0.1, -0.78, 0.52);   // left side up
  shieldShape.closePath();

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  });
  shieldGeo.center();

  // Holographic dark fill
  const shieldMat = new THREE.MeshPhongMaterial({
    color: 0x010a18,
    emissive: BLUE,
    emissiveIntensity: 0.12,
    shininess: 60,
    transparent: true,
    opacity: 0.55   // semi-transparent for projection look
  });

  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  scene.add(shield);

  // Outer glowing edge
  const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 8);
  const edgeMat  = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.95 });
  shield.add(new THREE.LineSegments(edgesGeo, edgeMat));

  // Inner shield outline (slightly smaller, like the reference double-border)
  const innerShape = new THREE.Shape();
  innerShape.moveTo(-0.62, 0.44);
  innerShape.bezierCurveTo(-0.62, 0.64, -0.3, 0.76, 0, 0.76);
  innerShape.bezierCurveTo(0.3, 0.76, 0.62, 0.64, 0.62, 0.44);
  innerShape.bezierCurveTo(0.62, 0.08, 0.62, -0.14, 0.35, -0.44);
  innerShape.bezierCurveTo(0.22, -0.6, 0.11, -0.7, 0, -0.78);
  innerShape.bezierCurveTo(-0.11, -0.7, -0.22, -0.6, -0.35, -0.44);
  innerShape.bezierCurveTo(-0.62, -0.14, -0.62, 0.08, -0.62, 0.44);
  innerShape.closePath();

  const innerGeo  = new THREE.ShapeGeometry(innerShape);
  const innerEdge = new THREE.EdgesGeometry(innerGeo);
  const innerMat  = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.4 });
  const innerLine = new THREE.LineSegments(innerEdge, innerMat);
  innerLine.position.z = 0.04;
  shield.add(innerLine);

  // ==================== CANVAS: CIRCUITS + LOCK ====================
  const tc  = document.createElement('canvas');
  tc.width  = 512;
  tc.height = 512;
  const ctx = tc.getContext('2d');

  function draw() {
    ctx.clearRect(0, 0, 512, 512);

    const CY  = '#00e5ff';
    const BL  = '#2776EA';
    const OR  = '#FF6F00';
    const DIM = 'rgba(0,229,255,0.18)';

    function glow(color, blur) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = blur;
    }

    function dot(x, y, r, color, blur) {
      glow(color, blur);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function trace(pts, color, blur, w) {
      glow(color, blur);
      ctx.strokeStyle = color;
      ctx.lineWidth   = w;
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }

    // ---- Full-shield circuit grid ----
    // Main cross
    trace([[60,256],[452,256]], CY, 10, 1.5);
    trace([[60,256],[452,256]], BL, 2, 0.8);
    trace([[256,60],[256,452]], CY, 10, 1.5);
    trace([[256,60],[256,452]], BL, 2, 0.8);

    // Horizontal branches
    trace([[60,180],[452,180]], DIM, 4, 0.8);
    trace([[60,332],[452,332]], DIM, 4, 0.8);
    // Vertical branches
    trace([[180,60],[180,452]], DIM, 4, 0.8);
    trace([[332,60],[332,452]], DIM, 4, 0.8);

    // L-branch connectors
    trace([[140,256],[140,200],[256,200]], BL, 5, 1.1);
    trace([[372,256],[372,200],[256,200]], BL, 5, 1.1);
    trace([[140,256],[140,312],[256,312]], BL, 5, 1.1);
    trace([[372,256],[372,312],[256,312]], BL, 5, 1.1);

    // Diagonal traces from corners
    trace([[90,100],[140,180]], DIM, 3, 0.7);
    trace([[422,100],[372,180]], DIM, 3, 0.7);
    trace([[90,412],[140,332]], DIM, 3, 0.7);
    trace([[422,412],[372,332]], DIM, 3, 0.7);

    // Short stubs
    trace([[256,200],[256,160]], BL, 4, 1);
    trace([[256,312],[256,352]], BL, 4, 1);
    trace([[140,256],[100,256]], BL, 4, 1);
    trace([[372,256],[412,256]], BL, 4, 1);

    // Tiny corner squares
    [[100,100],[412,100],[100,412],[412,412],
     [140,180],[372,180],[140,332],[372,332]
    ].forEach(([x,y]) => {
      glow(CY, 6);
      ctx.strokeStyle = CY;
      ctx.lineWidth   = 1;
      ctx.strokeRect(x-5, y-5, 10, 10);
    });

    // ---- Circuit nodes ----
    [[140,200],[372,200],[140,312],[372,312],
     [256,160],[256,352],[100,256],[412,256],
     [180,180],[332,180],[180,332],[332,332]
    ].forEach(([x,y]) => {
      dot(x, y, 3.5, CY, 12);
      dot(x, y, 1.5, '#fff', 3);
    });

    // ========================
    // PADLOCK centered at 256,248
    // ========================
    const lx = 256, ly = 260;

    // Shackle arc
    glow(CY, 20);
    ctx.strokeStyle = CY;
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.arc(lx, ly - 30, 26, Math.PI, 0, false);
    ctx.stroke();

    // Shackle legs into body
    glow(CY, 14);
    ctx.beginPath(); ctx.moveTo(lx - 26, ly - 30); ctx.lineTo(lx - 26, ly - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + 26, ly - 30); ctx.lineTo(lx + 26, ly - 4); ctx.stroke();

    // Lock body outer
    const bw = 68, bh = 56;
    glow(CY, 18);
    ctx.strokeStyle = CY;
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.roundRect(lx - bw/2, ly - 4, bw, bh, 8);
    ctx.stroke();

    // Lock body fill
    ctx.shadowBlur = 0;
    ctx.fillStyle  = 'rgba(1,10,24,0.82)';
    ctx.beginPath();
    ctx.roundRect(lx - bw/2 + 2, ly - 2, bw - 4, bh - 4, 7);
    ctx.fill();

    // Lock body inner border
    glow(BL, 8);
    ctx.strokeStyle = BL;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.roundRect(lx - bw/2 + 5, ly + 2, bw - 10, bh - 10, 5);
    ctx.stroke();

    // Keyhole circle
    const kx = lx, ky = ly + 20;
    glow(OR, 22);
    ctx.fillStyle = OR;
    ctx.beginPath();
    ctx.arc(kx, ky, 10, 0, Math.PI * 2);
    ctx.fill();

    // Keyhole triangle
    ctx.beginPath();
    ctx.moveTo(kx - 7, ky + 2);
    ctx.lineTo(kx + 7, ky + 2);
    ctx.lineTo(kx, ky + 20);
    ctx.closePath();
    ctx.fill();

    // Keyhole dark inset
    ctx.shadowBlur = 0;
    ctx.fillStyle  = 'rgba(1,10,24,0.9)';
    ctx.beginPath();
    ctx.arc(kx, ky, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Orange glow pulse ring
    glow(OR, 16);
    ctx.strokeStyle = OR;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(kx, ky, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Connect lock to circuit lines
    glow(OR, 10);
    ctx.strokeStyle = OR;
    ctx.lineWidth   = 1.5;
    ctx.beginPath(); ctx.moveTo(lx, ly - 5); ctx.lineTo(lx, ly - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx, ly + bh - 6); ctx.lineTo(lx, ly + bh + 16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx - bw/2, ly + bh/2 - 4); ctx.lineTo(lx - bw/2 - 20, ly + bh/2 - 4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx + bw/2, ly + bh/2 - 4); ctx.lineTo(lx + bw/2 + 20, ly + bh/2 - 4); ctx.stroke();

    // Orange connection dots
    [[lx, ly - 30],[lx, ly + bh + 16],
     [lx - bw/2 - 20, ly + bh/2 - 4],
     [lx + bw/2 + 20, ly + bh/2 - 4]
    ].forEach(([x,y]) => dot(x, y, 3, OR, 10));
  }

  draw();

  const texMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 1.6),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(tc),
      transparent: true,
      depthWrite: false,
      opacity: 0.9
    })
  );
  texMesh.position.z = 0.08;
  shield.add(texMesh);

  // ==================== ORBIT RING ====================
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.006, 8, 100),
    new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.18 })
  );
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  const orbDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.034, 10, 10),
    new THREE.MeshBasicMaterial({ color: ORANGE })
  );
  scene.add(orbDot);

  // ==================== BINARY SPRITES ====================
  const sprites = [];

  function makeSprite(char, color) {
    const sc = document.createElement('canvas');
    sc.width = sc.height = 64;
    const c  = sc.getContext('2d');
    c.font = 'bold 40px monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.shadowColor = color;
    c.shadowBlur  = 12;
    c.fillStyle   = color;
    c.fillText(char, 32, 32);
    const mat    = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, opacity: 0.7 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.13, 0.13, 1);
    return sprite;
  }

  for (let i = 0; i < 75; i++) {
    const isOrange = Math.random() < 0.2;
    const col    = isOrange ? '#FF6F00' : '#00e5ff';
    const sprite = makeSprite(Math.random() < 0.5 ? '1' : '0', col);
    const angle  = Math.random() * Math.PI * 2;
    const radius = 1.3 + Math.random() * 2.0;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 3.8;
    sprite.position.set(x, y, (Math.random() - 0.5) * 1.2);
    sprite.userData = {
      baseX: x, baseY: y,
      speed: 0.003 + Math.random() * 0.005,
      amp:   0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      fade:  0.3 + Math.random() * 0.9
    };
    scene.add(sprite);
    sprites.push(sprite);
  }

  // ==================== LIGHTING ====================
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const blueLight = new THREE.PointLight(BLUE, 2.0, 8);
  blueLight.position.set(2, 2, 3);
  scene.add(blueLight);

  const orangeLight = new THREE.PointLight(ORANGE, 1.0, 5);
  orangeLight.position.set(-1.5, -1, 2);
  scene.add(orangeLight);

  const cyanLight = new THREE.PointLight(CYAN, 1.0, 5);
  cyanLight.position.set(0, 0.5, 3);
  scene.add(cyanLight);

  // ==================== MOUSE ====================
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ==================== ANIMATE ====================
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    // Smooth mouse
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // Shield float + mouse tilt
    shield.position.y           = Math.sin(t * 0.6) * 0.055;
    shield.rotation.y = Math.sin(t * 0.22) * 0.08 + currentX * 0.6;
    shield.rotation.x = Math.sin(t * 0.16) * 0.04 - currentY * 0.4;
    shieldMat.emissiveIntensity = 0.1 + Math.sin(t * 0.9) * 0.05;
    edgeMat.opacity             = 0.7 + Math.sin(t * 0.9) * 0.25;
    innerMat.opacity            = 0.3 + Math.sin(t * 0.9 + 1) * 0.12;

    // Ring
    ring.rotation.z = t * 0.18;
    ring.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.28) * 0.06;

    // Orbiting dot
    const a = t * 0.65;
    orbDot.position.x = Math.cos(a) * 1.1;
    orbDot.position.z = Math.sin(a) * 1.1 * Math.sin(Math.PI / 2.5);
    orbDot.position.y = Math.sin(a) * 1.1 * Math.cos(Math.PI / 2.5);

    // Binary drift + fade
    for (const s of sprites) {
      const u = s.userData;
      s.position.x = u.baseX + Math.sin(t * u.speed * 20 + u.phase) * u.amp * 0.2;
      s.position.y = u.baseY + Math.sin(t * u.speed * 15 + u.phase) * u.amp;
      if (s.position.y >  2.2) s.position.y = -2.2;
      if (s.position.y < -2.2) s.position.y =  2.2;
      s.material.opacity = 0.28 + Math.sin(t * u.fade + u.phase) * 0.28;
    }

    blueLight.intensity   = 1.8 + Math.sin(t * 0.9) * 0.4;
    orangeLight.intensity = 0.8 + Math.sin(t * 0.75 + 1) * 0.3;
    cyanLight.intensity   = 0.9 + Math.sin(t * 1.1 + 2) * 0.3;

    renderer.render(scene, camera);
  }

  animate();

})();
