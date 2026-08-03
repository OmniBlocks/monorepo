import { createRoot } from 'react-dom/client';
import { setAppElement } from 'react-modal';

const appTarget = document.getElementById('app');

// Remove everything from the target to fix macOS Safari "Save Page As"
while (appTarget.firstChild) {
    appTarget.removeChild(appTarget.firstChild);
}

setAppElement(appTarget);
let root;
const render = children => {
    if (!root) {
        root = createRoot(appTarget);
    }
    
    root.render(children);

    if (window.SplashEnd) {
        window.SplashEnd();
    }
};

export default render;