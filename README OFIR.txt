---------- BACKGROUND AND ENVIROMENT---------- 
Beat-Jumper is a rhythm based online game, based on Phaser 3 Game Framework open-source. It was developed by Ofir Israeli,
as part of BandPad.co company (being an intern in the company), using several of BandPad's utillities, and particularly the BandPad Vexflow and the
BandPad ScoreManager, in an enviroment of JavaScript ES6 along with Node.js and Webpack. 


---------- GAME OVERVIEW ---------- 
The game is designed to strengthen children's abillities in rhythmic sheet music and executing basic rhythmic patterns in time.
The game has overall 36 levels, divided into 6 stages (so 6 levels per stage). Each stage focuses on different kinds of rhythmic patterns,
with the first one being the easiest (with only half and quarter notes), and the last one being the hardest (להשלים איזה סוג).
להשלים איך עובד עניין הטמפו
In each level, the user will be playing the main character. When a level is started, the character will run, while boulders of different
sizes will roll towards him. The general aim is to jump (by pressing space) above those boulders, 
according to the notes diplayed in the sheet music above (there is a metronome beat so user will know when each measure takes place).
Each boulder will reach the character just in the time it's corresponding note in the sheet music will occur in it's measure.
Generally speaking, user will jump successfully above all of the boulders if he presses space in the exact same time he should according to the sheet music.
In each level, the user gets points for each jump, based on how precise his jump was (relative to the note in the sheet music he meant to jump for).
After completing a level (when we finish executing the sheet music displayed), he will get a score representing his points in that level (based on all of the jumps).
If the user will miss a jump, not jump in time (meaning he did not execute the rhythmic pattern precisely enough) or jump when he was not supposed
to (jump in a rest note for example), he will fail the level, and will have to try again. If player has lost a level 3 times during one stage,
he will have to redo the whole stage, until he can complete that stage with failing less than 3 times.