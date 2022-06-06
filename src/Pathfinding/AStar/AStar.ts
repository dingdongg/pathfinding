import { Heap } from "../Heap";
import { NodeType } from "../../App/Node";
import { IGrid as BaseIGrid, INode as BaseINode, Pathfinder, PathInfo, SearchedNode } from "../Pathfinder";

// Pathfinding class for ASharp

export interface IGrid extends BaseIGrid {
    nodes: INode[]
}
export interface INode extends BaseINode {
    euclidDist: number
}
export class AStar implements Pathfinder {
    grid: IGrid;
    searchOrder: SearchedNode[] = [];
    shortestPath: number[] = [];
    pathFound: boolean = false;
    heap: Heap = new Heap((node: any) => { return node.distance });
    startNode: INode | undefined = undefined;
    endNode: INode | undefined = undefined;

    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number, baseNodes: BaseINode[]) {
        const nodes: INode[] = this.convertNodes(baseNodes);
        this.grid = { height: BOARD_HEIGHT, width: BOARD_WIDTH, nodes: nodes };
    }


    public findPath(): PathInfo {
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



    // Initializes Euclidean distance of each node in grid (convert from BaseINode to ASharp INode)
    private convertNodes(baseNodes: BaseINode[]): INode[] {
        for (const node of baseNodes) {
            if (node.nodeType === NodeType.EndNode) {
                this.endNode = { ...node, euclidDist: 0 };
                break;
            }
        }

        const ret: INode[] = [];
        for (const node of baseNodes) {
            ret.push(this.baseToINode(node));
        }
        return ret;
    };

    // Returns the euclidean distance between two nodes
    private calcEuclidDist(node1: INode | BaseINode, node2: INode | BaseINode): number {
        return ((node1.col - node2.col) ** 2 + (node1.row - node2.row) ** 2) ** (1 / 2);
    }

    // Converts "Base" INode to ASharp INode. Assumes "EndNode" is already found.
    private baseToINode(node: BaseINode): INode {
        return { ...node, euclidDist: this.calcEuclidDist(node, this.endNode as INode) };
    }
}