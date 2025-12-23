export default function({addon, console, msg}) {
    const colors = ['red','green','yellow','blue','orange','pink'];

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let lights = [];

    function initLights() {
        const count = Math.floor(window.innerWidth / 30);
        lights = [];
        for (let i = 0; i < count; i++) {
            lights.push({
                x: i * 30 + 15,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    function updateCanvasPosition() {
        const menus = document.querySelectorAll('[class^="menu-bar_menu-bar_"]');
        const menuHeight = menus.length ? menus[0].offsetHeight : 40;
        canvas.width = window.innerWidth;
        canvas.height = 20; // small strip
        canvas.style.top = menuHeight + 'px';
    }

    function draw() {
        updateCanvasPosition(); // recalc menu height each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lights.forEach(light => {
            ctx.beginPath();
            ctx.arc(light.x, canvas.height / 2, 1, 0, Math.PI * 2);
            ctx.fillStyle = light.color;
            ctx.shadowColor = light.color;
            ctx.shadowBlur = 8;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    initLights();
    draw();
    window.addEventListener('resize', initLights);
};
