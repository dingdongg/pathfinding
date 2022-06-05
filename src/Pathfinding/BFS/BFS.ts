import {Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";


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

    // findPath return values 
    searchOrder: SearchedNode[] = [];
    shortestPath: any;
    pathFound: any;

    constructor(width: number, height: number) {
        this.BOARD_HEIGHT = height;
        this.BOARD_WIDTH = width;
    }

    public findPath(grid: any[]): PathInfo {

        let prev = this.solve();
        this.shortestPath = this.reconstructPath(this.startNode, this.endNode, prev);

        return {
            searchOrder: this.searchOrder,
            shortestPath: this.shortestPath,
            pathFound: this.pathFound
        };
    }

    private solve() {

        // construct Queue object to keep track of visited nodes 
        // enqueue starting node

        // initalize bool array[BOARD_HEIGHT * BOARD_WIDTH] to be false
        // array[startNode] = true

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

    }

}