import { NodeType } from "../../App/Node";
import {IGrid, INode, Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";
import {Queue} from "../Queue";


/**
 * number of nodes in the graph
 * adjacency list 
 * stat and end nodes 
 */

// Pathfinding class for breadth-first search (BFS)
export class BFS implements Pathfinder {
    grid: IGrid;
    startNode: INode | undefined;
    endNode: INode | undefined;
    queue: Queue;

    searchOrder: SearchedNode[];
    shortestPath: number[];
    pathFound: boolean;

    constructor(height: number, width: number, nodes: INode[]) {
        this.grid = {
            height, width, nodes
        };
        this.startNode = undefined;
        this.endNode = undefined;
        this.queue = new Queue();
        this.searchOrder = [];
        this.shortestPath = [];
        this.pathFound = false;
    }

    public findPath(): PathInfo {

        this.init();
        let prev = this.solve();
        this.reconstructPath(this.startNode as INode, this.endNode as INode, prev);
        return {
            searchOrder: this.searchOrder,
            shortestPath: this.shortestPath,
            pathFound: this.pathFound
        };
    }

    /**
     *  Initializes all instance variables
     */
    private init() {

        for (const node of this.grid.nodes) {
            if (node.nodeType === NodeType.StartNode) {
                this.startNode = node;
                this.startNode.distance = 0;
                this.startNode.visited = true;
            } else if (node.nodeType === NodeType.EndNode) {
                this.endNode = node;
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    private solve(): INode[] {
        // enqueue starting node
        this.queue.enqueue(this.startNode);
        let prev = [];

        let n = this.grid.height * this.grid.width;
        for (let i = 0; i < n; i++) {
            // visited[i] = false;
            prev[i] = null;
        }
        // visited[this.getIndex(<INode> this.startNode)] = true;
        this.markSearched(this.startNode as INode, (this.startNode as INode).distance);

        while (!this.queue.isEmpty()) {
            let node = this.queue.dequeue();
            let neighbors = this.getNeighbors(node);

            for (const neighbor of neighbors) {
                let idx = this.getIndex(neighbor);
                if (!this.grid.nodes[idx].visited && this.grid.nodes[idx].nodeType !== NodeType.WallNode) {
                    this.queue.enqueue(neighbor);
                    neighbor.distance = (node as INode).distance + 1;
                    this.markSearched(neighbor, neighbor.distance);
                    prev[idx] = node;
                    if (neighbor.nodeType === NodeType.EndNode) return prev;
                }
            }
        }
        return prev;
    }

    private markSearched(node: INode, dist: number) {
        node.visited = true;
        this.searchOrder.push({
            index: this.getIndex(node),
            distance: dist
        });
    }

    /**
     *  returns a list of the neighboring nodes of @node
     */
    private getNeighbors(node: INode) {
        let currNodeIndex = this.getIndex(node);
        /**
         * TOP NODE: currNodeIndex - this.grid.width >= 0
         * RIGHT NODE: currNodeIndex + 1 < this.grid.width * node.row + 1
         * BOTTOM NODE: currNodeIndex + this.grid.width < this.grid.nodes.length
         * LEFT NODE: currNodeIndex - 1 >= this.grid.width * node.row
         * 
         */
        const topCond = currNodeIndex - this.grid.width;
        const rightCond = currNodeIndex + 1;
        const bottomCond = currNodeIndex + this.grid.width;
        const leftCond = currNodeIndex - 1;

        let topIndex = (topCond >= 0) ? topCond : undefined;
        let rightIndex = (rightCond < this.grid.width * (node.row + 1)) ? rightCond : undefined;
        let bottomIndex = (bottomCond < this.grid.nodes.length) ? bottomCond : undefined;
        let leftIndex = (leftCond >= this.grid.width * node.row) ? leftCond : undefined;
        
        const neighborsIndex = [topIndex, rightIndex, bottomIndex, leftIndex];
        let retval = [];
        for (const neighborIndex of neighborsIndex) {
            if (neighborIndex !== undefined) {
                retval.push(this.grid.nodes[neighborIndex]);
            }
        }
        return retval;
    }

    /**
     *  calculate and return the 0-based array index of the node
     */
    private getIndex(node: INode): number {
        return node.row * this.grid.width + node.col;
    }

    private reconstructPath(start: INode, end: INode, prevPath: INode[]) {

        let path = [];
        for (let at = end; at != null; at = prevPath[this.getIndex(at)]) {
            path.push(this.getIndex(at));
        }

        path.reverse();

        if (path[0] === this.getIndex(start)) {
            this.shortestPath = path;
            this.pathFound = true;
        }
    }

}