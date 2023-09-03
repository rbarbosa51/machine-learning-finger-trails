import {
  HandLandmarker,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
import Heart from "./Heart.js";

const video = document.getElementById("webcam");
const image = document.getElementById("canvasImage");
const canvas = document.getElementById("canvas");
const wait = document.getElementById("wait");
const ctx = canvas.getContext("2d");
const startWebcamBtn = document.getElementById("startWebcamBtn");
let handLandmarker = null;
const heartArray = [];
const maxHearts = 25;
let lastVideoTime = -1;
let results = undefined;
let runningMode = "IMAGE";

async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2,
  });
}
createHandLandmarker();
//es
if (!!navigator.mediaDevices?.getUserMedia) {
  startWebcamBtn.addEventListener("click", enableCam);
} else {
  alert("UserMedia() is not supported by browser");
}

function enableCam() {
  wait.style.display = "flex";
  if (!handLandmarker) {
    alert(
      "Error: handlandarker was not loaded! Please try again in a few seconds",
    );
    wait.style.display = "none";
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
  startWebcamBtn.disabled = true;
}

async function predictWebcam() {
  wait.style.display = "none";
  canvas.style.width = video.videoWidth;
  canvas.style.height = video.videoHeight;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await handLandmarker.setOptions({ runningMode: "VIDEO" });
  }
  const startTime = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTime);
  }
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      // eslint-disable-next-line
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#007f8b",
        lineWidth: 5,
      });
      const x = landmarks[8].x;
      const y = landmarks[8].y;
      if (heartArray.length > maxHearts) {
        heartArray.pop();
      }
      const heart = new Heart(canvas, ctx, image, x, y);
      heartArray.unshift(heart);
      heartArray.forEach((heart, i) => {
        heart.draw(1 - i / maxHearts);
      });
    }
  }
  ctx.restore();
  requestAnimationFrame(predictWebcam);
}
