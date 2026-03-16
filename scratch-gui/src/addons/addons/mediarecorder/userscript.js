import downloadBlob from "../../libraries/common/cs/download-blob.js";
import recordIcon from "./record.svg";

export default async ({ addon, console, msg }) => {
  let recordElem;
  let recordTextSpan;
  let isRecording = false;
  let isWaitingForFlag = false;
  let waitingForFlagFunc = null;
  let abortController = null;
  let stopSignFunc = null;
  let recordBuffer = [];
  let recorder;
  let timeout;
  let ffmpeg = null;
  let persistedSelectedFormat = null;

  // Determine supported formats
  const supportedMimeTypes = [
    "video/webm; codecs=vp9",
    "video/webm",
    "video/mp4",
  ].filter((i) => MediaRecorder.isTypeSupported(i));
  
  const defaultMimeType = supportedMimeTypes[0];
  const defaultFileExtension = defaultMimeType.split(";")[0].split("/")[1];
  
  // Available formats for dropdown
  const availableFormats = ["webm", "mp4"];

  // Load FFmpeg.wasm only when needed
  // Load FFmpeg.wasm v0.12.x (matches package.json)
// Load FFmpeg.wasm v0.12.x from static bundled files
const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = "/ffmpeg/ffmpeg.min.js";
    script.onload = async () => {
      try {
        const { FFmpeg } = window.FFmpegWASM || window.FFmpeg || {};
        if (!FFmpeg) {
          throw new Error("FFmpeg UMD bundle not found on window");
        }
        ffmpeg = new FFmpeg();
        
        // Set up logging
        ffmpeg.on('log', ({ message }) => {
          console.log('FFmpeg:', message);
        });
        
        // Auto detect whether we can use multithreading
        const useMt = window.crossOriginIsolated;
        const coreType = useMt ? 'core-mt' : 'core';
        
        await ffmpeg.load({
          coreURL: `/ffmpeg/${coreType}/ffmpeg-core.js`,
          wasmURL: `/ffmpeg/${coreType}/ffmpeg-core.wasm`,
          workerURL: useMt ? `/ffmpeg/${coreType}/ffmpeg-core.worker.js` : undefined
        });
        
        console.log('FFmpeg loaded successfully. Multithreading:', useMt);
        resolve(ffmpeg);
      } catch (error) {
        console.error('FFmpeg load error:', error);
        ffmpeg = null;
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
      recordTextSpan.textContent = msg("record");
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
    let fps = null;
    const fpsMatch = probeOutput.match(/(\d+(?:\.\d+)?)\s*fps/i);
    if (fpsMatch) {
      fps = parseFloat(fpsMatch[1]);
    } else {
      const rateMatch = probeOutput.match(/(\d+)\/(\d+)\s*fps/);
      if (rateMatch) fps = parseInt(rateMatch[1]) / parseInt(rateMatch[2]);
    }
    if (fps) console.log(`Detected frame rate: ${fps} fps`);
    return fps;
  } catch (error) {
    console.warn('FPS detection failed:', error);
  }
  return null;
};

const convertVideo = async (inputBlob, inputExt, outputExt, onProgress) => {
  try {
    console.log(`=== Starting conversion from ${inputExt} to ${outputExt} ===`);
    console.log('Input size:', inputBlob.size, 'bytes');
    
    const ffmpeg = await loadFFmpeg();
    const inputName = `input.${inputExt}`;
    const outputName = `output.${outputExt}`;
    
    // Write input file using v0.12 API
    const arrayBuffer = await inputBlob.arrayBuffer();
    await ffmpeg.writeFile(inputName, new Uint8Array(arrayBuffer));
    console.log('Input file written');
    
    // Determine FPS and duration if we have to re-encode
    let fps = 30;
    let duration = 0;
    
    // Wire up a custom log interceptor to extract frame count on the fly
    let totalFramesKnown = false;
    let estimatedTotalFrames = 30 * 10; // Fallback: Assume ~10 second clip initially
    
    const initialLogHandler = ({ message }) => {
      const durationMatch = message.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (durationMatch) {
         let hrs = parseFloat(durationMatch[1]);
         let mins = parseFloat(durationMatch[2]);
         let secs = parseFloat(durationMatch[3]);
         let totalSecs = hrs*3600 + mins*60 + secs;
         estimatedTotalFrames = Math.max(1, Math.floor(totalSecs * fps));
         totalFramesKnown = true;
      }
    };
    ffmpeg.on('log', initialLogHandler);
    
    if (inputExt !== outputExt) {
      const detectedFps = await detectFrameRate(ffmpeg, inputName);
      fps = detectedFps || 30;
      console.log(`Using ${fps} fps`);
      
      // Fast initial pass to count frames
      if (onProgress) onProgress(0.05); // Give short bump
      console.log('Counting total frames prior to encode...');
      try {
        let frameCountOutput = '';
        const countHandler = ({ message }) => { frameCountOutput += message + '\n'; };
        ffmpeg.on('log', countHandler);
        try {
          await ffmpeg.exec(['-err_detect', 'ignore_err', '-i', inputName, '-f', 'null', '-c', 'copy', '-']);
        } finally {
          ffmpeg.off('log', countHandler);
        }

        const frameMatches = [...frameCountOutput.matchAll(/frame=\s*(\d+)/g)];
        if (frameMatches && frameMatches.length > 0) {
          const highestFrame = parseInt(frameMatches[frameMatches.length - 1][1]);
          if (highestFrame > 0) {
            estimatedTotalFrames = highestFrame;
            totalFramesKnown = true;
            console.log(`Pre-counted exactly ${estimatedTotalFrames} frames!`);
          }
        }
      } catch (countErr) {
         console.warn("Frame count pre-pass failed.", countErr);
      }  
    } else { 
      duration = 1;
    }
    console.log('Starting ffmpeg encoding...');
    let args = [
      '-err_detect', 'ignore_err',
      '-i', inputName
    ];
    
    if (inputExt === outputExt) {
      // Re-mux to fix duration metadata (vital for MediaRecorder output)
      args.push('-c', 'copy');
    } else {
      if (outputExt === 'mp4') {
        args.push(
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-r', fps.toString(),
          '-g', fps.toString(),
          '-movflags', '+faststart',
          '-c:a', 'aac', '-b:a', '128k'
        );
      } else if (outputExt === 'webm') {
        args.push(
          '-c:v', 'libvpx-vp9',
          '-crf', '30',
          '-b:v', '0',
          '-r', fps.toString(),
          '-c:a', 'libopus'
        );
      }
    }
    args.push(outputName);

    // Wire up progress event
    // The ffmpeg 0.12 progress payload sometimes reports 'time' (microseconds) instead of a stable 'progress' float
    // if duration metadata is missing. We will use the 'time' object if available and scale it.
    const progressHandler = ({ progress, time }) => {
      // If we only have time (in microseconds), we track it purely visually without max bound if duration isn't perfectly known
      // If progress exists and is > 0, we can use that float easily
      let pOut = 0;
      if (totalFramesKnown) {
         const currentSecs = time / 1000000;
         const currentFrameNum = currentSecs * fps;
         let calc = currentFrameNum / estimatedTotalFrames;
         pOut = Math.min(0.99, Math.max(0, calc));
      } else {
        if (time && duration > 0) {
          // Use actual duration for accurate time-based progress
          pOut = Math.min(0.95, (time / 1000000) / duration);
        } else if (progress && progress > 0 && progress <= 1) {
          pOut = progress;
        } else if (time && time > 0) {
          // Fallback: visual heartbeat update if tracking isn't locked to 1.0 properly
          // Emulate progress up to ~95% dynamically based on processing time
          pOut = Math.min(0.95, (time / 1000000) / (time / 1000000 + 5)); // Asymptotic progress calculation based on time passed
        }
      }
      if (onProgress) onProgress(pOut);
    };
    ffmpeg.on('progress', progressHandler);

    // Catch execution errors safely
    try {
      await ffmpeg.exec(args);
    } catch(err) {
      console.warn("FFmpeg execution warned/errored, but checking output output anyway...", err);
    } finally {
      ffmpeg.off('log', initialLogHandler);
      ffmpeg.off('progress', progressHandler);
      if (onProgress) onProgress(1.0); // Force 100% at end
    }
    console.log('Encoding complete');
    
    // Read output using v0.12 API
    const data = await ffmpeg.readFile(outputName);
    console.log('Output size:', data.length, 'bytes');
    
    // Clean up
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
    
    const outputMime = outputExt === 'mp4' ? 'video/mp4' : 'video/webm';
    const outputBlob = new Blob([data.buffer], { type: outputMime });
    console.log('=== Conversion successful ===');
    return outputBlob;
  } catch (error) {
    console.error('=== Conversion FAILED ===');
    console.error(error);
    throw error;
  }
};
    const stopRecording = async (force) => {
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
          // Verify we have recorded data
          if (recordBuffer.length === 0) {
            console.error("No data recorded");
            disposeRecorder();
            return;
          }

          let blob = new Blob(recordBuffer, { type: recorder.mimeType });
          let finalExtension = recorder.mimeType.split(";")[0].split("/")[1];
          if (finalExtension.includes("x-matroska")) finalExtension = "webm";
          
          let progressModal = null;
          // Convert to target format if not matching, OR remux to fix metadata duration
          if (persistedSelectedFormat !== finalExtension || finalExtension === "webm" || finalExtension === "mp4") {
            try {
              progressModal = addon.tab.createModal(typeof msg === 'function' ? msg("exporting") || "Exporting Video..." : "Exporting Video...", {
                isOpen: true,
                useEditorClasses: true,
              });
              progressModal.container.classList.add("mediaRecorderPopup");
              progressModal.content.classList.add("mediaRecorderPopupContent");
              if (progressModal.closeButton) progressModal.closeButton.style.display = "none";
              if (progressModal.backdrop) progressModal.backdrop.style.pointerEvents = "none"; // block clicks outside
              
              const progressText = Object.assign(document.createElement("p"), {
                textContent: "Starting video export...",
                className: "recordOptionDescription"
              });
              Object.assign(progressText.style, {
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "15px"
              });
              progressModal.content.appendChild(progressText);
              
              const progressBarContainer = document.createElement("div");
              Object.assign(progressBarContainer.style, {
                width: "100%",
                height: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                borderRadius: "10px",
                overflow: "hidden"
              });
              
              const progressBar = document.createElement("div");
              Object.assign(progressBar.style, {
                width: "0%",
                height: "100%",
                backgroundColor: "#4c97ff",
                transition: "width 0.2s"
              });
              
              progressBarContainer.appendChild(progressBar);
              progressModal.content.appendChild(progressBarContainer);

              // Wait a little bit for UI to catch up
              recordTextSpan.textContent = typeof msg === 'function' ? msg("exporting") || "Exporting Video..." : "Exporting Video...";
              
              // Verify blob size is valid (>0) to avoid FFmpeg crashing on empty files
              if (blob.size === 0) {
                 throw new Error("Cannot convert empty recording buffer.");
              }
              
              // Progress hook
              const onProgress = (p) => {
                 let pct = Math.round(p * 100);
                 if (pct < 0) pct = 0;
                 if (pct > 100) pct = 100;
                 progressBar.style.width = `${pct}%`;
                 const exportingLoc = typeof msg === 'function' && msg("exporting") ? msg("exporting") : "Exporting Video...";
                 progressText.textContent = `${exportingLoc} ${pct}%`;
              };
              
              blob = await convertVideo(blob, finalExtension, persistedSelectedFormat, onProgress);
              finalExtension = persistedSelectedFormat;
            } catch (e) {
              console.error(`Conversion to ${persistedSelectedFormat} failed`, e);
              // Fall back to original format
              finalExtension = recorder.mimeType.split(";")[0].split("/")[1];
              if (finalExtension.includes("x-matroska")) finalExtension = "webm";
            } finally {
              if (progressModal) {
                 progressModal.remove();
              }
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
        recordTextSpan.textContent = msg("click-flag");
        recordElem.title = msg("click-flag-description");
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
      // Persist the user's chosen format for use during stop/timeout handlers
      persistedSelectedFormat = selectedFormat;
      
      timeout = setTimeout(() => stopRecording(false), secs * 1000);
      if (opts.useStopSign) {
        stopSignFunc = () => stopRecording(false);
        vm.runtime.once("PROJECT_STOP_ALL", stopSignFunc);
      }

      // Delay
      const delay = opts.delay || 0;
      const roundedDelay = Math.floor(delay);
      for (let index = 0; index < roundedDelay; index++) {
        recordTextSpan.textContent = msg("starting-in", { secs: roundedDelay - index });
        await new Promise((resolve) => setTimeout(resolve, 975));
      }
      setTimeout(
        () => {
          recordTextSpan.textContent = msg("stop");
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
      recordTextSpan = Object.assign(document.createElement("span"), {
        textContent: msg("record"),
      });
      recordElem.appendChild(recordTextSpan);
      recordElem.addEventListener("click", async () => {
        if (isRecording) {
          // Use the persisted format from when recording started
          stopRecording(false);
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
