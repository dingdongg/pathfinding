import { AStar } from './AStar';
import { Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType } from '../../App/Node';
import {IGrid, INode, Util} from '../util.test';

test("stub test", () => {
    expect(true).toBe(true);
});

test("Open Board test", () => {
    let grid: IGrid  = Util.createGrid(4, 5);
    grid.nodes[6].nodeType = NodeType.StartNode;
    grid.nodes[19].nodeType = NodeType.EndNode;
    const pathfinder: Pathfinder = new AStar(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([7,8,13,14]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([1,2,3,4]);
    expect(pathInfo.shortestPath).toEqual([7,8,13,14])
});

// Initializes Euclidean distance of each node in grid
function initEuclidDist(grid: IGrid): void {
    let endNode: INode = grid.nodes[0];
    for (const node of grid.nodes) {
        if (node.nodeType == NodeType.EndNode) {
            endNode = node;
            break;
        }
    }
    for (const node of grid.nodes) {
        node.euclidDist = calcEuclidDist(node, endNode);
    }
};

function calcEuclidDist(node1:INode, node2:INode): number {
    return ((node1.col-node2.col)**2 + (node1.row - node2.row)**2)**(1/2);
}