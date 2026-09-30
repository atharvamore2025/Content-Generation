import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

function createNodeLabel(label, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 96;
  context.font = '600 32px ui-monospace, SFMono-Regular, Menlo, monospace';
  const textWidth = Math.min(480, context.measureText(label).width);
  context.strokeStyle = 'rgba(5, 8, 12, 0.92)';
  context.lineWidth = 8;
  context.lineJoin = 'round';
  context.strokeText(label, 12, 61, 480);
  context.fillStyle = color;
  context.fillText(label, 12, 61, 480);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
  }));
  sprite.scale.set(Math.max(0.52, Math.min(1.85, (textWidth + 24) * 0.0034)), 0.34, 1);
  sprite.position.set(0.12 + sprite.scale.x * 0.48, 0.04, 0);
  sprite.userData.texture = texture;
  return sprite;
}

function getNodeDepth(node, index) {
  let hash = index + 17;
  for (const character of node.id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return ((Math.abs(hash) % 1000) / 1000 - 0.5) * 2.6;
}

export default function ConceptGraph3D({ graph }) {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);
  const selectedNodeRef = useRef(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !graph?.nodes?.length) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080b0e');
    scene.fog = new THREE.Fog('#080b0e', 12, 25);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 80);
    camera.position.set(0, 0, 10.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-label', 'Three-dimensional interactive concept relationship graph');
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.screenSpacePanning = true;
    controls.minDistance = 3.8;
    controls.maxDistance = 20;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.85;
    controls.panSpeed = 0.8;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight('#aabbd0', 1.45));
    const keyLight = new THREE.PointLight('#b8d9ff', 26, 18);
    keyLight.position.set(-3.5, 4.5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight('#49d9bd', 16, 14);
    rimLight.position.set(4, -2.5, -3);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(12, 24, '#34424c', '#1b252c');
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -2.8;
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    scene.add(grid);

    const nodeObjects = new Map();
    const nodeMeshes = [];
    graph.nodes.forEach((node, index) => {
      const group = new THREE.Group();
      group.position.set((node.x - 450) / 92, (250 - node.y) / 92, getNodeDepth(node, index));
      group.userData.nodeId = node.id;
      const color = new THREE.Color(node.color);
      const radius = 0.055 + Math.min(0.12, node.radius * 0.009);
      const geometry = new THREE.SphereGeometry(radius, 20, 16);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.58,
        roughness: 0.3,
        metalness: 0.12,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.userData.nodeId = node.id;
      group.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 2.8, 16, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.075, depthWrite: false })
      );
      halo.userData.isHalo = true;
      group.add(halo);
      group.add(createNodeLabel(node.label, node.color));
      scene.add(group);
      nodeObjects.set(node.id, group);
      nodeMeshes.push(sphere);
    });

    const linkPositions = new Float32Array(graph.links.length * 6);
    const linkColors = new Float32Array(graph.links.length * 6);
    graph.links.forEach((link, index) => {
      const source = graph.nodes.find((node) => node.id === link.source);
      const color = new THREE.Color(source?.color || '#8ba0b3');
      const brightness = Math.min(0.85, 0.34 + link.weight * 0.1);
      color.multiplyScalar(brightness);
      color.toArray(linkColors, index * 6);
      color.toArray(linkColors, index * 6 + 3);
    });
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));
    linkGeometry.setAttribute('color', new THREE.BufferAttribute(linkColors, 3));
    const linkMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.46,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const linkLines = new THREE.LineSegments(linkGeometry, linkMaterial);
    scene.add(linkLines);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.12;
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane();
    const dragPoint = new THREE.Vector3();
    let draggedGroup = null;
    let pointerMoved = false;
    let lastPointer = new THREE.Vector2();
    let animationFrame = 0;
    let disposed = false;

    const setPointer = (event) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );
    };

    const updateSelection = () => {
      const selectedId = selectedNodeRef.current;
      graph.nodes.forEach((node) => {
        const group = nodeObjects.get(node.id);
        const selected = node.id === selectedId;
        const connected = selectedId && graph.links.some((link) => (
          (link.source === selectedId && link.target === node.id)
          || (link.target === selectedId && link.source === node.id)
        ));
        group.children.forEach((child) => {
          if (child.isMesh && !child.userData.isHalo) {
            child.material.emissiveIntensity = selected ? 1.6 : connected ? 0.9 : selectedId ? 0.08 : 0.58;
            child.scale.setScalar(selected ? 1.45 : connected ? 1.12 : 1);
          } else if (child.userData.isHalo) {
            child.material.opacity = selected ? 0.28 : connected ? 0.14 : selectedId ? 0.015 : 0.075;
          } else if (child.isSprite) {
            child.material.opacity = selectedId && !selected && !connected ? 0.16 : 1;
          }
        });
      });

      for (let index = 0; index < graph.links.length; index += 1) {
        const link = graph.links[index];
        const isConnected = selectedId && (link.source === selectedId || link.target === selectedId);
        const sourceGroup = nodeObjects.get(link.source);
        const targetGroup = nodeObjects.get(link.target);
        const color = new THREE.Color(graph.nodes.find((node) => node.id === link.source)?.color || '#8ba0b3');
        color.multiplyScalar(selectedId ? (isConnected ? 1.4 : 0.09) : Math.min(0.85, 0.34 + link.weight * 0.1));
        color.toArray(linkColors, index * 6);
        color.toArray(linkColors, index * 6 + 3);
        const offset = index * 6;
        linkPositions[offset] = sourceGroup.position.x;
        linkPositions[offset + 1] = sourceGroup.position.y;
        linkPositions[offset + 2] = sourceGroup.position.z;
        linkPositions[offset + 3] = targetGroup.position.x;
        linkPositions[offset + 4] = targetGroup.position.y;
        linkPositions[offset + 5] = targetGroup.position.z;
      }
      linkGeometry.attributes.color.needsUpdate = true;
      linkGeometry.attributes.position.needsUpdate = true;
      linkGeometry.computeBoundingSphere();
    };

    const selectNode = (group) => {
      const nodeId = group?.userData.nodeId || null;
      selectedNodeRef.current = nodeId;
      setSelectedLabel(graph.nodes.find((node) => node.id === nodeId)?.label || null);
      updateSelection();
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(nodeMeshes, false)[0];
      if (!hit) {
        selectNode(null);
        return;
      }

      draggedGroup = hit.object.parent;
      selectNode(draggedGroup);
      pointerMoved = false;
      lastPointer.set(event.clientX, event.clientY);
      dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(dragPlane.normal), draggedGroup.position);
      controls.enabled = false;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = (event) => {
      setPointer(event);
      if (draggedGroup) {
        if (Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y) > 2) pointerMoved = true;
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) draggedGroup.position.copy(dragPoint);
        renderer.domElement.style.cursor = 'grabbing';
        return;
      }

      raycaster.setFromCamera(pointer, camera);
      renderer.domElement.style.cursor = raycaster.intersectObjects(nodeMeshes, false).length ? 'grab' : 'grab';
    };

    const onPointerUp = (event) => {
      if (!draggedGroup) return;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      draggedGroup = null;
      controls.enabled = true;
      renderer.domElement.style.cursor = 'grab';
      if (!pointerMoved) controls.update();
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return;
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(mount);

    const render = () => {
      if (disposed) return;
      controls.update();
      for (let index = 0; index < graph.links.length; index += 1) {
        const link = graph.links[index];
        const source = nodeObjects.get(link.source).position;
        const target = nodeObjects.get(link.target).position;
        const offset = index * 6;
        linkPositions[offset] = source.x;
        linkPositions[offset + 1] = source.y;
        linkPositions[offset + 2] = source.z;
        linkPositions[offset + 3] = target.x;
        linkPositions[offset + 4] = target.y;
        linkPositions[offset + 5] = target.z;
      }
      linkGeometry.attributes.position.needsUpdate = true;
      linkGeometry.computeBoundingSphere();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    updateSelection();
    render();
    sceneApiRef.current = { camera, controls };

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            material.map?.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      sceneApiRef.current = null;
    };
  }, [graph]);

  useEffect(() => {
    if (sceneApiRef.current) sceneApiRef.current.controls.autoRotate = autoRotate;
  }, [autoRotate]);

  const zoomBy = (amount) => {
    const controls = sceneApiRef.current?.controls;
    if (!controls) return;
    const direction = new THREE.Vector3().subVectors(controls.object.position, controls.target);
    direction.multiplyScalar(amount > 0 ? 0.84 : 1.19);
    controls.object.position.copy(controls.target).add(direction);
    controls.update();
  };

  const resetView = () => {
    const api = sceneApiRef.current;
    if (!api) return;
    api.controls.reset();
    selectedNodeRef.current = null;
    setSelectedLabel(null);
  };

  const groups = [...new Map(graph.nodes.map((node) => [node.group, { name: node.group, color: node.color }])).values()];

  return (
    <div className="space-y-2.5">
      <div className="relative h-[340px] sm:h-[420px] overflow-hidden rounded-lg border border-white/[0.05] bg-[#080b0e]">
        <div ref={mountRef} className="absolute inset-0" />
        <div className="absolute left-2 top-2 flex flex-col gap-1 rounded-md border border-white/[0.08] bg-black/60 p-1 backdrop-blur-sm">
          <button type="button" title="Zoom in" aria-label="Zoom in" onClick={() => zoomBy(1)} className="p-1.5 text-neutral-300 hover:text-white rounded hover:bg-white/[0.08]">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button type="button" title="Zoom out" aria-label="Zoom out" onClick={() => zoomBy(-1)} className="p-1.5 text-neutral-300 hover:text-white rounded hover:bg-white/[0.08]">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button type="button" title="Reset graph view" aria-label="Reset graph view" onClick={resetView} className="p-1.5 text-neutral-300 hover:text-white rounded hover:bg-white/[0.08]">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button type="button" title={autoRotate ? 'Pause rotation' : 'Start rotation'} aria-label={autoRotate ? 'Pause rotation' : 'Start rotation'} onClick={() => setAutoRotate((rotating) => !rotating)} className="p-1.5 text-neutral-300 hover:text-white rounded hover:bg-white/[0.08]">
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
        <div className="absolute bottom-2 right-2 rounded-md border border-white/[0.08] bg-black/55 px-2 py-1 text-[9px] font-mono text-neutral-500 backdrop-blur-sm">
          DRAG TO ORBIT · RIGHT-DRAG TO PAN · SCROLL TO ZOOM · DRAG NODES TO REPOSITION
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-neutral-400">
        {groups.map((group) => (
          <span key={group.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
            {group.name}
          </span>
        ))}
        {selectedLabel && <span className="text-white">Selected: {selectedLabel}</span>}
      </div>
    </div>
  );
}