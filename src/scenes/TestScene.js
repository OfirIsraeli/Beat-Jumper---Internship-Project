import Phaser from "phaser";
import Stave from "../classes/Stave"
import musicJson from "../../assets/musicJson/beats1"

class TestScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TestScene",
    });
  }

  preload() {
    this.load.image("backgroundImage", "assets/images/backgroundWithFloor.png");

  }

  create() {
    const Y_TEST = 200;
    // for learning the object
    window.that = this;

    this.add.image(0, 0, "backgroundImage").setOrigin(0, 0);

    console.log("creating test")

    // testing stave class
    new Stave({
      x:0,
      y:Y_TEST,
      scene: this,
      musicJson: musicJson
    }).drawNotes();
 }

  update(time, delta) {
  }
}

export default TestScene;
