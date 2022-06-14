import { AStar } from './AStar';
import { IGrid, INode, Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType } from '../../App/Node';
import { Util } from '../util.test';


test("Open Board test (map0)", () => {
    let grid: IGrid  = Util.createGrid(4, 5);
    grid.nodes[6].nodeType = NodeType.StartNode;
    grid.nodes[19].nodeType = NodeType.EndNode;
    const pathfinder: Pathfinder = new AStar(grid.height, grid.width, grid.nodes);
    const pathInfo: PathInfo = pathfinder.findPath();
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([6,7,11,8,12,13,9,17,14,18,19]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([0,1,1,2,2,3,3,3,4,4,5]);
    expect(pathInfo.shortestPath).toEqual([6,7,8,13,14,19])
});

test("Basic wall test (map1)", () => {
    // Refer to "map1" image in this folder to see map
    let grid: IGrid  = Util.createGrid(5, 5);
    grid.nodes[11].nodeType = NodeType.StartNode;
    grid.nodes[24].nodeType = NodeType.EndNode;
    Util.setWallList(grid, [6,7,12,16,17,23]);
    const pathfinder: Pathfinder = new AStar(grid.height, grid.width, grid.nodes);
    const pathInfo: PathInfo = pathfinder.findPath();
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([11,10,15,5,20,21,22,0,1,2,3,8,13,18,9,4,19,14,24]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([0,1,2,2,3,4,5,3,4,5,6,7,8,9,8,7,10,9,11]);
    expect(pathInfo.shortestPath).toEqual([11,10,5,0,1,2,3,8,13,18,19,24])
});

test("Basic wall and forest test (map2)", () => {
    // Refer to "map1" image in this folder to see map
    let grid: IGrid  = Util.createGrid(5, 5);
    grid.nodes[11].nodeType = NodeType.StartNode;
    grid.nodes[24].nodeType = NodeType.EndNode;
    Util.setWallList(grid, [6,7,12,16,17,23]);
    Util.setWeight(grid, 2, 0,3,4,4);
    const pathfinder: Pathfinder = new AStar(grid.height, grid.width, grid.nodes);
    const pathInfo: PathInfo = pathfinder.findPath();
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([11,10,15,5,20,0,21,1,2,22,3,8,13,18,9,4,19,14,24]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([0,1,2,2,4,3,6,4,5,8,6,7,8,9,8,7,10,9,11]);
    expect(pathInfo.shortestPath).toEqual([11,10,5,0,1,2,3,8,13,18,19,24])
});