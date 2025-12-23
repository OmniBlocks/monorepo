export default async function ({addon, console, msg}) {
    // --- Create canvas for snowflakes ---
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 500;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numFlakes = 50;
    const snowflakes = [];

    function createSnowflake() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 12 + 6,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 0.5 - 0.25
        };
    }

    for (let i = 0; i < numFlakes; i++) {
        snowflakes.push(createSnowflake());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#cfcfcf';
        ctx.beginPath();
        for (const flake of snowflakes) {
            flake.y += flake.speedY;
            flake.x += flake.speedX;

            if (flake.y > canvas.height) {
                flake.y = -flake.radius;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;

            ctx.moveTo(flake.x, flake.y);
            ctx.arc(flake.x, flake.y, flake.radius / 4, 0, Math.PI * 2);
        }
        ctx.fill();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust snowflake positions proportionally
        for (const flake of snowflakes) {
            flake.x = (flake.x / oldWidth) * canvas.width;
            flake.y = (flake.y / oldHeight) * canvas.height;
        }
    });

    // --- Utility: parse stylesheets for class names with a prefix ---
    function getClassesByPrefix(prefix) {
        const classes = new Set();
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText) {
                        const parts = rule.selectorText.split(/[\s,>+~]+/);
                        for (const part of parts) {
                            if (part.startsWith('.') && part.slice(1).startsWith(prefix)) {
                                classes.add(part.slice(1));
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignore cross-origin stylesheets
            }
        }
        return [...classes];
    }

    // --- Inject "Remove Snowflakes" menu item continuously ---
    function injectMenuItem() {
        const menuItemClasses = getClassesByPrefix('menu_menu-item_');
        const hoverableClasses = getClassesByPrefix('menu_hoverable_');
        const settingsLabelClasses = getClassesByPrefix('settings-menu_dropdown-label_');

        const menus = Array.from(document.querySelectorAll('ul')).filter(ul =>
            Array.from(ul.children).some(child =>
                settingsLabelClasses.some(cls => child.classList.contains(cls))
            )
        );

        for (const menu of menus) {
            if (menu.querySelector('.remove-snowflakes-item')) continue;

            const li = document.createElement('li');
            li.classList.add('remove-snowflakes-item');

            if (menuItemClasses.length) li.classList.add(menuItemClasses[0]);
            if (hoverableClasses.length) li.classList.add(hoverableClasses[0]);

            li.textContent = 'Remove Snowflakes';
            li.addEventListener('click', () => {
                canvas.remove();
                console.log('Snowflakes removed!');
            });

            menu.appendChild(li);
        }
    }

    injectMenuItem();

    console.log(msg || 'Snowflake canvas overlay activated with React menu support!');
}
