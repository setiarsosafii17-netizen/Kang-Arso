import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { REALMS } from '../../data/realmsData';
import { soundEngine } from '../../utils/audio';

export type InteractiveTargetType = 'npc' | 'board' | 'chest' | 'crystal' | 'minigame' | 'boss' | 'portal';

export interface InteractiveTarget {
  id: string;
  type: InteractiveTargetType;
  title: string;
  subtitle: string;
  realmId: number;
  data?: unknown;
}

interface GameCanvasProps {
  currentRealmId: number;
  onInteract: (target: InteractiveTarget) => void;
  onCoinCollected: () => void;
  onCrystalCollected: (realmId: number) => void;
  moveInput: { x: number; y: number };
  jumpRequested: boolean;
  onJumpHandled: () => void;
  interactRequested: boolean;
  onInteractHandled: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentRealmId,
  onInteract,
  onCoinCollected,
  onCrystalCollected,
  moveInput,
  jumpRequested,
  onJumpHandled,
  interactRequested,
  onInteractHandled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearbyPrompt, setNearbyPrompt] = useState<InteractiveTarget | null>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Game state references
  const playerPos = useRef({ x: 0, y: 1, z: 0 });
  const playerVel = useRef({ x: 0, y: 0, z: 0 });
  const isGrounded = useRef(true);
  const playerRotation = useRef(0);
  const walkCycle = useRef(0);

  // Objects to animate & interact
  const interactableObjects = useRef<
    {
      mesh: THREE.Object3D;
      target: InteractiveTarget;
      radius: number;
      collected?: boolean;
    }[]
  >([]);
  const spinningCoins = useRef<THREE.Mesh[]>([]);
  const pulsingCrystals = useRef<THREE.Group[]>([]);
  const cuteMonsters = useRef<{ group: THREE.Group; baseY: number; phase: number }[]>([]);

  // Key tracking
  const keysDown = useRef<{ [key: string]: boolean }>({});

  const handleInteractionTrigger = useCallback(() => {
    if (nearbyPrompt) {
      onInteract(nearbyPrompt);
    }
  }, [nearbyPrompt, onInteract]);

  useEffect(() => {
    if (interactRequested) {
      handleInteractionTrigger();
      onInteractHandled();
    }
  }, [interactRequested, handleInteractionTrigger, onInteractHandled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDown.current[e.code] = true;
      if (e.code === 'KeyE' || e.code === 'Enter') {
        handleInteractionTrigger();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleInteractionTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const currentRealm = REALMS.find((r) => r.id === currentRealmId) || REALMS[0];

    // Sky and Fog based on Realm
    const realmColors: { [key: number]: { sky: number; fog: number; ground: number } } = {
      1: { sky: 0xc6f6d5, fog: 0x9ae6b4, ground: 0x48bb78 }, // Desa Pangkat: fresh meadow
      2: { sky: 0xbae6fd, fog: 0x7dd3fc, ground: 0x0284c7 }, // Hutan: deep sky blue
      3: { sky: 0xfef08a, fog: 0xfde047, ground: 0xd97706 }, // Gunung: golden canyon
      4: { sky: 0x312e81, fog: 0x4338ca, ground: 0x6d28d9 }, // Gua: mystical purple
      5: { sky: 0x4c0519, fog: 0x831843, ground: 0xbe185d }, // Kastel: royal rose/crimson
    };
    const theme = realmColors[currentRealmId] || realmColors[1];
    scene.background = new THREE.Color(theme.sky);
    scene.fog = new THREE.FogExp2(theme.fog, 0.022);

    // 2. Camera Setup
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    camera.position.set(0, 7, 10);
    cameraRef.current = camera;

    // 3. Renderer Setup (optimized for mobile/tablet/TV)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
    dirLight.position.set(20, 35, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    scene.add(dirLight);

    // 5. Build Realm Island & Props
    interactableObjects.current = [];
    spinningCoins.current = [];
    pulsingCrystals.current = [];
    cuteMonsters.current = [];

    // Main Floating Island (Blocky, colorful low-poly style)
    const islandGroup = new THREE.Group();
    const groundGeo = new THREE.BoxGeometry(38, 4, 38);
    const groundMat = new THREE.MeshStandardMaterial({
      color: theme.ground,
      roughness: 0.6,
      flatShading: true,
    });
    const mainGround = new THREE.Mesh(groundGeo, groundMat);
    mainGround.position.y = -2;
    mainGround.receiveShadow = true;
    islandGroup.add(mainGround);

    // Island Under-rock cliff layers
    const rockGeo = new THREE.ConeGeometry(24, 18, 7);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, flatShading: true, roughness: 0.9 });
    const underRock = new THREE.Mesh(rockGeo, rockMat);
    underRock.rotation.x = Math.PI;
    underRock.position.y = -13;
    islandGroup.add(underRock);

    // Stone pathway tiles in center
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8, flatShading: true });
    for (let i = -14; i <= 14; i += 2.2) {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.8), pathMat);
      tile.position.set(0, 0.05, i);
      tile.receiveShadow = true;
      islandGroup.add(tile);
    }
    scene.add(islandGroup);

    // --- BIOME SPECIFIC PROPS ---
    const decorGroup = new THREE.Group();

    // Helper: Add Low-Poly Tree
    const addTree = (x: number, z: number, scale = 1, foliageColor = 0x22c55e) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3 * scale, 0.45 * scale, 2.4 * scale, 6),
        new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8, flatShading: true })
      );
      trunk.position.y = 1.2 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      // 2 tiers of foliage cones
      const leavesMat = new THREE.MeshStandardMaterial({ color: foliageColor, flatShading: true, roughness: 0.5 });
      const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.6 * scale, 2.2 * scale, 6), leavesMat);
      f1.position.y = 2.8 * scale;
      f1.castShadow = true;
      tree.add(f1);

      const f2 = new THREE.Mesh(new THREE.ConeGeometry(1.2 * scale, 1.8 * scale, 6), leavesMat);
      f2.position.y = 4.0 * scale;
      f2.castShadow = true;
      tree.add(f2);

      tree.position.set(x, 0, z);
      decorGroup.add(tree);
    };

    // Helper: Add Crystal Rock
    const addCrystalShard = (x: number, z: number, color = 0x38bdf8) => {
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.1,
          metalness: 0.3,
          emissive: color,
          emissiveIntensity: 0.4,
          flatShading: true,
        })
      );
      shard.position.set(x, 1.0, z);
      shard.rotation.z = 0.2;
      shard.castShadow = true;
      decorGroup.add(shard);
    };

    // Populate according to realm
    if (currentRealmId === 1) {
      // Desa: Windmill, cozy fences, trees, flowers
      addTree(-10, -8, 1.2, 0x10b981);
      addTree(-12, 6, 1.0, 0x059669);
      addTree(12, -10, 1.3, 0x10b981);
      addTree(13, 8, 0.9, 0x34d399);

      // Low-poly House / Windmill
      const house = new THREE.Group();
      const walls = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 3.5, 3.5),
        new THREE.MeshStandardMaterial({ color: 0xfef3c7, flatShading: true })
      );
      walls.position.y = 1.75;
      walls.castShadow = true;
      house.add(walls);
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.0, 2.4, 4),
        new THREE.MeshStandardMaterial({ color: 0xd97706, flatShading: true })
      );
      roof.position.y = 4.7;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);
      house.position.set(-9, 0, -10);
      decorGroup.add(house);
    } else if (currentRealmId === 2) {
      // Hutan Perkalian: Lots of trees and giant mushrooms
      for (let i = 0; i < 9; i++) {
        const tx = (Math.sin(i * 1.5) * 12);
        const tz = (Math.cos(i * 1.5) * 12);
        if (Math.abs(tx) > 3) addTree(tx, tz, 1 + (i % 3) * 0.2, 0x0284c7);
      }
    } else if (currentRealmId === 3) {
      // Gunung Pembagian: Rocky peaks & snow stones
      for (let i = 0; i < 7; i++) {
        const peak = new THREE.Mesh(
          new THREE.ConeGeometry(2.5 + (i % 2), 6 + (i % 3), 5),
          new THREE.MeshStandardMaterial({ color: 0x78716c, flatShading: true })
        );
        peak.position.set((i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 2), 3, -12 + i * 4);
        peak.castShadow = true;
        decorGroup.add(peak);
      }
    } else if (currentRealmId === 4) {
      // Gua Pangkat: Glowing crystals everywhere
      addCrystalShard(-8, -6, 0xa855f7);
      addCrystalShard(-10, 8, 0xc084fc);
      addCrystalShard(8, -8, 0x8b5cf6);
      addCrystalShard(11, 6, 0xe879f9);
    } else {
      // Kastel Eksponen: Castle battlements and towers
      const addTower = (x: number, z: number) => {
        const tower = new THREE.Group();
        const cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(1.6, 1.8, 7, 8),
          new THREE.MeshStandardMaterial({ color: 0x64748b, flatShading: true })
        );
        cylinder.position.y = 3.5;
        cylinder.castShadow = true;
        tower.add(cylinder);
        const sp = new THREE.Mesh(
          new THREE.ConeGeometry(2.0, 3.5, 8),
          new THREE.MeshStandardMaterial({ color: 0xec4899, flatShading: true })
        );
        sp.position.y = 8.5;
        sp.castShadow = true;
        tower.add(sp);
        tower.position.set(x, 0, z);
        decorGroup.add(tower);
      };
      addTower(-12, -12);
      addTower(12, -12);
      addTower(-12, 12);
      addTower(12, 12);
    }
    scene.add(decorGroup);

    // --- INTERACTIVE OBJECT 1: NPC GURU / PENJAGA ---
    const npcGroup = new THREE.Group();
    // Body (cute robes)
    const npcBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.9, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, flatShading: true })
    );
    npcBody.position.y = 0.9;
    npcBody.castShadow = true;
    npcGroup.add(npcBody);

    // Head
    const npcHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xfed7aa, flatShading: true })
    );
    npcHead.position.y = 2.1;
    npcHead.castShadow = true;
    npcGroup.add(npcHead);

    // Sage Hat
    const npcHat = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, flatShading: true })
    );
    npcHat.position.y = 2.9;
    npcHat.castShadow = true;
    npcGroup.add(npcHat);

    // Exclamation Icon hovering above NPC
    const excGeo = new THREE.OctahedronGeometry(0.3, 0);
    const excMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const excMesh = new THREE.Mesh(excGeo, excMat);
    excMesh.position.y = 3.9;
    npcGroup.add(excMesh);

    npcGroup.position.set(-4, 0, -4);
    scene.add(npcGroup);

    interactableObjects.current.push({
      mesh: npcGroup,
      target: {
        id: `npc_${currentRealmId}`,
        type: 'npc',
        title: currentRealm.npcName,
        subtitle: currentRealm.npcRole,
        realmId: currentRealmId,
        data: currentRealm,
      },
      radius: 3.2,
    });

    // --- INTERACTIVE OBJECT 2: PAPAN SOAL (QUESTION SIGNBOARD) ---
    const boardGroup = new THREE.Group();
    const boardPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 2.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true })
    );
    boardPost.position.y = 1.1;
    boardPost.castShadow = true;
    boardGroup.add(boardPost);

    const boardPanel = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xd97706, flatShading: true })
    );
    boardPanel.position.y = 2.0;
    boardPanel.castShadow = true;
    boardGroup.add(boardPanel);

    // Math Sign Emblem
    const boardSign = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.0, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, flatShading: true })
    );
    boardSign.position.y = 2.0;
    boardGroup.add(boardSign);

    boardGroup.position.set(4, 0, -3);
    scene.add(boardGroup);

    interactableObjects.current.push({
      mesh: boardGroup,
      target: {
        id: `board_${currentRealmId}`,
        type: 'board',
        title: 'Papan Misi Eksponen',
        subtitle: 'Selesaikan tantangan matematika di sini!',
        realmId: currentRealmId,
      },
      radius: 3.0,
    });

    // --- INTERACTIVE OBJECT 3: PETI HARTA (TREASURE CHEST) ---
    const chestGroup = new THREE.Group();
    const chestBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6, flatShading: true })
    );
    chestBase.position.y = 0.45;
    chestBase.castShadow = true;
    chestGroup.add(chestBase);

    const chestLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.4, 8, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xd97706, flatShading: true })
    );
    chestLid.rotation.z = Math.PI / 2;
    chestLid.position.y = 0.9;
    chestLid.castShadow = true;
    chestGroup.add(chestLid);

    chestGroup.position.set(7, 0, 4);
    scene.add(chestGroup);

    interactableObjects.current.push({
      mesh: chestGroup,
      target: {
        id: `chest_${currentRealmId}`,
        type: 'chest',
        title: 'Peti Harta Matematika',
        subtitle: 'Buka peti dengan menyelesaikan kode eksponen!',
        realmId: currentRealmId,
      },
      radius: 3.0,
    });

    // --- INTERACTIVE OBJECT 4: KRISTAL ENERGI UTAMA EKSPONEN ---
    const crystalGroup = new THREE.Group();
    const crystalMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.6,
        flatShading: true,
      })
    );
    crystalMesh.position.y = 2.4;
    crystalMesh.castShadow = true;
    crystalGroup.add(crystalMesh);

    // Glowing Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.6, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, flatShading: true })
    );
    pedestal.position.y = 0.6;
    pedestal.receiveShadow = true;
    crystalGroup.add(pedestal);

    crystalGroup.position.set(-6, 0, 7);
    scene.add(crystalGroup);
    pulsingCrystals.current.push(crystalGroup);

    interactableObjects.current.push({
      mesh: crystalGroup,
      target: {
        id: `crystal_${currentRealmId}`,
        type: 'crystal',
        title: 'Kristal Energi Eksponen',
        subtitle: 'Ambil pecahan kristal untuk memulihkan Numeria!',
        realmId: currentRealmId,
      },
      radius: 3.2,
    });

    // --- INTERACTIVE OBJECT 5: PORTAL BOSS / GUARDIAN ARENA ---
    const portalGroup = new THREE.Group();
    const portalArch = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.4, 8, 20),
      new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xbe185d,
        emissiveIntensity: 0.5,
        flatShading: true,
      })
    );
    portalArch.position.y = 2.3;
    portalGroup.add(portalArch);

    portalGroup.position.set(0, 0, -14);
    scene.add(portalGroup);

    interactableObjects.current.push({
      mesh: portalGroup,
      target: {
        id: `boss_${currentRealmId}`,
        type: 'boss',
        title: currentRealmId === 5 ? 'Singgasana RAJA EKSPONEN' : `Pertarungan Guardian: ${currentRealm.bossName}`,
        subtitle: 'Uji kemampuanmu menghadapi Guardian Wilayah!',
        realmId: currentRealmId,
        data: currentRealm,
      },
      radius: 3.5,
    });

    // --- INTERACTIVE OBJECT 6: MINI GAME PORTAL ---
    const miniGameGroup = new THREE.Group();
    const mgPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.5, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, flatShading: true })
    );
    mgPedestal.position.y = 0.25;
    miniGameGroup.add(mgPedestal);

    const mgIcon = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.5, flatShading: true })
    );
    mgIcon.position.y = 1.8;
    miniGameGroup.add(mgIcon);

    miniGameGroup.position.set(-8, 0, 0);
    scene.add(miniGameGroup);

    interactableObjects.current.push({
      mesh: miniGameGroup,
      target: {
        id: `minigame_${currentRealmId}`,
        type: 'minigame',
        title: 'Arena Mini Game Matematika',
        subtitle: 'Pilih: Lompat Angka, Jembatan, atau Labirin!',
        realmId: currentRealmId,
      },
      radius: 3.2,
    });

    // --- COINS SCATTERED ON THE ISLAND ---
    const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 10);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xca8a04,
      emissiveIntensity: 0.3,
    });
    const coinPositions = [
      { x: 0, z: -8 },
      { x: 0, z: 8 },
      { x: 2, z: -4 },
      { x: -2, z: 4 },
      { x: 6, z: 0 },
      { x: -6, z: -2 },
      { x: 4, z: 9 },
    ];
    coinPositions.forEach((pos, idx) => {
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.rotation.x = Math.PI / 2;
      coin.position.set(pos.x, 1.2, pos.z);
      coin.castShadow = true;
      scene.add(coin);
      spinningCoins.current.push(coin);

      interactableObjects.current.push({
        mesh: coin,
        target: {
          id: `coin_${idx}`,
          type: 'portal', // Internal collectible
          title: 'Koin Matematika',
          subtitle: '+10 Koin diperoleh!',
          realmId: currentRealmId,
        },
        radius: 1.4,
      });
    });

    // --- CUTE MATH MONSTER (Friendly math pet walking around) ---
    const monsterGroup = new THREE.Group();
    const monsterBody = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.8, 0),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4, flatShading: true })
    );
    monsterBody.position.y = 0.8;
    monsterBody.castShadow = true;
    monsterGroup.add(monsterBody);

    // Cute Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
    eye1.position.set(-0.25, 0.9, 0.7);
    monsterGroup.add(eye1);
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
    eye2.position.set(0.25, 0.9, 0.7);
    monsterGroup.add(eye2);

    monsterGroup.position.set(8, 0, -8);
    scene.add(monsterGroup);
    cuteMonsters.current.push({ group: monsterGroup, baseY: 0, phase: 0 });

    // --- 6. ORIGINAL CHARACTER: "KUBI" THE EXPONENT ADVENTURER ---
    const playerGroup = new THREE.Group();
    playerRef.current = playerGroup;

    // Body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, flatShading: true });
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.65), bodyMat);
    pBody.position.y = 0.95;
    pBody.castShadow = true;
    playerGroup.add(pBody);

    // Head
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6, flatShading: true });
    const pHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.75, 0.75), headMat);
    pHead.position.y = 1.85;
    pHead.castShadow = true;
    playerGroup.add(pHead);

    // Adventurer Cap / Visor
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, flatShading: true });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.9), capMat);
    cap.position.y = 2.3;
    cap.castShadow = true;
    playerGroup.add(cap);

    // Backpack (Explorer kit)
    const packMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, flatShading: true });
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.35), packMat);
    pack.position.set(0, 1.0, -0.45);
    pack.castShadow = true;
    playerGroup.add(pack);

    // Glowing antenna crystal on cap
    const antMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ant = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 5), antMat);
    ant.position.y = 2.55;
    playerGroup.add(ant);

    // Player initial position
    playerGroup.position.set(playerPos.current.x, playerPos.current.y, playerPos.current.z);
    scene.add(playerGroup);

    // --- 7. Main Render & Physics Loop ---
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Inputs (Keyboard + Virtual Joystick)
      let inputX = moveInput.x;
      let inputZ = moveInput.y;

      if (keysDown.current['KeyA'] || keysDown.current['ArrowLeft']) inputX -= 1;
      if (keysDown.current['KeyD'] || keysDown.current['ArrowRight']) inputX += 1;
      if (keysDown.current['KeyW'] || keysDown.current['ArrowUp']) inputZ -= 1;
      if (keysDown.current['KeyS'] || keysDown.current['ArrowDown']) inputZ += 1;

      // Normalize speed if diagonal
      const length = Math.hypot(inputX, inputZ);
      const speed = 7.5;
      if (length > 0.05) {
        const normX = (inputX / (length > 1 ? length : 1));
        const normZ = (inputZ / (length > 1 ? length : 1));
        playerVel.current.x = normX * speed;
        playerVel.current.z = normZ * speed;

        // Player face direction
        playerRotation.current = Math.atan2(normX, normZ);
        playerGroup.rotation.y = playerRotation.current;

        // Walking bob animation
        walkCycle.current += delta * 12;
        pBody.position.y = 0.95 + Math.sin(walkCycle.current) * 0.08;
      } else {
        playerVel.current.x = 0;
        playerVel.current.z = 0;
        pBody.position.y = 0.95;
      }

      // Jump handling
      const isSpace = keysDown.current['Space'];
      if ((isSpace || jumpRequested) && isGrounded.current) {
        playerVel.current.y = 7.2;
        isGrounded.current = false;
        soundEngine.playJump();
        if (jumpRequested) onJumpHandled();
      }

      // Gravity & Vertical Physics
      playerVel.current.y -= 18.0 * delta;
      playerPos.current.y += playerVel.current.y * delta;

      if (playerPos.current.y <= 0) {
        playerPos.current.y = 0;
        playerVel.current.y = 0;
        isGrounded.current = true;
      }

      // Horizontal boundaries (keep inside island bounds)
      playerPos.current.x += playerVel.current.x * delta;
      playerPos.current.z += playerVel.current.z * delta;

      const islandLimit = 16.5;
      playerPos.current.x = Math.max(-islandLimit, Math.min(islandLimit, playerPos.current.x));
      playerPos.current.z = Math.max(-islandLimit, Math.min(islandLimit, playerPos.current.z));

      playerGroup.position.set(playerPos.current.x, playerPos.current.y, playerPos.current.z);

      // Camera Smooth Follow (Third-Person Chase Cam)
      const targetCamX = playerPos.current.x;
      const targetCamY = playerPos.current.y + 6.0;
      const targetCamZ = playerPos.current.z + 8.5;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(playerPos.current.x, playerPos.current.y + 1.2, playerPos.current.z);

      // Animate ambient items (Spinning coins & crystals)
      spinningCoins.current.forEach((coin) => {
        coin.rotation.z += delta * 3.0;
      });

      pulsingCrystals.current.forEach((cg) => {
        cg.rotation.y += delta * 1.5;
        const crystalChild = cg.children[0];
        if (crystalChild) {
          crystalChild.position.y = 2.4 + Math.sin(time * 0.003) * 0.25;
        }
      });

      cuteMonsters.current.forEach((m) => {
        m.phase += delta * 2;
        m.group.position.y = m.baseY + Math.abs(Math.sin(m.phase)) * 0.4;
      });

      // Proximity detection for Interactive Objects & Coin auto-collect
      let foundPrompt: InteractiveTarget | null = null;
      for (const item of interactableObjects.current) {
        if (item.collected) continue;

        const dx = playerPos.current.x - item.mesh.position.x;
        const dz = playerPos.current.z - item.mesh.position.z;
        const dist = Math.hypot(dx, dz);

        // Auto collect coin on walk over
        if (item.target.title === 'Koin Matematika' && dist < item.radius) {
          item.collected = true;
          item.mesh.visible = false;
          soundEngine.playCoin();
          onCoinCollected();
          continue;
        }

        if (dist <= item.radius) {
          foundPrompt = item.target;
        }
      }
      setNearbyPrompt(foundPrompt);

      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentRealmId, moveInput, jumpRequested, onCoinCollected, onCrystalCollected, onJumpHandled]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Proximity Interaction Prompt Banner */}
      {nearbyPrompt && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border-2 border-amber-400 text-white shadow-2xl animate-bounce">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-bold font-mono text-sm shadow">
              E
            </span>
            <div className="text-left">
              <p className="text-xs uppercase font-bold tracking-wider text-amber-300">
                {nearbyPrompt.title}
              </p>
              <p className="text-sm font-medium text-slate-200">{nearbyPrompt.subtitle}</p>
            </div>
            <button
              onClick={handleInteractionTrigger}
              className="ml-2 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 active:scale-95 transition-all shadow"
            >
              Interaksi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
