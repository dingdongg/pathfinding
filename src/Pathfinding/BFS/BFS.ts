import { NodeType } from "../../App/Node";
import {Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";
import {Queue} from "../Queue";


/**
 * number of nodes in the graph
 * adjacency list 
 * stat and end nodes 
 */

// Pathfinding class for breadth-first search (BFS)
export class BFS implements Pathfinder {
    BOARD_HEIGHT: number;
    BOARD_WIDTH: number;
    grid: any;
    startNode: any;
    endNode: any;
    queue: Queue;

    // findPath return values 
    searchOrder: SearchedNode[];
    shortestPath: number[];
    pathFound: boolean;

    constructor(width: number, height: number) {
        this.BOARD_HEIGHT = height;
        this.BOARD_WIDTH = width;
    }

    public findPath(grid: any[]): PathInfo {

        this.init(grid);
        let prev = this.solve();
        this.shortestPath = this.reconstructPath(this.startNode, this.endNode, prev);

        return {
            searchOrder: this.searchOrder,
            shortestPath: this.shortestPath,
            pathFound: this.pathFound
        };
    }

    /**
     *  Initializes all instance variables
     */
    private init(grid) {
        this.grid = grid;
        this.queue = new Queue();

        for (let i = 0; i < this.grid.length; i++) {
            let currNode = this.grid[i];
            if (currNode.nodeType === NodeType.StartNode) {
                this.startNode = currNode;
            } else if (currNode.nodeType === NodeType.EndNode) {
                this.endNode = currNode;
            }
        }

        this.searchOrder = [];
        this.shortestPath = [];
        this.pathFound = false;
    }

    private solve() {

        // construct Queue object to keep track of visited nodes 
        // enqueue starting node

        // initalize bool array[BOARD_HEIGHT * BOARD_WIDTH] to be false
        // array[startNode] = true
        // use this.searchOrder?

        // initialize parent[BOARD_HEIGHT * BOARD_WIDTH] to be null
        // used to reconstruct path from startNode to endNode 

        /**
         *  While Queue isn't empty:
         *      node = dequeue()
         *      neighbors = getNeighbors(node)
         * 
         *      for (neighbor : neighbors):
         *          if !visited[neighbor]:
         *              enqueue(neightbor)
         *              visited[neighbor] = true
         *              parent[neighbor] = node
         * 
         *  return prev
         */

    }

    private reconstructPath(start, end, prevPath) {
        
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
        return [1]; // stub
    }

}