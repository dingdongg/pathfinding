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

    // PathInfo properties
    searchOrder: SearchedNode[];
    shortestPath: number[];
    pathFound: boolean;

    /**
     *  creates an instance of the BFS algorithm. 
     *  The width/height of the board is passed in (structure),
     *  and an empty list of nodes (state).
     */
    constructor(BOARD_HEIGHT: number, BOARD_WIDTH: number) {
        this.grid = {height: BOARD_HEIGHT, width: BOARD_WIDTH, nodes: []};
        this.queue = new Queue();
        this.searchOrder = [];
        this.shortestPath = [];
        this.pathFound = false;
    }

    public findPath(nodes: INode[]): PathInfo {

        this.init(nodes);
        let prev = this.solve();
        this.reconstructPath(<INode> this.startNode, <INode> this.endNode, prev);

        return {
            searchOrder: this.searchOrder,
            shortestPath: this.shortestPath,
            pathFound: this.pathFound
        };
    }

    /**
     *  Initializes all instance variables
     */
    private init(nodes: INode[]) {
        this.grid.nodes = nodes.slice();

        for (let i = 0; i < this.grid.nodes.length; i++) {
            let currNode = this.grid.nodes[i];
            if (currNode.nodeType === NodeType.StartNode) {
                this.startNode = currNode;
                this.startNode.distance = 0;
                this.startNode.visited = true;
            } else if (currNode.nodeType === NodeType.EndNode) {
                this.endNode = currNode;
            }
        }
    }

    private solve(): INode[] {
        // enqueue starting node
        this.queue.enqueue(this.startNode);

        // initalize bool array[BOARD_HEIGHT * BOARD_WIDTH] to be false
        let visited = [];
        // initialize parent[BOARD_HEIGHT * BOARD_WIDTH] to be null
        // used to reconstruct path from startNode to endNode 
        let prev = [];

        let n = this.grid.height * this.grid.width;
        for (let i = 0; i < n; i++) {
            visited[i] = false;
            prev[i] = null;
        }
        visited[this.getIndex(<INode> this.startNode)] = true;
        this.searchOrder.push({
            index: this.getIndex(<INode> this.startNode),
            distance: 0
        });

        while (!this.queue.isEmpty()) {
            let node = this.queue.dequeue();
            let neighbors = this.getNeighbors(node);

            for (const neighbor of neighbors) {
                let idx = this.getIndex(neighbor);
                if (!visited[idx]) {
                    this.queue.enqueue(neighbor);
                    visited[idx] = true;
                    prev[idx] = node;
                }
            }
        }
        return prev;
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
        let rightIndex = (rightCond < this.grid.width * node.row + 1) ? rightCond : undefined;
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
    private getIndex(node: INode) {
        return node.row * this.grid.width + node.col;
    }

    private reconstructPath(start: INode, end: INode, prevPath: INode[]) {
        
        /**
         *  path = empty path (array)
         *  for (at = end; at != null; at = prevPath[at])
         *      path.add(at)
         *  
         *  path.reverse()
         * 
         *  if path[0] == start:
         *      return path
         *  return []
         */
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