import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-expect-error: mp4 import lacks declaration
import phoneVid1 from "@/assets/phoneVid1.mp4";
// @ts-expect-error: mp4 import lacks declaration
import phoneVid2 from "@/assets/phoneVid2.mp4";
// @ts-expect-error: mp4 import lacks declaration
import phoneVid3 from "@/assets/phoneVid3.mp4";
// @ts-expect-error: mp4 import lacks declaration
import phoneVid4 from "@/assets/phoneVid4.mp4";

interface Ritual3DPhoneProps {
  scrollProgress: number; // 0 to 1 representing the scroll progress through the Ritual section
  activeStep: number; // 0 to 3 representing the active step index
}

export function Ritual3DPhone({ scrollProgress, activeStep }: Ritual3DPhoneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Track dragging state for 360 rotation
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.1, y: 0.3 }); // starting cinematic tilt
  const currentRotationRef = useRef({ x: 0.1, y: 0.3 });

  // Track hover movement for subtle parallax tilt when not dragging
  const hoverOffsetRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);

  // Track white gradient transition for video switching
  const transitionRef = useRef({
    active: false,
    startTime: 0,
    duration: 800, // ms (smooth 800ms transition)
    targetVideo: null as string | null,
    pendingSourceSwap: false,
    progress: 0,
  });

  // Sync scrollProgress via a ref to avoid destroying and recreating the WebGL context on scroll changes
  const scrollProgressRef = useRef(scrollProgress);
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 300;
    const height = mountRef.current.clientHeight || 500;

    // --- 1. Scene & Transparent Renderer Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 8.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountRef.current.appendChild(renderer.domElement);

    // --- 2. Programmatic Studio Environment Map (Equirectangular) ---
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext("2d");
    if (envCtx) {
      // Warm champagne/beige sky to dark studio atmosphere
      const grad = envCtx.createLinearGradient(0, 0, 0, envCanvas.height);
      grad.addColorStop(0, "#fcfaf6");
      grad.addColorStop(0.3, "#f4ecde");
      grad.addColorStop(0.6, "#151312");
      grad.addColorStop(1, "#c5a880");
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, envCanvas.width, envCanvas.height);

      // Bright studio softbox light panels on the left & right sides
      envCtx.fillStyle = "#ffffff";
      envCtx.fillRect(80, 40, 160, 432); // Left softbox
      envCtx.fillRect(580, 40, 200, 432); // Right softbox

      // Top overhead glowing light
      envCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
      envCtx.fillRect(320, 0, 380, 90);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // --- 3. Base Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // Key directional light creating metallic specular highlights
    const dirLight1 = new THREE.DirectionalLight(0xfff8ee, 2.8);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    // Rim light to define the phone edges
    const dirLight2 = new THREE.DirectionalLight(0xc5a880, 1.8);
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    // (PointLight and laser scanning line meshes removed for a clean video presentation)

    // --- 5. HTML5 Video Element & Texture Setup ---
    const video = document.createElement("video");
    video.src =
      activeStep === 0
        ? phoneVid1
        : activeStep === 1
          ? phoneVid2
          : activeStep === 2
            ? phoneVid3
            : phoneVid4;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    // Set off-screen styles and append to DOM so Safari keeps hardware decoding active
    video.style.position = "absolute";
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.opacity = "0";
    video.style.pointerEvents = "none";
    video.style.overflow = "hidden";
    mountRef.current.appendChild(video);

    videoRef.current = video;

    video.load();

    // Attempt playback
    video.play().catch((err) => {
      console.warn("Video autoplay failed, waiting for user interactions:", err);
    });

    // --- 6. Phone Screen Dynamic Texture (HTML5 Canvas) ---
    // Aspect ratio matches 2.4 × 5.0 chassis exactly (1:2.083)
    const logicalWidth = 480;
    const logicalHeight = 1000;
    const dpr = 2.0;

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = logicalWidth * dpr;
    screenCanvas.height = logicalHeight * dpr;
    screenCanvasRef.current = screenCanvas;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.generateMipmaps = false;
    screenTextureRef.current = screenTexture;

    // --- 7. Procedural 3D iPhone Modelling ---
    const phoneGroup = new THREE.Group();

    // Helper: Rounded extrude geometry for the chassis and screen
    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x, y + r);
      shape.lineTo(x, y + h - r);
      shape.quadraticCurveTo(x, y + h, x + r, y + h);
      shape.lineTo(x + w - r, y + h);
      shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
      shape.lineTo(x + w, y + r);
      shape.quadraticCurveTo(x + w, y, x + w - r, y);
      shape.lineTo(x + r, y);
      shape.quadraticCurveTo(x, y, x, y + r);
      return shape;
    };

    // Main Chassis: Champagne / metallic beige frame
    const chassisWidth = 2.4;
    const chassisHeight = 5.0;
    const chassisDepth = 0.12;
    const cornerRadius = 0.36; // iPhone standard rounding
    const chassisShape = createRoundedRectShape(chassisWidth, chassisHeight, cornerRadius);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
      depth: chassisDepth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    chassisGeo.center();

    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0xd7ceb9, // Warm luxury champagne / titanium gold finish
      metalness: 0.95,
      roughness: 0.16,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMaterial);
    phoneGroup.add(chassisMesh);

    // Front Screen: Edge-to-edge display matching the chassis exactly
    const screenShape = createRoundedRectShape(2.4, 5.0, 0.36);
    // Custom UV generator — normalises raw vertex X/Y to [0,1] over the
    // shape's bounding box.  Three.js WorldUVGenerator (the default) simply
    // copies raw vertex coords as UVs; for a −1.2..+1.2 × −2.5..+2.5 shape
    // those UVs sit far outside [0,1], so ClampToEdgeWrapping floods the
    // entire face with a single edge pixel and the video appears tiny.
    const UV_W = 2.4,
      UV_H = 5.0;
    const screenUVGen = {
      generateTopUV(
        _g: THREE.ExtrudeGeometry,
        verts: number[],
        iA: number,
        iB: number,
        iC: number,
      ): THREE.Vector2[] {
        return [iA, iB, iC].map(
          (i) =>
            new THREE.Vector2(
              (verts[i * 3] + UV_W / 2) / UV_W,
              (verts[i * 3 + 1] + UV_H / 2) / UV_H,
            ),
        );
      },
      generateSideWallUV(
        _g: THREE.ExtrudeGeometry,
        _v: number[],
        _a: number,
        _b: number,
        _c: number,
        _d: number,
      ): THREE.Vector2[] {
        return [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(1, 0),
          new THREE.Vector2(1, 1),
          new THREE.Vector2(0, 1),
        ];
      },
    };

    const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
      depth: 0.015,
      bevelEnabled: false,
      UVGenerator: screenUVGen,
    });
    screenGeo.center();

    // MeshBasicMaterial: ignores all scene lighting, tone-mapping, and
    // roughness — renders the canvas texture with its exact original colors.
    const screenCapMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenSideMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0a09,
      roughness: 0.9,
      metalness: 0.1,
    });
    const screenMesh = new THREE.Mesh(screenGeo, [screenCapMaterial, screenSideMaterial]);
    screenMesh.position.z = 0.103;
    phoneGroup.add(screenMesh);

    // --- Tactile Side Buttons (iPhone detail) ---
    const buttonMat = chassisMaterial;

    // Right Side: Long Side Button (Power button)
    const sideButtonGeo = new THREE.BoxGeometry(0.02, 0.65, 0.05);
    const sideButton = new THREE.Mesh(sideButtonGeo, buttonMat);
    sideButton.position.set(1.23, 0.4, 0);
    phoneGroup.add(sideButton);

    // Left Side: Two separate volume buttons
    const volButtonGeo = new THREE.BoxGeometry(0.02, 0.28, 0.05);
    const volUpBtn = new THREE.Mesh(volButtonGeo, buttonMat);
    volUpBtn.position.set(-1.23, 0.75, 0);
    phoneGroup.add(volUpBtn);

    const volDownBtn = new THREE.Mesh(volButtonGeo, buttonMat);
    volDownBtn.position.set(-1.23, 0.35, 0);
    phoneGroup.add(volDownBtn);

    // Left Side: Ring/Silent slider switch
    const silentSwitchGeo = new THREE.BoxGeometry(0.02, 0.15, 0.05);
    const silentSwitch = new THREE.Mesh(silentSwitchGeo, buttonMat);
    silentSwitch.position.set(-1.23, 1.15, 0);
    phoneGroup.add(silentSwitch);

    // --- Rear Camera Island: iPhone Pro design ---
    const cameraIslandShape = createRoundedRectShape(0.9, 0.95, 0.2);
    const cameraIslandGeo = new THREE.ExtrudeGeometry(cameraIslandShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    cameraIslandGeo.center();
    const cameraIsland = new THREE.Mesh(cameraIslandGeo, chassisMaterial);
    // Upper-left corner of the iPhone Pro rear casing
    cameraIsland.position.set(-0.55, 1.45, -0.08);
    phoneGroup.add(cameraIsland);

    // 3 Lenses: Triangular Pro arrangement
    const lensGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.03, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x080706,
      roughness: 0.03,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });

    const lensPoints = [
      { x: -0.72, y: 1.62, z: -0.105 }, // Top-left lens
      { x: -0.72, y: 1.28, z: -0.105 }, // Bottom-left lens
      { x: -0.42, y: 1.45, z: -0.105 }, // Right center lens
    ];

    lensPoints.forEach((pt) => {
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(pt.x, pt.y, pt.z);
      phoneGroup.add(lens);

      // Gold metallic rim border around each lens
      const rimGeo = new THREE.RingGeometry(0.14, 0.165, 32);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xd7ceb9,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.set(pt.x, pt.y, pt.z - 0.005);
      rim.rotation.y = Math.PI; // point backward
      phoneGroup.add(rim);
    });

    // Small LED Flash (top right of camera island)
    const flashGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.015, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfffae6 });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.rotation.x = Math.PI / 2;
    flash.position.set(-0.45, 1.68, -0.1);
    phoneGroup.add(flash);

    // Small LiDAR Sensor (bottom right of camera island)
    const lidarGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.015, 16);
    const lidarMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.2,
    });
    const lidar = new THREE.Mesh(lidarGeo, lidarMat);
    lidar.rotation.x = Math.PI / 2;
    lidar.position.set(-0.45, 1.25, -0.1);
    phoneGroup.add(lidar);

    phoneGroup.position.y = -0.5; // shift phone down in the viewport
    scene.add(phoneGroup);

    // --- 8. Event Listeners for Mouse/Touch 360-deg Drag Rotation ---
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousPointerPositionRef.current.x;
        const deltaY = e.clientY - previousPointerPositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.008;
        targetRotationRef.current.x += deltaY * 0.008;

        // Clamp X (tilt up/down): ±75° — generous tilt without flipping
        targetRotationRef.current.x = Math.max(
          (-Math.PI * 5) / 12,
          Math.min((Math.PI * 5) / 12, targetRotationRef.current.x),
        );
        // Clamp Y (spin left/right): ±150° — wide sweep without endless spinning
        targetRotationRef.current.y = Math.max(
          (-Math.PI * 5) / 6,
          Math.min((Math.PI * 5) / 6, targetRotationRef.current.y),
        );

        previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
      } else if (isHoveredRef.current) {
        // Subtle tilt parallax on mouse hover when not dragging
        const rect = mountRef.current?.getBoundingClientRect();
        if (rect) {
          const relX = e.clientX - rect.left - rect.width / 2;
          const relY = e.clientY - rect.top - rect.height / 2;
          hoverOffsetRef.current.x = (relX / rect.width) * 0.45;
          hoverOffsetRef.current.y = (relY / rect.height) * 0.45;
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

    // --- 9. Screen Texture Canvas Rendering Loop ---
    const drawScreenCanvas = (_progress: number, videoEl: HTMLVideoElement) => {
      const canvas = screenCanvas;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Only clear the backing store if transition is NOT active.
      // This freezes the last frame of the previous video during the first half of the sweep.
      if (!transitionRef.current.active) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Reset transform and scale context for high-DPI drawing
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Only draw the video element if we are NOT in the first half of a transition (p < 0.5)
      const showVideo = !transitionRef.current.active || transitionRef.current.progress >= 0.5;

      // Draw the video frame covering the full screen (object-fit: cover)
      if (showVideo && videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) {
        const vWidth = videoEl.videoWidth;
        const vHeight = videoEl.videoHeight;

        if (vWidth > 0 && vHeight > 0) {
          // Cover fill: scale so video fills entire canvas, crop edges evenly
          const scale = Math.max(logicalWidth / vWidth, logicalHeight / vHeight);
          const sw = vWidth * scale;
          const sh = vHeight * scale;
          const dx = (logicalWidth - sw) / 2;
          const dy = (logicalHeight - sh) / 2;
          ctx.drawImage(videoEl, dx, dy, sw, sh);
        } else {
          ctx.drawImage(videoEl, 0, 0, logicalWidth, logicalHeight);
        }
      }

      // Draw the transition white sweep gradient if active
      if (transitionRef.current.active) {
        const p = transitionRef.current.progress;

        // Easing function for smooth swipe speed
        const easeInOutQuad = (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const easedP = easeInOutQuad(p);

        // Center position of the gradient sweep (moves from -1000 to 2000)
        const yCenter = -1000 + easedP * 3000;

        // Create the linear gradient for the sweep
        const grad = ctx.createLinearGradient(0, yCenter - 1000, 0, yCenter + 1000);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.25, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.75, "rgba(255, 255, 255, 1)");
        grad.addColorStop(1.0, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, logicalWidth, logicalHeight);
      }

      screenTexture.needsUpdate = true;
    };

    // --- 10. Animation & Interpolation Loop ---
    let animationFrameId: number;
    let autoAngle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update transition progress if active
      if (transitionRef.current.active) {
        const elapsed = Date.now() - transitionRef.current.startTime;
        let p = elapsed / transitionRef.current.duration;
        console.log("[Ritual3DPhone] animate loop transition active: elapsed =", elapsed, "p =", p);

        if (p >= 1.0) {
          p = 1.0;
          transitionRef.current.active = false;
          console.log("[Ritual3DPhone] animate loop transition complete!");
        }

        transitionRef.current.progress = p;
      }

      // Update screen texture canvas with the video frame overlayed
      drawScreenCanvas(scrollProgressRef.current, video);

      // Buttery smooth damping rotation logic (lerp)
      if (isDraggingRef.current) {
        // Dragging mode - interpolate toward drag coordinates
        currentRotationRef.current.y +=
          (targetRotationRef.current.y - currentRotationRef.current.y) * 0.15;
        currentRotationRef.current.x +=
          (targetRotationRef.current.x - currentRotationRef.current.x) * 0.15;
      } else {
        // Non-dragging cinematic mode - automatic floating rotation + cursor hover parallax
        autoAngle += 0.005;

        const baseAutoY = targetRotationRef.current.y + Math.sin(autoAngle) * 0.18;
        const baseAutoX = targetRotationRef.current.x + Math.cos(autoAngle) * 0.06;

        const targetY = baseAutoY + (isHoveredRef.current ? hoverOffsetRef.current.x : 0);
        const targetX = baseAutoX + (isHoveredRef.current ? hoverOffsetRef.current.y : 0);

        currentRotationRef.current.y += (targetY - currentRotationRef.current.y) * 0.06;
        currentRotationRef.current.x += (targetX - currentRotationRef.current.x) * 0.06;
      }

      phoneGroup.rotation.y = currentRotationRef.current.y;
      phoneGroup.rotation.x = currentRotationRef.current.x;

      renderer.render(scene, camera);
    };

    animate();

    // --- 11. Resize handler ---
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 300;
      const h = mountRef.current.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- 12. Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      videoRef.current = null;

      // Pause video and clean up HTML elements to release memory
      video.pause();
      video.removeAttribute("src");
      video.load();
      try {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      } catch (e) {
        console.warn("Failed to remove video node from DOM:", e);
      }

      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }

      // Dispose Geometries and Materials to prevent leaks
      chassisGeo.dispose();
      chassisMaterial.dispose();
      screenGeo.dispose();
      screenCapMaterial.dispose();
      screenSideMaterial.dispose();
      cameraIslandGeo.dispose();
      lensGeo.dispose();
      lensMat.dispose();
      envTexture.dispose();
      screenTexture.dispose();
      renderer.dispose();
    };
  }, []); // Run WebGL mount setup exactly once to prevent context-leak crashes

  // Reactively switch the video source when activeStep changes
  useEffect(() => {
    if (!videoRef.current) return;

    const targetVideo =
      activeStep === 0
        ? phoneVid1
        : activeStep === 1
          ? phoneVid2
          : activeStep === 2
            ? phoneVid3
            : phoneVid4;
    const absoluteTargetUrl = new URL(targetVideo, window.location.href).href;

    if (videoRef.current.src !== absoluteTargetUrl) {
      // Start the transition!
      transitionRef.current.active = true;
      transitionRef.current.startTime = Date.now();
      transitionRef.current.targetVideo = targetVideo;
      transitionRef.current.progress = 0;

      // Swap the source immediately
      videoRef.current.src = targetVideo;
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("[Ritual3DPhone] Failed to play switched video:", err);
      });
    }
  }, [activeStep]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing outline-none select-none"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        hoverOffsetRef.current = { x: 0, y: 0 };
      }}
    />
  );
}
