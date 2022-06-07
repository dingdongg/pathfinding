import { NodeType } from "../../App/Node";
import {IGrid, INode, Pathfinder, PathInfo, SearchedNode} from "../Pathfinder";

export class DFS implements Pathfinder {
    
    constructor(height: number, width: number, nodes: INode[]) {
        
    }


    public findPath(): PathInfo {
        return {                // stub
            searchOrder: [],
            shortestPath: [],
            pathFound: false
        }
    }
}