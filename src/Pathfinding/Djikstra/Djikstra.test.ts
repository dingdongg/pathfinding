import { Djikstra } from './Djikstra';
import { IGrid, Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType} from '../../App/Node';
import {Util} from '../util.test';

test('No barriers pathfind', () => {
    const grid: IGrid = Util.createGrid(3,5);
    grid.nodes[5].nodeType = NodeType.StartNode;
    grid.nodes[9].nodeType = NodeType.EndNode;
    const pathfinder: Pathfinder = new Djikstra(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([0,6,10,1,11,7,2,12,8]);
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([1,1,1,2,2,2,3,3,3]);
    expect(pathInfo.shortestPath).toEqual([5,6,7,8])
});

test('No valid path', () => {
    const grid: IGrid = Util.createGrid(3,5);
    grid.nodes[5].nodeType = NodeType.StartNode;
    grid.nodes[9].nodeType = NodeType.EndNode;
    Util.setWall(grid, 2,2, 0, 2);
    const pathfinder: Pathfinder = new Djikstra(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(false);
    expect(pathInfo.searchOrder.map(node => node.index)).toEqual([0,6,10,1,11])
    expect(pathInfo.searchOrder.map(node => node.distance)).toEqual([1,1,1,2,2])
    expect(pathInfo.shortestPath).toEqual([])
});