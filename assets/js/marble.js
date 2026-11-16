/* Flowing marble for the left strip.
   Generated in the browser (no image file), so it is sharp at any size
   and each page shows a different region of the same pour.
   Set data-seed on the .marble element to change the region. */
(function () {
  var host = document.querySelector(".marble");
  if (!host) return;

  var canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return; // the CSS gradient on .marble stays as the fallback

  var VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 uRes; uniform float uTime; uniform float uSeed; uniform float uUnit;",
    "uniform vec2 uMouse; uniform float uPull;",

    "float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }",
    "float noise(vec2 p){",
    "  vec2 i = floor(p), f = fract(p);",
    "  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),",
    "             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);",
    "}",
    "const mat2 ROT = mat2(0.8, -0.6, 0.6, 0.8);",
    "float fbm(vec2 p){",
    "  float a = 0.5, s = 0.0;",
    "  for (int i = 0; i < 5; i++){ s += a * noise(p); p = ROT * p * 2.03 + 11.7; a *= 0.5; }",
    "  return s;",
    "}",

    // ten paint colours, visited in a loop
    "vec3 paint(float t){",
    "  t = fract(t) * 10.0;",
    "  vec3 c0 = vec3(1.00, 0.10, 0.45);", // hot pink
    "  vec3 c1 = vec3(0.07, 0.03, 0.22);", // ink
    "  vec3 c2 = vec3(0.05, 0.78, 0.88);", // cyan
    "  vec3 c3 = vec3(0.10, 0.36, 1.00);", // blue
    "  vec3 c4 = vec3(0.50, 0.14, 0.86);", // violet
    "  vec3 c5 = vec3(0.93, 0.08, 0.16);", // red
    "  vec3 c6 = vec3(1.00, 0.56, 0.10);", // orange
    "  vec3 c7 = vec3(1.00, 0.86, 0.22);", // yellow
    "  vec3 c8 = vec3(0.06, 0.72, 0.38);", // green
    "  vec3 c9 = vec3(0.88, 0.16, 0.82);", // magenta
    "  float w = 0.28;", // narrow blends keep the bands crisp, like poured paint
    "  vec3 c = c0;",
    "  c = mix(c, c1, smoothstep(1.0 - w, 1.0 + w, t));",
    "  c = mix(c, c2, smoothstep(2.0 - w, 2.0 + w, t));",
    "  c = mix(c, c3, smoothstep(3.0 - w, 3.0 + w, t));",
    "  c = mix(c, c4, smoothstep(4.0 - w, 4.0 + w, t));",
    "  c = mix(c, c5, smoothstep(5.0 - w, 5.0 + w, t));",
    "  c = mix(c, c6, smoothstep(6.0 - w, 6.0 + w, t));",
    "  c = mix(c, c7, smoothstep(7.0 - w, 7.0 + w, t));",
    "  c = mix(c, c8, smoothstep(8.0 - w, 8.0 + w, t));",
    "  c = mix(c, c9, smoothstep(9.0 - w, 9.0 + w, t));",
    "  c = mix(c, c0, smoothstep(10.0 - w, 10.0, t));",
    "  return c;",
    "}",

    "void main(){",
    "  vec2 p = gl_FragCoord.xy / uUnit;",

    // the cursor stirs the paint: a small swirl and pinch around it
    "  vec2 d = p - uMouse / uUnit;",
    "  float near = exp(-dot(d, d) / 0.022) * uPull;",
    "  float ang = 0.3 * near;",
    "  d = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * d * (1.0 - 0.08 * near);",
    "  p = uMouse / uUnit + d;",

    "  p += vec2(uSeed * 3.7, uSeed * 1.9);",
    "  float t = uTime * 0.018;",

    // warp the plane twice so the colour bands fold over each other
    "  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));",
    "  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + 0.6 * t),",
    "                fbm(p + 3.2 * q + vec2(8.3, 2.8) - 0.5 * t));",
    "  float f = fbm(p + 3.4 * r);",

    "  float v = f * 1.55 + 0.45 * r.x + 0.25 * q.y + 0.04 * uSeed + 0.03 * near;",
    "  vec3 col = paint(v * 1.9);",

    // fine striations that follow the flow
    "  float fine = sin(v * 150.0 + 6.0 * r.y);",
    "  col *= 0.9 + 0.1 * fine;",
    "  col = mix(col, vec3(1.0), 0.16 * smoothstep(0.86, 1.0, fine) * smoothstep(0.35, 0.75, f));",

    // darker folds where the flow pinches
    "  col *= mix(0.55, 1.08, smoothstep(0.12, 0.62, length(r)));",

    "  col = pow(col, vec3(0.92));",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("marble shader:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, "uRes");
  var uTime = gl.getUniformLocation(prog, "uTime");
  var uSeed = gl.getUniformLocation(prog, "uSeed");
  var uUnit = gl.getUniformLocation(prog, "uUnit");
  var uMouse = gl.getUniformLocation(prog, "uMouse");
  var uPull = gl.getUniformLocation(prog, "uPull");

  // cursor: where it is, and how strongly it is stirring (0 when off the marble)
  var mouse = { x: 0, y: 0, tx: 0, ty: 0, pull: 0, tpull: 0, seen: false };
  window.addEventListener("pointermove", function (e) {
    var r = host.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    mouse.tx = e.clientX - r.left;
    mouse.ty = r.height - (e.clientY - r.top); // WebGL counts up from the bottom
    mouse.tpull = inside ? 1 : 0;
    if (!mouse.seen) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.seen = true; }
  }, { passive: true });
  document.addEventListener("pointerleave", function () { mouse.tpull = 0; });
  window.addEventListener("blur", function () { mouse.tpull = 0; });

  var seed = parseFloat(host.getAttribute("data-seed") || "0");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = 1;

  host.appendChild(canvas);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.round(host.clientWidth * dpr));
    var h = Math.max(1, Math.round(host.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw(ms) {
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    // one noise unit is about 520 CSS px, so swirls keep their size on any strip width
    gl.uniform1f(uUnit, 520 * dpr);
    gl.uniform1f(uSeed, seed);
    // ease toward the cursor so the stir trails behind it like something viscous
    mouse.x += (mouse.tx - mouse.x) * 0.09;
    mouse.y += (mouse.ty - mouse.y) * 0.09;
    mouse.pull += (mouse.tpull - mouse.pull) * 0.06;
    gl.uniform2f(uMouse, mouse.x * dpr, mouse.y * dpr);
    gl.uniform1f(uPull, still ? 0 : mouse.pull);
    gl.uniform1f(uTime, still ? 40.0 : 40.0 + ms / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  var raf = 0;
  function loop(ms) {
    draw(ms);
    raf = requestAnimationFrame(loop);
  }

  if (still) {
    draw(0);
    window.addEventListener("resize", function () { draw(0); });
  } else {
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function () {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
  }
})();
