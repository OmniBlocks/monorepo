import downloadBlob from "../../libraries/common/cs/download-blob.js";
import recordIcon from "./record.svg";

export default async ({ addon, console, msg }) => {
  let recordElem;
  let isRecording = false;
  let isWaitingForFlag = false;
  let waitingForFlagFunc = null;
  let abortController = null;
  let stopSignFunc = null;
  let recordBuffer = [];
  let recorder;
  let timeout;
  let ffmpeg = null;

  // Determine supported formats
  const supportedMimeTypes = [
    "video/webm; codecs=vp9",
    "video/webm",
    "video/mp4",
  ].filter((i) => MediaRecorder.isTypeSupported(i));
  
  const defaultMimeType = supportedMimeTypes[0];
  const defaultFileExtension = defaultMimeType.split(";")[0].split("/")[1];
  
  // Available formats for dropdown
  const availableFormats = [];
  if (supportedMimeTypes.some(m => m.startsWith("video/webm"))) {
    availableFormats.push("webm");
  }
  if (supportedMimeTypes.some(m => m.startsWith("video/mp4"))) {
    availableFormats.push("mp4");
  }

  // Load FFmpeg.wasm only when needed
  // Load FFmpeg.wasm v0.12.x (matches package.json)
// Load FFmpeg.wasm v0.12.x (matches package.json)
const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // Use v0.12.10 which has stable libx264 support
    script.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.min.js";
    script.onload = async () => {
      try {
        const { FFmpeg } = window.FFmpeg || {};
        if (!FFmpeg) {
          throw new Error("FFmpeg UMD bundle not found on window.FFmpeg");
        }
        ffmpeg = new FFmpeg();
        
        // Set up logging
        ffmpeg.on('log', ({ message }) => {
          console.log('FFmpeg:', message);
        });
        
        // Load with multi-threaded core
        await ffmpeg.load({
          coreURL: "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.js",
          wasmURL: "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.wasm",
          workerURL: "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.6/dist/esm/ffmpeg-core.worker.js"
        });
        
        console.log('FFmpeg v0.12 loaded successfully');
        resolve(ffmpeg);
      } catch (error) {
        console.error('FFmpeg load error:', error);
        reject(error);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

  while (true) {
    const elem = await addon.tab.waitForElement('div[class*="menu-bar_file-group"] > div:last-child:not(.sa-record)', {
      markAsSeen: true,
      reduxEvents: ["scratch-gui/mode/SET_PLAYER", "fontsLoaded/SET_FONTS_LOADED", "scratch-gui/locales/SELECT_LOCALE"],
    });
    
    const getOptions = () => {
      const { backdrop, container, content, closeButton, remove } = addon.tab.createModal(msg("option-title"), {
        isOpen: true,
        useEditorClasses: true,
      });
      container.classList.add("mediaRecorderPopup");
      content.classList.add("mediaRecorderPopupContent");

      content.appendChild(
        Object.assign(document.createElement("p"), {
          textContent: msg("record-description", {
            extension: `.${defaultFileExtension}`,
          }),
          className: "recordOptionDescription",
        })
      );

      // Format selection dropdown
      if (availableFormats.length > 1) {
        const recordOptionFormat = document.createElement("p");
        const recordOptionFormatLabel = Object.assign(document.createElement("label"), {
          htmlFor: "recordOptionFormatInput",
          textContent: msg("format"),
        });
        const recordOptionFormatInput = Object.assign(document.createElement("select"), {
          id: "recordOptionFormatInput",
        });
        availableFormats.forEach(format => {
          const option = document.createElement("option");
          option.value = format;
          option.textContent = format.toUpperCase();
          if (format === defaultFileExtension) option.selected = true;
          recordOptionFormatInput.appendChild(option);
        });
        recordOptionFormat.appendChild(recordOptionFormatLabel);
        recordOptionFormat.appendChild(recordOptionFormatInput);
        content.appendChild(recordOptionFormat);
      }

      // Seconds
      const recordOptionSeconds = document.createElement("p");
      const recordOptionSecondsInput = Object.assign(document.createElement("input"), {
        type: "number",
        min: 1,
        max: 600,
        defaultValue: 30,
        id: "recordOptionSecondsInput",
        className: addon.tab.scratchClass("prompt_variable-name-text-input"),
      });
      const recordOptionSecondsLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionSecondsInput",
        textContent: msg("record-duration"),
      });
      recordOptionSeconds.appendChild(recordOptionSecondsLabel);
      recordOptionSeconds.appendChild(recordOptionSecondsInput);
      content.appendChild(recordOptionSeconds);

      // Delay
      const recordOptionDelay = document.createElement("p");
      const recordOptionDelayInput = Object.assign(document.createElement("input"), {
        type: "number",
        min: 0,
        max: 600,
        defaultValue: 0,
        id: "recordOptionDelayInput",
        className: addon.tab.scratchClass("prompt_variable-name-text-input"),
      });
      const recordOptionDelayLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionDelayInput",
        textContent: msg("start-delay"),
      });
      recordOptionDelay.appendChild(recordOptionDelayLabel);
      recordOptionDelay.appendChild(recordOptionDelayInput);
      content.appendChild(recordOptionDelay);

      // Audio
      const recordOptionAudio = Object.assign(document.createElement("p"), {
        className: "mediaRecorderPopupOption",
      });
      const recordOptionAudioInput = Object.assign(document.createElement("input"), {
        type: "checkbox",
        defaultChecked: true,
        id: "recordOptionAudioInput",
      });
      const recordOptionAudioLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionAudioInput",
        textContent: msg("record-audio"),
        title: msg("record-audio-description"),
      });
      recordOptionAudio.appendChild(recordOptionAudioInput);
      recordOptionAudio.appendChild(recordOptionAudioLabel);
      content.appendChild(recordOptionAudio);

      // Mic
      const recordOptionMic = Object.assign(document.createElement("p"), {
        className: "mediaRecorderPopupOption",
      });
      const recordOptionMicInput = Object.assign(document.createElement("input"), {
        type: "checkbox",
        defaultChecked: false,
        id: "recordOptionMicInput",
      });
      const recordOptionMicLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionMicInput",
        textContent: msg("record-mic"),
      });
      recordOptionMic.appendChild(recordOptionMicInput);
      recordOptionMic.appendChild(recordOptionMicLabel);
      content.appendChild(recordOptionMic);

      // Green flag    
      const recordOptionFlag = Object.assign(document.createElement("p"), {
        className: "mediaRecorderPopupOption",
      });
      const recordOptionFlagInput = Object.assign(document.createElement("input"), {
        type: "checkbox",
        defaultChecked: true,
        id: "recordOptionFlagInput",
      });
      const recordOptionFlagLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionFlagInput",
        textContent: msg("record-after-flag"),
      });
      recordOptionFlag.appendChild(recordOptionFlagInput);
      recordOptionFlag.appendChild(recordOptionFlagLabel);
      content.appendChild(recordOptionFlag);

      // Stop sign
      const recordOptionStop = Object.assign(document.createElement("p"), {
        className: "mediaRecorderPopupOption",
      });
      const recordOptionStopInput = Object.assign(document.createElement("input"), {
        type: "checkbox",
        defaultChecked: true,
        id: "recordOptionStopInput",
      });
      const recordOptionStopLabel = Object.assign(document.createElement("label"), {
        htmlFor: "recordOptionStopInput",
        textContent: msg("record-until-stop"),
      });
      recordOptionFlagInput.addEventListener("change", () => {
        const disabled = (recordOptionStopInput.disabled = !recordOptionFlagInput.checked);
        if (disabled) {
          recordOptionStopLabel.title = msg("record-until-stop-disabled", {
            afterFlagOption: msg("record-after-flag"),
          });
        }
      });
      recordOptionStop.appendChild(recordOptionStopInput);
      recordOptionStop.appendChild(recordOptionStopLabel);
      content.appendChild(recordOptionStop);

      let resolvePromise = null;
      const optionPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      let handleOptionClose = null;

      backdrop.addEventListener("click", () => handleOptionClose(null));
      closeButton.addEventListener("click", () => handleOptionClose(null));

      handleOptionClose = (value) => {
        resolvePromise(value);
        remove();
      };

      const buttonRow = Object.assign(document.createElement("div"), {
        className: addon.tab.scratchClass("prompt_button-row", { others: "mediaRecorderPopupButtons" }),
      });
      const cancelButton = Object.assign(document.createElement("button"), {
        textContent: msg("cancel"),
      });
      cancelButton.addEventListener("click", () => handleOptionClose(null), { once: true });
      buttonRow.appendChild(cancelButton);
      const startButton = Object.assign(document.createElement("button"), {
        textContent: msg("start"),
        className: addon.tab.scratchClass("prompt_ok-button"),
      });
      startButton.addEventListener(
        "click",
        () =>
          handleOptionClose({
            secs: Number(recordOptionSecondsInput.value),
            delay: Number(recordOptionDelayInput.value),
            audioEnabled: recordOptionAudioInput.checked,
            micEnabled: recordOptionMicInput.checked,
            waitUntilFlag: recordOptionFlagInput.checked,
            useStopSign: !recordOptionStopInput.disabled && recordOptionStopInput.checked,
            format: availableFormats.length > 1 ? recordOptionFormatInput.value : defaultFileExtension,
          }),
        { once: true }
      );
      buttonRow.appendChild(startButton);
      content.appendChild(buttonRow);

      return optionPromise;
    };
    
    const disposeRecorder = () => {
      isRecording = false;
      recordElem.textContent = msg("record");
      recordElem.title = "";
      recorder = null;
      recordBuffer = [];
      clearTimeout(timeout);
      timeout = 0;
      if (stopSignFunc) {
        addon.tab.traps.vm.runtime.off("PROJECT_STOP_ALL", stopSignFunc);
        stopSignFunc = null;
      }
    };
    // Helper function to detect frame rate from video
const detectFrameRate = async (ffmpeg, inputName) => {
  try {
    let probeOutput = '';
    const logHandler = ({ message }) => {
      probeOutput += message + '\n';
    };
    
    ffmpeg.on('log', logHandler);
    
    try {
      await ffmpeg.exec(['-i', inputName, '-hide_banner']);
    } catch (e) {
      // ffmpeg exits with error code when no output specified
    }
    
    ffmpeg.off('log', logHandler);
    
    // Parse fps
    const fpsMatch = probeOutput.match(/(\d+(?:\.\d+)?)\s*fps/i);
    if (fpsMatch) {
      const fps = parseFloat(fpsMatch[1]);
      console.log(`Detected frame rate: ${fps} fps`);
      return fps;
    }
    
    const rateMatch = probeOutput.match(/(\d+)\/(\d+)\s*fps/);
    if (rateMatch) {
      const fps = parseInt(rateMatch[1]) / parseInt(rateMatch[2]);
      console.log(`Detected frame rate: ${fps} fps`);
      return fps;
    }
  } catch (error) {
    console.warn('FPS detection failed:', error);
  }
  return null;
};

const convertWebmToMp4 = async (webmBlob) => {
  try {
    console.log('=== Starting conversion ===');
    console.log('Input size:', webmBlob.size, 'bytes');
    
    const ffmpeg = await loadFFmpeg();
    const inputName = 'input.webm';
    const outputName = 'output.mp4';
    
    // Write input file using v0.12 API
    const arrayBuffer = await webmBlob.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));
    console.log('Input file written');
    
    // Detect FPS
    const detectedFps = await detectFrameRate(ffmpeg, inputName);
    const fps = detectedFps || 30;
    console.log(`Using ${fps} fps`);
    
    // Convert with H.264 encoding
    console.log('Starting ffmpeg encoding...');
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-r', fps.toString(),
      '-g', '30',
      '-movflags', '+faststart',
      '-c:a', 'aac', '-b:a', '128k',
      outputName
    ]);
    console.log('Encoding complete');
    
    // Read output using v0.12 API
    const data = await ffmpeg.readFile(outputName);
    console.log('Output size:', data.length, 'bytes');
    
    // Clean up
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    const outputBlob = new Blob([data.buffer], { type: 'video/mp4' });
    console.log('=== Conversion successful ===');
    return outputBlob;
  } catch (error) {
    console.error('=== Conversion FAILED ===');
    console.error(error);
    throw error;
  }
};
    const stopRecording = async (force, selectedFormat) => {
      if (isWaitingForFlag) {
        addon.tab.traps.vm.runtime.off("PROJECT_START", waitingForFlagFunc);
        isWaitingForFlag = false;
        waitingForFlagFunc = null;
        abortController.abort();
        abortController = null;
        disposeRecorder();
        return;
      }
      if (!isRecording || !recorder || recorder.state === "inactive") return;
      
      if (force) {
        disposeRecorder();
      } else {
        recorder.onstop = async () => {
          let blob = new Blob(recordBuffer, { type: recorder.mimeType });
          let finalExtension = recorder.mimeType.split(";")[0].split("/")[1];
          
          // Convert to MP4 if requested and not native
          if (selectedFormat === "mp4" && !recorder.mimeType.includes("mp4")) {
            try {
              recordElem.textContent = msg("converting");
              blob = await convertWebmToMp4(blob);
              finalExtension = "mp4";
            } catch (e) {
              console.error("WebM to MP4 conversion failed", e);
              alert(msg("conversion-failed"));
              // Fall back to original format
              finalExtension = recorder.mimeType.split(";")[0].split("/")[1];
            }
          }
          
          downloadBlob(`${addon.tab.redux.state?.preview?.projectInfo?.title || "video"}.${finalExtension}`, blob);
          disposeRecorder();
        };
        recorder.stop();
      }
    };
    
    const startRecording = async (opts) => {
      // Timer
      const secs = Math.min(600, Math.max(1, opts.secs));

      // Initialize MediaRecorder
      recordBuffer = [];
      isRecording = true;
      const vm = addon.tab.traps.vm;
      let micStream;
      if (opts.micEnabled) {
        // Show permission dialog before green flag is clicked
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          if (e.name !== "NotAllowedError" && e.name !== "NotFoundError") throw e;
          opts.micEnabled = false;
        }
      }
      if (opts.waitUntilFlag) {
        isWaitingForFlag = true;
        Object.assign(recordElem, {
          textContent: msg("click-flag"),
          title: msg("click-flag-description"),
        });
        abortController = new AbortController();
        try {
          await Promise.race([
            new Promise((resolve) => {
              waitingForFlagFunc = () => resolve();
              vm.runtime.once("PROJECT_START", waitingForFlagFunc);
            }),
            new Promise((_, reject) => {
              abortController.signal.addEventListener("abort", () => reject("aborted"), { once: true });
            }),
          ]);
        } catch (e) {
          if (e.message === "aborted") return;
          throw e;
        }
      }
      isWaitingForFlag = false;
      waitingForFlagFunc = abortController = null;
      const stream = new MediaStream();
      const videoStream = vm.runtime.renderer.canvas.captureStream();
      stream.addTrack(videoStream.getVideoTracks()[0]);

      const ctx = new AudioContext();
      const dest = ctx.createMediaStreamDestination();
      if (opts.audioEnabled) {
        const mediaStreamDestination = vm.runtime.audioEngine.audioContext.createMediaStreamDestination();
        vm.runtime.audioEngine.inputNode.connect(mediaStreamDestination);
        const audioSource = ctx.createMediaStreamSource(mediaStreamDestination.stream);
        audioSource.connect(dest);
      }
      if (opts.micEnabled) {
        const micSource = ctx.createMediaStreamSource(micStream);
        micSource.connect(dest);
      }
      if (opts.audioEnabled || opts.micEnabled) {
        stream.addTrack(dest.stream.getAudioTracks()[0]);
      }
      
// Determine recording format
const selectedFormat = opts.format || defaultFileExtension;
let recordMimeType;

if (selectedFormat === "mp4") {
  // Try MP4 with specific codec support for audio
  const mp4WithCodecs = "video/mp4; codecs=avc1,mp4a.40.2";
  if (MediaRecorder.isTypeSupported(mp4WithCodecs)) {
    recordMimeType = mp4WithCodecs;
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    recordMimeType = "video/mp4";
  } else {
    // Fall back to WebM if MP4 not supported
    recordMimeType = supportedMimeTypes.find(m => m.startsWith("video/webm")) || defaultMimeType;
  }
} else {
  recordMimeType = supportedMimeTypes.find(m => m.startsWith("video/webm")) || defaultMimeType;
}
      
      recorder = new MediaRecorder(stream, { mimeType: recordMimeType });
      recorder.ondataavailable = (e) => {
        recordBuffer.push(e.data);
      };
      recorder.onerror = (e) => {
        console.warn("Recorder error:", e.error);
        stopRecording(true);
      };
      timeout = setTimeout(() => stopRecording(false, selectedFormat), secs * 1000);
      if (opts.useStopSign) {
        stopSignFunc = () => stopRecording(false, selectedFormat);
        vm.runtime.once("PROJECT_STOP_ALL", stopSignFunc);
      }

      // Delay
      const delay = opts.delay || 0;
      const roundedDelay = Math.floor(delay);
      for (let index = 0; index < roundedDelay; index++) {
        recordElem.textContent = msg("starting-in", { secs: roundedDelay - index });
        await new Promise((resolve) => setTimeout(resolve, 975));
      }
      setTimeout(
        () => {
          recordElem.textContent = msg("stop");
          recorder.start(1000);
        },
        (delay - roundedDelay) * 1000
      );
    };

    if (!recordElem) {
      recordElem = Object.assign(document.createElement("div"), {
        className: "sa-record " + elem.className,
      });
      const icon = Object.assign(document.createElement("img"), {
        src: recordIcon,
        className: "sa-record-icon",
      });
      recordElem.appendChild(icon);
      const text = Object.assign(document.createElement("span"), {
        textContent: msg("record"),
      });
      recordElem.appendChild(text);
      recordElem.addEventListener("click", async () => {
        if (isRecording) {
          // Get selected format from options if available
          const formatInput = document.getElementById("recordOptionFormatInput");
          const selectedFormat = formatInput ? formatInput.value : defaultFileExtension;
          stopRecording(false, selectedFormat);
        } else {
          const opts = await getOptions();
          if (!opts) {
            console.log("Canceled");
            return;
          }
          startRecording(opts);
        }
      });
    }

    elem.parentElement.appendChild(recordElem);
  }
};
