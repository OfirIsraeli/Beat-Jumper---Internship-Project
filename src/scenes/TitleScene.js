class TitleScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "TitleScene",
    });
  }
  preload() {}
  create() {
    this.background = this.add
      .tileSprite(0, 0, this.width, this.height, "backgroundImage")
      .setOrigin(0, 0);
    const text = "PRESS SPACE TO PLAY";
    this.add.text(400, 250, text, { fill: "#000000", align: "center", fontSize: "50px" });
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
      this.scene.start("GameScene");
    }
  }
}

export default TitleScene;
