import { Djikstra } from './Djikstra';
import { Pathfinder, PathInfo } from './Pathfinder';
import { NodeType} from '../App/Node';

interface IGrid {
    height: number,
    width: number,
    nodes: any[]
}

interface INode {
    weight: number,
    row: number,
    col: number,
    distance: number,
    nodeType: NodeType,
    visited: boolean,
    prev: INode
}

test('Create node', () => {
    const node: INode = createNode(2,3,5);
    expect(node.weight).toEqual(2);
    expect(node.row).toEqual(3);
    expect(node.col).toEqual(5);
    expect(node.nodeType).toEqual(NodeType.EmptyNode);
})

test('Create grid', () => {
    const grid: IGrid = createGrid(5,7);
    const nodes: INode[] = grid.nodes;
    expect(grid.height).toEqual(5);
    expect(grid.width).toEqual(7);
    expect(nodes.length).toEqual(5*7);
    for(let i in nodes) {
        const node:INode = nodes[i];
        expect(node.weight).toEqual(1);
        expect(node.row*7+node.col).toEqual(Number.parseInt(i));
        expect(node.nodeType).toEqual(NodeType.EmptyNode);
        expect(node.visited).toEqual(false);
    }
})

test('No barriers pathfind', () => {
    const grid: IGrid = createGrid(3,5);
    grid.nodes[5].nodeType = NodeType.StartNode;
    grid.nodes[9].nodeType = NodeType.EndNode;
    const pathfinder: Pathfinder = new Djikstra(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(true);
    expect(pathInfo.searchOrder).toEqual([0,6,10,1,11,7,2,12,8,3,13,9])
    expect(pathInfo.shortestPath).toEqual([5,6,7,8])
});

test('No valid path, no barriers', () => {
    const grid: IGrid = createGrid(3,5);
    grid.nodes[5].nodeType = NodeType.StartNode;
    grid.nodes[9].nodeType = NodeType.EndNode;
    setWall(grid, 2,2, 0, 2);
    const pathfinder: Pathfinder = new Djikstra(grid.height, grid.width);
    const pathInfo: PathInfo = pathfinder.findPath(grid.nodes);
    expect(pathInfo.pathFound).toEqual(false);
    expect(pathInfo.searchOrder).toEqual([0,6,10,1,11])
    expect(pathInfo.shortestPath).toEqual([])
});

// Initializes an empty grid of nodes
function createGrid(height: number, width: number): IGrid {
    let nodes: any[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            nodes.push(createNode(1, y, x));
        }
    }
    const ret: any = {height, width, nodes};
    return ret;
}

// Given a grid, sets the weight of all nodes between the given x and y ranges, to have weight "weight"
function setWeight(grid: IGrid, weight: number, startX: number, endX: number, startY: number, endY: number): void {
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            grid.nodes[y*grid.width+x].weight = weight;
        }
    }
}

// Given a grid, sets all nodes between the given x and y ranges, to wallNodes
function setWall(grid: IGrid, startX: number, endX: number, startY: number, endY: number): void {
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            grid.nodes[y*grid.width+x].nodeType = NodeType.WallNode;
        }
    }
}

function createNode(weight: number, row: number, col: number): INode {
    const node: any = {weight, row, col, nodeType: NodeType.EmptyNode, visited: false, prev: null, distance: Infinity};
    return node;
}