import {INode, Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";

// Pathfinding class for breadth-first search (BFS)
export class BFS implements Pathfinder {
    BOARD_HEIGHT: number;
    BOARD_WIDTH: number;
    searchOrder: SearchedNode[] = [];
    shortestPath: any;
    pathFound: any;
    grid: any;
    startNode: any;
    endNode: any;

    constructor(width: number, height: number, nodes: INode[]) {
        this.BOARD_HEIGHT = height;
        this.BOARD_WIDTH = width;
    }

    public findPath(): PathInfo {
        return {
            searchOrder: [],
            shortestPath: [],
            pathFound: false
        };
    }

}