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
        }
    }

    componentDidMount() {
        this.setState({ grid: createInitGrid() });
    }

    renderNode(node) {
        const index = node.row * BOARD_WIDTH + node.col;
        return <Node key={index} row={node.row} col={node.col} startNode={node.startNode} endNode={node.endNode} />
    }

    renderBoard() {
        console.log(this.state.grid);
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