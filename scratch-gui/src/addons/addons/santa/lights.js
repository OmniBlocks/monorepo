export default function({addon, console, msg}) {
    const colors = ['red','green','yellow','blue','orange','pink'];

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    // make it below modal
    canvas.style.zIndex = '500'; // peak css z-index  
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let lights = [];
    let colorOffset = 0;

    function initLights() {
        const count = Math.floor(window.innerWidth / 30);
        lights = [];
        for (let i = 0; i < count; i++) {
            lights.push({
                x: i * 30 + 15,
                // store a base color index so lights cycle in a pattern
                baseIndex: Math.floor(Math.random() * colors.length)
            });
        }
    }

    function updateCanvasPosition() {
        const menus = document.querySelectorAll('[class^="menu-bar_menu-bar_"]');
        const menuHeight = menus.length ? menus[0].offsetHeight : 40;
        canvas.width = window.innerWidth;
        canvas.height = 30; // slightly taller so glow fits
        canvas.style.top = menuHeight + 'px';
    }

    function draw() {
        updateCanvasPosition(); // recalc menu height each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        lights.forEach(light => {
            ctx.beginPath();
            // slightly bigger lights and stronger glow
            const radius = 3;
            const color = colors[(light.baseIndex + colorOffset) % colors.length];
            ctx.arc(light.x, canvas.height / 2 - 3, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 14;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Advance color offset once per second so lights alternate like real strings
    setInterval(() => {
        colorOffset = (colorOffset + 1) % colors.length;
    }, 1000);

    initLights();
    draw();
    window.addEventListener('resize', initLights);
};
