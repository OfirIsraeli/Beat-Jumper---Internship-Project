import teoria from "teoria-extra";

export default class Staff {
  constructor(config, clef) {
    // constants
    this.yStart = config.yStart;
    this.scene = config.scene.scene;
    this.gameSize = {
      height: this.scene.sys.game.config.height,
      width: this.scene.sys.game.config.width,
    };
    this.STAFF_GAP = 22;

    // lines objects
    this.lines = [];

    // clef, treble or bass
    this.clef = clef;

    // reference to key of tune, default is "C"
    this.tunekey = config.tunekey || "C";
  }

  init() {
    // Create lines
    for (let i = -6; i <= 16; i++) {
      let line;
      if (!(i % 2) && i < 12 && i > 0) {
        line = "fullLine";
      } else {
        line = "emptyLine";
      }
      this.lines[i] = this.scene.add.sprite(
        640,
        this.gameSize.height - this.yStart - this.STAFF_GAP * i,
        line
      );
    }

    // add treble or bass clef
    if (this.clef === "treble") {
      if (this.yStart > this.gameSize.height / 2) {
        this.scene.add.sprite(80, 204, "trebleClef");
      } else {
        this.scene.add.sprite(80, 564, "trebleClef");
      }
    } else if (this.clef === "bass") {
      if (this.yStart > this.gameSize.height / 2) {
        this.scene.add.sprite(80, 180, "bassClef");
      } else {
        this.scene.add.sprite(80, 540, "bassClef");
      }
    } else {
      console.log("cannot recognize clef");
    }
  }

  createKey(key) {
    const POSITION = teoria.KEY_SIGNS_POSITION;
    // set key and sign position on staff, key goes up to three signs
    this.tunekey = key;
    let X_START = 175,
      X_GAP = 45;

    // arrays for sharp and flat positions on staff
    let sharpPosition = [10, 7, 11];
    let flatPosition = [7, 10, 6];
    if (this.clef === "bass") {
      // subtract 2 from these arrays to get bass clef positions
      for (let i = 0; i < sharpPosition.length; i++) {
        sharpPosition[i] -= 2;
        flatPosition[i] -= 2;
      }
    }

    switch (key) {
      // sharp
      case "A":
      case "F#m":
        this.scene.add.sprite(
          X_START + X_GAP * 2,
          this.lines[sharpPosition[2]].y,
          "sharpSymbol"
        );
      case "D":
      case "Bm":
        this.scene.add.sprite(
          X_START + X_GAP,
          this.lines[sharpPosition[1]].y,
          "sharpSymbol"
        );
      case "G":
      case "Em":
        this.scene.add.sprite(
          X_START,
          this.lines[sharpPosition[0]].y,
          "sharpSymbol"
        );
        break;

      // flat
      case "Eb":
      case "Cm":
        this.scene.add.sprite(
          X_START + X_GAP * 2,
          this.lines[flatPosition[2]].y,
          "flatSymbol"
        );
      case "Bb":
      case "Gm":
        this.scene.add.sprite(
          X_START + X_GAP,
          this.lines[flatPosition[1]].y,
          "flatSymbol"
        );
      case "F":
      case "Dm":
        this.scene.add.sprite(
          X_START,
          this.lines[flatPosition[0]].y,
          "flatSymbol"
        );
        break;
    }
  }

  getStaffPosition(noteLine) {
    return this.lines[noteLine].y;
  }
}
