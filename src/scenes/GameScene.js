import Phaser from "phaser";
import Hero from "../sprites/Hero";
//import Stave from "../classes/Stave"
import { scoreMap } from "../classes/scoreMapCopy";

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    this.setGameButtons();
    this.background = this.add.tileSprite(
      0,
      380,
      this.width,
      this.height,
      "backgroundImage"
    );
    this.setGameGround();
    this.myHero = new Hero({ scene: this.scene });
    this.setGameColliders();
    this.divisonLength = this.getGameDivisions();
    this.gameMode = "not started";
    this.scoreMap = [];
    this.createOneBarScoreMap();

    // start game after 2 seconds
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.gameBegin();
      },
    });
  }

  deconstructNote(bar, note) {
    if (scoreMap[bar][note]["rest"] === "noPlace") {
      for (let k = 0; k < scoreMap[bar][note]["division"]; k++) {
        this.scoreMap.push([1, scoreMap[bar][note]["rest"]]);
      }
    } else {
      this.scoreMap.push([
        scoreMap[bar][note]["division"],
        scoreMap[bar][note]["rest"],
      ]);
      for (let k = 1; k < scoreMap[bar][note]["division"]; k++) {
        this.scoreMap.push([1, "noPlace"]);
      }
    }
  }

  createOneBarScoreMap() {
    // fetch number of bars
    const amountOfBars = 2;
    //

    for (let bar = 1; bar <= amountOfBars; bar++) {
      for (let note = 0; note < scoreMap[bar].length; note++) {
        this.deconstructNote(bar, note);
        //this.scoreMap.push([scoreMap[bar][note]["division"], scoreMap[bar][note]["rest"]]);
      }
    }
    for (let n = 0; n < this.scoreMap.length; n++) {
      //console.log(this.scoreMap[n]);
    }
  }

  getRelevantBlockName(index) {
    if (this.scoreMap[index][0] === 1) {
      return "smallBlockImage";
    } else if (this.scoreMap[index][0] === 2) {
      return "mediumBlockImage";
    } else if (this.scoreMap[index][0] === 4) {
      return "largeBlockImage";
    }
    /*
    else{
        return "biggestBlockImage"; // not existing yet
      }*/
  }

  stopBlocks(blockInterval) {
    clearInterval(blockInterval);
  }

  gameBegin() {
    this.myHero.walk();
    this.gameMode = "started";
    let index = 0;
    let imageName;
    let blockInterval = setInterval(() => {
      if (index >= this.scoreMap.length - 1) {
        this.stopBlocks(blockInterval);
      }

      if (this.scoreMap[index][1] != "noPlace") {
        let smallBlock = this.physics.add.sprite(
          this.sys.game.config.width,
          this.ground.y - 34,
          this.getRelevantBlockName(index)
        );
        smallBlock.setImmovable();
        smallBlock.setVelocityX(-350);
        //this.physics.add.collider(this.myHero.heroSprite, smallBlock);
      }
      index++;
    }, this.divisonLength);
  }

  getGameDivisions() {
    // fetch from sheet source
    let tempo = 60;
    let divisions = "eights";
    //

    let noteSize;
    if (divisions === "quarters") {
      noteSize = 1;
    } else if (divisions === "eights") {
      noteSize = 2;
    } else {
      // 16th notes
      noteSize = 4;
    }
    return ((60 / tempo) * 1000) / noteSize;
  }

  setGameButtons() {
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  setGameGround() {
    this.ground = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * 0.747,
      "groundImage"
    );
    this.ground.setVisible(false);
    this.ground.setImmovable();
  }

  setGameColliders() {
    this.physics.add.collider(this.myHero.heroSprite, this.ground);

    // colliders for blocks:

    //this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    //this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
  }

  jumpTimingCheck(jumpTime) {
    var jumpTime = Date.now();
    var timePassedSinceJump = jumpTime - this.myHero.walkStartTime; // / 1000
    var delay = timePassedSinceJump % this.divisonLength;
    var premature =
      this.divisonLength - (timePassedSinceJump % this.divisonLength);
    if (delay < 100 || premature < 100) {
      console.log("jump time is: ", timePassedSinceJump % this.divisonLength);
    }

    /*
    this.stave = new Stave({
      x:200,
      y:200,
      scene: this
    })
    this.stave.drawNotes();*/
  }

  update(time, delta) {
    if (this.gameMode === "started") {
      this.background.tilePositionX += 6;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.spaceBar) &&
      this.myHero.heroSprite.body.touching.down
    ) {
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
