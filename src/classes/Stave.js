import * as liveScore from "bandpad-vexflow";
import test from "../sheets/beat";

export default class Stave {
  constructor(config) {
    // game scene
    this.scene = config.scene;

    // dimensions
    this.x = config.x || 100;
    this.y = config.y || 100;

    this.musicJson = config.musicJson;

    // create stave canvas
    this.createCanvas();

    this.createScore();
  }
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  createScore() {}

  drawNotes() {}
}
