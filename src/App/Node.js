import React, { Component } from 'react';
import {INIT_START_ROW, INIT_START_COL, INIT_END_ROW, INIT_END_COL} from "./Board";


// These enums used for node type
export const EmptyNode = Symbol(0), StartNode = Symbol(1), EndNode = Symbol(2), WallNode = Symbol(3);

export default class Node extends Component {
    static createNode(row, col) {
        const nodeType = (row === INIT_START_ROW && col === INIT_START_COL) ? StartNode : (row === INIT_END_ROW && col === INIT_END_COL) ? EndNode : EmptyNode;
        return {
            row: row,
            col: col,
            nodeType: nodeType,
            wallSegments: new Array(9).fill(false),
            distance: Infinity,
            visited: false,
        }
    }

    renderWallSegments() {
        const segments = new Array(9);
        for (let i = 0; i < segments.length; i++) {
            const className = this.props.wallSegments[i] ? "wall-segment" : "";
            segments[i] = <div key={i} className={className}></div>
        }
        return <div className="wall-segments">{segments}</div>
    }

    render() {
        let extraClasses = "";
        switch (this.props.nodeType) {
            case StartNode:
                extraClasses = "start-node";
                break;
            case EndNode:
                extraClasses = "end-node";
                break;
            case WallNode:
                extraClasses = "wall-node";
                break;
            default:
        }
        extraClasses += this.props.visited ? " visited" : "";
        const row = this.props.row, col = this.props.col;

        return (
            <div className={`node ${extraClasses}`}
                onMouseDown={() => this.props.onMouseDown(row, col)}
                onMouseEnter={() => this.props.onMouseEnter(row, col)}
                onMouseUp={() => this.props.onMouseUp()}>
                {this.renderWallSegments()}</div>
        )
    }
}