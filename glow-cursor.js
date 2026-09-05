(function () {
  "use strict";
  var host = document.getElementById("glowCursor");
  if (!host) return;
  var canvas = host.querySelector("canvas");
  if (!canvas) return;

  // Keep a lightweight CSS core synced with the pointer. It remains visible
  // on desktop even when WebGL is unavailable or hardware acceleration is off.
  function updateCssPointer(clientX, clientY) {
    host.style.setProperty("--cursor-x", clientX + "px");
    host.style.setProperty("--cursor-y", clientY + "px");
    host.classList.add("is-pointer-active");
  }
  function hideCssPointer() { host.classList.remove("is-pointer-active"); }
  window.addEventListener("pointermove", function (event) {
    updateCssPointer(event.clientX, event.clientY);
  }, { passive: true });
  window.addEventListener("pointerleave", hideCssPointer, { passive: true });
  window.addEventListener("blur", hideCssPointer, { passive: true });

  var gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
  if (!gl) { host.classList.add("is-fallback"); return; }

  var vertex = "attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}";
  var fragment = [
    "precision highp float;",
    "#define MAX_POINTS 64",
    "uniform vec2 uResolution; uniform vec2 uPoints[MAX_POINTS]; uniform float uPointCount;",
    "uniform vec3 uColor; uniform vec3 uSecondaryColor; uniform float uTime; uniform float uFade;",
    "varying vec2 vUv;",
    "void main(){ vec2 pixel=vUv*uResolution; float denom=max(uPointCount-1.,1.); float strongest=0.; float coreMax=0.; vec3 sum=vec3(0.); float weight=0.;",
    "for(int i=0;i<MAX_POINTS-1;i++){ float idx=float(i); float active=1.-step(uPointCount-1.,idx); vec2 a=uPoints[i], b=uPoints[i+1], seg=b-a, d=pixel-a; float along=clamp(dot(d,seg)/max(dot(seg,seg),.0001),0.,1.); float progress=clamp((idx+along)/denom,0.,1.); float life=pow(max(1.-progress,0.),.9); float width=8.*mix(1.,.22,pow(progress,1.1)); float dist=length(d-seg*along); float falloff=max(width*2.1,.5); float beam=min(1.,(falloff*falloff)/(dist*dist+falloff*falloff)); float core=exp(-pow(dist/max(width,.5),2.)*2.5); float intensity=(core+beam*.95)*life*active; vec3 col=mix(uColor,uSecondaryColor,progress); strongest=max(strongest,intensity); coreMax=max(core*life*active,coreMax); sum+=col*intensity; weight+=intensity; }",
    "float alpha=clamp(strongest*uFade,0.,.96); if(alpha<.001) discard; vec3 color=sum/max(weight,.0001); color=mix(color,vec3(1.),smoothstep(.2,.95,coreMax)*.62); float pulse=.94+.06*sin(uTime*3.3); gl_FragColor=vec4(color*pulse,alpha); }"
  ].join("\n");

  function makeShader(type, source) {
    var shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  var vs = makeShader(gl.VERTEX_SHADER, vertex), fs = makeShader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) { host.classList.add("is-fallback"); return; }
  var program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { host.classList.add("is-fallback"); return; }
  var buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  var pos = gl.getAttribLocation(program, "position");
  var points = Array.from({ length: 64 }, function () { return { x: 0, y: 0 }; });
  var pointData = new Float32Array(128); var target = { x: 0, y: 0 }; var head = { x: 0, y: 0 }; var initialized = false;
  var fade = 0, lastInput = performance.now(), pointerInside = false, raf = 0, width = 1, height = 1;
  var uResolution = gl.getUniformLocation(program, "uResolution");
  var uPoints = gl.getUniformLocation(program, "uPoints");
  var uPointCount = gl.getUniformLocation(program, "uPointCount");
  var uColor = gl.getUniformLocation(program, "uColor");
  var uSecondaryColor = gl.getUniformLocation(program, "uSecondaryColor");
  var uTime = gl.getUniformLocation(program, "uTime");
  var uFade = gl.getUniformLocation(program, "uFade");

  function resize() { width = Math.max(1, window.innerWidth); height = Math.max(1, window.innerHeight); var dpr = Math.min(window.devicePixelRatio || 1, 1.5); canvas.width = Math.floor(width*dpr); canvas.height = Math.floor(height*dpr); canvas.style.width = width + "px"; canvas.style.height = height + "px"; gl.viewport(0,0,canvas.width,canvas.height); gl.uniform2f(uResolution,width*dpr,height*dpr); }
  function update(clientX, clientY) { var dpr=Math.min(window.devicePixelRatio||1,1.5); var x=clientX*dpr, y=(height-clientY)*dpr; if(!initialized){target.x=head.x=x;target.y=head.y=y;points.forEach(function(p){p.x=x;p.y=y;});initialized=true;} target.x=x; target.y=y; pointerInside=true; lastInput=performance.now(); }
  function leave(){ pointerInside=false; lastInput=performance.now(); }
  function render(now) {
    var delta=Math.min((now-(render.last||now))/16.667,3); render.last=now;
    if(initialized){var ease=1-Math.pow(.84,delta); head.x+=(target.x-head.x)*ease; head.y+=(target.y-head.y)*ease; points[0].x=head.x;points[0].y=head.y; for(var i=1;i<64;i++){points[i].x+=(points[i-1].x-points[i].x)*.34;points[i].y+=(points[i-1].y-points[i].y)*.34;} for(var j=0;j<64;j++){pointData[j*2]=points[j].x;pointData[j*2+1]=points[j].y;}}
    var idle=now-lastInput; var targetFade=initialized&&pointerInside&&idle<700?1:0; fade+=(targetFade-fade)*Math.min(1,delta*.085);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0); gl.uniform2fv(uPoints,pointData); gl.uniform1f(uPointCount,64); gl.uniform3f(uColor,.404,.91,.976); gl.uniform3f(uSecondaryColor,.655,.545,.98); gl.uniform1f(uTime,now*.001); gl.uniform1f(uFade,fade); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE); gl.drawArrays(gl.TRIANGLES,0,6); raf=requestAnimationFrame(render);
  }
  window.addEventListener("resize",resize,{passive:true}); window.addEventListener("pointermove",function(e){update(e.clientX,e.clientY);},{passive:true}); window.addEventListener("pointerleave",leave,{passive:true}); window.addEventListener("blur",leave,{passive:true});
  resize(); raf=requestAnimationFrame(render);
})();
