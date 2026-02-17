#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 fragColor;
uniform sampler2D tex;

void main() {
    vec2 uv = v_texcoord;

    // 1. Ganz dezente Wölbung für den Röhren-Look
    vec2 dc = abs(0.5 - uv);
    dc *= dc;
    vec2 curved_uv = uv;
    curved_uv.y -= 0.5;
    curved_uv.y *= 1.0 + (dc.x * 0.012);
    curved_uv.y += 0.5;
    curved_uv.x -= 0.5;
    curved_uv.x *= 1.0 + (dc.y * 0.012);
    curved_uv.x += 0.5;

    // 2. Statische Scanlines (sehr fein, damit sie nicht flimmern)
    // Wir nutzen ein festes Muster, das dem Auge Struktur gibt
    float scanline = sin(curved_uv.y * 1200.0) * 0.03;

    // 3. Chromatic Aberration (Farbversatz an den Kanten)
    // Das gibt dem statischen Bild die nötige "Unschärfe"
    float r = texture(tex, curved_uv + vec2(0.0007, 0.0)).r;
    float g = texture(tex, curved_uv).g;
    float b = texture(tex, curved_uv - vec2(0.0007, 0.0)).b;

    vec4 color = vec4(r, g, b, 1.0);

    // 4. Helligkeit und Kontrast leicht anheben
    color -= scanline;
    color *= 1.1;

    // 5. Minimale Vignette (wirklich nur in den äußersten Ecken)
    float edge = 1.0 - length(v_texcoord - 0.5);
    float vignette = smoothstep(0.4, 0.7, edge);
    color *= mix(0.9, 1.0, vignette);

    fragColor = color;

    // 6. Sauberer Randabschluss
    if (curved_uv.y > 1.0 || curved_uv.x > 1.0 || curved_uv.y < 0.0 || curved_uv.x < 0.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
