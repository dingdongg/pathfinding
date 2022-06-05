// Interfaces for pathfinder algorithms

import {Djikstra} from "./Djikstra/Djikstra";
import {AStar} from "./AStar/AStar";
import {BFS} from "./BFS/BFS";

// Enumeration of all the available algorithms
export const enum Algorithm {
    Djikstra = "Djikstra's", AStar = "A*", BFS = "BFS",
}

export interface PathInfo {
    searchOrder: SearchedNode[], // Order in which nodes were searched
    shortestPath: number[], // Order of INDICES of nodes in shortest path
    pathFound: boolean, // False if no path was found
}

// Encapsulates a node visited by the pathfinder
export interface SearchedNode {
    index: number, // index on the grid
    distance: number, // updated distance
}

export abstract class Pathfinder {

    public static createPathfinder(algorithm: Algorithm, BOARD_HEIGHT: number, BOARD_WIDTH: number): Pathfinder {
        switch(algorithm) {
            case Algorithm.Djikstra:
                return new Djikstra(BOARD_HEIGHT, BOARD_WIDTH);
            case Algorithm.BFS:
                return new BFS(BOARD_HEIGHT, BOARD_WIDTH);
            case Algorithm.AStar:
                return new AStar(BOARD_HEIGHT, BOARD_WIDTH);
            default:
                return new Djikstra(BOARD_HEIGHT, BOARD_WIDTH);
        }
    }


    // Find shortest path from start node to end node
    // Assumes all nodes start with infinite distance and are unvisited
    // Note that this WILL MODIFY visited states of board
    public abstract findPath(grid: any[]): PathInfo;
}

