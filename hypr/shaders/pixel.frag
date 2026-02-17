#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 fragColor;
uniform sampler2D tex;

void main() {
    vec2 uv = v_texcoord;
    ivec2 size = textureSize(tex, 0);

    // Wir machen die "Pixel" nur 2x2 real-pixel groß
    float pixel_size = 2.0;

    vec2 res = vec2(size);
    vec2 grid = fract(uv * res / pixel_size);

    // Wir sampeln das Originalbild fast scharf
    vec2 coord = floor(uv * res / pixel_size) * pixel_size / res;
    vec4 color = texture(tex, coord);

    // Erzeuge ein ganz feines Gitter-Overlay (Pixel-Struktur)
    // Das macht den "Look", ohne die Schrift zu zerstören
    float grid_line = smoothstep(0.0, 0.1, grid.x) * smoothstep(0.0, 0.1, grid.y);

    fragColor = color * (0.9 + 0.1 * grid_line);
}
