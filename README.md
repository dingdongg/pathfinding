[Link to website](https://matthewmywu.github.io/pathfinding/)

## Overview
Welcome to my pathfinder visualizer! I Wanted to create something that would help people (*students*) visualize various pathfinding algorithms, while also being easily accessible and easy to use. As such, I tried to create a UI that was simple and intuitive, while still being able to handle the complexities of various pathfinding algorithms.

## How to Use
* The yellow and red nodes are the start and end nodes respectively. Drag and drop them to move!
* The 'Barriers' section allows the user to select which barriers they want to place on the board. Rivers are uncrossable, while 'forest' has a weight of 2 (eg. moving across 1 forest node is the same as moving through 2 normal nodes)
* The 'Algorithms' section allows the user to select which algorithm to use for pathfinding
* The 'Board Size' section is used to change the dimensions of the board. Press 'reset' to see the changes
* The 'Find Path' button finds a path from the start node to the end node
* The 'Soft Reset' button resets the board, but leaves the barriers, and start/end node positions intact
* The "Reset" button resets the board, including barriers and start/end node positions. This also resets board dimensions, if they were changed

## TODO:
* Implement more pathfinding algorithms (note only Djikstra's is implemented right now)
* Add "information" button, with details on how to use the controls
* Change the way path is displayed (currently path is almost invisible if it goes through forest)
* Add graphics to start and end nodes (optionally for nodes as well)
