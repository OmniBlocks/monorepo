/* inserted by pull.js */
import _twAsset0 from "!url-loader!./pause.svg";
import _twAsset1 from "!url-loader!./play.svg";
const _twGetAsset = (path) => {
  if (path === "/pause.svg") return _twAsset0;
  if (path === "/play.svg") return _twAsset1;
  throw new Error(`Unknown asset: ${path}`);
};

import { isPaused, setPaused, onPauseChanged, setup } from "../debugger/module.js";

export default async function ({ addon, console, msg }) {
  setup(addon.tab.traps.vm);

  const img = document.createElement("img");
  img.className = "pause-btn";
  img.draggable = false;
  img.title = msg("pause");

  const setSrc = () => (img.src = _twGetAsset((isPaused() ? "/play.svg" : "/pause.svg")));
  img.addEventListener("click", () => setPaused(!isPaused()));
  addon.tab.displayNoneWhileDisabled(img);
  addon.self.addEventListener("disabled", () => setPaused(false));
  setSrc();
  onPauseChanged(setSrc);

  while (true) {
    await addon.tab.waitForElement("[class^='green-flag']", {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
    });
    addon.tab.appendToSharedSpace({ space: "afterGreenFlag", element: img, order: 0 });
  }
}
