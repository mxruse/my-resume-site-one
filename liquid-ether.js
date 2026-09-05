(function () {
  "use strict";

  var root = document.getElementById("liquidEtherBackground");
  if (!root) return;
  var canvas = root.querySelector("canvas");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance"
  });

  if (!gl) {
    root.classList.add("is-fallback");
    return;
  }

  var vertexSource = [
    "attribute vec2 aPosition;",
    "varying vec2 vUv;",
    "void main(){",
    "  vUv = aPosition * .5 + .5;",
    "  gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
  ].join("\n");

  var updateSource = [
    "precision highp float;",
    "uniform sampler2D uPrevious;",
    "uniform vec2 uPointer;",
    "uniform vec2 uVelocity;",
    "uniform float uTime;",
    "uniform float uAspect;",
    "uniform float uForce;",
    "varying vec2 vUv;",
    "void main(){",
    "  vec2 p = vUv;",
    "  float waves = sin((p.y + uTime * .025) * 12.0)",
    "              + cos((p.x - uTime * .018) * 9.0)",
    "              + sin((p.x + p.y + uTime * .012) * 17.0);",
    "  float angle = waves * 1.35 + uTime * .018;",
    "  vec2 flow = vec2(cos(angle), sin(angle)) * .00125;",
    "  vec2 delta = p - uPointer;",
    "  vec2 metricDelta = delta * vec2(uAspect, 1.0);",
    "  float dist = length(metricDelta);",
    "  vec2 swirl = vec2(-metricDelta.y, metricDelta.x) * exp(-dist * 14.0) * .013;",
    "  vec2 previousUv = clamp(p - flow - swirl - uVelocity * .010, .002, .998);",
    "  vec3 trail = texture2D(uPrevious, previousUv).rgb * .986;",
    "  float cursor = 1.0 - smoothstep(0.0, .165, dist);",
    "  float energy = clamp(length(uVelocity) * 24.0 + uForce, 0.18, 1.0);",
    "  vec3 purple = vec3(.322, .153, 1.0);",
    "  vec3 pink = vec3(1.0, .624, .988);",
    "  vec3 lilac = vec3(.706, .592, .812);",
    "  float phase = .5 + .5 * sin(uTime * .42 + p.x * 4.0 - p.y * 3.0);",
    "  vec3 ink = mix(purple, pink, phase);",
    "  ink = mix(ink, lilac, .24 + .18 * sin(uTime * .27));",
    "  trail += ink * cursor * (.045 + energy * .22);",
    "  trail = min(trail, vec3(1.35));",
    "  gl_FragColor = vec4(trail, 1.0);",
    "}"
  ].join("\n");

  var displaySource = [
    "precision highp float;",
    "uniform sampler2D uTexture;",
    "uniform vec2 uPixel;",
    "uniform float uTime;",
    "varying vec2 vUv;",
    "void main(){",
    "  vec3 c = texture2D(uTexture, vUv).rgb * .42;",
    "  c += texture2D(uTexture, vUv + vec2(uPixel.x, 0.0)).rgb * .145;",
    "  c += texture2D(uTexture, vUv - vec2(uPixel.x, 0.0)).rgb * .145;",
    "  c += texture2D(uTexture, vUv + vec2(0.0, uPixel.y)).rgb * .145;",
    "  c += texture2D(uTexture, vUv - vec2(0.0, uPixel.y)).rgb * .145;",
    "  c = 1.0 - exp(-c * 1.45);",
    "  float vignette = 1.0 - smoothstep(.22, 1.05, distance(vUv, vec2(.5)));",
    "  vec3 base = vec3(.018, .012, .045);",
    "  vec3 glow = c * (1.02 + vignette * .28);",
    "  glow += vec3(.035, .012, .075) * (.5 + .5 * sin(uTime * .08));",
    "  gl_FragColor = vec4(base + glow, 1.0);",
    "}"
  ].join("\n");

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn("LiquidEther shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function program(fragmentSource) {
    var vertex = compile(gl.VERTEX_SHADER, vertexSource);
    var fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return null;
    var result = gl.createProgram();
    gl.attachShader(result, vertex);
    gl.attachShader(result, fragment);
    gl.linkProgram(result);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
      console.warn("LiquidEther program:", gl.getProgramInfoLog(result));
      gl.deleteProgram(result);
      return null;
    }
    return result;
  }

  var updateProgram = program(updateSource);
  var displayProgram = program(displaySource);
  if (!updateProgram || !displayProgram) {
    root.classList.add("is-fallback");
    return;
  }

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  var updateUniforms = {
    previous: gl.getUniformLocation(updateProgram, "uPrevious"),
    pointer: gl.getUniformLocation(updateProgram, "uPointer"),
    velocity: gl.getUniformLocation(updateProgram, "uVelocity"),
    time: gl.getUniformLocation(updateProgram, "uTime"),
    aspect: gl.getUniformLocation(updateProgram, "uAspect"),
    force: gl.getUniformLocation(updateProgram, "uForce")
  };
  var displayUniforms = {
    texture: gl.getUniformLocation(displayProgram, "uTexture"),
    pixel: gl.getUniformLocation(displayProgram, "uPixel"),
    time: gl.getUniformLocation(displayProgram, "uTime")
  };

  var targets = [];
  var simWidth = 1;
  var simHeight = 1;
  var front = 0;
  var pointer = { x: .5, y: .5, oldX: .5, oldY: .5, vx: 0, vy: 0 };
  var autoTarget = { x: .72, y: .36 };
  var lastInteraction = 0;
  var lastFrame = performance.now();
  var startTime = lastFrame;
  var frameRequest = 0;
  var running = true;

  function destroyTargets() {
    targets.forEach(function (target) {
      gl.deleteTexture(target.texture);
      gl.deleteFramebuffer(target.framebuffer);
    });
    targets = [];
  }

  function createTarget(width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture: texture, framebuffer: framebuffer };
  }

  function resize() {
    var width = Math.max(1, window.innerWidth);
    var height = Math.max(1, window.innerHeight);
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    var scale = width < 700 ? .52 : .44;
    simWidth = Math.max(180, Math.min(620, Math.round(width * scale)));
    simHeight = Math.max(180, Math.min(620, Math.round(height * scale)));
    destroyTargets();
    targets = [createTarget(simWidth, simHeight), createTarget(simWidth, simHeight)];
    front = 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function useQuad(activeProgram) {
    var position = gl.getAttribLocation(activeProgram, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  function newAutoTarget() {
    autoTarget.x = .12 + Math.random() * .76;
    autoTarget.y = .12 + Math.random() * .76;
  }

  function updateAuto(delta) {
    if (reduceMotion.matches || performance.now() - lastInteraction < 1000) return .12;
    var dx = autoTarget.x - pointer.x;
    var dy = autoTarget.y - pointer.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < .025) {
      newAutoTarget();
      return .25;
    }
    var step = Math.min(distance, delta * .11);
    pointer.x += dx / distance * step;
    pointer.y += dy / distance * step;
    pointer.vx += (pointer.x - pointer.oldX) * 1.8;
    pointer.vy += (pointer.y - pointer.oldY) * 1.8;
    return .46;
  }

  function draw(now) {
    if (!running) return;
    var delta = Math.min(.05, Math.max(.001, (now - lastFrame) / 1000));
    var time = (now - startTime) / 1000;
    lastFrame = now;
    var autoForce = updateAuto(delta);

    gl.disable(gl.BLEND);
    gl.useProgram(updateProgram);
    useQuad(updateProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, targets[1 - front].framebuffer);
    gl.viewport(0, 0, simWidth, simHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[front].texture);
    gl.uniform1i(updateUniforms.previous, 0);
    gl.uniform2f(updateUniforms.pointer, pointer.x, pointer.y);
    gl.uniform2f(updateUniforms.velocity, pointer.vx, pointer.vy);
    gl.uniform1f(updateUniforms.time, time);
    gl.uniform1f(updateUniforms.aspect, window.innerWidth / Math.max(1, window.innerHeight));
    gl.uniform1f(updateUniforms.force, autoForce);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    front = 1 - front;

    gl.useProgram(displayProgram);
    useQuad(displayProgram);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[front].texture);
    gl.uniform1i(displayUniforms.texture, 0);
    gl.uniform2f(displayUniforms.pixel, 1 / simWidth, 1 / simHeight);
    gl.uniform1f(displayUniforms.time, time);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    pointer.oldX = pointer.x;
    pointer.oldY = pointer.y;
    pointer.vx *= .74;
    pointer.vy *= .74;
    frameRequest = window.requestAnimationFrame(draw);
  }

  function interact(clientX, clientY) {
    var x = Math.min(1, Math.max(0, clientX / Math.max(1, window.innerWidth)));
    var y = 1 - Math.min(1, Math.max(0, clientY / Math.max(1, window.innerHeight)));
    pointer.vx += (x - pointer.x) * 1.7;
    pointer.vy += (y - pointer.y) * 1.7;
    pointer.x = x;
    pointer.y = y;
    lastInteraction = performance.now();
  }

  window.addEventListener("pointermove", function (event) {
    interact(event.clientX, event.clientY);
  }, { passive: true });
  window.addEventListener("touchmove", function (event) {
    if (event.touches && event.touches[0]) interact(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) {
      lastFrame = performance.now();
      window.cancelAnimationFrame(frameRequest);
      frameRequest = window.requestAnimationFrame(draw);
    }
  });

  resize();
  frameRequest = window.requestAnimationFrame(draw);
})();
