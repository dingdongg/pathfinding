import { AStar } from './AStar';
import { IGrid, INode, Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType } from '../../App/Node';
import { Util } from '../util.test';


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

test("Basic wall test (map1)", () => {
    // Refer to "map1" image in this folder to see map
    let grid: IGrid  = Util.createGrid(5, 5);
    grid.nodes[11].nodeType = NodeType.StartNode;
    grid.nodes[24].nodeType = NodeType.EndNode;
    Util.setWallList(grid, [6,7,12,16,17,23]);
    const pathfinder: Pathfinder = new AStar(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([10,15,20,21,22,5,0,1,2,3,8,13,18,19,24]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([1,2,3,4,5,6,7,8,9,10,11]);
    expect(pathInfo.shortestPath).toEqual([10,5,0,1,2,3,8,13,18,19,24])
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
        // node.euclidDist = calcEuclidDist(node, endNode);
    }
};

function calcEuclidDist(node1:INode, node2:INode): number {
    return ((node1.col-node2.col)**2 + (node1.row - node2.row)**2)**(1/2);
}