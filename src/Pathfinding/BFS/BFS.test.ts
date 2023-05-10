import {BFS} from "./BFS";
import { IGrid, Pathfinder, PathInfo } from '../Pathfinder';
import { NodeType} from '../../App/Node';
import {Util} from '../util.test';

test('Go through forests unaffected', () => {

    let testGrid: IGrid = Util.createGrid(4, 7);
    testGrid.nodes[16].nodeType = NodeType.StartNode;
    for (let i = 17; i < 20; i++) {
        testGrid.nodes[i].nodeType = NodeType.ForestNode;
    }
    testGrid.nodes[20].nodeType = NodeType.EndNode;

    let algorithm: Pathfinder = new BFS(testGrid.height, testGrid.width, testGrid.nodes);
    const result: PathInfo = algorithm.findPath();
    expect(result.pathFound).toEqual(true);
    expect(result.searchOrder.map(node => node.index)).toEqual([16,                         // layer 0
                                                                9, 17, 23, 15,              // layer 1
                                                                2, 10, 8, 18, 24, 22, 14,   // layer 2
                                                                3, 1, 11, 7, 19, 25, 21,    // layer 3
                                                                4, 0, 12, 20]);             // layer 4
    expect(result.searchOrder.map(node => node.distance)).toEqual([0, 
                                                                   1, 1, 1, 1, 
                                                                   2, 2, 2, 2, 2, 2, 2, 
                                                                   3, 3, 3, 3, 3, 3, 3, 
                                                                   4, 4, 4, 4]);
    expect(result.shortestPath).toEqual([16, 17, 18, 19, 20]);
});

test("Disjoint graph", () => {
    let testGrid: IGrid = Util.createGrid(4, 7);
    testGrid.nodes[16].nodeType = NodeType.StartNode;
    for (let i = 7; i < 14; i++) {
        testGrid.nodes[i].nodeType = NodeType.WallNode;
    }
    testGrid.nodes[6].nodeType = NodeType.EndNode;

    let algorithm: Pathfinder = new BFS(testGrid.height, testGrid.width, testGrid.nodes);
    const result: PathInfo = algorithm.findPath();
    expect(result.pathFound).toEqual(false);
    expect(result.searchOrder.map(node => node.index)).toEqual([16, 
                                                                17, 23, 15, 
                                                                18, 24, 22, 14, 
                                                                19, 25, 21, 
                                                                20, 26, 
                                                                27]);
    expect(result.searchOrder.map(node => node.distance)).toEqual([0, 
                                                                   1, 1, 1, 
                                                                   2, 2, 2, 2, 
                                                                   3, 3, 3, 
                                                                   4, 4, 
                                                                   5]);
    expect(result.shortestPath).toEqual([]);
});