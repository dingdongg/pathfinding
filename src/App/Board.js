import React, { Component } from 'react';
import Node from "./Node.js";

const BOARD_HEIGHT = 5;
const BOARD_WIDTH = 5;

const INIT_START_ROW = 1;
const INIT_START_COL = 0;
const INIT_END_ROW = 2;
const INIT_END_COL = 4;

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseDown: false,
            holdStart: false,
            holdEnd: false,
            prevHoldRow: INIT_START_ROW,
            prevHoldCol: INIT_START_COL
        }
    }

    componentDidMount() {
        this.setState({ grid: createInitGrid() });
    }

    handleMouseDown(row, col) {
        const newState = {mouseDown: true};
        const node = getNode(this.state.grid, row, col);
        if (node.startNode) {
            newState.holdStart = true;
        } else if (node.endNode) {
            newState.holdEnd = true;
        }
        this.setState(newState);
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseDown) return;
        
        const grid = this.state.grid.slice();
        if (this.state.holdStart && !getNode(grid, row, col).endNode) {
            modifyGridStart(grid, row, col);
        } else if (this.state.holdEnd && !getNode(grid, row, col).startNode) {
            modifyGridEnd(grid, row, col);
        }
        this.setState({grid: grid});
    }

    handleMouseUp() {
        const newState = { mouseDown: false, holdStart: false, holdEnd: false };
        this.setState(newState);
    }

    renderNode(node) {
        const index = node.row * BOARD_WIDTH + node.col;
        return <Node key={index} row={node.row} col={node.col} startNode={node.startNode} endNode={node.endNode}
            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
            onMouseUp={() => this.handleMouseUp()} />
    }

    renderBoard() {
        const grid = [];
        for (const node of this.state.grid) {
            grid.push(this.renderNode(node));
        }
        return <div className="board" onMouseLeave={() => this.handleMouseUp()}>{grid}</div>
    }

    render() {
        return this.renderBoard();
    }
}






function createInitGrid() {
    const grid = [];
    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            grid.push(createNode(row, col));
        }
    }
    return grid;

    function createNode(row, col) {
        return {
            row: row,
            col: col,
            startNode: (row == INIT_START_ROW && col == INIT_START_COL),
            endNode: (row == INIT_END_ROW && col == INIT_END_COL)
        }
    }
}


// Given a grid, makes the start node at the specified row and col
// Ensures that all surrounding nodes are not starting nodes
function modifyGridStart(grid, row, col) {
    for (let x = row - 2; x <= row + 2; x++) {
        for (let y = col - 2; y <= col + 2; y++) {
            try {
                getNode(grid, x, y).startNode = false;
            } catch (e) {
                // Out of bounds exception. Do nothing.
            }
        }
    }
    getNode(grid, row, col).startNode = true;
}

function modifyGridEnd(grid, row, col) {
    for (let x = row - 2; x <= row + 2; x++) {
        for (let y = col - 2; y <= col + 2; y++) {
            try {
                getNode(grid, x, y).endNode = false;
            } catch (e) {
                // Out of bounds exception. Do nothing.
            }
        }
    }
    getNode(grid, row, col).endNode = true;
}


function getNode(grid, row, col) {
    return grid[row * BOARD_WIDTH + col];
}