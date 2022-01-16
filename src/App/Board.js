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

    getNode(grid, row, col) {
        return grid[row * BOARD_WIDTH + col];
    }

    componentDidMount() {
        this.setState({ grid: createInitGrid() });
    }

    handleMouseDown(row, col) {
        const newState = {mouseDown: true};
        const node = this.getNode(this.state.grid, row, col);
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
        const node = this.getNode(grid, row, col);
        if (this.state.holdStart) {
            node.startNode = true;
        } else if (this.state.holdEnd) {
            node.endNode = true;
        }
        this.setState({grid: grid});
    }

    handleMouseLeave(row, col) {
        if (!this.state.mouseDown) return;

        // Modifications
        const grid = this.state.grid.slice();
        if (this.state.holdStart) {
            this.getNode(grid, row, col).startNode = false;
        } else if (this.state.holdEnd) {
            this.getNode(grid, row, col).endNode = false;
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
            onMouseLeave={(row, col) => this.handleMouseLeave(row, col)}
            onMouseUp={() => this.handleMouseUp()} />
    }

    renderBoard() {
        const grid = [];
        for (const node of this.state.grid) {
            grid.push(this.renderNode(node));
        }
        return <div className="board">{grid}</div>
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