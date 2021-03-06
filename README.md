# Beat-Jumper - Internship Project
Beat Jumper - my main project as an intern in BandPad. 

A JavaScript ES6 project using node.js along with webpack, and the open-source Phaser 3 game framework.
Uploaded as a PWA. 

Designed for children in their first\second year learning music (playable only if you can read basic sheet music). 

You can play the game in https://bandpad.co/beat-jumper/?language=en.

You can choose the language you prefer. As of this moment, available language are English and Hebrew, and in the future German and Arabic.

# Background and Enviroment

Beat-Jumper is an online rhythm based game, based on Phaser 3 Game Framework open-source.

It was developed by Ofir Israeli, as an intern in BandPad, using several of BandPad's utillities, and particularly BandPad Vexflow and BandPad ScoreManager, 
in an enviroment of JavaScript ES6 along with Node.js and Webpack. Developed as a PWA, so it is playable both on a desktop PC and on any mobile device. 

IMPORTANT NOTICE - Beat Jumper is designed to be played by children with basic musical knowledge and abillities, 
so people without any musical background will have a REALLY hard time passing levels successfully.

IMPORTANT NOTICE #2 - As mentioned above, Beat Jumper depends on several of BandPad's utillities, which are not open-source, 
so running the code in GitHub with node.js WILL NOT result in the functioning game in a localhost server.
Also, due to graphic copyrights, all of the graphics (from the assets folder) are not shown on this repository.

# Game Overview

The game is designed to strengthen children's abillities in rhythmic sheet music reading and executing basic rhythmic patterns in time. 

The game has overall 36 levels, divided into 6 stages (so 6 levels per stage). 
Each stage focuses on different kinds of rhythmic patterns, with the first one being the easiest (with only half and quarter notes), 
and the last one being the hardest (with dotted quarter notes and eighth notes).

The tempo is picked by the user in the options menu, so he can practice in the tempo he wants to get better at. 

In each level, the user will be playing the main character. When a level is started, the character will run,
while boulders of different sizes will roll towards him. 

The general aim is to jump (by pressing space) above those boulders,
according to the notes diplayed in the sheet music above (there is a metronome beat so user will know when each measure takes place).

Each boulder will reach the character just in the time it's corresponding note in the sheet music will occur in it's measure. 

Generally speaking, user will jump successfully above all of the boulders if he presses space in the exact same time he should according to the sheet music. 

Notice that during a half note, player should hold the jump and stay in air longer than other notes (at least a third of the half note's duration). 

In each level, the user gets points for each jump, based on how precise his jump was (relative to the note in the sheet music he meant to jump for). 

After completing a level (when we finish executing the sheet music displayed), he will get a score representing his points in that level (based on all of the jumps). 

If the user will miss a jump, not jump in time (meaning he did not execute the rhythmic pattern precisely enough) 
or jump when he was not supposed to (jump in a rest note for example), he will fail the level, and will have to try again. 

If player has lost a level 3 times during one stage, he will have to redo the whole stage, until he can complete that stage with failing less than 3 times. 

Notice that after each level completed, you will have to re-do the same level but without the approaching boulders. 

By that, player will have to truly demonstrate his musical abillities and not just jump above the boulders without considering the sheet music.

-------------------------------------

# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing Template

### Babel
You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

  ```
  "browsers": [
    ">0.25%",
    "not ie 11",
    "not op_mini all"
  ]
  ```

### Webpack
If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code
After you run the `npm run build` command, your code will be built into a single bundle located at 
`dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), 
you should be able to open `http://mycoolserver.com/index.html` and play your game.
