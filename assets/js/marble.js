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
    "uniform vec4 uWake[12];", // xy: where the cursor was (px), zw: the push it left there

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

    // wading through water: every recent cursor position shoves the paint
    // the way the cursor was travelling, plus a small bow wave outward
    "  vec2 push = vec2(0.0);",
    "  for (int i = 0; i < 12; i++){",
    "    vec2 w = uWake[i].zw;",
    "    vec2 d = p - uWake[i].xy / uUnit;",
    "    float r2 = dot(d, d);",
    "    push += w * exp(-r2 / 0.022) + d * (2.2 * length(w)) * exp(-r2 / 0.03);",
    "  }",
    "  p -= push;",

    "  p += vec2(uSeed * 3.7, uSeed * 1.9);",
    "  float t = uTime * 0.018;",

    // warp the plane twice so the colour bands fold over each other
    "  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));",
    "  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + 0.6 * t),",
    "                fbm(p + 3.2 * q + vec2(8.3, 2.8) - 0.5 * t));",
    "  float f = fbm(p + 3.4 * r);",

    "  float v = f * 1.55 + 0.45 * r.x + 0.25 * q.y + 0.04 * uSeed + 0.35 * length(push);",
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
  var uWake = gl.getUniformLocation(prog, "uWake");

  // The wake: a short list of places the cursor has just been, each holding
  // the push it gave the paint there. A faster cursor pushes harder; a still
  // cursor does nothing. Each push fades out over about a second.
  var WAKE = 12;          // must match uWake[12] in the shader
  var FADE_MS = 650;      // how quickly a push dies away
  var STRENGTH = 0.07;    // paint moved per (px/ms) of cursor speed
  var MAX_SPEED = 2.2;    // px/ms; faster than this pushes no harder
  var wake = [];          // { x, y, vx, vy, born }
  var wakeData = new Float32Array(WAKE * 4);
  var last = null;        // previous pointer sample
  var vel = { x: 0, y: 0 };

  window.addEventListener("pointermove", function (e) {
    var r = host.getBoundingClientRect();
    var now = performance.now();
    var x = e.clientX - r.left;
    var y = r.height - (e.clientY - r.top); // WebGL counts up from the bottom
    if (last && now - last.t < 120) {
      var dt = Math.max(now - last.t, 4);
      // smooth the speed a little so one jittery sample does not spike
      vel.x += ((x - last.x) / dt - vel.x) * 0.5;
      vel.y += ((y - last.y) / dt - vel.y) * 0.5;
      var speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      var inside = x >= -60 && x <= r.width + 60 && y >= -60 && y <= r.height + 60;
      var prev = wake[wake.length - 1];
      var far = !prev || Math.abs(x - prev.x) + Math.abs(y - prev.y) > 22;
      if (inside && far && speed > 0.05) {
        var k = Math.min(speed, MAX_SPEED) / speed * STRENGTH;
        wake.push({ x: x, y: y, vx: vel.x * k, vy: vel.y * k, born: now });
        if (wake.length > WAKE) wake.shift();
      }
    } else {
      vel.x = 0; vel.y = 0;
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
    // hand the shader the wake, each push faded by its age
    var now = performance.now();
    while (wake.length && now - wake[0].born > FADE_MS * 5) wake.shift();
    for (var i = 0; i < WAKE; i++) {
      var w = wake[i], o = i * 4;
      if (w && !still) {
        var age = now - w.born;
        // swell quickly, then die away
        var fade = Math.min(age / 90, 1) * Math.exp(-age / FADE_MS);
        wakeData[o] = w.x * dpr; wakeData[o + 1] = w.y * dpr;
        wakeData[o + 2] = w.vx * fade; wakeData[o + 3] = w.vy * fade;
      } else {
        wakeData[o] = wakeData[o + 1] = wakeData[o + 2] = wakeData[o + 3] = 0;
      }
    }
    gl.uniform4fv(uWake, wakeData);
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
