import AddonHooks from '../../hooks.js';
export default async function ({ addon }) {
  AddonHooks.disableRestorePoints = true;
}
