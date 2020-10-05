import { FONT_STYLE } from "./GameScene";

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
      fontSize: "80px",
    })
    .setOrigin(0.5, 0.5);
  that.infoMessage = "Level " + (that.levelIndex + 1);

  // point text
  that.pointsUpperText = that.add
    .text(20, 80, "Points:", {
      ...FONT_STYLE,
      fontSize: "32px",
    })
    .setOrigin(0, 0.5);

  // points number
  that.totalPoints = 0;
  that.pointsLowerText = that.add
    .text(110, 80, that.totalPoints, {
      ...FONT_STYLE,
      fontSize: "32px",
    })
    .setOrigin(0, 0.5);

  // high score text
  that.highScoreUpperText = that.add
    .text(20, 25, "High Score:", {
      ...FONT_STYLE,
      fontSize: "32px",
    })
    .setOrigin(0, 0.5);

  // high score number
  that.highScoreLowerText = that.add
    .text(170, 25, that.userHighScores[that.stageIndex][that.levelIndex], {
      ...FONT_STYLE,
      fontSize: "32px",
    })
    .setOrigin(0, 0.5);

  // level text
  that.levelInfoText = that.add
    .text(
      20,
      that.sys.game.config.height - 50,
      "Stage " + (that.stageIndex + 1) + ", Level " + (that.levelIndex + 1),
      {
        fontFamily: "Chewy",
        fill: "#342707",
        fontSize: "60px",
      }
    )
    .setOrigin(0, 0.5);
}