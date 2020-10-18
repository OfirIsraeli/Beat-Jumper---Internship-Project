import { FONT_STYLE } from "./GameScene";

/**
 * function that sets the many texts needed for GameScene
 * @param {*} that - a Phaser scene. in our case, always GameScene
 */
export function initText(that) {
  // set count-in text
  that.countInText = that.add.text(520, 250, "", {
    ...FONT_STYLE,
    align: "center",
    fontSize: "250px",
  });

  // set information text. appears on screen whenever we want to inform the user about anything
  // todo: centralize the text
  that.infoText = that.add
    .text(640, 350, "", {
      ...FONT_STYLE,
      fontSize: "70px",
    })
    .setOrigin(0.5, 0.5);
  that.infoMessage = myLanguage.level + " " + (that.levelIndex + 1);

  // point text
  that.totalPoints = 0;
  that.pointsText = that.add
    .text(40, 110, myLanguage.points + ": " + that.totalPoints, {
      ...FONT_STYLE,
      fontSize: "35px",
    })
    .setOrigin(0, 0.5);

  // high score text
  that.highScoreText = that.add
    .text(
      40,
      55,
      myLanguage.highscore + ": " + that.userHighScores[that.stageIndex][that.levelIndex],
      {
        ...FONT_STYLE,
        fontSize: "35px",
      }
    )
    .setOrigin(0, 0.5);

  // level text
  that.levelInfoText = that.add
    .text(
      20,
      that.sys.game.config.height - 50,
      myLanguage.stage +
        " " +
        (that.stageIndex + 1) +
        ", " +
        myLanguage.level +
        " " +
        (that.levelIndex + 1),
      {
        fontFamily: "Chewy",
        fill: "#342707",
        fontSize: "60px",
      }
    )
    .setOrigin(0, 0.5);
}
