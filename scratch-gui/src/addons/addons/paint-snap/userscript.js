import { isSelectTool, updateSelectTool } from "./updateSelectTool.js";
import { enable, disable, loadSettings, setGuideColor, toggle } from "./state.js";
import { initUI } from "./ui.js";
import { updateScaleTool } from "./updateScaleTool.js";

/** @type {(api: import("../../addon-api/content-script/typedef").UserscriptUtilities) => Promise<void>} */
export default async function (api) {
  const { addon } = api;
  addon.self.addEventListener("disabled", disable);
  addon.self.addEventListener("reenabled", enable);
  loadSettings(addon);
  const paper = await addon.tab.traps.getPaper();
<<<<<<< HEAD

  // Find the select tool in paper.tools (OmniBlocks-Paint may change tool order or structure)
  let selectTool = null;
  if (Array.isArray(paper.tools)) {
    selectTool = paper.tools.find(t => isSelectTool(t));
    // fallback: if not found, use first tool
    if (!selectTool && paper.tools.length > 0) selectTool = paper.tools[0];
  } else if (paper.tool && isSelectTool(paper.tool)) {
    selectTool = paper.tool;
  }
=======
  const [tool] = paper.tools;
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

  toggle(addon.settings.get("enable-default"));
  setGuideColor(addon.settings.get("guide-color"));
  addon.settings.addEventListener("change", () => setGuideColor(addon.settings.get("guide-color")));

<<<<<<< HEAD
  if (selectTool && isSelectTool(selectTool)) {
    updateSelectTool(paper, selectTool, addon.tab.traps.vm);
    updateScaleTool(paper, selectTool, addon.tab.traps.vm);
=======
  if (isSelectTool(tool)) {
    updateSelectTool(paper, tool, addon.tab.traps.vm);
    updateScaleTool(paper, tool, addon.tab.traps.vm);
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
  }
  initUI(api);
}
