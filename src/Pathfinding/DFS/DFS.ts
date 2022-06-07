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
        return {                // stub
            searchOrder: [],
            shortestPath: [],
            pathFound: false
        }
    }
}