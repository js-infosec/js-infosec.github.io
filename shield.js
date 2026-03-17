// ==================== THREE.JS SHIELD ANIMATION ====================
(function () {

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  if (typeof THREE === 'undefined') return;

  console.log('SHIELD V5 LOADED');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.z = 7;

  // ==================== COLORS (defined first) ====================
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
    const baseWidth = 600;
    const scale = Math.max(0.5, w / baseWidth);
    camera.position.z = 7 / scale;
    camera.updateProjectionMatrix();
  }

  setTimeout(resize, 100);
  window.addEventListener('resize', resize);

  // ==================== SHIELD SHAPE ====================
  const shieldShape = new THREE.Shape();
  shieldShape.moveTo(-0.82, 0.82);
  shieldShape.lineTo(0.82, 0.82);
  shieldShape.bezierCurveTo(0.82, 0.82, 0.82, 0.2, 0.82, 0.1);
  shieldShape.bezierCurveTo(0.82, -0.3, 0.45, -0.6, 0, -0.92);
  shieldShape.bezierCurveTo(-0.45, -0.6, -0.82, -0.3, -0.82, 0.1);
  shieldShape.bezierCurveTo(-0.82, 0.2, -0.82, 0.82, -0.82, 0.82);
  shieldShape.closePath();

  const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4
  });
  shieldGeo.center();

  const shieldMat = new THREE.MeshPhongMaterial({
    color: 0x030e20,
    emissive: BLUE,
    emissiveIntensity: 0.2,
    shininess: 100,
    transparent: true,
    opacity: 0.95
  });

  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  scene.add(shield);

  const edgesGeo = new THREE.EdgesGeometry(shieldGeo, 12);
  const edgeMat  = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.9 });
  shield.add(new THREE.LineSegments(edgesGeo, edgeMat));

  // ==================== CYBERPUNK CIRCUIT TEXTURE ====================
  const cc  = document.createElement('canvas');
  cc.width  = 512;
  cc.height = 512;
  const ctx = cc.getContext('2d');

  function drawCircuits() {
    ctx.clearRect(0, 0, 512, 512);

    function glowDot(x, y, r, color, blur) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = blur;
      ctx.fillStyle   = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function traceLine(points, color, blur, width) {
      ctx.shadowColor = color;
      ctx.shadowBlur  = blur;
      ctx.strokeStyle = color;
      ctx.lineWidth   = width;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.stroke();
    }

    const BL  = '#2776EA';
    const CY  = '#00e5ff';
    const OR  = '#FF6F00';
    const DIM = 'rgba(39,118,234,0.35)';

    // Background dim grid
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = DIM;
    ctx.lineWidth   = 0.5;
    for (let x = 80; x < 440; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 100); ctx.lineTo(x, 420); ctx.stroke();
    }
    for (let y = 120; y < 440; y += 40) {
      ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(440, y); ctx.stroke();
    }

    // Main traces
    traceLine([[100,256],[412,256]], CY, 6, 1.5);
    traceLine([[100,256],[412,256]], BL, 2, 1);
    traceLine([[256,130],[256,390]], CY, 6, 1.5);
    traceLine([[256,130],[256,390]], BL, 2, 1);

    // L-traces
    traceLine([[160,256],[160,190],[256,190]], BL, 5, 1.2);
    traceLine([[352,256],[352,190],[256,190]], BL, 5, 1.2);
    traceLine([[160,256],[160,320],[256,320]], BL, 5, 1.2);
    traceLine([[352,256],[352,320],[256,320]], BL, 5, 1.2);

    // Outer corners
    traceLine([[120,200],[120,160],[200,160]], DIM, 3, 1);
    traceLine([[392,200],[392,160],[312,160]], DIM, 3, 1);
    traceLine([[120,310],[120,360],[200,360]], DIM, 3, 1);
    traceLine([[392,310],[392,360],[312,360]], DIM, 3, 1);

    // Stubs
    traceLine([[256,190],[256,150]], BL, 4, 1);
    traceLine([[256,320],[256,370]], BL, 4, 1);
    traceLine([[160,256],[120,256]], BL, 4, 1);
    traceLine([[352,256],[392,256]], BL, 4, 1);

    // Center chip
    ctx.shadowColor = CY; ctx.shadowBlur = 14;
    ctx.strokeStyle = CY; ctx.lineWidth  = 1.5;
    ctx.strokeRect(220, 220, 72, 72);
    ctx.shadowBlur  = 6;
    ctx.strokeStyle = BL; ctx.lineWidth  = 1;
    ctx.strokeRect(230, 230, 52, 52);

    // Chip pins
    const pins = [
      [220,234],[220,248],[220,262],[220,276],
      [292,234],[292,248],[292,262],[292,276],
      [234,220],[248,220],[262,220],[276,220],
      [234,292],[248,292],[262,292],[276,292],
    ];
    ctx.shadowBlur  = 8;
    ctx.strokeStyle = CY; ctx.lineWidth = 1.5;
    pins.forEach(([px, py]) => {
      ctx.beginPath();
      if (px === 220)      { ctx.moveTo(px, py); ctx.lineTo(px - 12, py); }
      else if (px === 292) { ctx.moveTo(px, py); ctx.lineTo(px + 12, py); }
      else if (py === 220) { ctx.moveTo(px, py); ctx.lineTo(px, py - 12); }
      else                 { ctx.moveTo(px, py); ctx.lineTo(px, py + 12); }
      ctx.stroke();
    });

    // Blue nodes
    [[160,190],[352,190],[160,320],[352,320],
     [256,150],[256,370],[120,256],[392,256],
     [200,160],[312,160],[200,360],[312,360]
    ].forEach(([nx, ny]) => glowDot(nx, ny, 3.5, CY, 10));

    // Orange nodes
    [[256,256],[160,256],[352,256],[256,190],[256,320]].forEach(([nx, ny]) => {
      glowDot(nx, ny, 5, OR, 16);
      ctx.shadowColor = OR; ctx.shadowBlur = 8;
      ctx.strokeStyle = OR; ctx.lineWidth  = 1;
      ctx.beginPath(); ctx.arc(nx, ny, 9, 0, Math.PI * 2); ctx.stroke();
    });

    // Corner squares
    [[120,160],[392,160],[120,360],[392,360]].forEach(([sx, sy]) => {
      ctx.shadowColor = BL; ctx.shadowBlur = 6;
      ctx.strokeStyle = BL; ctx.lineWidth  = 1;
      ctx.strokeRect(sx - 5, sy - 5, 10, 10);
    });
  }

  drawCircuits();

  const circuitMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 1.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cc), transparent: true, depthWrite: false, opacity: 0.9 })
  );
  circuitMesh.position.z = 0.12;
  shield.add(circuitMesh);

  // ==================== ORBIT RING ====================
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.007, 8, 80),
    new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.22 })
  );
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  const orbDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 10, 10),
    new THREE.MeshBasicMaterial({ color: ORANGE })
  );
  scene.add(orbDot);

  // ==================== BINARY SPRITES ====================
  const binarySprites = [];

  function makeBinarySprite(char, color) {
    const sc   = document.createElement('canvas');
    sc.width   = 64;
    sc.height  = 64;
    const sctx = sc.getContext('2d');
    sctx.font = 'bold 40px monospace';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.shadowColor = color;
    sctx.shadowBlur  = 10;
    sctx.fillStyle   = color;
    sctx.fillText(char, 32, 32);
    const mat    = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, opacity: 0.65 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.13, 0.13, 1);
    return sprite;
  }

  for (let i = 0; i < 70; i++) {
    const isOrange = Math.random() < 0.18;
    const col      = isOrange ? '#FF6F00' : '#2776EA';
    const sprite   = makeBinarySprite(Math.random() < 0.5 ? '1' : '0', col);
    const angle    = Math.random() * Math.PI * 2;
    const radius   = 1.4 + Math.random() * 1.8;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 3.5;
    sprite.position.set(x, y, (Math.random() - 0.5) * 1.0);
    sprite.userData = {
      baseX: x, baseY: y,
      speed: 0.003 + Math.random() * 0.005,
      amp:   0.15 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      fade:  0.4 + Math.random() * 0.8
    };
    scene.add(sprite);
    binarySprites.push(sprite);
  }

  // ==================== LIGHTING ====================
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const blueLight = new THREE.PointLight(BLUE, 1.8, 7);
  blueLight.position.set(2, 2, 3);
  scene.add(blueLight);

  const orangeLight = new THREE.PointLight(ORANGE, 0.85, 5);
  orangeLight.position.set(-2, -1, 2);
  scene.add(orangeLight);

  const cyanLight = new THREE.PointLight(CYAN, 0.55, 4);
  cyanLight.position.set(0, 0.5, 3);
  scene.add(cyanLight);

  // ==================== MOUSE ====================
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ==================== ANIMATE ====================
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    shield.position.y           = Math.sin(t * 0.65) * 0.05;
    shield.rotation.y           = Math.sin(t * 0.28) * 0.13 + mouseX * 0.06;
    shield.rotation.x           = Math.sin(t * 0.2)  * 0.04 - mouseY * 0.035;
    shieldMat.emissiveIntensity = 0.17 + Math.sin(t * 1.1) * 0.07;
    edgeMat.opacity             = 0.65 + Math.sin(t * 1.1) * 0.28;

    ring.rotation.z = t * 0.22;
    ring.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.35) * 0.07;

    const a = t * 0.75;
    orbDot.position.x = Math.cos(a) * 1.15;
    orbDot.position.z = Math.sin(a) * 1.15 * Math.sin(Math.PI / 2.5);
    orbDot.position.y = Math.sin(a) * 1.15 * Math.cos(Math.PI / 2.5);

    for (const s of binarySprites) {
      const u = s.userData;
      s.position.x = u.baseX + Math.sin(t * u.speed * 22 + u.phase) * u.amp * 0.2;
      s.position.y = u.baseY + Math.sin(t * u.speed * 16 + u.phase) * u.amp;
      if (s.position.y >  2.0) s.position.y = -2.0;
      if (s.position.y < -2.0) s.position.y =  2.0;
      s.material.opacity = 0.35 + Math.sin(t * u.fade + u.phase) * 0.25;
    }

    blueLight.intensity   = 1.6 + Math.sin(t * 1.1) * 0.4;
    orangeLight.intensity = 0.7 + Math.sin(t * 0.85 + 1) * 0.25;
    cyanLight.intensity   = 0.5 + Math.sin(t * 1.3 + 2) * 0.2;

    renderer.render(scene, camera);
  }

  animate();

})();
