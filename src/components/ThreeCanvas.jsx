import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Luxury 3D Studio Canvas
 * Features an undulating 3D satin fabric / aerodynamic curved drape with
 * cinematic studio rim lighting and iconic crimson taillight reflections,
 * matching high-end WebGL automotive and luxury product showcases.
 */
export default function ThreeCanvas({ isGenerating = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.FogExp2(0x060608, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    currentMount.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f1115, 1.2);
    scene.add(ambientLight);

    // Top Key Rim Spotlight (Soft White Studio Diffuser)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(0, 10, 5);
    scene.add(keyLight);

    // Backstage High-Contrast Backlight
    const backLight = new THREE.DirectionalLight(0x94a3b8, 1.5);
    backLight.position.set(-6, 8, -8);
    scene.add(backLight);

    // Iconic Crimson Taillight Point Light (as seen in video)
    const redLight = new THREE.PointLight(0xff1a35, 4.5, 25);
    redLight.position.set(2, -1.2, 3);
    scene.add(redLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 2.0, 20);
    amberLight.position.set(-4, -1.8, 2);
    scene.add(amberLight);

    // Group for mouse parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. The Draped 3D Silk / Aerodynamic Flowing Fabric
    const width = 24;
    const height = 16;
    const segW = 80;
    const segH = 60;
    const planeGeo = new THREE.PlaneGeometry(width, height, segW, segH);

    // Store original positions for harmonic wave calculations
    const pos = planeGeo.attributes.position;
    const originalZ = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      originalZ[i] = pos.getZ(i);
    }

    // High-end Silk/Velvet Shader Material
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      roughness: 0.38,
      metalness: 0.65,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    const fabricMesh = new THREE.Mesh(planeGeo, planeMat);
    fabricMesh.rotation.x = -Math.PI / 2.6;
    fabricMesh.position.set(0, -1.2, -1);
    masterGroup.add(fabricMesh);

    // 2. Sculptural Minimal Ring Floating in Studio Space
    const ringGeo = new THREE.TorusGeometry(5.2, 0.04, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
      opacity: 0.35,
    });
    const studioRing = new THREE.Mesh(ringGeo, ringMat);
    studioRing.rotation.x = Math.PI / 3;
    studioRing.position.set(0, 0.5, -2);
    masterGroup.add(studioRing);

    // 3. Subtle Floating Dust / Studio Embers
    const emberCount = 90;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      emberPos[i * 3] = (Math.random() - 0.5) * 20;
      emberPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      emberPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xff3b5c,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    masterGroup.add(embers);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 2;
      mouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const speed = isGenerating ? 2.4 : 1.0;

      // Ripple the fabric mesh smoothly
      const posAttr = planeGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);

        // Complex organic silk cloth undulation
        const wave1 = Math.sin(x * 0.45 + time * 0.9 * speed) * 0.85;
        const wave2 = Math.cos(y * 0.6 + time * 1.1 * speed) * 0.7;
        const wave3 = Math.sin((x + y) * 0.35 + time * 0.7 * speed) * 0.55;
        const z = wave1 + wave2 + wave3;

        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
      planeGeo.computeVertexNormals();

      // Slow studio ring rotation
      studioRing.rotation.z += 0.002 * speed;
      studioRing.rotation.y += 0.001 * speed;

      // Pulse red accent light when generating
      if (isGenerating) {
        redLight.intensity = 5.5 + Math.sin(time * 8) * 2.0;
        redLight.position.x = Math.sin(time * 2) * 5;
      } else {
        redLight.intensity = 4.0;
        redLight.position.x = 2 + Math.sin(time * 0.5) * 1.5;
      }

      // Smooth mouse parallax
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      masterGroup.rotation.y = targetX * 0.15;
      masterGroup.rotation.x = targetY * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      emberGeo.dispose();
      emberMat.dispose();
    };
  }, [isGenerating]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: '#060608',
      }}
    />
  );
}
