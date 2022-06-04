import { Heap } from "../Heap";
import { NodeType } from "../../App/Node";
import {Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";

// Pathfinding class for Djikstra's algorithm
export class AStar implements Pathfinder {
    BOARD_HEIGHT: number;
    BOARD_WIDTH: number;
    searchOrder: SearchedNode[] = [];
    shortestPath: any;
    pathFound: any;
    heap: any;
    grid: any;
    startNode: any;
    endNode: any;

    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number) {
        this.BOARD_HEIGHT = BOARD_HEIGHT;
        this.BOARD_WIDTH = BOARD_WIDTH;
    }
    
    
    public findPath(grid: any[]):PathInfo {
        // this.init(grid);
        // this.addNeighbors(this.startNode);
        // this.search();
        // this.calcShortestPath();
        return {
            searchOrder: this.searchOrder, // Order in which nodes were searched
            shortestPath: this.shortestPath, // Order of nodes in shortest path
            pathFound: this.pathFound, // False if no path was found
        }
    }
}