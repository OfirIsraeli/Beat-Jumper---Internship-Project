import "../lib/index"


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
  createCanvas(){
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  createScore(){
    console.log(createScoreManager)
    console.log(createScore)
    createScore(this.musicJson, "score-id", {}, function(event, value) {
      // pass bandpad-vexflow events to the event bus
      console.log(event, value)
    });
  }

  drawNotes(){
    this.ctx.beginPath();
    this.ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    this.ctx.stroke();
    window.sss = this.scene
    // draw the circle using Phaser 3
    this.scene.textures.addCanvas('circle', this.canvas);
    const circleImage = this.scene.add.image(this.x, this.y, 'circle');
  }
}
