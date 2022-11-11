# KAOOA_GAME

This repository is a 3-D visualization of a game called Kaooa which involves 7 crows and 1 vulture.\
The game rules and motivation can be read from here: https://www.whatdowedoallday.com/kaooa/

![image](https://user-images.githubusercontent.com/53634655/201353459-4a7ad6a0-019e-4fdf-8af9-45782fa3ae5f.png)

1. I have used A-frame.js 3D library for implementing this game.

2. Movement of elements:
- Due to the use of this library, the moves shall be done by clicking on the elements and not drag/drop.
- To move a crow/vulture, click on it's respective ball and then click on any empty white circle on the board(if available) to place it there.
- The crow/vulture ball will get enlarged on clicking and get back to normal when placed.
- If it is an invalid move, the element will not move.

3, The color conventions are:

Red color ball - Vulture\
Blue color ball - Crows

4. Whenver a crow is killed, it is removed from the board.

5. A win is denoted by an alert prompt and the game reloads post that.

4. The general rules of the game are being followed except the feature to suggest vulture \
of a possible crow kill opportunity since I wanted to keep the game unbiased for both the sides.

5. Log file can be downloaded any time by clicking on the 'Download Logs' button.

6. Log files have the logs of the following event types:
- a crow/vulture is clicked.
- a crow/vulture arrives on the board.
- a crow/vulture moves from one place to other on board
- the vulture kills the crow.
- if an invalid move is made.
