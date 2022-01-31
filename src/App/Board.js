import React, { Component } from 'react';
import Djikstra from '../Pathfinding/Djikstra.js';
import Node, { StartNode, EndNode, EmptyNode, WallNode } from "./Node.js";

// WHEN UPDATING BOARD DIMENSIONS, MAKE SURE TO UPDATE _board.scss AS WELL
export const BOARD_HEIGHT = 10, BOARD_WIDTH = 20; 
export const INIT_START_ROW = 1, INIT_START_COL = 1, INIT_END_ROW = 8, INIT_END_COL = 8;


// These enums used for moving/placing start, end, and walls
const HoldNone = Symbol(0);
const HoldStart = Symbol(1);
const HoldEnd = Symbol(2);
const HoldWall = Symbol(3);

// Class for the board where pathfinding occurs
export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseDown: false,
            holdType: HoldNone
        }
    }

    componentDidMount() {
        this.setState({ grid: createInitGrid() });
    }

    handleMouseDown(row, col) {
        const newState = { mouseDown: true };
        const nodeType = getNode(this.state.grid, row, col).nodeType;
        switch (nodeType) {
            case StartNode:
                newState.holdType = HoldStart;
                break;
            case EndNode:
                newState.holdType = HoldEnd;
                break;
            case EmptyNode:
            case WallNode:
                newState.holdType = HoldWall;
                modifyGridWall(this.state.grid, row, col);
                newState.grid = this.state.grid;
                break;
            default:

        }
        this.setState(newState);
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseDown) return;

        const grid = this.state.grid;
        const holdType = this.state.holdType;
        const nodeType = getNode(grid, row, col).nodeType;
        if (holdType === HoldStart && nodeType === EmptyNode) {
            modifyGridStart(grid, row, col);
        } else if (holdType === HoldEnd && nodeType === EmptyNode) {
            modifyGridEnd(grid, row, col);
        } else if (holdType === HoldWall && (nodeType === EmptyNode || nodeType === WallNode)) {
            modifyGridWall(grid, row, col);
        }
        this.setState({ grid: grid });
    }

    handleMouseUp() {
        const newState = { mouseDown: false, holdType: HoldNone };
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
    animateSearch(searchOrder, shortestPath, next) {
        const grid = this.state.grid;
        grid[searchOrder[next]].visited = true;
        this.setState({grid: grid});
        next++;
        if (next < searchOrder.length) {
            setTimeout(() => {this.animateSearch(searchOrder, shortestPath, next)}, 40);
        } else {
            setTimeout(() => {this.animatePath(shortestPath, 0)}, 40);
        }
    }

    // Animates the "next"th node in the shortestPath
    animatePath(shortestPath, next) {
        const grid = this.state.grid;
        grid[shortestPath[next]].isPath = true;
        this.setState({grid: grid});
        next++;
        if (next < shortestPath.length) {
            setTimeout(() => {this.animatePath(shortestPath, next)}, 100);
        }
    }

    
    renderNode(node) {
        const index = node.row * BOARD_WIDTH + node.col;
        return <Node key={index} row={node.row} col={node.col} nodeType={node.nodeType} wallSegments={node.wallSegments}
            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
            onMouseUp={() => this.handleMouseUp()}
            visited={node.visited}
            isPath={node.isPath}
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
                <button onClick={() => this.findPath()}>Find Path</button>
            </div>
        );
    }
}






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
function resetGrid(grid) {
    for (const node of grid) {
        node.visited = false;
    }
}


// Given a grid, makes the start node at the specified row and col
// Ensures that all surrounding nodes are not starting nodes
function modifyGridStart(grid, row, col) {
    for (const node of grid) {
        if (node.nodeType === StartNode) { node.nodeType = EmptyNode; break; }
    }
    getNode(grid, row, col).nodeType = StartNode;
}

function modifyGridEnd(grid, row, col) {
    for (const node of grid) {
        if (node.nodeType === EndNode) { node.nodeType = EmptyNode; break; }
    }
    getNode(grid, row, col).nodeType = EndNode;
}

function modifyGridWall(grid, row, col) {
    const node = getNode(grid, row, col);
    switch (node.nodeType) {
        case EmptyNode:
            node.nodeType = WallNode;
            break;
        case WallNode:
            node.nodeType = EmptyNode;
            break;
        default:
    }

    // Modifying surrounding wall classes
    for (let x = row - 1; x <= row + 1; x++) {
        for (let y = col - 1; y <= col + 1; y++) {
            try {
                getNode(grid, x, y).wallSegments = getWallSegments(grid, x, y);
            } catch (e) {
                // Out of bounds exception. Do nothing
            }
        }
    }

}

// Assuming the node at the specified row and col is a wall, will return its corresponding "wall class"
// Used for css purposes
function getWallSegments(grid, row, col) {
    let ret = new Array(9);
    ret[4] = true;

    // First do direct edges
    for (let i = 1; i < ret.length; i += 2) {
        try {
            switch (i) {
                case 1:
                    ret[i] = getNode(grid, row - 1, col).nodeType === WallNode;
                    break;
                case 3:
                    ret[i] = getNode(grid, row, col - 1).nodeType === WallNode;
                    break;
                case 5:
                    ret[i] = getNode(grid, row, col + 1).nodeType === WallNode;
                    break;
                case 7:
                    ret[i] = getNode(grid, row + 1, col).nodeType === WallNode;
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
                    ret[i] = ret[1] && ret[3] && getNode(grid, row - 1, col - 1).nodeType === WallNode;
                    break;
                case 2:
                    ret[i] = ret[1] && ret[5] && getNode(grid, row - 1, col + 1).nodeType === WallNode;
                    break;
                case 6:
                    ret[i] = ret[3] && ret[7] && getNode(grid, row + 1, col - 1).nodeType === WallNode;
                    break;
                case 8:
                    ret[i] = ret[5] && ret[7] && getNode(grid, row + 1, col + 1).nodeType === WallNode;
                    break;
                default:
            }
        } catch (e) {
            // Out of bounds exception. Do nothing
        }
    }
    return ret;
}


function getNode(grid, row, col) {
    if (row >= BOARD_HEIGHT || col >= BOARD_WIDTH || row < 0 || col < 0) { throw new Error("Invalid row or column.") };
    return grid[row * BOARD_WIDTH + col];
}