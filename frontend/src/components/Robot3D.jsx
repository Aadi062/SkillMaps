// SkillMap AI - Real-Time Embodied 3D AI Career Coach with Three.js Lip-Sync
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Bot,
  Mic,
  MicOff,
  Radio,
  Send,
  Zap,
  CheckCircle2,
  Headphones,
  BrainCircuit,
  Volume1
} from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Standard Voice Prompt Chips
const VOICE_SUGGESTIONS = [
  "What should I learn next?",
  "What are my biggest skill gaps?",
  "Show me jobs matching my profile",
  "Take me to my 10-week roadmap",
  "How is my career readiness score?"
];

export default function Robot3D({ 
  onNavigateTab, 
  currentTab = 'dashboard', 
  isFloating = false 
}) {
  const mountRef = useRef(null);

  // Embodied Emotional States: 'IDLE' | 'LISTENING' | 'THINKING' | 'ANSWERING' | 'EXCITED'
  const [avatarState, setAvatarState] = useState('IDLE');
  const avatarStateRef = useRef('IDLE');

  const updateAvatarState = (newState) => {
    setAvatarState(newState);
    avatarStateRef.current = newState;
  };

  // Dialogue & Speech
  const [activeSpeech, setActiveSpeech] = useState(
    "Hi Rajat! I'm SkillBot, your Embodied 3D AI Career Coach. Talk to me naturally or ask anything about your career roadmap!"
  );
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [detectedAction, setDetectedAction] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Three.js internal references for live 60 FPS animation
  const threeRefs = useRef({
    robotRoot: null,
    headGroup: null,
    leftEye: null,
    rightEye: null,
    mouthMesh: null,
    leftArm: null,
    rightArm: null,
    levRing: null,
    levRingMat: null,
    leftEarRing: null,
    rightEarRing: null,
    renderer: null,
    scene: null,
    camera: null
  });

  // Feature briefings
  const featureBriefings = {
    dashboard: "Here is your live Smart Dashboard with Career Readiness at 82/100 and average skill match across 12 roles.",
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

  // -------------------------------------------------------------
  // Text-To-Speech with Three.js Lip-Sync Synchronization
  // -------------------------------------------------------------
  const speakText = useCallback((text) => {
    if (!voiceEnabled || !synthRef.current) {
      setActiveSpeech(text);
      return;
    }

    synthRef.current.cancel(); // Stop any pending utterances
    const cleanText = text.replace(/[*_#`\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick natural English voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David")) && v.lang.startsWith("en"));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }
    utterance.rate = 1.05;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setActiveSpeech(text);
      updateAvatarState('ANSWERING');
    };

    utterance.onend = () => {
      updateAvatarState('IDLE');
      // If hands-free mode is on, resume listening after a brief natural pause
      if (handsFreeMode && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }, 600);
      }
    };

    utterance.onerror = () => {
      updateAvatarState('IDLE');
    };

    synthRef.current.speak(utterance);
  }, [voiceEnabled, handsFreeMode]);

  // -------------------------------------------------------------
  // AI Career Coach Brain Query
  // -------------------------------------------------------------
  const askCoach = useCallback(async (userQuery) => {
    if (!userQuery || !userQuery.trim()) return;

    updateAvatarState('THINKING');
    setActiveSpeech("Analyzing your SkillMap profile and career trajectory...");

    try {
      const res = await fetch(`${API_BASE}/api/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userQuery })
      });

      if (res.ok) {
        const data = await res.json();
        const spoken = data.spoken_summary || data.reply || "I analyzed your question. Let me know what you would like to explore next!";
        
        // Voice Navigation Trigger: Check if a tab action was detected
        if (data.voice_action && onNavigateTab) {
          const tab = data.voice_action;
          setDetectedAction(tab);
          setTimeout(() => {
            onNavigateTab(tab);
            setDetectedAction(null);
          }, 1200);
        }

        speakText(spoken);

        if (userQuery.toLowerCase().includes("great") || userQuery.toLowerCase().includes("thank") || userQuery.toLowerCase().includes("done")) {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
        }
      } else {
        const fallback = "I'm ready to help you discover careers, close skill gaps, or explore job matches!";
        speakText(fallback);
      }
    } catch (err) {
      console.warn("Coach voice query error:", err);
      speakText("I had trouble reaching the cloud, but I'm ready to help with your roadmap!");
    }
  }, [onNavigateTab, speakText]);

  // -------------------------------------------------------------
  // Web Speech Recognition (Microphone Voice Input)
  // -------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      updateAvatarState('LISTENING');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setTranscript(final || interim);

      if (final) {
        setIsListening(false);
        askCoach(final);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      updateAvatarState('IDLE');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (avatarStateRef.current === 'LISTENING') {
        updateAvatarState('IDLE');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {}
    };
  }, [askCoach]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. You can click any of the prompt buttons below to ask!");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      updateAvatarState('IDLE');
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    }
  };

  const handleSelectFeature = (tabKey) => {
    if (onNavigateTab) {
      onNavigateTab(tabKey);
    }
    const text = featureBriefings[tabKey] || "Exploring this module with real-time AI career intelligence!";
    speakText(text);

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.7 }
    });
  };

  // -------------------------------------------------------------
  // Three.js WebGL Scene & 60 FPS Embodied Animation Loop
  // -------------------------------------------------------------
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

    // 3. Robot 3D Construction
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    const whiteBodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
    });

    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x090d18,
      roughness: 0.1,
      metalness: 0.85,
    });

    const cyanEyeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
    });

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    robotRoot.add(headGroup);

    // Outer Head Shell
    const headGeo = new THREE.SphereGeometry(0.55, 36, 36);
    headGeo.scale(1.05, 0.95, 1.0);
    const headMesh = new THREE.Mesh(headGeo, whiteBodyMat);
    headGroup.add(headMesh);

    // Visor Faceplate
    const visorGeo = new THREE.SphereGeometry(0.46, 32, 32);
    visorGeo.scale(0.96, 0.65, 0.45);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.04, 0.38);
    headGroup.add(visorMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    eyeGeo.scale(1.1, 1.3, 0.4);
    const leftEye = new THREE.Mesh(eyeGeo, cyanEyeMat);
    leftEye.position.set(-0.16, 0.08, 0.53);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, cyanEyeMat);
    rightEye.position.set(0.16, 0.08, 0.53);
    headGroup.add(rightEye);

    // Dynamic Lip-Sync Mouth Mesh
    const mouthCurve = new THREE.TorusGeometry(0.07, 0.015, 8, 20, Math.PI * 0.7);
    const mouthMesh = new THREE.Mesh(mouthCurve, cyanEyeMat);
    mouthMesh.rotation.z = Math.PI * 1.15;
    mouthMesh.rotation.x = 0.2;
    mouthMesh.position.set(0, -0.07, 0.53);
    headGroup.add(mouthMesh);

    // Ear Pods
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

    // Glowing Rings on Ear Pods
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

    // Body Group
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(0, -0.4, 0);
    robotRoot.add(bodyGroup);

    const bodyGeo = new THREE.SphereGeometry(0.42, 32, 32);
    bodyGeo.scale(0.9, 1.15, 0.85);
    const bodyMesh = new THREE.Mesh(bodyGeo, whiteBodyMat);
    bodyGroup.add(bodyMesh);

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.08, 0.22, 12, 16);
    const leftArm = new THREE.Mesh(armGeo, earMat);
    leftArm.position.set(-0.48, 0.08, 0.05);
    leftArm.rotation.z = 0.35;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, earMat);
    rightArm.position.set(0.48, 0.08, 0.05);
    rightArm.rotation.z = -0.35;
    bodyGroup.add(rightArm);

    // Levitation Ring
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

    // Store refs
    threeRefs.current = {
      robotRoot,
      headGroup,
      leftEye,
      rightEye,
      mouthMesh,
      leftArm,
      rightArm,
      levRing,
      levRingMat,
      leftEarRing,
      rightEarRing,
      renderer,
      scene,
      camera
    };

    // 4. Mouse Tracking & Dragging
    let mouseNormX = 0;
    let mouseNormY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0;

    const handleMouseMoveWindow = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      mouseNormX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
      mouseNormY = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    };
    window.addEventListener('mousemove', handleMouseMoveWindow);

    const handlePointerDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const handlePointerMove = (e) => {
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

    // 5. Embodied Animation Loop (60 FPS)
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const state = avatarStateRef.current;

      // Base Levitation
      robotRoot.position.y = Math.sin(t * 2.2) * 0.08;
      robotRoot.rotation.y += (targetRotationY - robotRoot.rotation.y) * 0.08;

      // Levitation ring pulse
      levRing.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      levRingMat.opacity = 0.5 + Math.sin(t * 3) * 0.25;

      // -------------------------------------------------------------
      // STATE 1: LISTENING 🎧 (Curious head tilt, pulsing amber ears)
      // -------------------------------------------------------------
      if (state === 'LISTENING') {
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, Math.sin(t * 3) * 0.06 + 0.16, 0.1);
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouseNormX * 0.3, 0.1);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0.05, 0.1);

        leftEarRing.material.color.setHex(0xf59e0b); // Amber
        rightEarRing.material.color.setHex(0xf59e0b);

        leftEye.material.color.setHex(0x38bdf8);
        rightEye.material.color.setHex(0x38bdf8);

        mouthMesh.scale.set(1.0, 1.0, 1.0);
        mouthMesh.position.set(0, -0.07, 0.53);
      }
      // -------------------------------------------------------------
      // STATE 2: THINKING 🤔 (Looking upward, eyes pulse violet)
      // -------------------------------------------------------------
      else if (state === 'THINKING') {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.28, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -0.22, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, -0.05, 0.08);

        leftEye.material.color.setHex(0xa855f7); // Violet
        rightEye.material.color.setHex(0xa855f7);

        leftEarRing.material.color.setHex(0xa855f7);
        rightEarRing.material.color.setHex(0xa855f7);

        mouthMesh.scale.set(1.0, 1.0, 1.0);
      }
      // -------------------------------------------------------------
      // STATE 3: ANSWERING 🗣️ (Direct Eye Contact + Real-Time 3D Lip-Sync)
      // -------------------------------------------------------------
      else if (state === 'ANSWERING') {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0, 0.1);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0, 0.1);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.1);

        leftEye.material.color.setHex(0x38bdf8);
        rightEye.material.color.setHex(0x38bdf8);

        leftEarRing.material.color.setHex(0x06b6d4);
        rightEarRing.material.color.setHex(0x06b6d4);

        // REAL-TIME 3D LIP-SYNC OSCILLATION
        const mouthOpenY = 1.0 + Math.abs(Math.sin(t * 20)) * 2.4 + (Math.sin(t * 32) * 0.6);
        const mouthOpenX = 1.0 + Math.abs(Math.cos(t * 15)) * 0.9;
        mouthMesh.scale.set(mouthOpenX, mouthOpenY, 1.0);
        mouthMesh.position.y = -0.07 - (mouthOpenY - 1) * 0.02;

        // Arm gestures while speaking
        leftArm.rotation.z = 0.35 + Math.sin(t * 6) * 0.18;
        rightArm.rotation.z = -0.35 - Math.cos(t * 6) * 0.18;
      }
      // -------------------------------------------------------------
      // STATE 4: IDLE / DEFAULT (Smooth cursor gaze tracking)
      // -------------------------------------------------------------
      else {
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, mouseNormX * 0.45, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -mouseNormY * 0.3, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.08);

        leftArm.rotation.x = Math.sin(t * 2) * 0.1;
        rightArm.rotation.x = -Math.sin(t * 2) * 0.1;
        leftArm.rotation.z = 0.35;
        rightArm.rotation.z = -0.35;

        leftEye.material.color.setHex(0x06b6d4);
        rightEye.material.color.setHex(0x06b6d4);
        leftEarRing.material.color.setHex(0x38bdf8);
        rightEarRing.material.color.setHex(0x38bdf8);

        mouthMesh.scale.set(1.0, 1.0, 1.0);
        mouthMesh.position.set(0, -0.07, 0.53);
      }

      // Blinking animation every 4 seconds
      const blinkTime = t % 4;
      if (blinkTime < 0.14) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
      } else {
        leftEye.scale.y = 1.3;
        rightEye.scale.y = 1.3;
      }

      renderer.render(scene, camera);
    };

    animate();

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
      window.removeEventListener('mousemove', handleMouseMoveWindow);
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
      {/* Top Header */}
      {!isFloating && (
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
              <Bot className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#090d18] animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>SkillBot 3D — Embodied AI Career Coach</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
                  Voice & Lip-Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time voice dialogue, 3D audio lip-sync, and contextual career guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                voiceEnabled
                  ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={voiceEnabled ? "Voice Speech Enabled" : "Voice Speech Muted"}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[280px]">
        {/* State Indicator HUD Badge */}
        <div className="absolute top-2 left-3 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
          {avatarState === 'LISTENING' && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5" /> Listening to you...
              </span>
            </>
          )}
          {avatarState === 'THINKING' && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5" /> Consulting SkillMap Brain...
              </span>
            </>
          )}
          {avatarState === 'ANSWERING' && (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                <Volume1 className="w-3.5 h-3.5 animate-bounce" /> Speaking (3D Lip-Sync)
              </span>
            </>
          )}
          {avatarState === 'IDLE' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Embodied AI Ready</span>
            </>
          )}
        </div>

        {/* Action Trigger Alert */}
        {detectedAction && (
          <div className="absolute top-2 right-3 z-10 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Navigating to: {detectedAction.toUpperCase()}</span>
          </div>
        )}

        {/* 3D Canvas Mount Point */}
        <div ref={mountRef} className="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing" />
      </div>

      {/* Voice Assistant Dialogue Box */}
      <div className="w-full mt-2 p-4 rounded-2xl bg-slate-900/95 border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-col gap-3">
        {/* Dialogue Script Text */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex-shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              SkillBot Speech
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              "{activeSpeech}"
            </p>
          </div>
        </div>

        {/* Live Mic Transcript if speaking */}
        {transcript && isListening && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 animate-fadeIn">
            <Mic className="w-3.5 h-3.5 flex-shrink-0 text-amber-400 animate-pulse" />
            <span className="truncate">You: "{transcript}"</span>
          </div>
        )}

        {/* Voice Interaction Toolbar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {/* Main Microphone Button */}
            <button
              onClick={toggleListening}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-500/25'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Talk with SkillBot</span>
                </>
              )}
            </button>

            {/* Hands-Free Mode Toggle */}
            <button
              onClick={() => setHandsFreeMode(!handsFreeMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                handsFreeMode
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-glow-emerald'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Continuous conversation mode: SkillBot listens automatically after speaking"
            >
              <Radio className={`w-3.5 h-3.5 ${handsFreeMode ? 'text-emerald-400 animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Hands-Free Mode:</span>
              <span>{handsFreeMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            3D Mouth Moves in Real-Time Lip-Sync
          </div>
        </div>

        {/* Suggested Voice Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {VOICE_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => askCoach(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-indigo-300 transition-all cursor-pointer"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
