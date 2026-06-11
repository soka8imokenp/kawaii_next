'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    function makePaletteTexture(stops: string[]) {
      let arr: string[];
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
      } else {
        arr = ['#ffffff', '#ffffff'];
      }
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const customColor = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(customColor.r * 255);
        data[i * 4 + 1] = Math.round(customColor.g * 255);
        data[i * 4 + 2] = Math.round(customColor.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    class CommonClass {
      width = 0; height = 0; aspect = 1; pixelRatio = 1; container: HTMLDivElement | null = null;
      renderer: THREE.WebGLRenderer | null = null; clock: THREE.Clock | null = null; delta = 0; time = 0;
      init(container: HTMLDivElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        Object.assign(this.renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        if (this.clock) {
          this.delta = this.clock.getDelta();
          this.time += this.delta;
        }
      }
      getFloatType() {
        return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      mouseMoved = false; coords = new THREE.Vector2(); coords_old = new THREE.Vector2(); diff = new THREE.Vector2();
      timer: number | null = null; container: HTMLDivElement | null = null; docTarget: Document | null = null;
      listenerTarget: Window | null = null; isHoverInside = false; hasUserControl = false; isAutoActive = false;
      autoIntensity = 2.0; takeoverActive = false; takeoverStartTime = 0; takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2(); takeoverTo = new THREE.Vector2(); onInteract: (() => void) | null = null;
      _onMouseMove = this.onDocumentMouseMove.bind(this); _onTouchStart = this.onDocumentTouchStart.bind(this);
      _onTouchMove = this.onDocumentTouchMove.bind(this); _onTouchEnd = this.onTouchEnd.bind(this);
      _onDocumentLeave = this.onDocumentLeave.bind(this);

      init(container: HTMLDivElement) {
        this.container = container;
        this.docTarget = container.ownerDocument || null;
        this.listenerTarget = window;
        this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
        this.listenerTarget.addEventListener('touchstart', this._onTouchStart, { passive: true });
        this.listenerTarget.addEventListener('touchmove', this._onTouchMove, { passive: true });
        this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
        if (this.docTarget) this.docTarget.addEventListener('mouseleave', this._onDocumentLeave);
      }
      dispose() {
        if (this.listenerTarget) {
          this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
          this.listenerTarget.removeEventListener('touchstart', this._onTouchStart);
          this.listenerTarget.removeEventListener('touchmove', this._onTouchMove);
          this.listenerTarget.removeEventListener('touchend', this._onTouchEnd);
        }
        if (this.docTarget) this.docTarget.removeEventListener('mouseleave', this._onDocumentLeave);
      }
      isPointInside(clientX: number, clientY: number) {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }
      updateHoverState(clientX: number, clientY: number) {
        this.isHoverInside = this.isPointInside(clientX, clientY);
        return this.isHoverInside;
      }
      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        this.coords.set(((x - rect.left) / rect.width) * 2 - 1, -(((y - rect.top) / rect.height) * 2 - 1));
        this.mouseMoved = true;
        this.timer = window.setTimeout(() => { this.mouseMoved = false; }, 100);
      }
      onDocumentMouseMove(e: MouseEvent) {
        if (!this.updateHoverState(e.clientX, e.clientY)) return;
        if (this.onInteract) this.onInteract();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true; this.hasUserControl = true; this.isAutoActive = false;
          return;
        }
        this.setCoords(e.clientX, e.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchStart(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        if (this.onInteract) this.onInteract();
        this.setCoords(t.clientX, t.clientY);
        this.hasUserControl = true;
      }
      onDocumentTouchMove(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        this.setCoords(t.clientX, t.clientY);
      }
      onTouchEnd() { this.isHoverInside = false; }
      onDocumentLeave() { this.isHoverInside = false; }
      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false; this.coords.copy(this.takeoverTo);
          } else {
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, t * t * (3 - 2 * t));
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      current = new THREE.Vector2(); target = new THREE.Vector2(); active = false; lastTime = performance.now(); activationTime = 0;
      constructor(public mouse: any, public manager: any, public opts: any) { this.pickNewTarget(); }
      pickNewTarget() { this.target.set((Math.random() * 2 - 1) * 0.8, (Math.random() * 2 - 1) * 0.8); }
      forceStop() { this.active = false; this.mouse.isAutoActive = false; }
      update() {
        if (!this.opts.enabled) return;
        const now = performance.now();
        if ((now - this.manager.lastUserInteraction) < this.opts.resumeDelay || this.mouse.isHoverInside) {
          if (this.active) this.forceStop(); return;
        }
        if (!this.active) {
          this.active = true; this.current.copy(this.mouse.coords); this.lastTime = now; this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        let dtSec = Math.min(0.2, (now - this.lastTime) / 1000); this.lastTime = now;
        const dir = new THREE.Vector2().subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) { this.pickNewTarget(); return; }
        const ramp = this.opts.rampDurationMs > 0 ? Math.min(1, (now - this.activationTime) / this.opts.rampDurationMs) : 1;
        this.current.addScaledVector(dir.normalize(), Math.min(this.opts.speed * dtSec * ramp, dist));
        this.mouse.coords.copy(this.current); this.mouse.mouseMoved = true;
      }
    }

    const face_vert = `attribute vec3 position; varying vec2 uv; void main(){ uv = vec2(0.5)+position.xy*0.5; gl_Position = vec4(position, 1.0); }`;
    const advection_frag = `precision highp float; uniform sampler2D velocity; uniform float dt; uniform vec2 fboSize; varying vec2 uv; void main(){ vec2 vel = texture2D(velocity, uv).xy; gl_FragColor = vec4(texture2D(velocity, uv - vel * dt * (max(fboSize.x, fboSize.y) / fboSize)).xy, 0.0, 0.0); }`;
    const color_frag = `precision highp float; uniform sampler2D velocity; uniform sampler2D palette; uniform vec4 bgColor; varying vec2 uv; void main(){ vec2 vel = texture2D(velocity, uv).xy; float lenv = clamp(length(vel), 0.0, 1.0); vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb; gl_FragColor = vec4(mix(bgColor.rgb, c, lenv), mix(bgColor.a, 1.0, lenv)); }`;
    const divergence_frag = `precision highp float; uniform sampler2D velocity; uniform float dt; uniform vec2 px; varying vec2 uv; void main(){ float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x; float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x; float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y; float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y; gl_FragColor = vec4((x1 - x0 + y1 - y0) * 0.5 / dt); }`;
    const externalForce_frag = `precision highp float; uniform vec2 force; uniform vec2 center; uniform vec2 scale; uniform vec2 px; varying vec2 vUv; void main(){ float d = 1.0 - min(length((vUv - 0.5) * 2.0), 1.0); gl_FragColor = vec4(force * d * d, 0.0, 1.0); }`;
    const poisson_frag = `precision highp float; uniform sampler2D pressure; uniform sampler2D divergence; uniform vec2 px; varying vec2 uv; void main(){ float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r; float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r; float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r; float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r; gl_FragColor = vec4((p0 + p1 + p2 + p3) * 0.25 - texture2D(divergence, uv).r); }`;
    const pressure_frag = `precision highp float; uniform sampler2D pressure; uniform sampler2D velocity; uniform vec2 px; uniform float dt; varying vec2 uv; void main(){ float p0 = texture2D(pressure, uv + vec2(px.x, 0.0)).r; float p1 = texture2D(pressure, uv - vec2(px.x, 0.0)).r; float p2 = texture2D(pressure, uv + vec2(0.0, px.y)).r; float p3 = texture2D(pressure, uv - vec2(0.0, px.y)).r; gl_FragColor = vec4(texture2D(velocity, uv).xy - vec2(p0 - p1, p2 - p3) * 0.5 * dt, 0.0, 1.0); }`;

    class ShaderPass {
      scene: THREE.Scene | null = null; camera: THREE.Camera | null = null; material: THREE.RawShaderMaterial | null = null;
      constructor(public props: any) { this.init(); }
      init() {
        this.scene = new THREE.Scene(); this.camera = new THREE.Camera();
        if (this.props.material) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), this.material));
        }
      }
      update() {
        if (Common.renderer && this.scene && this.camera) {
          Common.renderer.setRenderTarget(this.props.output || null);
          Common.renderer.render(this.scene, this.camera);
          Common.renderer.setRenderTarget(null);
        }
      }
    }

    class WebGLManager {
      running = false; lastUserInteraction = performance.now(); autoDriver: AutoDriver | null = null; output: any = null;
      constructor(props: any) {
        Common.init(props.$wrapper); Mouse.init(props.$wrapper);
        Mouse.autoIntensity = props.autoIntensity; Mouse.takeoverDuration = props.takeoverDuration;
        Mouse.onInteract = () => { this.lastUserInteraction = performance.now(); if (this.autoDriver) this.autoDriver.forceStop(); };
        this.autoDriver = new AutoDriver(Mouse, this, { enabled: props.autoDemo, speed: props.autoSpeed, resumeDelay: props.autoResumeDelay, rampDurationMs: props.autoRampDuration * 1000 });
        props.$wrapper.prepend(Common.renderer!.domElement);
        
        const type = Common.getFloatType();
        const fboOpts = { type, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
        const simW = Math.max(1, Math.round(resolution * Common.width));
        const simH = Math.max(1, Math.round(resolution * Common.height));
        const px = new THREE.Vector2(1.0 / simW, 1.0 / simH);

        const fbos = {
          v0: new THREE.WebGLRenderTarget(simW, simH, fboOpts), v1: new THREE.WebGLRenderTarget(simW, simH, fboOpts),
          div: new THREE.WebGLRenderTarget(simW, simH, fboOpts), p0: new THREE.WebGLRenderTarget(simW, simH, fboOpts), p1: new THREE.WebGLRenderTarget(simW, simH, fboOpts)
        };

        const advection = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: advection_frag, uniforms: { fboSize: { value: new THREE.Vector2(simW, simH) }, velocity: { value: fbos.v0.texture }, dt: { value: dt } } }, output: fbos.v1 });
        const forcePass = new ShaderPass({ material: { vertexShader: `attribute vec3 position; attribute vec2 uv; uniform vec2 center; uniform vec2 scale; uniform vec2 px; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * scale * 2.0 * px + center, 0.0, 1.0); }`, fragmentShader: externalForce_frag, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: { px: { value: px }, force: { value: new THREE.Vector2() }, center: { value: new THREE.Vector2() }, scale: { value: new THREE.Vector2(cursorSize, cursorSize) } } }, output: fbos.v1 });
        const divergence = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: divergence_frag, uniforms: { velocity: { value: fbos.v1.texture }, px: { value: px }, dt: { value: dt } } }, output: fbos.div });
        const poisson = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: poisson_frag, uniforms: { pressure: { value: fbos.p0.texture }, divergence: { value: fbos.div.texture }, px: { value: px } } }, output: fbos.p1 });
        const pressure = new ShaderPass({ material: { vertexShader: face_vert, fragmentShader: pressure_frag, uniforms: { pressure: { value: fbos.p0.texture }, velocity: { value: fbos.v1.texture }, px: { value: px }, dt: { value: dt } } }, output: fbos.v0 });

        this.output = {
          scene: new THREE.Scene(), camera: new THREE.Camera(),
          update: () => {
            advection.update();
            forcePass.material!.uniforms.force.value.set((Mouse.diff.x / 2) * mouseForce, (Mouse.diff.y / 2) * mouseForce);
            forcePass.material!.uniforms.center.value.copy(Mouse.coords);
            forcePass.update();
            divergence.update();
            for (let i = 0; i < iterationsPoisson; i++) {
              poisson.props.output = i % 2 === 0 ? fbos.p1 : fbos.p0;
              poisson.material!.uniforms.pressure.value = (i % 2 === 0 ? fbos.p0 : fbos.p1).texture;
              poisson.update();
            }
            pressure.material!.uniforms.pressure.value = (iterationsPoisson % 2 === 0 ? fbos.p0 : fbos.p1).texture;
            pressure.update();
            Common.renderer!.setRenderTarget(null);
            Common.renderer!.render(this.output.scene, this.output.camera);
          }
        };

        this.output.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: color_frag, transparent: true, depthWrite: false,
          uniforms: { velocity: { value: fbos.v0.texture }, palette: { value: paletteTex }, bgColor: { value: bgVec4 } }
        })));

        this.start();
      }
      loop() { if (!this.running) return; this.output.update(); Mouse.update(); Common.update(); rafRef.current = requestAnimationFrame(this.loop.bind(this)); }
      start() { if (this.running) return; this.running = true; this.loop(); }
      pause() { this.running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); }
      dispose() { Mouse.dispose(); if (Common.renderer) { Common.renderer.dispose(); Common.renderer.domElement.remove(); } }
    }



    const webgl = new WebGLManager({ $wrapper: mountRef.current, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration });
    webglRef.current = webgl;

    const io = new IntersectionObserver(([e]) => { if (webglRef.current) e.isIntersecting ? webglRef.current.start() : webglRef.current.pause(); });
    io.observe(mountRef.current);

    return () => { io.disconnect(); if (webglRef.current) webglRef.current.dispose(); };
  }, [colors, mouseForce, cursorSize, iterationsPoisson, resolution, dt, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration]);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`} style={style} />;
}