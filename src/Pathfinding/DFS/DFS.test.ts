import {DFS} from "./DFS";
import { IGrid, Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType} from '../../App/Node';
import {Util} from '../util.test';

test('DFS1', () => {

    let testGrid: IGrid = Util.createGrid(4, 7);
    testGrid.nodes[16].nodeType = NodeType.StartNode;
    for (let i = 17; i < 20; i++) {
        testGrid.nodes[i].nodeType = NodeType.ForestNode;
    }
    testGrid.nodes[20].nodeType = NodeType.EndNode;

    let algorithm: Pathfinder = new DFS(testGrid.height, testGrid.width, testGrid.nodes);
    const result: PathInfo = algorithm.findPath();
    console.log('yeattterarer');
    expect(result.pathFound).toEqual(true);
    expect(result.searchOrder.map(node => node.index)).toEqual([16, 9, 2, 3, 4, 5, 6, 13, 20]);
    expect(result.searchOrder.map(node => node.distance)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result.shortestPath).toEqual([16, 9, 2, 3, 4, 5, 6, 13, 20]);
});