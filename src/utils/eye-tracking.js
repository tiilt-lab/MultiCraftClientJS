import "@tensorflow/tfjs-backend-webgl";
import { load } from "@tensorflow-models/face-landmarks-detection";

const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const LEFT_KEYPOINTS = [362, 263];
const RIGHT_KEYPOINTS = [33, 133];
const LEFT_THRESH = 1.05;
const RIGHT_THRESH = 0.95;

function getDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

// change later to use annotations?
function getDirection(keypoints) {
  const leftCenter = keypoints[NUM_KEYPOINTS];
  const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS];
  const leftThresh = LEFT_THRESH;
  const rightThresh = RIGHT_THRESH;
  const leftRatio =
    getDistance(leftCenter, keypoints[LEFT_KEYPOINTS[0]]) /
    getDistance(leftCenter, keypoints[LEFT_KEYPOINTS[1]]);
  const rightRatio =
    getDistance(rightCenter, keypoints[RIGHT_KEYPOINTS[0]]) /
    getDistance(rightCenter, keypoints[RIGHT_KEYPOINTS[1]]);
  return leftRatio > leftThresh && rightRatio > leftThresh
    ? "Left"
    : leftRatio < rightThresh && rightRatio < rightThresh
    ? "Right"
    : "Center";
}

async function startStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: "user" },
  });

  return stream;
}

async function startVideo(videoElement) {
  videoElement.srcObject = await startStream();
  await videoElement.play();
  console.log("[eye-tracking] Started webcam");
}

async function loadModel() {
  return await load("mediapipe-facemesh", { maxFaces: 1 });
}

async function trackEyes(model, video) {
  const predictions = await model.estimateFaces({
    input: video,
    flipHorizontal: false,
  });
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    const direction = getDirection(keypoints);
    return direction;
  }
  return null;
}

export { loadModel, startVideo, trackEyes };
