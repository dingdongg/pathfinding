import { Heap } from "./Heap";
import Node, { StartNode, EndNode, WallNode } from "../App/Node.js";


// Pathfinding class for Djikstra's algorithm
export default class Djikstra {
    constructor(BOARD_HEIGHT, BOARD_WIDTH) {
        this.BOARD_HEIGHT = BOARD_HEIGHT;
        this.BOARD_WIDTH = BOARD_WIDTH;
    }

    // Find shortest path from start node to end node
    // Assumes all nodes start with infinite distance and are unvisited
    // Note that this WILL MODIFY visited states of board
    findPath(grid) {
        this.init(grid);
        this.addNeighbors(this.startNode);
        this.search();
        this.calcShortestPath();
        return {
            searchOrder: this.searchOrder, // Order in which nodes were searched
            shortestPath: this.shortestPath, // Order of nodes in shortest path
            pathFound: this.pathFound, // False if no path was found
        }
    }

    // Recursive search to find shortest path.
    search() {
        // updating "Next"
        let next = undefined;
        while ((next == undefined || next.visited) && this.heap.length() > 0) {
            next = this.heap.pop();
        } 
        // Searching "next"
        next.visited = true;
        this.addToSearchOrder(next);
        if (next.nodeType === EndNode) {
            this.pathFound = true;
            return;
        }
        this.addNeighbors(next);
        // Case where no valid path is found
        if (this.heap.length() == 0) {
            this.pathFound = false;
            return;
        }
        this.search();
    }

    // Initializes class variables
    init(grid) {
        this.grid = grid.slice();
        this.searchOrder = [];
        this.shortestPath = [];
        this.startNode = undefined;
        this.endNode = undefined;
        this.heap = new Heap((node) => { return node.distance });
        // Initialize start and end indices
        for (let i = 0; i < this.grid.length; i++) {
            if (grid[i].nodeType === StartNode) {
                this.startNode = grid[i];
                grid[i].distance = 0;
                grid[i].visited = true;
            } else if (grid[i].nodeType === EndNode) {
                this.endNode = grid[i];
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    // Adds node's (non-wall, unvisited) neighbors to the heap
    addNeighbors(node) {
        const BOARD_HEIGHT = this.BOARD_HEIGHT, BOARD_WIDTH = this.BOARD_WIDTH,
            index = this.getIndex(node),
            top = (index - BOARD_WIDTH >= 0) ? index - BOARD_WIDTH : undefined,
            bottom = (index + BOARD_WIDTH < BOARD_WIDTH * BOARD_HEIGHT) ? index + BOARD_WIDTH : undefined,
            left = (Math.floor((index - 1) / BOARD_WIDTH) === Math.floor((index) / BOARD_WIDTH)) ? index - 1 : undefined,
            right = (Math.floor((index + 1) / BOARD_WIDTH) === Math.floor((index) / BOARD_WIDTH)) ? index + 1 : undefined,
            neighbors = [top, left, bottom, right];
        for (const i of neighbors) {
            if (i !== undefined && this.grid[i].nodeType !== WallNode && !(this.grid[i].visited)) {
                const nextNode = this.grid[i];
                nextNode.distance = node.distance + nextNode.weight;
                nextNode.prev = node;
                this.heap.insert(nextNode);
            }
        }

    }

    // Adds the node to the search order
    addToSearchOrder(node) {
        this.searchOrder.push(node.row * this.BOARD_WIDTH + node.col);
    }

    // Initializes "this.shortestPath"
    calcShortestPath() {
        let prev = this.endNode.prev;
        const shortestPath = [];
        while (prev !== null) {
            shortestPath.unshift(this.getIndex(prev));
            prev = prev.prev;
        }
        this.shortestPath = shortestPath;
    }

    // Returns the (array) index for a node
    getIndex(node) {
        return node.row*this.BOARD_WIDTH + node.col;
    }
}

// const grid = [
//     {
//         "row": 0,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 0,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": 0,
//         "visited": true
//     },
//     {
//         "row": 1,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 1,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 2,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 3,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 4,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 5,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 6,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 7,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 8,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 0,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 1,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 2,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 3,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 4,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 5,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 6,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 7,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 8,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     },
//     {
//         "row": 9,
//         "col": 9,
//         "wallSegments": [
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false,
//             false
//         ],
//         "distance": null,
//         "visited": false
//     }
// ]
// const pathfinder = new Djikstra(10, 10), path = pathfinder.findPath(grid);