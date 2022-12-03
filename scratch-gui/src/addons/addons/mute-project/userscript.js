/* inserted by pull.js */
import _twAsset0 from "!url-loader!./icon--mute.svg";
const _twGetAsset = (path) => {
  if (path === "/icon--mute.svg") return _twAsset0;
  throw new Error(`Unknown asset: ${path}`);
};

import { setup, isMuted, setVol, getDefVol } from "../vol-slider/module.js";

export default async function ({ addon, global, console }) {
  const vm = addon.tab.traps.vm;
  let icon = document.createElement("img");
  icon.loading = "lazy";
  icon.src = _twGetAsset("/icon--mute.svg");
  icon.style.display = "none";
  icon.className = "sa-mute-icon";
  const toggleMute = (e) => {
    if (!addon.self.disabled && (e.ctrlKey || e.metaKey)) {
      e.cancelBubble = true;
      e.preventDefault();
      if (isMuted()) {
        setVol(getDefVol());
        icon.style.display = "none";
      } else {
        setVol(0);
        icon.style.display = "block";
      }
    }
  };
  addon.self.addEventListener("disabled", () => {
    setVol(1);
    icon.style.display = "none";
  });

  while (true) {
    let button = await addon.tab.waitForElement("[class^='green-flag_green-flag']", {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
    });
    addon.tab.appendToSharedSpace({ space: "afterStopButton", element: icon, order: 0 });
    setup(vm);
    button.addEventListener("click", toggleMute);
    button.addEventListener("contextmenu", toggleMute);
  }
}
