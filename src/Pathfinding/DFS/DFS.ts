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
        this.solve(this.startNode as INode, 0);
        this.reconstructPath(this.startNode as INode, this.endNode as INode);
        return {                // stub
            searchOrder: this.searchOrder,
            shortestPath: this.shortestPath,
            pathFound: this.pathFound
        }
    }

    private initStartEndNodes() {

        for (const node of this.grid.nodes) {
            if (node.nodeType === NodeType.StartNode) {
                this.startNode = node;
                node.distance = 0;
            } else if (node.nodeType === NodeType.EndNode) {
                this.endNode = node;
            }
            if (this.startNode !== undefined && this.endNode !== undefined) break;
        }
    }

    private solve(node: INode, dist: number) {

        if (node.visited) return;
        this.markSearched(node, dist);

        if (node === this.endNode) return;

        let neighbors = this.getNeighbors(node);
        for (const neighbor of neighbors) {
            if (!neighbor.visited && neighbor.nodeType !== NodeType.WallNode) {
                neighbor.prev = node;
                this.solve(neighbor, dist + 1);
            }
            if ((this.endNode as INode).visited) return;
        }
        
    }

    private getNeighbors(node: INode) {
        let currNodeIndex = this.getIndex(node);
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

    private getIndex(node: INode): number {
        return node.row * this.grid.width + node.col;
    }

    private markSearched(node: INode, dist: number) {
        node.visited = true;
        this.searchOrder.push({
            index: this.getIndex(node),
            distance: dist
        });
    }

    private reconstructPath(start: INode, end: INode) {
        let path = [];
        for (let at = end; at != null; at = at.prev) {
            path.push(this.getIndex(at));
        }

        path.reverse();

        if (path[0] === this.getIndex(start)) {
            this.shortestPath = path;
            this.pathFound = true;
        }
    }
}