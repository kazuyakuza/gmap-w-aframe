// import * as Aframe from "aframe";
import * as Aframe from "aframe-custom-canvas";
// import * as Aframe from "./aframe-master-changed";

const sceneLoadedEvent = new Event("on-scene-loaded");

Aframe.registerComponent("scene-loaded", {
  init: function () {
    this.el.sceneEl.dispatchEvent(sceneLoadedEvent);
  },
});
