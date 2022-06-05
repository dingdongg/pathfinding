import { NodeType} from '../App/Node';
import { IGrid, INode } from './Pathfinder';

export class Util {
    // Initializes an empty grid of nodes
    public static createGrid(height: number, width: number): IGrid {
        let nodes: any[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                nodes.push(Util.createNode(1, y, x));
            }
        }
        const ret: any = { height, width, nodes };
        return ret;
    }

    // Given a grid, sets the weight of all nodes between the given x and y ranges, to have weight "weight"
    public static setWeight(grid: IGrid, weight: number, startX: number, endX: number, startY: number, endY: number): void {
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                grid.nodes[y * grid.width + x].weight = weight;
            }
        }
    }

    // Given a grid, sets all nodes between the given x and y ranges, to wallNodes
    public static setWall(grid: IGrid, startX: number, endX: number, startY: number, endY: number): void {
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                grid.nodes[y * grid.width + x].nodeType = NodeType.WallNode;
            }
        }
    }

    // Given a grid, sets all nodes with indices "indices" to be a wall
    public static setWallList(grid: IGrid, indices: number[]): void {
        for (const index of indices) {
            grid.nodes[index].nodeType = NodeType.WallNode;
        }
    }

    static createNode(weight: number, row: number, col: number): INode {
        const node: any = { weight, row, col, nodeType: NodeType.EmptyNode, visited: false, prev: null, distance: Infinity };
        return node;
    }
}

test('Create node', () => {
    const node: INode = Util.createNode(2,3,5);
    expect(node.weight).toEqual(2);
    expect(node.row).toEqual(3);
    expect(node.col).toEqual(5);
    expect(node.nodeType).toEqual(NodeType.EmptyNode);
})

test('Create grid', () => {
    const grid: IGrid = Util.createGrid(5,7);
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