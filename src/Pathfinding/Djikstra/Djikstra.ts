import { Heap } from "../Heap";
import { NodeType } from "../../App/Node";
import { IGrid, INode, Pathfinder, PathInfo, SearchedNode } from "../Pathfinder";

// Pathfinding class for Djikstra's algorithm
export class Djikstra implements Pathfinder {
    grid: IGrid;
    searchOrder: SearchedNode[] = [];
    shortestPath: number[] = [];
    pathFound: boolean = false;
    heap: Heap<INode> = new Heap((node: any) => { return node.distance });
    startNode: INode | undefined = undefined;
    endNode: INode | undefined = undefined;

    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number, nodes: INode[]) {
        this.grid = { height: BOARD_HEIGHT, width: BOARD_WIDTH, nodes: nodes };
    }


    public findPath(): PathInfo {
        this.init();
        this.search();
        this.calcShortestPath();
        return {
            searchOrder: this.searchOrder, // Order in which nodes were searched
            shortestPath: this.shortestPath, // Order of nodes in shortest path
            pathFound: this.pathFound, // False if no path was found
        }
    }

    // Recursive search to find shortest path.
    private search() {
        if ((this.endNode as INode).visited) {
            this.pathFound = true;
            return;
        } else if (this.heap.length() === 0) {
            this.pathFound = false;
            return;
        }
        // updating "Next"
        let next = undefined;
        while ((next === undefined || next.visited) && this.heap.length() > 0) {
            next = this.heap.pop();
        }
        // Searching "next"
        next.visited = true;
        this.addToSearchOrder(next);
        this.addNeighbors(next);
        this.search();
    }

    // Initializes class variables
    private init() {
        this.heap = new Heap((node: any) => { return node.distance });
        const nodes: INode[] = this.grid.nodes;

        // Initialize start and end indices
        for (const i in nodes) {
            if (nodes[i].nodeType === NodeType.StartNode) {
                this.startNode = nodes[i];
                nodes[i].distance = 0;
                nodes[i].visited = true;
                this.heap.insert(nodes[i]);
            } else if (nodes[i].nodeType === NodeType.EndNode) {
                this.endNode = nodes[i];
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    // Adds node's (non-wall, unvisited) neighbors to the heap
    private addNeighbors(node: INode) {
        const BOARD_HEIGHT = this.grid.height, BOARD_WIDTH = this.grid.width,
            index = this.getIndex(node),
            top = (index - BOARD_WIDTH >= 0) ? index - BOARD_WIDTH : undefined,
            bottom = (index + BOARD_WIDTH < BOARD_WIDTH * BOARD_HEIGHT) ? index + BOARD_WIDTH : undefined,
            left = (Math.floor((index - 1) / BOARD_WIDTH) === Math.floor((index) / BOARD_WIDTH)) ? index - 1 : undefined,
            right = (Math.floor((index + 1) / BOARD_WIDTH) === Math.floor((index) / BOARD_WIDTH)) ? index + 1 : undefined,
            neighbors = [top, right, bottom, left];
        for (const i of neighbors) {
            if (i !== undefined && this.grid.nodes[i].nodeType !== NodeType.WallNode && !(this.grid.nodes[i].visited)) {
                const nextNode = this.grid.nodes[i];
                if (node.distance + nextNode.weight < nextNode.distance) {
                    nextNode.distance = node.distance + nextNode.weight;
                    nextNode.prev = node;
                    this.heap.insert(nextNode);
                }
            }
        }

    }

    // Adds the node to the search order
    private addToSearchOrder(node: INode) {
        this.searchOrder.push(
            {
                index: node.row * this.grid.width + node.col,
                distance: node.distance,
            });
    }

    // Initializes "this.shortestPath"
    private calcShortestPath() {
        if (!this.pathFound) return;
        let prev: INode = this.endNode as INode;
        const shortestPath = [];
        while (prev !== null) {
            shortestPath.unshift(this.getIndex(prev));
            prev = prev.prev;
        }
        this.shortestPath = shortestPath;
    }

    // Returns the (array) index for a node
    private getIndex(node: INode) {
        return node.row * this.grid.width + node.col;
    }
}