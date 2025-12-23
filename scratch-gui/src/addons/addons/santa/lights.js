export default function({addon, console, msg}) {
    const colors = ['red','green','yellow','blue','orange','pink'];

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '500';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let lights = [];
    const fadeDuration = 1000; // 1 second fade

    function initLights() {
        const count = Math.floor(window.innerWidth / 30);
        lights = [];
        const now = performance.now();
        for (let i = 0; i < count; i++) {
            const baseIndex = Math.floor(Math.random() * colors.length);
            lights.push({
                x: i * 30 + 15,
                baseIndex,
                nextIndex: Math.floor(Math.random() * colors.length),
                fadeStart: now, // each light tracks its own fade start
                bobOffset: Math.random() * Math.PI * 2,
                twinkle: Math.random() * 0.3 + 0.7
            });
        }
    }

    function updateCanvasPosition() {
        const menus = document.querySelectorAll('[class^="menu-bar_menu-bar_"]');
        const menuHeight = menus.length ? menus[0].offsetHeight : 40;
        canvas.width = window.innerWidth;
        canvas.height = 30; 
        canvas.style.top = menuHeight + 'px';
    }

    function cssColorToRgb(color) {
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const rgb = getComputedStyle(div).color.match(/\d+/g).map(Number);
        document.body.removeChild(div);
        return rgb;
    }

    function lerpColor(c1, c2, t) {
        return [
            Math.round(c1[0] + (c2[0] - c1[0]) * t),
            Math.round(c1[1] + (c2[1] - c1[1]) * t),
            Math.round(c1[2] + (c2[2] - c1[2]) * t)
        ];
    }

    function rgbToCss(rgb) {
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }

    function getFadedColor(light) {
        const now = performance.now();
        let t = (now - light.fadeStart) / fadeDuration;
        if (t >= 1) {
            // move to next color and reset timer
            light.baseIndex = light.nextIndex;
            light.nextIndex = Math.floor(Math.random() * colors.length);
            light.fadeStart = now;
            t = 0;
        }
        const current = cssColorToRgb(colors[light.baseIndex]);
        const next = cssColorToRgb(colors[light.nextIndex]);
        return rgbToCss(lerpColor(current, next, t));
    }

    function draw() {
        updateCanvasPosition();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const time = performance.now() / 1000;

        lights.forEach(light => {
            ctx.beginPath();
            const radius = 3;
            const y = canvas.height / 2 - 3 + Math.sin(time * 2 + light.bobOffset) * 2;
            const color = getFadedColor(light);
            const twinkle = light.twinkle + (Math.sin(time * 5 + light.bobOffset) * 0.2);

            ctx.arc(light.x, y, radius, 0, Math.PI * 2);

            const gradient = ctx.createRadialGradient(light.x, y, 0, light.x, y, radius*4);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = gradient;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8 * twinkle;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    initLights();
    draw();
    window.addEventListener('resize', initLights);
};
