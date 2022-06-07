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
    heap: Heap<INode> = new Heap(this.getDist);
    startNode: INode | undefined = undefined;
    endNode: INode | undefined = undefined;

    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number, readonly baseNodes: BaseINode[]) {
        const nodes: INode[] = this.convertNodes(baseNodes);
        this.grid = { height: BOARD_HEIGHT, width: BOARD_WIDTH, nodes: nodes };
    }


    public findPath(): PathInfo {
        this.initStartEndNodes();
        this.heap.insert(this.startNode as INode);
        this.search();
        this.calcShortestPath();
        return {
            searchOrder: this.searchOrder, // Order in which nodes were searched
            shortestPath: this.shortestPath, // Order of nodes in shortest path
            pathFound: (this.endNode as INode).visited, // False if no path was found
        }
    }

    // Search loop
    private search(): void {
        while (this.heap.length() > 0 && !(this.endNode as INode).visited) {
            let next: INode | undefined = undefined;
            while (next === undefined || (next as INode).visited) {
                next = this.heap.pop();
            }
            next.visited = true;
            this.addToSearchOrder(next);
            this.addNeighbors(next);
        }
    }

    // Adds node's neighbours to heap
    // Does not add visited or wall nodes
    // Sets distance for all neighbours
    private addNeighbors(node: INode): void {
        const WIDTH = this.grid.width;
        // Indices of top, right, bottom, and left neighbours
        let top: number | undefined = (node.row - 1) * WIDTH + node.col,
            right: number | undefined = node.row * WIDTH + node.col + 1,
            bottom: number | undefined = (node.row + 1) * WIDTH + node.col,
            left: number | undefined = node.row * WIDTH + node.col - 1;
        top = top >= 0 ? top : undefined;
        bottom = bottom < WIDTH * this.grid.height ? bottom : undefined;
        left = Math.floor(left / WIDTH) === node.row ? left : undefined;
        right = Math.floor(right / WIDTH) === node.row ? right : undefined;
        const neighbours: (number | undefined)[] = [top, right, bottom, left];
        const nodes: INode[] = this.grid.nodes;
        for (const index of neighbours) {
            if (index === undefined) continue;
            const neighbour: INode = nodes[index];
            if (node === undefined) {
                console.log("UNDEFINED NODE: " + index);
            }
            if (neighbour.nodeType === NodeType.WallNode || neighbour.visited) continue;
            if (node.distance + neighbour.weight >= neighbour.distance) continue;
            neighbour.prev = node;
            neighbour.distance = node.distance + neighbour.weight;
            this.heap.insert(neighbour);
        }
    }

    // Initializes "this.shortestPath"
    private calcShortestPath() {
        if (!this.endNode?.visited) return;
        let prev: BaseINode = this.endNode as BaseINode;
        while (prev !== null) {
            this.shortestPath.unshift(this.getIndex(prev));
            prev = prev.prev;
        }
        this.shortestPath = this.shortestPath;
    }

    // Returns the (array) index for a node
    private getIndex(node: BaseINode) {
        return node.row * this.grid.width + node.col;
    }

    // Initialization methods
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Initializes start and end nodes.
    private initStartEndNodes(): void {
        for (const node of this.grid.nodes) {
            if (node.nodeType === NodeType.EndNode) {
                this.endNode = node;
            } else if (node.nodeType === NodeType.StartNode) {
                node.distance = 0;
                this.startNode = node;
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    // Initializes Euclidean distance of each node in grid (convert from BaseINode to ASharp INode)
    private convertNodes(baseNodes: BaseINode[]): INode[] {
        let endNode: BaseINode | undefined = undefined;
        for (const node of baseNodes) {
            if (node.nodeType === NodeType.EndNode) {
                endNode = node;
                break;
            }
        }

        const ret: INode[] = [];
        for (const node of baseNodes) {
            ret.push({... node, euclidDist: this.calcEuclidDist(node, endNode as BaseINode)});
        }
        return ret;
    };

    // Returns the euclidean distance between two nodes
    private calcEuclidDist(node1: INode | BaseINode, node2: INode | BaseINode): number {
        return ((node1.col - node2.col) ** 2 + (node1.row - node2.row) ** 2) ** (1 / 2);
    }

    // Returns the "distance" to the node, as relevant to ASharp
    private getDist(node: INode): number {
        return node.distance + node.euclidDist;
    }

    // Adds the node to the search order
    private addToSearchOrder(node: INode) {
        this.searchOrder.push(
            {
                index: this.getIndex(node),
                distance: node.distance,
            });
    }
}