import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Eye, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Compass,
  ArrowRight,
  MessageSquare,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Robot3D({ 
  onNavigateTab, 
  currentTab = 'dashboard', 
  isFloating = false 
}) {
  const mountRef = useRef(null);
  const [expression, setExpression] = useState('happy'); // 'happy', 'speaking', 'analyzing'
  const [activeSpeech, setActiveSpeech] = useState(
    "Hi Rajat! I'm SkillBot, your 3D AI Career Intelligence Guide. Rotate me or click any feature below to explore the platform!"
  );
  const [isSpeaking, setIsSpeaking] = useState(true);

  const featureBriefings = {
    dashboard: "Here's your live Smart Dashboard with Career Readiness at 82/100 and average skill match across 12 roles.",
    careerdna: "This is your AI Career DNA 6-axis radar chart showing 92% Programming and 88% Problem Solving.",
    verification: "Adaptive Skill Verification lets you prove your skills with code challenges. Claimed skill becomes Verified!",
    quests: "Project Quests give you hands-on capstones that award +10 React, +8 API, and +350 XP on completion.",
    roadmap: "Your personalized 10-week roadmap starts with System Design basics and Docker containerization.",
    projects: "Project-based proof-of-work showcasing your AI Chatbot, E-Commerce API, and React Portfolio.",
    portfolio: "Your Living Portfolio is a shareable public URL with verified audit badges for top employers.",
    opportunities: "Multi-tier Opportunity Engine aggregating 8 streams: Jobs, Internships, Hackathons, and Open Source.",
    interview: "AI Mock Interview Simulator scoring Technical depth, Communication, Confidence, and Completeness.",
    knowledgegraph: "Semantic Career Knowledge Graph mapping connections between Skills, Careers, and Quests.",
    college: "College & TPO Institutional Dashboard tracking 2,500 students and macro missing curriculum skills.",
  };

  const handleSelectFeature = (tabKey) => {
    if (onNavigateTab) {
      onNavigateTab(tabKey);
    }
    const text = featureBriefings[tabKey] || "Exploring this module with real-time AI career intelligence!";
    setActiveSpeech(text);
    setIsSpeaking(true);

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.7 }
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 3.0);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    const cyanSpot = new THREE.PointLight(0x06b6d4, 3, 10);
    cyanSpot.position.set(0, 0, 2);
    scene.add(cyanSpot);

    // 3. Construct 3D Robot matching the uploaded reference image
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // White Glossy Material
    const whiteBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
    });

    // Dark Visor Screen Material
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x090d18,
      roughness: 0.1,
      metalness: 0.85,
    });

    // Glowing Cyan Eye Material
    const cyanEyeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
    });

    // Head Group (tilts to look at mouse)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    robotRoot.add(headGroup);

    // Outer Head Shell (Smooth sphere slightly flattened)
    const headGeo = new THREE.SphereGeometry(0.55, 36, 36);
    headGeo.scale(1.05, 0.95, 1.0);
    const headMesh = new THREE.Mesh(headGeo, whiteBodyMat);
    headGroup.add(headMesh);

    // Visor Faceplate (Curved inset screen)
    const visorGeo = new THREE.SphereGeometry(0.46, 32, 32);
    visorGeo.scale(0.96, 0.65, 0.45);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.04, 0.38);
    headGroup.add(visorMesh);

    // Cyan Glowing Left Eye (Pill/circle)
    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    eyeGeo.scale(1.1, 1.3, 0.4);
    const leftEye = new THREE.Mesh(eyeGeo, cyanEyeMat);
    leftEye.position.set(-0.16, 0.08, 0.53);
    headGroup.add(leftEye);

    // Cyan Glowing Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, cyanEyeMat);
    rightEye.position.set(0.16, 0.08, 0.53);
    headGroup.add(rightEye);

    // Cute Smiling Mouth Line
    const mouthCurve = new THREE.TorusGeometry(0.07, 0.015, 8, 20, Math.PI * 0.7);
    const mouthMesh = new THREE.Mesh(mouthCurve, cyanEyeMat);
    mouthMesh.rotation.z = Math.PI * 1.15;
    mouthMesh.rotation.x = 0.2;
    mouthMesh.position.set(0, -0.07, 0.53);
    headGroup.add(mouthMesh);

    // Side Earphone / Headphone Pods (Darker blue with cyan inner ring)
    const earMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.5,
    });
    const earGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 24);
    earGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.58, 0.06, 0);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.58, 0.06, 0);
    headGroup.add(rightEar);

    // Cyan glowing ring on ears
    const earRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const earRingGeo = new THREE.RingGeometry(0.07, 0.11, 20);
    earRingGeo.rotateY(Math.PI / 2);

    const leftEarRing = new THREE.Mesh(earRingGeo, earRingMat);
    leftEarRing.position.set(-0.645, 0.06, 0);
    headGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, earRingMat);
    rightEarRing.position.set(0.645, 0.06, 0);
    rightEarRing.rotateY(Math.PI);
    headGroup.add(rightEarRing);

    // Body Group (Floating egg/capsule torso)
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.4, 0);
    robotRoot.add(bodyGroup);

    // Body Egg Geometry
    const bodyGeo = new THREE.SphereGeometry(0.42, 32, 32);
    bodyGeo.scale(0.9, 1.15, 0.85);
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteBodyMat);
    bodyGroup.add(bodyMesh);

    // Floating Left Shoulder & Arm
    const armGeo = new THREE.CapsuleGeometry(0.08, 0.22, 12, 16);
    const leftArm = new THREE.Mesh(armGeo, earMat);
    leftArm.position.set(-0.48, 0.08, 0.05);
    leftArm.rotation.z = 0.35;
    bodyGroup.add(leftArm);

    // Floating Right Shoulder & Arm
    const rightArm = new THREE.Mesh(armGeo, earMat);
    rightArm.position.set(0.48, 0.08, 0.05);
    rightArm.rotation.z = -0.35;
    bodyGroup.add(rightArm);

    // Glowing Levitation Ring beneath the robot
    const levRingGeo = new THREE.TorusGeometry(0.35, 0.015, 12, 36);
    levRingGeo.rotateX(Math.PI / 2);
    const levRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.75,
    });
    const levRing = new THREE.Mesh(levRingGeo, levRingMat);
    levRing.position.set(0, -0.9, 0);
    robotRoot.add(levRing);

    // 4. Mouse Tracking & Drag-to-Rotate Interaction
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        targetRotationY += deltaX * 0.012;
        previousMouseX = e.clientX;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 5. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth levitation bobbing
      robotRoot.position.y = Math.sin(t * 2.2) * 0.08;

      // Gentle breathing scale on arms
      leftArm.rotation.x = Math.sin(t * 2) * 0.1;
      rightArm.rotation.x = -Math.sin(t * 2) * 0.1;

      // Levitation ring pulse
      levRing.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      levRingMat.opacity = 0.5 + Math.sin(t * 3) * 0.25;

      // Smooth rotation interpolation
      robotRoot.rotation.y += (targetRotationY - robotRoot.rotation.y) * 0.08;

      // Head smoothly tracks cursor
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouseNormX * 0.45, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouseNormY * 0.3, 0.08);

      // Blinking animation every 4 seconds
      const blinkTime = t % 4;
      if (blinkTime < 0.15) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1.3;
        rightEye.scale.y = 1.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-between ${
      isFloating 
        ? 'w-full h-full' 
        : 'glass-panel rounded-3xl p-6 border border-slate-800/90 shadow-2xl'
    }`}>
      {/* Top Guide Header */}
      {!isFloating && (
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Bot className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#090d18] animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>SkillBot 3D — AI Platform Moderator</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
                  Live WebGL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Interactive 3D guide. Drag to rotate 360° • Tracks your cursor in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Click any feature below to explore:</span>
          </div>
        </div>
      )}

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px] cursor-grab active:cursor-grabbing select-none overflow-hidden">
        {/* Three.js Canvas Mount */}
        <div ref={mountRef} className="w-full h-full min-h-[280px] max-h-[360px]" />

        {/* Floating speech bubble from the 3D robot */}
        <div className="absolute top-2 left-4 right-4 z-10 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <div className="glass-card rounded-2xl p-3.5 border border-cyan-500/40 shadow-glow-cyan max-w-lg mx-auto pointer-events-auto">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeSpeech}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Drag rotation tip */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>Click and drag to rotate in 3D</span>
        </div>
      </div>

      {/* Interactive Feature Quick-Jump Chips */}
      {!isFloating && (
        <div className="w-full pt-4 mt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center sm:text-left">
            Ask SkillBot to Tour Platform Features:
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            {[
              { id: 'dashboard', label: '📊 Smart Dashboard' },
              { id: 'careerdna', label: '🧬 AI Career DNA' },
              { id: 'verification', label: '🧪 Skill Verification' },
              { id: 'quests', label: '🎯 Project Quests' },
              { id: 'interview', label: '🎙️ Mock Interview' },
              { id: 'portfolio', label: '🌐 Living Portfolio' },
              { id: 'opportunities', label: '💼 Opportunity Engine' },
              { id: 'knowledgegraph', label: '🕸️ Knowledge Graph' },
              { id: 'college', label: '🏛️ College / TPO' },
              { id: 'roadmap', label: '🗺️ 10-Week Roadmap' },
            ].map((feat) => (
              <button
                key={feat.id}
                onClick={() => handleSelectFeature(feat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:scale-105 ${
                  currentTab === feat.id
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-glow-cyan'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                {feat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
