import { NodeType } from "../../App/Node";
import {IGrid, INode, Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";

export class DFS implements Pathfinder {
    grid: IGrid;
    startNode: INode | undefined;
    endNode: INode | undefined;
    stack: INode[];

    searchOrder: SearchedNode[];
    shortestPath: number[];
    pathFound: boolean;
    
    constructor(height: number, width: number, nodes: INode[]) {
        this.grid = {
            height, width, nodes
        }

        this.startNode = undefined;
        this.endNode = undefined;
        this.stack = [];

        this.searchOrder = [];
        this.shortestPath = [];
        this.pathFound = false;
    }


    public findPath(): PathInfo {

        this.initStartEndNodes();
        this.solve();
        this.reconstructPath();
        return {                // stub
            searchOrder: [],
            shortestPath: [],
            pathFound: false
        }
    }

    private initStartEndNodes() {

        for (const node of this.grid.nodes) {
            if (node.nodeType === NodeType.StartNode) {
                this.startNode = node;
                node.distance = 0;
                node.visited = true;
            } else if (node.nodeType === NodeType.EndNode) {
                this.endNode = node;
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    private solve() {

    }

    private reconstructPath() {
        
    }
}