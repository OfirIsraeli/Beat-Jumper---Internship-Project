import Phaser from "phaser";
import Stave from "../classes/Stave";
import { BUS_EVENTS } from "bandpad-vexflow";
import * as ScoreManager from "bandpad-vexflow";

class TestScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TestScene",
    });
  }

  preload() {
    this.load.image("backgroundImage", "assets/images/background.png");
  }

  create() {
    const Y_TEST = 200;
    // for learning the object
    window.that = this;

    this.add.image(0, 0, "backgroundImage").setOrigin(0, 0);

    console.log("creating test");

    // testing stave class
    new Stave({
      x: 0,
      y: Y_TEST,
      scene: this,
    }).drawNotes();

    test.partElements[0].mute = true;

    document.addEventListener("click", () => {
      ScoreManager.scoreGetEvent(BUS_EVENTS.PLAY, {
        smoothNotePointer: true,
      });
    });
  }

  update(time, delta) {}
}

export default TestScene;
