
import './App.css';
import { useState,useRef,useEffect } from 'react';
import * as FaceSDK from "faceplugin"


function App() {
  
  const [mode,setMode] = useState(0);
  const [emotions,seteMotions] = useState({0: "angry", 1: "disgust", 2: "fear", 3: "smile", 4: "sad", 5: "surprise", 6: "neutral"});
  const [detectSession,setDetectSession] = useState(null);
  const [liveSession,setLiveSession] = useState(null);
  const [landmarkSession,setLandmarkSession] = useState(null);
  const [poseSession,setPoseSession] = useState(null);
  const [expressionSession,setExpressionSession] = useState(null);
  const [eyeSession,setEyeSession] = useState(null);
  const [genderSession,setGenderSession] = useState(null);
  const [ageSession,setAgeSession] = useState(null);
  const [featureSession,setFeatureSession] = useState(null);
  const [canvasImg,setCanvasImg] = useState('1.jpg');

  let canvas = useRef();

  const draw = () => {
    const context = canvas.current.getContext("2d");
    const img1 = new Image();
    img1.onload = function () {
      context.drawImage(img1, 0, 0, 640, 480);
    };
    img1.src = canvasImg;
  };
  const changeImage = (e) => {
    setCanvasImg(e.target.value);
  }

  useEffect(() => {
    draw();
  },[canvasImg]);

  useEffect(() => {
    window.onload = function () {
      loadModels();
      draw();
    }
  },[]);

  const loadModels = async () => {
    await FaceSDK.load_opencv();
    let detectSession = await FaceSDK.loadDetectionModel();
    setDetectSession(detectSession);
    let expressionSession = await FaceSDK.loadExpressionModel();
    setExpressionSession(expressionSession);
    let eyeSession = await FaceSDK.loadEyeModel();
    setEyeSession(eyeSession);
    let landmarkSession = await FaceSDK.loadLandmarkModel();
    setLandmarkSession(landmarkSession);
    let liveSession = await FaceSDK.loadLivenessModel();
    setLiveSession(liveSession);
    let poseSession = await FaceSDK.loadPoseModel();
    setPoseSession(poseSession);
    let genderSession = await FaceSDK.loadGenderModel();
    setGenderSession(genderSession);
    let ageSession = await FaceSDK.loadAgeModel();
    setAgeSession(ageSession);
    let featureSession = await FaceSDK.loadFeatureModel();
    setFeatureSession(featureSession);
    
  }

  const detectFace = async () => {
    draw();
    setTimeout(async () => {

      setMode(0);
      const detectionResult = await FaceSDK.detectFace(detectSession, 'live-canvas');

      var bbox = detectionResult.bbox;
      var face_count = bbox.shape[0],
        bbox_size = bbox.shape[1];

      const canvas = document.getElementById('live-canvas');
      const canvasCtx = canvas.getContext('2d');
      canvasCtx.beginPath();

      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(bbox.data[i * bbox_size]),
          y1 = parseInt(bbox.data[i * bbox_size + 1]),
          x2 = parseInt(bbox.data[i * bbox_size + 2]),
          y2 = parseInt(bbox.data[i * bbox_size + 3]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.stroke();
      }

    },100)
  }

  const extractLandmark = async () => {
    draw();
    setTimeout(async () => {
      setMode(1);
      const detectionResult = await FaceSDK.detectFace(detectSession, 'live-canvas');
      const points = await FaceSDK.predictLandmark(landmarkSession, 'live-canvas', detectionResult.bbox);

      const canvas = document.getElementById('live-canvas');
      const canvasCtx = canvas.getContext('2d');
      canvasCtx.beginPath();

      for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < 68; j++) {
          var x1 = points[i][j * 2],
            y1 = points[i][j * 2 + 1];

          canvasCtx.moveTo(x1 + 2, y1);
          canvasCtx.arc(x1, y1, 2, 0, 2 * Math.PI);
          canvasCtx.strokeStyle = "red";
          canvasCtx.stroke()
        }
      }
    },100);
  }

  const detectLivenessDetection = async () => {
    draw();
    setTimeout(async () => {
      setMode(2);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      
      const liveResult = await FaceSDK.predictLiveness(
        liveSession,
        "live-canvas",
        detectionResult.bbox
      );

      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();

      var face_count = liveResult.length;

      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(liveResult[i][0]),
          y1 = parseInt(liveResult[i][1]),
          x2 = parseInt(liveResult[i][2]),
          y2 = parseInt(liveResult[i][3]),
          result = liveResult[i][4] < 0.3 ? "Fake" : "Live",
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText(result, x1, y1 - 10);
        canvasCtx.stroke();
      }
    },100);
  }

  const predictFaceExpression = async () => {
    draw();
    setTimeout(async () => {
      setMode(3);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      const expressionResult = await FaceSDK.predictExpression(
        expressionSession,
        "live-canvas",
        detectionResult.bbox
      );
      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();
      var face_count = expressionResult.length;
      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(expressionResult[i][0]),
          y1 = parseInt(expressionResult[i][1]),
          x2 = parseInt(expressionResult[i][2]),
          y2 = parseInt(expressionResult[i][3]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText(
          "Yaw: " + emotions[expressionResult[i][4]],
          x1,
          y1 - 10
        );
        canvasCtx.stroke();
      }
    },100)
  }

  const predictFacePose = async () => {
    draw();
    setTimeout(async () => {
      setMode(4);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      const poseResult = await FaceSDK.predictPose(
        poseSession,
        "live-canvas",
        detectionResult.bbox
      );
      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();
      var face_count = poseResult.length;
      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(poseResult[i][0]),
          y1 = parseInt(poseResult[i][1]),
          x2 = parseInt(poseResult[i][2]),
          y2 = parseInt(poseResult[i][3]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText(
          "Yaw: " +
            poseResult[i][4] +
            " Pitch: " +
            poseResult[i][5] +
            " Roll: " +
            poseResult[i][6],
          x1,
          y1 - 10
        );
        canvasCtx.stroke();
      }
    },100);
  }

  const predictEyeCloseness = async () => {
    draw();
    setTimeout(async () => {
      setMode(5);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      const points = await FaceSDK.predictLandmark(
        landmarkSession,
        "live-canvas",
        detectionResult.bbox
      );
      const eyeResult = await FaceSDK.predictEye(
        eyeSession,
        "live-canvas",
        points
      );
      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();
      var bbox = detectionResult.bbox;
      var face_count = bbox.shape[0],
        bbox_size = bbox.shape[1];
      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(bbox.data[i * bbox_size]),
          y1 = parseInt(bbox.data[i * bbox_size + 1]),
          x2 = parseInt(bbox.data[i * bbox_size + 2]),
          y2 = parseInt(bbox.data[i * bbox_size + 3]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        const leftEye = eyeResult[i][0] ? "Close" : "Open";
        const rightEye = eyeResult[i][1] ? "Close" : "Open";

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText(
          "Left Eye: " + leftEye + " Right Eye: " + rightEye,
          x1,
          y1 - 10
        );
        canvasCtx.stroke();
      }
    }, 100);
  }

  const predictGender = async () => {
    draw();
    setTimeout( async () => {

      setMode(6);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      
      const genderResult = await FaceSDK.predictGender(
        genderSession,
        "live-canvas",
        detectionResult.bbox
      );

      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();

      var face_count = genderResult.length;

      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(genderResult[i][0]),
          y1 = parseInt(genderResult[i][1]),
          x2 = parseInt(genderResult[i][2]),
          y2 = parseInt(genderResult[i][3]),
          result = genderResult[i][4] > 0.6 ? "Male" : "Female",
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText(result, x1, y1 - 10);
        canvasCtx.stroke();
      }
    }, 100)
  }

  const predictAge = async () => {
    draw();
    setTimeout(async () => {

      setMode(7);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      
      const ageResult = await FaceSDK.predictAge(
        ageSession,
        "live-canvas",
        detectionResult.bbox
      );

      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();

      var face_count = ageResult.length;

      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(ageResult[i][0]),
          y1 = parseInt(ageResult[i][1]),
          x2 = parseInt(ageResult[i][2]),
          y2 = parseInt(ageResult[i][3]),
          result = parseInt(ageResult[i][4]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText("Age: " + result, x1, y1 - 10);
        canvasCtx.stroke();
      }

    },100);
  }

  const extractFeature = async () => {
    draw();
    setTimeout( async () => {

      setMode(8);
      const detectionResult = await FaceSDK.detectFace(
        detectSession,
        "live-canvas"
      );
      
      const points = await FaceSDK.predictLandmark(
        landmarkSession,
        "live-canvas",
        detectionResult.bbox
      );
      const eyeResult = await FaceSDK.extractFeature(
        featureSession,
        "live-canvas",
        points
      );

      const canvas = document.getElementById("live-canvas");
      const canvasCtx = canvas.getContext("2d");
      canvasCtx.beginPath();

      var bbox = detectionResult.bbox;
      var face_count = bbox.shape[0],
        bbox_size = bbox.shape[1];

      for (let i = 0; i < face_count; i++) {
        var x1 = parseInt(bbox.data[i * bbox_size]),
          y1 = parseInt(bbox.data[i * bbox_size + 1]),
          x2 = parseInt(bbox.data[i * bbox_size + 2]),
          y2 = parseInt(bbox.data[i * bbox_size + 3]),
          width = Math.abs(x2 - x1),
          height = Math.abs(y2 - y1);

        canvasCtx.strokeStyle = "red";
        canvasCtx.fillStyle = "blue";
        canvasCtx.strokeRect(x1, y1, width, height);
        canvasCtx.fillText("Person " + i, x1, y1 - 10);
        canvasCtx.stroke();
      }
    }, 100);
  }

  return (
    <div className="flex flex-row">
        
        <div className="flex flex-col">
          <div className="relative">
              <select onChange={changeImage} className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none">
                  <option value="1.jpg">1.jpg</option>
                  <option value="2.jpg">2.jpg</option>
                  <option value="3.png">3.png</option>
                  <option value="4.jpg">4.jpg</option>
                  <option value="5.jpg">5.jpg</option>
                  <option value="6.jpg">6.jpg</option>
                  <option value="7.jpg">7.jpg</option>
                  <option value="8.jpg">8.jpg</option>
                  <option value="9.jpg">9.jpg</option>
              </select>
          </div>
          <canvas ref={canvas} id="live-canvas" height={480} width={640} />
          
        </div>
        <div className="">
          <div className="flex flex-col gap-2 ml-2">
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none mt-2"
                aria-expanded="false" onClick={detectFace}>Detect Face
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={extractLandmark}>Extract Landmark
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={detectLivenessDetection}>Detect Liveness
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={predictFacePose}>Estimate Face Pose
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={predictFaceExpression}>Estimate Face Expression
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={predictEyeCloseness}>Estimate Eye Closeness
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={predictGender}>Estimate Gender
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={predictAge}>Estimate Age
              </button>
              <button
                className="px-6 py-2 font-semibold text-white bg-gray-800 rounded-md hover:opacity-95 focus:outline-none"
                aria-expanded="false" onClick={extractFeature}>Extract Face feature
              </button>
          </div>
        </div>
    </div>
  );
}

export default App;
