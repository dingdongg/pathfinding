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
        this.heap = new Heap(this.getDist);
    }


    public findPath(): PathInfo {
        // this.addNeighbors(this.startNode);
        // this.search();
        // this.calcShortestPath();
        return {
            searchOrder: this.searchOrder, // Order in which nodes were searched
            shortestPath: this.shortestPath, // Order of nodes in shortest path
            pathFound: this.pathFound, // False if no path was found
        }
    }

    // Adds node's neighbours to heap
    // Does not add visited or wall nodes
    private addNeighbors(node: INode): void {
        const WIDTH = this.grid.width;
        // Indices of top, right, bottom, and left neighbours
        let top: number | undefined = (node.row - 1) * WIDTH + node.col,
            right: number | undefined = node.row * WIDTH + node.col + 1,
            bottom: number | undefined = (node.row + 1) * WIDTH + node.col,
            left: number | undefined = node.row * WIDTH + node.col - 1;
        top = top >= 0 ? top : undefined;
        bottom = bottom < WIDTH*this.grid.height ? bottom : undefined;
        left = Math.round(left/WIDTH) === node.row ? left : undefined;
        right = Math.round(right/WIDTH) === node.row ? left : undefined;
        const neighbors: (number|undefined)[] = [top, right, bottom, left];
        const nodes: INode[] = this.grid.nodes;
        for (const index of neighbors) {
            if (index == undefined) continue;
            const node: INode = nodes[index];
            if (node.nodeType == NodeType.WallNode || node.visited) continue;
            this.heap.insert(node);
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

    // Returns the "distance" to the node, as relevant to ASharp
    private getDist(node: INode): number {
        return node.distance + node.euclidDist;
    }
}