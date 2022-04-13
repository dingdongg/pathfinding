import React, { Component } from 'react';
import internal from 'stream';
import Djikstra from '../Pathfinding/Djikstra';
import Node, { NodeType, BarrierNode } from "./Node";

// WHEN UPDATING BOARD DIMENSIONS, MAKE SURE TO UPDATE _board.scss AS WELL
export const BOARD_HEIGHT = 10, BOARD_WIDTH = 20;
export const INIT_START_ROW = 0, INIT_START_COL = 0, INIT_END_ROW = 0, INIT_END_COL = BOARD_WIDTH-1;
const EmptyNode = NodeType.EmptyNode, StartNode = NodeType.StartNode, EndNode = NodeType.EndNode, WallNode = NodeType.WallNode, ForestNode = NodeType.ForestNode;


// These enums used for moving/placing start, end, and walls
const enum Hold {
    HoldNone, HoldStart, HoldEnd, HoldBarrier
}

interface IBoardProps {
    barrierType: BarrierNode
}

interface IBoardState {
    grid: any[],
    mouseDown: boolean,
    holdType: Hold,
}


export default class Board extends Component<IBoardProps, IBoardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            grid: [],
            mouseDown: false,
            holdType: Hold.HoldNone
        }
    }
    
    // Initializes grid state
    initGrid() {
        this.setState({ grid: createInitGrid() });
    }

    componentDidMount() {
        this.initGrid();
    }

    handleMouseDown(row: number, col: number) {
        const newState = { ...this.state, mouseDown: true };
        const nodeType = getNode(this.state.grid, row, col).nodeType;
        switch (nodeType) {
            case StartNode:
                newState.holdType = Hold.HoldStart;
                break;
            case EndNode:
                newState.holdType = Hold.HoldEnd;
                break;
            default:
                newState.holdType = Hold.HoldBarrier;
                modifyGridBarrier(this.state.grid, row, col, this.props.barrierType);
                newState.grid = this.state.grid;
                break;
        }
        this.setState(newState);
    }

    handleMouseEnter(row: number, col: number) {
        if (!this.state.mouseDown) return;

        const grid = this.state.grid;
        const holdType = this.state.holdType;
        const nodeType = getNode(grid, row, col).nodeType;
        if (holdType === Hold.HoldStart && nodeType === NodeType.EmptyNode) {
            modifyGridStart(grid, row, col);
        } else if (holdType === Hold.HoldEnd && nodeType === NodeType.EmptyNode) {
            modifyGridEnd(grid, row, col);
        } else if (holdType === Hold.HoldBarrier && (nodeType !== NodeType.StartNode && nodeType !== NodeType.EndNode)) {
            modifyGridBarrier(grid, row, col, this.props.barrierType);
        }
        this.setState({ grid: grid });
    }

    handleMouseUp() {
        const newState = { mouseDown: false, holdType: Hold.HoldNone };
        this.setState(newState);
    }

    // Finds shortest path and animates it
    findPath() {
        const pathfinder = new Djikstra(BOARD_HEIGHT, BOARD_WIDTH), path = pathfinder.findPath(this.state.grid);
        // Need to reset state of board for animation
        resetGrid(this.state.grid);

        const searchOrder = path.searchOrder, shortestPath = path.shortestPath;
        if (searchOrder.length > 0) {
            this.animateSearch(searchOrder, shortestPath, 0);
        }
    }

    // Animates the "next"th node in the searchOrder
    // Hold "shortestPath" so can start shortest path animation when search is done
    animateSearch(searchOrder: number[], shortestPath: number[], next: number) {
        const grid = this.state.grid;
        grid[searchOrder[next]].visited = true;
        this.setState({ grid: grid });
        next++;
        if (next < searchOrder.length) {
            setTimeout(() => { this.animateSearch(searchOrder, shortestPath, next) }, 40);
        } else {
            setTimeout(() => { this.animatePath(shortestPath, 0) }, 40);
        }
    }

    // Animates the "next"th node in the shortestPath
    animatePath(shortestPath: number[], next: number) {
        const grid = this.state.grid;
        grid[shortestPath[next]].isPath = true;
        this.setState({ grid: grid });
        next++;
        if (next < shortestPath.length) {
            setTimeout(() => { this.animatePath(shortestPath, next) }, 100);
        }
    }


    renderNode(node: any) {
        const index = node.row * BOARD_WIDTH + node.col;
        return <Node key={index} row={node.row} col={node.col} nodeType={node.nodeType} barrierSegments={node.wallSegments}
            onMouseDown={(row: number, col: number) => this.handleMouseDown(row, col)}
            onMouseEnter={(row: number, col: number) => this.handleMouseEnter(row, col)}
            onMouseUp={() => this.handleMouseUp()}
            visited={node.visited}
            isPath={node.isPath}
            weight={node.weight}
            prev={node.prev}
            distance={node.distance} />
    }

    renderBoard() {
        const grid = [];
        for (const node of this.state.grid) {
            grid.push(this.renderNode(node));
        }
        return <div className="board" onMouseLeave={() => this.handleMouseUp()}>{grid}</div>
    }

    render() {
        return (
            <div>
                {this.renderBoard()}
                <div className="board-buttons">
                    <button onClick={() => this.findPath()} className="find-path">Find Path</button>
                    <button onClick={() => this.initGrid()} className="reset">Reset</button>
                </div>
            </div>
        );
    }
}





// Creates and returns starting grid
function createInitGrid() {
    const grid = [];
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            grid.push(Node.createNode(row, col));
        }
    }
    return grid;
}

// Resets visited state of all nodes in grid
function resetGrid(grid: any[]) {
    for (const node of grid) {
        node.visited = false;
    }
}


// Given a grid, makes the start node at the specified row and col
// Ensures that all surrounding nodes are not starting nodes
function modifyGridStart(grid: any[], row: number, col: number) {
    for (const node of grid) {
        if (node.nodeType === StartNode) { node.nodeType = EmptyNode; break; }
    }
    getNode(grid, row, col).nodeType = StartNode;
}

function modifyGridEnd(grid: any[], row: number, col: number) {
    for (const node of grid) {
        if (node.nodeType === EndNode) { node.nodeType = EmptyNode; break; }
    }
    getNode(grid, row, col).nodeType = EndNode;
}

// Takes the node at the provided row/col, and makes it into BarrierType.
// Assumes the provided node is not a start or end node
function modifyGridBarrier(grid: any[], row: number, col: number, barrierType: BarrierNode) {
    const node = getNode(grid, row, col);
    switch (node.nodeType) {
        case barrierType:
            node.nodeType = EmptyNode;
            break;
        default:
            setNodeBarrier(node, barrierType);
            break;
    }

    // Modifying surrounding wall classes
    for (let x = row - 1; x <= row + 1; x++) {
        for (let y = col - 1; y <= col + 1; y++) {
            try {
                getNode(grid, x, y).wallSegments = getBarrierSegments(grid, x, y);
            } catch (e) {
                // Out of bounds exception. Do nothing
            }
        }
    }

}

// Assuming the node at the specified row and col is a barrier, will return its corresponding "barrier class"
// Used for css purposes
function getBarrierSegments(grid: any[], row: number, col: number) {
    const barrierType = getNode(grid, row, col).nodeType;
    let ret = new Array(9);
    ret[4] = true;

    // First do direct edges
    for (let i = 1; i < ret.length; i += 2) {
        try {
            switch (i) {
                case 1:
                    ret[i] = getNode(grid, row - 1, col).nodeType === barrierType;
                    break;
                case 3:
                    ret[i] = getNode(grid, row, col - 1).nodeType === barrierType;
                    break;
                case 5:
                    ret[i] = getNode(grid, row, col + 1).nodeType === barrierType;
                    break;
                case 7:
                    ret[i] = getNode(grid, row + 1, col).nodeType === barrierType;
                    break;
                default:
            }
        } catch (e) {
            // Out of bounds exception. Do nothing
        }
    }

    // Then handle corners
    for (let i = 0; i < ret.length; i += 2) {
        try {
            switch (i) {
                case 0:
                    ret[i] = ret[1] && ret[3] && getNode(grid, row - 1, col - 1).nodeType === barrierType;
                    break;
                case 2:
                    ret[i] = ret[1] && ret[5] && getNode(grid, row - 1, col + 1).nodeType === barrierType;
                    break;
                case 6:
                    ret[i] = ret[3] && ret[7] && getNode(grid, row + 1, col - 1).nodeType === barrierType;
                    break;
                case 8:
                    ret[i] = ret[5] && ret[7] && getNode(grid, row + 1, col + 1).nodeType === barrierType;
                    break;
                default:
            }
        } catch (e) {
            // Out of bounds exception. Do nothing
        }
    }
    return ret;
}

// Sets the provided node to the provided barrier type
function setNodeBarrier(node: any, barrierType: BarrierNode) {
    console.log("MATTHEW");
    node.nodeType = barrierType;
    switch (barrierType) {
        case ForestNode:
            node.weight = 5;
            break;
    }
}

// Gets the node at the provided row and col number
function getNode(grid: any[], row: number, col: number) {
    if (row >= BOARD_HEIGHT || col >= BOARD_WIDTH || row < 0 || col < 0) { throw new Error("Invalid row or column.") };
    return grid[row * BOARD_WIDTH + col];
}