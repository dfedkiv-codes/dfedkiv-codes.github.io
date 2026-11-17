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
    "uniform sampler2D uField; uniform vec2 uFieldSize;", // how far the cursor has dragged the paint, per region

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

    // the cursor drags the paint and it stays dragged: uField remembers,
    // for each patch of the strip, how far it has been pushed so far
    "  vec2 push = (texture2D(uField, gl_FragCoord.xy / uFieldSize).rg * 255.0 - 128.0) / 127.0 * 0.45;",
    "  p -= push;",

    "  p += vec2(uSeed * 3.7, uSeed * 1.9);",
    "  float t = uTime * 0.018;",

    // warp the plane twice so the colour bands fold over each other
    "  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));",
    "  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + 0.6 * t),",
    "                fbm(p + 3.2 * q + vec2(8.3, 2.8) - 0.5 * t));",
    "  float f = fbm(p + 3.4 * r);",

    "  float v = f * 1.55 + 0.45 * r.x + 0.25 * q.y + 0.04 * uSeed + 0.1 * length(push);",
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
  var uField = gl.getUniformLocation(prog, "uField");
  var uFieldSize = gl.getUniformLocation(prog, "uFieldSize");

  // ---- stirring -------------------------------------------------------
  // The strip is covered by a coarse grid. Each cell remembers how far the
  // paint there has been dragged. Moving the cursor adds to the cells near
  // it, in the direction of travel, and more the faster it moves. Nothing
  // fades, so the pattern keeps whatever shape it has been stirred into.
  var CELL = 16;            // CSS px per grid cell
  var GW = 64, GH = 128;    // grid size: covers 1024 x 2048 px
  var RANGE = 0.45;         // most a patch can be dragged, in pattern units (must match the shader)
  var UNIT = 520;           // CSS px per pattern unit (must match draw())
  var GAIN = 0.3;           // share of the cursor's travel the paint follows at full speed
  var FULL_SPEED = 1.5;     // px/ms at which GAIN is reached; slower drags less
  var RADIUS = 70;          // px: how wide a path the cursor stirs

  var fx = new Float32Array(GW * GH);
  var fy = new Float32Array(GW * GH);
  var bytes = new Uint8Array(GW * GH * 4);
  var dirty = true;
  var STORE = "df-marble-" + (document.body.classList.contains("cover") ? "cover" : "inner") + "-" + seedAttr();

  function seedAttr() { return host.getAttribute("data-seed") || "0"; }

  function pack() {
    for (var i = 0, o = 0; i < fx.length; i++, o += 4) {
      bytes[o] = Math.round(128 + fx[i] / RANGE * 127);
      bytes[o + 1] = Math.round(128 + fy[i] / RANGE * 127);
      bytes[o + 2] = 0;
      bytes[o + 3] = 255;
    }
  }

  // bring back what was stirred earlier in this visit
  try {
    var saved = sessionStorage.getItem(STORE);
    if (saved) {
      var raw = atob(saved);
      if (raw.length === GW * GH * 2) {
        for (var i = 0; i < GW * GH; i++) {
          fx[i] = (raw.charCodeAt(i * 2) - 128) / 127 * RANGE;
          fy[i] = (raw.charCodeAt(i * 2 + 1) - 128) / 127 * RANGE;
        }
      }
    }
  } catch (e) {}

  function save() {
    try {
      pack();
      var out = "";
      for (var i = 0; i < GW * GH; i++) out += String.fromCharCode(bytes[i * 4], bytes[i * 4 + 1]);
      sessionStorage.setItem(STORE, btoa(out));
    } catch (e) {}
  }
  window.addEventListener("pagehide", save);

  var fieldTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fieldTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  pack();
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GW, GH, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
  gl.uniform1i(uField, 0);

  // add a drag of (dx, dy) px, centred on (x, y), to the cells around it
  function stir(x, y, dx, dy) {
    var reach = Math.ceil(RADIUS * 1.6 / CELL);
    var cx = Math.floor(x / CELL), cy = Math.floor(y / CELL);
    for (var j = cy - reach; j <= cy + reach; j++) {
      if (j < 0 || j >= GH) continue;
      for (var i = cx - reach; i <= cx + reach; i++) {
        if (i < 0 || i >= GW) continue;
        var ex = (i + 0.5) * CELL - x, ey = (j + 0.5) * CELL - y;
        var g = Math.exp(-(ex * ex + ey * ey) / (RADIUS * RADIUS * 0.5));
        if (g < 0.01) continue;
        var k = j * GW + i;
        var nx = fx[k] + dx / UNIT * g, ny = fy[k] + dy / UNIT * g;
        // never drag a patch further than RANGE in total
        var len = Math.sqrt(nx * nx + ny * ny);
        if (len > RANGE) { nx *= RANGE / len; ny *= RANGE / len; }
        fx[k] = nx; fy[k] = ny;
      }
    }
    dirty = true;
  }

  var last = null; // previous pointer sample
  window.addEventListener("pointermove", function (e) {
    if (still) return;
    var r = host.getBoundingClientRect();
    var now = performance.now();
    var x = e.clientX - r.left;
    var y = r.height - (e.clientY - r.top); // WebGL counts up from the bottom
    if (last && now - last.t < 120) {
      var dx = x - last.x, dy = y - last.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var speed = dist / Math.max(now - last.t, 4);
      var inside = x >= -RADIUS && x <= r.width + RADIUS && y >= -RADIUS && y <= r.height + RADIUS;
      if (inside && dist > 0.5 && dist < 300) {
        // a slow cursor slips through; a fast one carries the paint with it
        var t = Math.min(speed / FULL_SPEED, 1);
        var gain = GAIN * t * t * (3 - 2 * t);
        if (gain > 0.004) stir(x, y, dx * gain, dy * gain);
      }
    }
    last = { x: x, y: y, t: now };
  }, { passive: true });

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
    if (dirty) {
      pack();
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, GW, GH, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      dirty = false;
    }
    gl.uniform2f(uFieldSize, GW * CELL * dpr, GH * CELL * dpr);
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
