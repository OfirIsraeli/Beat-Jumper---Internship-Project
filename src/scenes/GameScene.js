import Phaser from "phaser";
import Hero from "../sprites/Hero";
//import Stave from "../classes/Stave"
import {scoreMap} from "../classes/scoreMapCopy"

class GameScene extends Phaser.Scene {
  constructor(test) {
    super({
      key: "GameScene",
    });
  }

  preload() {}

  create() {
    this.setGameButtons();
    this.background = this.add.tileSprite(0, 380, this.width, this.height, "backgroundImage");
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
      callback: ()=>{
        this.gameBegin();
      }})
  }

  createOneBarScoreMap(){
    // fetch number of bars
    const amountOfBars = 2;
    //

    for(let i = 1; i <= amountOfBars; i++){

      for (let j = 0; j < scoreMap[i].length; j++){
        this.scoreMap.push([scoreMap[i][j]["division"], scoreMap[i][j]["rest"]]);
      }
    }
  }


  gameBegin(){
    this.myHero.walk();
    this.gameMode = "started";
    let index = 0;
    setInterval(()=>{
      if (this.scoreMap[index][1] != "noPlace"){
        let smallBlock = this.physics.add.sprite(
          this.sys.game.config.width ,
          this.ground.y - 34,
          "smallBlockImage"
        );
        smallBlock.setImmovable();
        smallBlock.setVelocityX(-350);
        //this.physics.add.collider(this.myHero.heroSprite, smallBlock);
      }
      index++;
    }, this.divisonLength);
  }

  getGameDivisions(){
    // fetch from sheet source
    let tempo = 60;
    let divisions = "eights";
    //

    let noteSize;
    if (divisions === 'quarters'){
      noteSize = 1;
    }
    else if (divisions === 'eights'){
      noteSize = 2;
    }
    else{ // 16th notes
      noteSize = 4;
    }
    return ((60 / tempo) * 1000) / noteSize;
  }

  setGameButtons(){
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  setGameGround()
  {
    this.ground = this.physics.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * 0.747,
      "groundImage"
    );
    this.ground.setVisible(false);
    this.ground.setImmovable();
  }


  setGameColliders()
  {
    this.physics.add.collider(this.myHero.heroSprite, this.ground);

    // colliders for blocks:

    //this.physics.add.collider(this.myHero.heroSprite, this.mediumBlock);
    //this.physics.add.collider(this.myHero.heroSprite, this.largeBlock);
  }


  jumpTimingCheck(jumpTime){
    var jumpTime = Date.now();
    var timePassedSinceJump = (jumpTime - this.myHero.walkStartTime)  // / 1000
    var delay = timePassedSinceJump % this.divisonLength;
    var premature = this.divisonLength - (timePassedSinceJump % this.divisonLength);
    if (delay < 100 || premature < 100){
      console.log ("jump time is: ", timePassedSinceJump % this.divisonLength);
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
    
    if (this.gameMode === "started"){
      this.background.tilePositionX += 6; 
    }

    if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.myHero.heroSprite.body.touching.down){
      this.jumpTimingCheck();
      this.myHero.smallJump();
    }
  }
}

export default GameScene;
