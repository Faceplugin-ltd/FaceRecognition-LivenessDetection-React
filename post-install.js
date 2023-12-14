const fs = require("fs");
const path = require("path");

// copy onnxruntime-web WebAssembly files to {workspace}/public/ folder
let srcFolder = path.join(__dirname, 'node_modules', 'onnxruntime-web', 'dist');
let destFolder = path.join(__dirname, 'public');
if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder);
}

fs.copyFileSync(path.join(srcFolder, 'ort-wasm.wasm'), path.join(destFolder, 'ort-wasm.wasm'));
fs.copyFileSync(path.join(srcFolder, 'ort-wasm-simd.wasm'), path.join(destFolder, 'ort-wasm-simd.wasm'));
fs.copyFileSync(path.join(srcFolder, 'ort-wasm-threaded.wasm'), path.join(destFolder, 'ort-wasm-threaded.wasm'));
fs.copyFileSync(path.join(srcFolder, 'ort-wasm-simd-threaded.wasm'), path.join(destFolder, 'ort-wasm-simd-threaded.wasm'));
fs.copyFileSync(path.join(srcFolder, 'ort.min.js'), path.join(destFolder, 'ort.min.js'));

destFolder = path.join(__dirname, 'public', 'js');
if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder);
}

srcFolder = path.join(__dirname, 'node_modules', 'faceplugin', 'model');
destFolder = path.join(__dirname, 'public', 'model');
if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder);
}
fs.copyFileSync(path.join(srcFolder, 'fr_pose.onnx'), path.join(destFolder, 'fr_pose.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_detect.onnx'), path.join(destFolder, 'fr_detect.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_expression.onnx'), path.join(destFolder, 'fr_expression.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_eye.onnx'), path.join(destFolder, 'fr_eye.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_landmark.onnx'), path.join(destFolder, 'fr_landmark.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_liveness.onnx'), path.join(destFolder, 'fr_liveness.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_feature.onnx'), path.join(destFolder, 'fr_feature.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_age.onnx'), path.join(destFolder, 'fr_age.onnx'));
fs.copyFileSync(path.join(srcFolder, 'fr_gender.onnx'), path.join(destFolder, 'fr_gender.onnx'));

srcFolder = path.join(__dirname, 'node_modules', 'faceplugin', 'js');
destFolder = path.join(__dirname, 'public', 'js');
fs.copyFileSync(path.join(srcFolder, 'opencv.js'), path.join(destFolder, 'opencv.js'));
fs.copyFileSync(path.join(srcFolder, 'opencv_js.js'), path.join(destFolder, 'opencv_js.js'));
fs.copyFileSync(path.join(srcFolder, 'opencv_js.wasm'), path.join(destFolder, 'opencv_js.wasm'));

