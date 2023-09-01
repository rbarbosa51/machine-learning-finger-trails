import {HandLandmarker, FilesetResolver} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const video = document.getElementById("webcam") ;
const image = document.getElementById('canvasImage');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startWebcamBtn = document.getElementById('startWebcamBtn');
let handLandmarker = null;
const heartArray = [];
const maxHearts = 25;
let lastVideoTime = -1;
let results = undefined;
let runningMode = "IMAGE";

const btnLabels = {
  start: 'Start Cam',
  stop: 'Stop Predicting'
}

async function createHandLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: runningMode,
    numHands: 2
  });
  
};
createHandLandmarker();
if (!!navigator.mediaDevices?.getUserMedia){
  startWebcamBtn.addEventListener('click', enableCam);
} else {
  alert('UserMedia() is not supported by browser');
}

function enableCam(e) {
  //Wait if finish loading (CDN)
  if (!handLandmarker) {
    //wait load not completed
    return;
  }
  if (startWebcamBtn.innerText === btnLabels.start){
   startWebcamBtn.innerText = btnLabels.stop; 
  } else {
    startWebcamBtn.innerText = btnLabels.start;
  }
  navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
    video.srcObject = stream;
    video.addEventListener('loadeddata', predictWebcam)
  });
}

async function predictWebcam() {
  //todo add a loading - please wait prompt

}