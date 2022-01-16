import React, { Component } from 'react';
import Board, { StartNode, EndNode, WallNode } from './Board';

export default class Node extends Component {
    constructor(props) {
        super(props);
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
        }
        const row = this.props.row, col = this.props.col;

        return (
            <div className={`node ${extraClasses}`}
                onMouseDown={() => this.props.onMouseDown(row, col)}
                onMouseEnter={() => this.props.onMouseEnter(row, col)}
                onMouseUp={() => this.props.onMouseUp()}>
                {this.props.index}</div>
        )
    }
}