export type OilRenderProfile = {
  pixelRatio: number;
  noiseOctaves: 2 | 4;
  dropletCount: number;
};

export type OilRenderer = {
  setProgress(value: number): void;
  settle(): void;
  resize(): void;
  draw(): void;
  dispose(): void;
};

export function getOilRenderProfile({
  width,
  devicePixelRatio,
  coarsePointer
}: {
  width: number;
  devicePixelRatio: number;
  coarsePointer: boolean;
}): OilRenderProfile {
  const simplified = width < 700 || coarsePointer;

  return simplified
    ? { pixelRatio: 1, noiseOctaves: 2, dropletCount: 8 }
    : { pixelRatio: Math.min(Math.max(devicePixelRatio, 1), 1.5), noiseOctaves: 4, dropletCount: 18 };
}

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

function fragmentShader(octaves: 2 | 4) {
  return `
precision highp float;

uniform vec2 u_resolution;
uniform float u_progress;
uniform float u_time;

#define OCTAVES ${octaves}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  mat2 turn = mat2(0.82, -0.57, 0.57, 0.82);
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03 + 3.17;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(u_resolution.xy, vec2(1.0));
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);

  float slowTime = u_time * 0.12;
  float broad = fbm(vec2(p.x * 1.35 - slowTime, p.y * 1.8 + slowTime * 0.55));
  float fine = fbm(vec2(p.x * 4.2 + slowTime * 0.7, p.y * 5.0 - slowTime));
  float wave = (broad - 0.5) * 0.23 + (fine - 0.5) * 0.055;

  float rise = smoothstep(0.0, 0.42, u_progress);
  float precisionLock = smoothstep(0.68, 1.0, u_progress);
  float surface = mix(-0.12, 1.16, rise);
  surface = mix(surface, 0.16, precisionLock) + wave * (1.0 - precisionLock * 0.72);
  float oil = 1.0 - smoothstep(surface - 0.035, surface + 0.035, uv.y);

  float ridgeDistance = abs(uv.y - surface);
  float ridge = exp(-ridgeDistance * 72.0) * (0.38 + fine * 0.62);
  float sheen = pow(max(0.0, 1.0 - abs(fine - 0.58) * 2.1), 7.0) * oil;
  float sweep = exp(-pow((uv.x - (u_progress * 1.38 - 0.16)) * 5.2, 2.0)) * oil;

  vec3 oilBlack = vec3(0.007, 0.008, 0.012);
  vec3 graphite = vec3(0.055, 0.065, 0.085);
  vec3 cold = vec3(0.70, 0.75, 0.84);
  vec3 red = vec3(0.90, 0.008, 0.045);

  vec3 color = mix(oilBlack, graphite, oil * (0.2 + broad * 0.42));
  color += cold * ridge * 0.34;
  color += cold * sheen * 0.10;
  color += red * (sweep * 0.16 + ridge * smoothstep(0.2, 0.95, uv.x) * 0.08);

  float blackField = 1.0 - smoothstep(0.08, 0.28, u_progress);
  float settledMist = 0.055 + oil * 0.63 + ridge * 0.15;
  float alpha = mix(1.0, settledMist, max(rise, precisionLock));
  alpha = max(alpha, blackField);

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createOilRenderer(canvas: HTMLCanvasElement, profile: OilRenderProfile): OilRenderer | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader(profile.noiseOctaves));
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!program || !buffer) {
    if (program) gl.deleteProgram(program);
    if (buffer) gl.deleteBuffer(buffer);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
  const progressUniform = gl.getUniformLocation(program, "u_progress");
  const timeUniform = gl.getUniformLocation(program, "u_time");

  let progress = 0;
  let frame = 0;
  let disposed = false;
  let running = true;
  const startedAt = performance.now();

  const resize = () => {
    if (disposed) return;
    const width = Math.max(1, Math.round(canvas.clientWidth * profile.pixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * profile.pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  };

  const draw = () => {
    if (disposed) return;
    resize();
    gl.useProgram(program);
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
    gl.uniform1f(progressUniform, progress);
    gl.uniform1f(timeUniform, (performance.now() - startedAt) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const tick = () => {
    if (!running || disposed) return;
    draw();
    frame = requestAnimationFrame(tick);
  };

  tick();

  return {
    setProgress(value) {
      progress = Math.min(Math.max(value, 0), 1);
    },
    settle() {
      progress = 1;
      running = false;
      cancelAnimationFrame(frame);
      draw();
    },
    resize,
    draw,
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    }
  };
}

