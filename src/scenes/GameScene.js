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


    // game buttons
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // todo: change those function to be local
    this.setGameSounds();
    this.setGameBackground();
    this.setGameGround();

    this.myHero = new Hero({ scene: this.scene });

    this.setGameColliders();

    this.divisonLength = this.getGameDivisions();

    // todo: should this be boolean? if not .. camel case
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

  // ------------------ METHODS FOR INTERVALS ---------------- //
  getRelevantBlockName(index) {
    const blockImage = {
      '1' : "smallBlockImage",
      //.. todo - change to remove the ifs
    };
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

  stopBlocks(blockInterval, index) {
    if (index < this.scoreMap.length - 1 + 4) {
      return;
    } else {
      clearInterval(blockInterval);
      this.gameMode = "ended";
      this.myHero.heroSprite.play("standingAnimation");
    }
  }

  // todo: explain that
  getVelocityForTempo() {
    return -8 * this.tempo - 40;
  }

  gameBegin() {
    this.myHero.walk();
    this.gameMode = "started";
    let index = 0;
    let imageName;
    let blockInterval = setInterval(() => {
      if (index % this.noteSize === 0 && index >= 4) {
        // play every quarter
        this.beatSound.play();
      } else if (index < 4) {
        this.beatSound.play();
      }

      if (index < this.scoreMap.length - 1) {
        // todo: bad comparison
        if (this.scoreMap[index][1] != "noPlace") {
          let smallBlock = this.physics.add.sprite(
            this.sys.game.config.width,
            this.ground.y - 34,
            this.getRelevantBlockName(index)
          );
          smallBlock.setImmovable();
          smallBlock.setVelocityX(this.getVelocityForTempo());
          //this.physics.add.collider(this.myHero.heroSprite, smallBlock);
        }
      } else {
        this.stopBlocks(blockInterval, index);
      }
      index++;
    }, this.divisonLength);
  }

  // ------------------ SETTER METHODS ---------------- //

  setGameButtons() {

  }

  setGameSounds() {
    this.beatSound = this.sound.add("tick");
    this.hitSound = this.sound.add("hit");
  }
  setGameBackground() {
    this.background = this.add.tileSprite(
      0,
      380,
      this.width,
      this.height,
      "backgroundImage"
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

  // todo: what is the collider here for
  setGameColliders() {
    this.physics.add.collider(this.myHero.heroSprite, this.ground);

    // colliders for blocks:

    //this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    //this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
  }

  getGameDivisions() {
    // fetch from sheet source
    this.tempo = 80;
    let divisions = "eights";
    //

    //let noteSize;
    // todo: convert by const object
    if (divisions === "quarters") {
      this.noteSize = 1;
    } else if (divisions === "eights") {
      this.noteSize = 2;
    } else {
      // 16th notes
      this.noteSize = 4;
    }
    return ((60 / this.tempo) * 1000) / this.noteSize;
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
    // TASK: fetch number of bars from library
    const amountOfBars = 2;
    //

    for (let bar = 1; bar <= amountOfBars; bar++) {
      for (let note = 0; note < scoreMap[bar].length; note++) {
        this.deconstructNote(bar, note);
      }
    }
  }

  // ------------------ UPDATE METHODS ---------------- //

  jumpTimingCheck(jumpTime) {
    // todo : chnage to let
    var jumpTime = Date.now();
    var timePassedSinceJump = jumpTime - this.myHero.walkStartTime; // / 1000
    var delay = timePassedSinceJump % this.divisonLength;
    // todo pteMature
    var premature =
      this.divisonLength - (timePassedSinceJump % this.divisonLength);
    if (delay < 50) {
      console.log("jump time is ", delay, "milliseconds late");
    }
    if (premature < 50) {
      console.log("jump time is ", premature, "milliseconds early");
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
      this.hitSound.play();
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
