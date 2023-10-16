// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by addable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from "@googlemaps/js-api-loader";
import * as SceneLoaded from "./scene-loaded-component";

const apiOptions = {
  apiKey: "AIzaSyAUkkmC9-cSepu12-6-E0pja7nx7QZWfEQ",
  version: "beta",
};

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: { lat: 35.6594945, lng: 139.6999859 },
  mapId: "a862881132d7f315",
};

const latLngAltitudeLiteral = {
  lat: mapOptions.center.lat,
  lng: mapOptions.center.lng,
  altitude: 0,
};

let webGLOverlayView, ascene, scene3JS, renderer, camera3JS;

async function initMap() {
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.importLibrary("maps");
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebGLOverlayView(map) {
  webGLOverlayView = new google.maps.WebGLOverlayView();
  webGLOverlayView.onAdd = webGlViewOnAdd;
  webGLOverlayView.onContextRestored = webGlViewOnContextRestored;
  webGLOverlayView.onDraw = webGlViewOnDraw;
  webGLOverlayView.setMap(map);
}

function webGlViewOnAdd() {
  createAframeScene();
  // appendGridHelper();
  appendExamplePlane();
  appendExampleBox();
  appendExampleModel();
  appendCarModel();
}

function createAframeScene() {
  ascene = document.createElement("a-scene");
  ascene.setAttribute("scene-loaded", "");
  ascene.addEventListener("on-scene-loaded", onSceneLoaded);
}

function onSceneLoaded() {
  scene3JS = ascene.object3D;
  camera3JS = ascene.camera;
}

function appendGridHelper() {
  // TBD
  const size = 10;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper(size, divisions);
  ascene.object3D.add(gridHelper);
}

function appendExamplePlane() {
  const examplePlane = document.createElement("a-plane");
  examplePlane.setAttribute("color", "blue");
  examplePlane.setAttribute("height", "5");
  examplePlane.setAttribute("width", "5");
  examplePlane.setAttribute("rotation", "0 0 0");
  ascene.appendChild(examplePlane);
}

function appendExampleBox() {
  const exampleBox = document.createElement("a-box");
  exampleBox.setAttribute("color", "red");
  exampleBox.setAttribute("position", "15 15 10");
  exampleBox.setAttribute("rotation", "0 0 0");
  exampleBox.setAttribute("scale", "20 20 20");
  ascene.appendChild(exampleBox);
}

function appendExampleModel() {
  const exampleModel = document.createElement("a-entity");
  exampleModel.setAttribute("gltf-model", "url(pin.gltf)");
  exampleModel.setAttribute("position", "0 0 20");
  exampleModel.setAttribute("scale", "5 5 5");
  exampleModel.setAttribute("rotation", "180 0 0");
  ascene.appendChild(exampleModel);
}

function appendCarModel() {
  const carModel = document.createElement("a-entity");
  carModel.setAttribute("gltf-model", "url(car.glb)");
  carModel.setAttribute("position", "20 0 0");
  carModel.setAttribute("scale", "5 5 5");
  carModel.setAttribute("rotation", "90 0 0");
  ascene.appendChild(carModel);
}

function webGlViewOnContextRestored({ gl }) {
  ascene.rendererCustomConfig = {
    canvas: gl.canvas,
    context: gl,
    ...gl.getContextAttributes(),
  };
  ascene.addEventListener("on-scene-loaded", setRenderer);
  document.body.appendChild(ascene);
}

function setRenderer() {
  renderer = ascene.renderer;
  renderer.autoClear = false;
}

function webGlViewOnDraw({ gl, transformer }) {
  if (!camera3JS) return;
  webGLOverlayView.requestRedraw();
  renderer.render(scene3JS, camera3JS);
  renderer.resetState();
  setCameraProjection({ gl, transformer });
}

function setCameraProjection({ gl, transformer }) {
  const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
  camera3JS.projectionMatrix = new AFRAME.THREE.Matrix4().fromArray(matrix);
}

(async () => {
  const map = await initMap();
  initWebGLOverlayView(map);
})();
