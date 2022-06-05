import { Heap } from "../Heap";
import { NodeType } from "../../App/Node";
import { IGrid, INode, Pathfinder, PathInfo, SearchedNode } from "../Pathfinder";

// Pathfinding class for Djikstra's algorithm
export class AStar implements Pathfinder {
    grid: IGrid;
    searchOrder: SearchedNode[] = [];
    shortestPath: number[] = [];
    pathFound: boolean = false;
    heap: Heap = new Heap((node: any) => { return node.distance });
    startNode: INode | undefined = undefined;
    endNode: INode | undefined = undefined;

    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number) {
        this.grid = {height: BOARD_HEIGHT, width: BOARD_WIDTH, nodes: []};
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
            // node.euclidDist = this.calcEuclidDist(node, endNode);
        }
    };

    private calcEuclidDist(node1: INode, node2: INode): number {
        return ((node1.col - node2.col) ** 2 + (node1.row - node2.row) ** 2) ** (1 / 2);
    }
}