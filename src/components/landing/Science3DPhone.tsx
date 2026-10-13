import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import faceModelUrl from "@/assets/face.glb?url";
import { MotionValue } from "framer-motion";

export function Science3DPhone({
  externalRotationY,
  scrollYProgress,
}: {
  externalRotationY?: React.MutableRefObject<number>;
  scrollYProgress?: MotionValue<number>;
} = {}) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Drag state (Horizontal Y-rotation only)
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.05, y: 0 }); // front-facing on entry
  const currentRotationRef = useRef({ x: 0.05, y: 0 });

  // Drag offset applied ON TOP of scroll-driven rotation.
  // Decays to 0 while scrolling so the face always returns to the fixed angle.
  const dragOffsetRef = useRef(0);
  const lastExternalYRef = useRef(0);

  // Floating rotation state
  const hoverOffsetRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const wireframeMaterials: THREE.MeshBasicMaterial[] = [];
    let boxMat: THREE.LineBasicMaterial | null = null;
    let scanPlaneMat: THREE.MeshBasicMaterial | null = null;

    // Guard flag: set to true when this effect instance is cleaned up.
    // Prevents stale GLTFLoader callbacks from a previous mount from calling
    // setState on the new mount — which is what caused the loading screen to
    // get stuck at 100% on page refresh.
    let aborted = false;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 450;

    // --- 1. Scene & Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // --- 2. Lighting (Sleek studio portrait lighting) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdcd5c5, 1.2);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // --- 3. 3D Model Loading & Setups ---
    const faceGroup = new THREE.Group();
    scene.add(faceGroup);

    // Subtle diagnostic wireframe overlay mesh

    // Project landmarks setup
    const landmarkMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const landmarkSphereGeo = new THREE.SphereGeometry(0.018, 8, 8);

    const landmarks2D: { x: number; y: number }[] = [];
    // Jawline (17 points)
    for (let i = 0; i < 17; i++) {
      const angle = Math.PI * (0.8 + (i / 16) * 1.4);
      landmarks2D.push({ x: Math.cos(angle) * 0.72, y: -0.15 + Math.sin(angle) * 0.72 });
    }
    // Eyebrows
    for (let i = 0; i < 5; i++) {
      landmarks2D.push({ x: -0.42 + i * 0.07, y: 0.28 - Math.sin((i / 4) * Math.PI) * 0.04 });
      landmarks2D.push({ x: 0.14 + i * 0.07, y: 0.28 - Math.sin((i / 4) * Math.PI) * 0.04 });
    }
    // Nose bridge and tip
    for (let i = 0; i < 4; i++) landmarks2D.push({ x: 0, y: 0.22 - i * 0.07 });
    for (let i = 0; i < 5; i++) landmarks2D.push({ x: -0.12 + i * 0.06, y: -0.05 });
    // Eyes
    for (let i = 0; i < 6; i++) {
      const a = (i / 5) * Math.PI * 2;
      landmarks2D.push({ x: -0.25 + Math.cos(a) * 0.06, y: 0.16 + Math.sin(a) * 0.03 });
      landmarks2D.push({ x: 0.25 + Math.cos(a) * 0.06, y: 0.16 + Math.sin(a) * 0.03 });
    }
    // Mouth
    for (let i = 0; i < 12; i++) {
      const a = (i / 11) * Math.PI * 2;
      landmarks2D.push({ x: Math.cos(a) * 0.16, y: -0.26 + Math.sin(a) * 0.05 });
    }

    const loader = new GLTFLoader();
    loader.load(
      faceModelUrl,
      (gltf) => {
        // If this effect instance was cleaned up (component unmounted on refresh),
        // discard the callback entirely — the new mount has its own loader.
        if (aborted) return;
        try {
          const model = gltf.scene;

          // Traverse mesh and setup standard materials
          const meshes: THREE.Mesh[] = [];
          model.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              meshes.push(mesh);

              if (mesh.material) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat) => {
                  if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                    const stdMat = mat as THREE.MeshStandardMaterial;
                    stdMat.roughness = 0.35; // Glossy skin sheen
                    stdMat.metalness = 0.02; // Non-metallic skin
                    stdMat.side = THREE.DoubleSide;
                  }
                });
              }
            }
          });

          // Autoscale and center loaded model
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2.4 / (maxDim || 1);
          model.scale.setScalar(scale);

          // Offset so model fits the origin (0, 0, 0)
          model.position.sub(center.clone().multiplyScalar(scale));
          faceGroup.add(model);

          // Create overlay wireframe helper by cloning the entire model hierarchy
          // This preserves all nested transformations, scales, and coordinates perfectly
          const wireModel = model.clone();
          wireModel.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh) {
              const wireMat = new THREE.MeshBasicMaterial({
                color: 0xc5a880,
                wireframe: true,
                transparent: true,
                opacity: 0.08,
              });
              mesh.material = wireMat;
              wireframeMaterials.push(wireMat);
            }
          });
          // Scale wireframe model slightly to prevent Z-fighting and overlay it perfectly
          wireModel.scale.multiplyScalar(1.002);
          faceGroup.add(wireModel);

          // Raycast flat 2D landmarks onto the model's 3D skin surface
          const raycaster = new THREE.Raycaster();
          const rayOrigin = new THREE.Vector3();
          const rayDirection = new THREE.Vector3(0, 0, -1);

          landmarks2D.forEach((pt) => {
            // Raycast from Z=5 straight back to Z=-5
            rayOrigin.set(pt.x, pt.y * 1.05, 5.0); // Slightly scaled y for better face mapping
            raycaster.set(rayOrigin, rayDirection);
            const intersects = raycaster.intersectObjects(meshes, true);

            if (intersects.length > 0) {
              const hit = intersects[0];
              const normal =
                hit.face && hit.face.normal
                  ? hit.face.normal
                      .clone()
                      .applyMatrix3(new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld))
                      .normalize()
                  : new THREE.Vector3(0, 0, 1);

              // Offset point slightly along the normal to stay visible on skin surface
              const dotPos = hit.point.clone().add(normal.multiplyScalar(0.015));
              const dot = new THREE.Mesh(landmarkSphereGeo, landmarkMaterial);
              dot.position.copy(faceGroup.worldToLocal(dotPos));
              faceGroup.add(dot);
            }
          });
        } catch (err) {
          console.error("Error processing loaded model:", err);
        }
      },
      (_xhr) => {
        // progress callback — no loading UI, intentionally empty
      },
      (error) => {
        console.error("Error loading face.glb:", error);
      },
    );

    // --- 4. Holographic Bounding Box ---
    // Sized to cage the 2.4-unit autoscaled model perfectly
    const boxGeo = new THREE.BoxGeometry(2.1, 2.5, 2.0);
    const boxEdgeGeo = new THREE.EdgesGeometry(boxGeo);
    boxMat = new THREE.LineBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.35,
    });
    const boxWireframe = new THREE.LineSegments(boxEdgeGeo, boxMat);
    boxWireframe.position.set(0, 0, 0);
    faceGroup.add(boxWireframe);

    // --- 5. Laser Scan Plane (Sweeping line) ---
    // Deepened to cut through the entire model volume
    const scanPlaneGeo = new THREE.BoxGeometry(2.3, 0.015, 2.2);
    scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.position.set(0, 0, 0);
    faceGroup.add(scanPlane);

    faceGroup.position.set(0, -0.05, 0);

    // --- 6. Pointer Drag Handlers (Horizontal rotation ONLY) ---
    const handlePointerDown = (e: PointerEvent) => {
      // Always allow drag — even in scroll-locked mode
      isDraggingRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousPointerPositionRef.current.x;
        if (externalRotationY) {
          // Scroll-locked mode: accumulate drag into dragOffsetRef
          dragOffsetRef.current += deltaX * 0.008;
          dragOffsetRef.current = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, dragOffsetRef.current),
          );
        } else {
          // Normal mode: modify targetRotationRef as before
          targetRotationRef.current.y += deltaX * 0.008;
          targetRotationRef.current.y = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, targetRotationRef.current.y),
          );
        }
        previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
      } else if (isHoveredRef.current) {
        const rect = container?.getBoundingClientRect();
        if (rect) {
          const relX = e.clientX - rect.left - rect.width / 2;
          hoverOffsetRef.current.x = (relX / rect.width) * 0.35;
        }
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // --- 7. Animation Loop ---
    let animationFrameId: number;
    let autoAngle = 0;
    let scanY = 1.2;
    let scanDirection = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // ── Scan Features Opacity Logic ──
      if (scrollYProgress) {
        const v = scrollYProgress.get();
        // Fades in scan features from 0 to 1 over zoom phase (0 -> 0.18) and wears them down to 0 after Card 06 (0.89 -> 0.93)
        let scanOpacity = 1;
        if (v < 0.18) {
          scanOpacity = Math.min(v / 0.18, 1);
        } else if (v > 0.89) {
          scanOpacity = Math.max(0, 1 - (v - 0.89) / (0.93 - 0.89));
        }

        if (boxMat) {
          boxMat.opacity = 0.35 * scanOpacity;
        }
        if (scanPlaneMat) {
          scanPlaneMat.opacity = 0.25 * scanOpacity;
        }
        if (landmarkMaterial) {
          landmarkMaterial.opacity = 0.9 * scanOpacity;
        }
        wireframeMaterials.forEach((mat) => {
          mat.opacity = 0.08 * scanOpacity;
        });
      }

      // Sweep the horizontal laser plane
      scanY += scanDirection * 0.012;
      if (scanY > 1.25) {
        scanY = 1.25;
        scanDirection = -1;
      } else if (scanY < -1.25) {
        scanY = -1.25;
        scanDirection = 1;
      }
      scanPlane.position.y = scanY;

      // ── Rotation logic ──
      if (externalRotationY) {
        // SCROLL-LOCKED MODE:
        // The base angle is always the scroll-driven value.
        // User can drag to add a temporary offset, which decays back to 0 during scroll.
        const extY = externalRotationY.current;
        const isScrolling = Math.abs(extY - lastExternalYRef.current) > 0.0005;
        lastExternalYRef.current = extY;

        if (isScrolling) {
          // Decay the drag offset rapidly so face returns to fixed angle on scroll
          dragOffsetRef.current *= 0.88;
        }

        const targetY = extY + dragOffsetRef.current;
        currentRotationRef.current.y += (targetY - currentRotationRef.current.y) * 0.08;
        faceGroup.rotation.y = currentRotationRef.current.y;
      } else {
        // INTERACTIVE MODE: drag + auto-sway + hover nudge
        if (isDraggingRef.current) {
          currentRotationRef.current.y +=
            (targetRotationRef.current.y - currentRotationRef.current.y) * 0.15;
        } else {
          autoAngle += 0.003;
          const targetY =
            targetRotationRef.current.y +
            Math.sin(autoAngle) * 0.1 +
            (isHoveredRef.current ? hoverOffsetRef.current.x : 0);
          currentRotationRef.current.y += (targetY - currentRotationRef.current.y) * 0.06;
        }
        faceGroup.rotation.y = currentRotationRef.current.y;
      }
      faceGroup.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      // Mark this effect instance as stale so any in-flight GLTFLoader
      // callbacks are silently discarded and cannot update the new mount's state.
      aborted = true;

      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (container && dom) {
        container.removeChild(dom);
      }

      landmarkMaterial.dispose();
      landmarkSphereGeo.dispose();
      boxGeo.dispose();
      boxEdgeGeo.dispose();
      boxMat.dispose();
      scanPlaneGeo.dispose();
      scanPlaneMat.dispose();
      renderer.dispose();

      // Traverse faceGroup and dispose geometries and materials of loaded GLTF model
      faceGroup.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry.dispose();
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => m.dispose());
          }
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] cursor-grab active:cursor-grabbing outline-none select-none"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          hoverOffsetRef.current = { x: 0, y: 0 };
        }}
      />
    </div>
  );
}
