import { Heap } from "../Heap";
import { NodeType } from "../../App/Node";
import { IGrid, INode, Pathfinder, PathInfo, SearchedNode } from "../Pathfinder";

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


    public findPath(grid: any[]): PathInfo {
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

    // Initializes Euclidean distance of each node in grid
    private initEuclidDist(grid: IGrid): void {
        let endNode: INode = grid.nodes[0];
        for (const node of grid.nodes) {
            if (node.nodeType == NodeType.EndNode) {
                endNode = node;
                break;
            }
        }
        for (const node of grid.nodes) {
            node.euclidDist = this.calcEuclidDist(node, endNode);
        }
    };

    private calcEuclidDist(node1: INode, node2: INode): number {
        return ((node1.col - node2.col) ** 2 + (node1.row - node2.row) ** 2) ** (1 / 2);
    }
}