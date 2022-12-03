/* inserted by pull.js */
import _twAsset0 from "!url-loader!./icons/close.svg";
import _twAsset1 from "!url-loader!./icons/debug.svg";
import _twAsset2 from "!url-loader!./icons/delete.svg";
import _twAsset3 from "!url-loader!./icons/download-white.svg";
import _twAsset4 from "!url-loader!./icons/error.svg";
import _twAsset5 from "!url-loader!./icons/logs.svg";
import _twAsset6 from "!url-loader!./icons/performance.svg";
import _twAsset7 from "!url-loader!./icons/play.svg";
import _twAsset8 from "!url-loader!./icons/step.svg";
import _twAsset9 from "!url-loader!./icons/subthread.svg";
import _twAsset10 from "!url-loader!./icons/threads.svg";
import _twAsset11 from "!url-loader!./icons/warning.svg";
const _twGetAsset = (path) => {
  if (path === "/icons/close.svg") return _twAsset0;
  if (path === "/icons/debug.svg") return _twAsset1;
  if (path === "/icons/delete.svg") return _twAsset2;
  if (path === "/icons/download-white.svg") return _twAsset3;
  if (path === "/icons/error.svg") return _twAsset4;
  if (path === "/icons/logs.svg") return _twAsset5;
  if (path === "/icons/performance.svg") return _twAsset6;
  if (path === "/icons/play.svg") return _twAsset7;
  if (path === "/icons/step.svg") return _twAsset8;
  if (path === "/icons/subthread.svg") return _twAsset9;
  if (path === "/icons/threads.svg") return _twAsset10;
  if (path === "/icons/warning.svg") return _twAsset11;
  throw new Error(`Unknown asset: ${path}`);
};

import { onPauseChanged, isPaused } from "./module.js";

export default async function createPerformanceTab({ debug, addon, console, msg }) {
  const vm = addon.tab.traps.vm;

  await addon.tab.loadScript(_twGetAsset("/thirdparty/cs/chart.min.js"));

  const tab = debug.createHeaderTab({
    text: msg("tab-performance"),
    icon: _twGetAsset("/icons/performance.svg"),
  });

  const content = Object.assign(document.createElement("div"), {
    className: "sa-performance-tab-content",
  });

  const createChart = ({ title }) => {
    const titleElement = Object.assign(document.createElement("h2"), {
      textContent: title,
    });
    const canvas = Object.assign(document.createElement("canvas"), {
      className: "sa-debugger-chart",
    });
    return {
      title: titleElement,
      canvas,
    };
  };

  const now = () => performance.now();

  const getMaxFps = () => Math.round(1000 / vm.runtime.currentStepTime);

  const NUMBER_OF_POINTS = 20;
  // An array like [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  const labels = Array.from(Array(NUMBER_OF_POINTS).keys()).reverse();

  const fpsElements = createChart({
    title: msg("performance-framerate-title"),
  });
  const fpsChart = new Chart(fpsElements.canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data: Array(NUMBER_OF_POINTS).fill(-1),
          borderWidth: 1,
          fill: true,
          backgroundColor: "#29beb8",
        },
      ],
    },
    options: {
      scales: {
        y: {
          max: getMaxFps(),
          min: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => msg("performance-framerate-graph-tooltip", { fps: context.parsed.y }),
          },
        },
      },
    },
  });

  const clonesElements = createChart({
    title: msg("performance-clonecount-title"),
  });
  const performanceClonesChart = new Chart(clonesElements.canvas.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data: Array(NUMBER_OF_POINTS).fill(-1),
          borderWidth: 1,
          fill: true,
          backgroundColor: "#29beb8",
        },
      ],
    },
    options: {
      scales: {
        y: {
          max: 300,
          min: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => msg("performance-clonecount-graph-tooltip", { clones: context.parsed.y }),
          },
        },
      },
    },
  });

  // Holds the times of each frame drawn in the last second.
  // The length of this list is effectively the FPS.
  const renderTimes = [];

  // The last time we pushed a new datapoint to the graph
  let lastFpsTime = now() + 3000;

  debug.addAfterStepCallback(() => {
    if (isPaused()) {
      return;
    }
    const time = now();

    // Remove all frame times older than 1 second in renderTimes
    while (renderTimes.length > 0 && renderTimes[0] <= time - 1000) renderTimes.shift();
    renderTimes.push(time);

    if (time - lastFpsTime > 1000) {
      lastFpsTime = time;

      const maxFps = getMaxFps();
      const fpsData = fpsChart.data.datasets[0].data;
      fpsData.shift();
      fpsData.push(Math.min(renderTimes.length, maxFps));
      // Incase we switch between 30FPS and 60FPS, update the max height of the chart.
      fpsChart.options.scales.y.max = maxFps;

      const clonesData = performanceClonesChart.data.datasets[0].data;
      clonesData.shift();
      clonesData.push(vm.runtime._cloneCounter);

      if (isVisible) {
        fpsChart.update();
        performanceClonesChart.update();
      }
    }
  });

  content.appendChild(fpsElements.title);
  content.appendChild(fpsElements.canvas);
  content.appendChild(clonesElements.title);
  content.appendChild(clonesElements.canvas);

  let pauseTime = 0;
  onPauseChanged((paused) => {
    if (paused) {
      pauseTime = now();
    } else {
      const dt = now() - pauseTime;
      lastFpsTime += dt;
      for (var i = 0; i < renderTimes.length; i++) {
        renderTimes[i] += dt;
      }
    }
  });

  let isVisible = false;
  const show = () => {
    isVisible = true;
  };
  const hide = () => {
    isVisible = false;
  };

  return {
    tab,
    content,
    buttons: [],
    show,
    hide,
  };
}
