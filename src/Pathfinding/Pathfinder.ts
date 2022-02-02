// Interfaces for pathfinder algorithms

import Djikstra from "./Djikstra";

export interface pathInfo {
    searchOrder: number[], // Order in which nodes were searched
    shortestPath: number[], // Order of nodes in shortest path
    pathFound: boolean, // False if no path was found
}

export abstract class Pathfinder {
    public static createPathfinder(algorithm: Algorithm, BOARD_HEIGHT: number, BOARD_WIDTH: number): Pathfinder {
        switch(algorithm) {
            case Algorithm.Djikstra:
                return new Djikstra(BOARD_HEIGHT, BOARD_WIDTH);
            default:
                return new Djikstra(BOARD_HEIGHT, BOARD_WIDTH);
        }
    }


    // Find shortest path from start node to end node
    // Assumes all nodes start with infinite distance and are unvisited
    // Note that this WILL MODIFY visited states of board
    public abstract findPath(grid: any[]): pathInfo;
}

// Enumeration of all the available algorithms
export const enum Algorithm {
    Djikstra = "Djikstra's", ASharp = "A#"
}

