import DevTools from "./DevTools.js";

export default async function ({ addon, global, console, msg, safeMsg: m }) {
  const devTools = new DevTools(addon, msg, m);
  devTools.init();
}
